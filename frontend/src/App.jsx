import React, { useEffect, useState, useCallback } from 'react';
import {
  PulseIcon,
  AlertTriangleIcon,
} from './components/Icons.jsx';
import RiskWorkbench from './components/RiskWorkbench.jsx';
import PopulationEDA from './components/PopulationEDA.jsx';
import ModelEvaluation from './components/ModelEvaluation.jsx';

const DEFAULT_INDICATORS = {
  HighBP: 1,
  HighChol: 1,
  CholCheck: 1,
  BMI: 32.0,
  Smoker: 1,
  Stroke: 0,
  HeartDiseaseorAttack: 0,
  PhysActivity: 0,
  Fruits: 0,
  Veggies: 0,
  HvyAlcoholConsump: 0,
  AnyHealthcare: 1,
  NoDocbcCost: 0,
  GenHlth: 3,
  MentHlth: 5,
  PhysHlth: 6,
  DiffWalk: 0,
  Sex: 1,
  Age: 7,
  Education: 5,
  Income: 5,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('workbench');
  const [metadata, setMetadata] = useState(null);
  const [presets, setPresets] = useState([]);
  const [activePresetId, setActivePresetId] = useState('modifiable-prediabetic');
  const [indicators, setIndicators] = useState(DEFAULT_INDICATORS);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchPrediction = useCallback(async (payload) => {
    setIsPredicting(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Prediction error (${res.status})`);
      const data = await res.json();
      setPrediction(data);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsPredicting(false);
    }
  }, []);

  useEffect(() => {
    async function initDashboard() {
      try {
        const [metaRes, presetRes] = await Promise.all([
          fetch('/api/metadata'),
          fetch('/api/presets'),
        ]);
        if (metaRes.ok) {
          setMetadata(await metaRes.json());
        }
        if (presetRes.ok) {
          const presetJson = await presetRes.json();
          setPresets(presetJson.presets || []);
        }
      } catch (err) {
        setErrorMsg('Backend API connection error. Ensure FastAPI is running on port 8000.');
      }
    }
    initDashboard();
  }, []);

  useEffect(() => {
    fetchPrediction(indicators);
  }, [indicators, fetchPrediction]);

  const handleUpdateIndicator = (key, value) => {
    setActivePresetId(null);
    setIndicators((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setIndicators({ ...preset.indicators });
  };

  const handleApplyOptimalInterventions = () => {
    setActivePresetId(null);
    setIndicators((prev) => ({
      ...prev,
      BMI: prev.BMI > 24.5 ? Math.max(23.5, Number((prev.BMI - 5.0).toFixed(1))) : prev.BMI,
      HighBP: 0,
      HighChol: 0,
      Smoker: 0,
      PhysActivity: 1,
      Fruits: 1,
      Veggies: 1,
      HvyAlcoholConsump: 0,
      DiffWalk: 0,
      GenHlth: prev.GenHlth > 2 ? prev.GenHlth - 1 : prev.GenHlth,
      PhysHlth: 0,
      MentHlth: 0,
    }));
  };

  const primaryEval =
    metadata?.ml_evaluation?.models?.HistGradientBoosting?.standard_threshold_050;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Clean Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 min-h-[64px] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-700 text-white rounded-md flex items-center justify-center shrink-0">
              <PulseIcon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[16px] font-bold tracking-tight text-slate-900">
                GlycoStrat AI
              </span>
              <span className="px-2.5 py-0.5 text-[14px] font-medium bg-teal-50 text-teal-800 rounded-sm">
                CDC BRFSS • N = 253,680
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2" aria-label="Primary Clinical Views">
            <button
              type="button"
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-2 text-[16px] font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                activeTab === 'workbench'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Risk Assessment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('eda')}
              className={`px-4 py-2 text-[16px] font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                activeTab === 'eda'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dataset Insights
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evaluation')}
              className={`px-4 py-2 text-[16px] font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                activeTab === 'evaluation'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Model Performance
            </button>
          </nav>
        </div>
      </header>

      {/* Clean, Uncluttered Header (No Box Wall) */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-slate-500 mb-2">
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-sm">
              UCI Dataset #891
            </span>
            <span>•</span>
            <span>Monotonic Clinical Gradient Boosting</span>
            <span>•</span>
            <span className="font-mono text-teal-800 font-semibold">
              ROC-AUC: {primaryEval ? primaryEval.roc_auc.toFixed(4) : '0.8253'}
            </span>
          </div>

          <h1 className="text-[64px] leading-[1.08] tracking-tight font-bold text-slate-900">
            Diabetes Risk Stratification
          </h1>
          <p className="text-[18px] leading-[1.6] text-slate-600 max-w-3xl mt-2">
            Interactive clinical screening and counterfactual lifestyle simulation trained on 253,680 US adult health records with strict medical monotonicity constraints.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md flex items-center gap-3 text-sm text-red-900">
            <AlertTriangleIcon className="w-5 h-5 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'workbench' && (
          <RiskWorkbench
            indicators={indicators}
            onUpdateIndicator={handleUpdateIndicator}
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onApplyOptimalInterventions={handleApplyOptimalInterventions}
            prediction={prediction}
            isPredicting={isPredicting}
          />
        )}

        {activeTab === 'eda' && <PopulationEDA eda={metadata?.eda} />}

        {activeTab === 'evaluation' && (
          <ModelEvaluation mlEval={metadata?.ml_evaluation} />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-700">Academic Prototype Disclaimer:</strong> Built for BE (AI&DS) Healthcare AI/ML coursework. Not a substitute for professional medical diagnosis.
          </div>
          <div className="font-mono">
            UCI ML Repository ID 891 • N = 253,680
          </div>
        </div>
      </footer>
    </div>
  );
}
