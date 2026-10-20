import React, { useState } from 'react';

export default function ModelEvaluation({ mlEval }) {
  const [subView, setSubView] = useState('benchmark');
  const [selectedModelName, setSelectedModelName] = useState('HistGradientBoosting');
  const [thresholdMode, setThresholdMode] = useState('clinical_screening_threshold_028');

  if (!mlEval) return null;

  const modelKeys = Object.keys(mlEval.models);
  const activeModel = mlEval.models[selectedModelName] || mlEval.models[modelKeys[0]];
  const activeMetrics = activeModel[thresholdMode];
  const cm = activeMetrics.confusion_matrix;

  const rocPoints = activeMetrics.roc_curve
    .map((pt) => `${(pt.fpr * 280 + 40).toFixed(1)},${(240 - pt.tpr * 210).toFixed(1)}`)
    .join(' ');

  const prPoints = activeMetrics.pr_curve
    .map((pt) => `${(pt.recall * 280 + 40).toFixed(1)},${(240 - pt.precision * 210).toFixed(1)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Clean Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="text-sm text-slate-600">
          Evaluated on <strong className="font-mono text-slate-900">{mlEval.test_size.toLocaleString()}</strong> unseen stratified test records (Training cohort: <strong className="font-mono text-slate-900">{mlEval.train_size.toLocaleString()}</strong>)
        </div>

        <div className="inline-flex bg-slate-200/80 p-1 rounded-md self-start">
          <button
            type="button"
            onClick={() => setSubView('benchmark')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subView === 'benchmark'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Benchmarks & Curves
          </button>
          <button
            type="button"
            onClick={() => setSubView('importance')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subView === 'importance'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feature Importance
          </button>
          <button
            type="button"
            onClick={() => setSubView('governance')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subView === 'governance'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Syllabus COs & Ethics
          </button>
        </div>
      </div>

      {subView === 'benchmark' && (
        <div className="space-y-6">
          {/* Model Benchmark Table */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Model Performance Comparison
                </h3>
                <p className="text-sm text-slate-500">
                  Click any row to inspect its ROC/PR curves and confusion matrix below
                </p>
              </div>
              <div className="inline-flex bg-slate-100 p-1 rounded-md self-start">
                <button
                  type="button"
                  onClick={() => setThresholdMode('clinical_screening_threshold_028')}
                  className={`px-3 py-1.5 text-[16px] font-medium rounded-sm ${
                    thresholdMode === 'clinical_screening_threshold_028'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Screening Cutoff (0.28)
                </button>
                <button
                  type="button"
                  onClick={() => setThresholdMode('standard_threshold_050')}
                  className={`px-3 py-1.5 text-[16px] font-medium rounded-sm ${
                    thresholdMode === 'standard_threshold_050'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standard Cutoff (0.50)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600">
                    <th className="py-3.5 px-6">Model Architecture</th>
                    <th className="py-3.5 px-4 text-right">ROC-AUC</th>
                    <th className="py-3.5 px-4 text-right">PR-AUC</th>
                    <th className="py-3.5 px-4 text-right">Accuracy</th>
                    <th className="py-3.5 px-4 text-right">Recall (Sensitivity)</th>
                    <th className="py-3.5 px-4 text-right">Specificity</th>
                    <th className="py-3.5 px-4 text-right">Precision</th>
                    <th className="py-3.5 px-6 text-right">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {modelKeys.map((mKey) => {
                    const mObj = mlEval.models[mKey];
                    const mMet = mObj[thresholdMode];
                    const isPrimary = mKey === mlEval.primary_model;
                    return (
                      <tr
                        key={mKey}
                        onClick={() => setSelectedModelName(mKey)}
                        className={`cursor-pointer transition-colors ${
                          selectedModelName === mKey ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {mKey}
                          {isPrimary && (
                            <span className="ml-2 px-2 py-0.5 text-[14px] font-medium bg-teal-700 text-white rounded-sm">
                              Monotonic Primary
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-800 tabular-nums">
                          {mMet.roc_auc.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {mMet.pr_auc.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {(mMet.accuracy * 100).toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {(mMet.recall_sensitivity * 100).toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {(mMet.specificity * 100).toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {(mMet.precision * 100).toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {mMet.f1_score.toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unified Curves & Confusion Matrix Panel */}
          <div className="bg-white border border-slate-200 rounded-md p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">ROC Curve ({selectedModelName})</span>
                  <span className="text-xs font-mono font-bold text-teal-800">
                    AUC = {activeMetrics.roc_auc.toFixed(4)}
                  </span>
                </div>
                <svg viewBox="0 0 340 260" className="w-full h-auto bg-slate-50 border border-slate-200 rounded-sm">
                  <line x1="40" y1="30" x2="40" y2="240" stroke="#94A3B8" strokeWidth="1" />
                  <line x1="40" y1="240" x2="320" y2="240" stroke="#94A3B8" strokeWidth="1" />
                  <line x1="40" y1="240" x2="320" y2="30" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                  <polyline fill="none" stroke="#0F766E" strokeWidth="2.5" points={rocPoints} />
                  <text x="180" y="255" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                    False Positive Rate
                  </text>
                  <text x="14" y="135" textAnchor="middle" transform="rotate(-90 14 135)" className="text-[10px] fill-slate-500 font-mono">
                    True Positive Rate
                  </text>
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">Precision-Recall Curve</span>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    PR-AUC = {activeMetrics.pr_auc.toFixed(4)}
                  </span>
                </div>
                <svg viewBox="0 0 340 260" className="w-full h-auto bg-slate-50 border border-slate-200 rounded-sm">
                  <line x1="40" y1="30" x2="40" y2="240" stroke="#94A3B8" strokeWidth="1" />
                  <line x1="40" y1="240" x2="320" y2="240" stroke="#94A3B8" strokeWidth="1" />
                  <polyline fill="none" stroke="#B45309" strokeWidth="2.5" points={prPoints} />
                  <text x="180" y="255" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                    Recall (Sensitivity)
                  </text>
                  <text x="14" y="135" textAnchor="middle" transform="rotate(-90 14 135)" className="text-[10px] fill-slate-500 font-mono">
                    Precision
                  </text>
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">
                  Confusion Matrix (Cutoff {activeMetrics.threshold.toFixed(2)})
                </h4>
                <span className="text-xs font-mono text-slate-600">
                  NPV: {(activeMetrics.npv * 100).toFixed(1)}%
                </span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-md">
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-sm text-slate-600">True Negatives (Correct Healthy)</span>
                  <strong className="font-mono text-base text-slate-900 tabular-nums">{cm.tn.toLocaleString()}</strong>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-sm text-slate-600">True Positives (Detected Cases)</span>
                  <strong className="font-mono text-base text-teal-800 tabular-nums">{cm.tp.toLocaleString()}</strong>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-sm text-slate-600">False Positives (Screen Flagged)</span>
                  <strong className="font-mono text-base text-amber-800 tabular-nums">{cm.fp.toLocaleString()}</strong>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-sm text-slate-600">False Negatives (Missed Cases)</span>
                  <strong className="font-mono text-base text-red-800 tabular-nums">{cm.fn.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subView === 'importance' && (
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Global Feature Attribution (Permutation ROC-AUC Share & Monotonic Direction)
            </h3>
            <p className="text-sm text-slate-500">
              Relative contribution of the top 12 predictive indicators across the 50,736 test cohort
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {mlEval.feature_importances.slice(0, 12).map((fi, idx) => (
              <div key={fi.feature} className="py-3 grid grid-cols-12 items-center gap-4 text-sm">
                <div className="col-span-5 sm:col-span-4 font-semibold text-slate-900">
                  <span className="font-mono text-slate-400 mr-2">#{idx + 1}</span>
                  {fi.label}
                </div>
                <div className="col-span-4 sm:col-span-5">
                  <div className="w-full h-2.5 bg-slate-100 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-teal-700"
                      style={{ width: `${Math.min(100, fi.importance_share_pct * 3)}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-3 text-right font-mono text-xs tabular-nums">
                  <strong className="text-slate-900 text-sm">{fi.importance_share_pct.toFixed(1)}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subView === 'governance' && (
        <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-200">
          <div className="p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Course Outcomes (CO1 to CO6) & UN SDG 3 Alignment
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-900">CO1 & CO6 (Model Justification):</strong> Monotonic Histogram-Based Gradient Boosting captures non-linear clinical interactions while guaranteeing that harmful factors (smoking, heavy alcohol, high BP, obesity) strictly increase risk and healthy habits (exercise, fruits, vegetables) strictly lower risk.
              </li>
              <li>
                <strong className="text-slate-900">CO2 & CO5 (Healthcare Application):</strong> Full-stack FastAPI + React.js clinical screening workstation with real-time counterfactual simulation.
              </li>
              <li>
                <strong className="text-slate-900">CO3 & CO4 (Evaluation & Calibration):</strong> Evaluated on 50,736 unseen test patients with sensitivity-tuned threshold calibration (0.28) to address the 6.18:1 class imbalance.
              </li>
              <li>
                <strong className="text-slate-900">UN SDG 3.4 & 10.2:</strong> Supports early non-invasive screening of chronic non-communicable diseases and highlights socioeconomic health disparities.
              </li>
            </ul>
          </div>

          <div className="p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Addressing Survey Bias & Clinical Limitations
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In raw cross-sectional telephone surveys (CDC BRFSS), diagnosed diabetics often stop drinking alcohol or smoking on medical advice, creating artificial negative correlations (sick-quitter confounding). Our model resolves this via tree monotonicity constraints (`monotonic_cst`) combined with clinical log-odds regularization so predictions remain 100% medically sound. Confirmatory blood testing (HbA1c / fasting plasma glucose) is always required for clinical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
