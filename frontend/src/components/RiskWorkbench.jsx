import React, { useState } from 'react';
import {
  HeartClinicalIcon,
  SlidersIcon,
  RefreshIcon,
  CheckCircleIcon,
} from './Icons.jsx';

const AGE_OPTIONS = [
  { value: 1, label: '18-24 yrs' },
  { value: 2, label: '25-29 yrs' },
  { value: 3, label: '30-34 yrs' },
  { value: 4, label: '35-39 yrs' },
  { value: 5, label: '40-44 yrs' },
  { value: 6, label: '45-49 yrs' },
  { value: 7, label: '50-54 yrs' },
  { value: 8, label: '55-59 yrs' },
  { value: 9, label: '60-64 yrs' },
  { value: 10, label: '65-69 yrs' },
  { value: 11, label: '70-74 yrs' },
  { value: 12, label: '75-79 yrs' },
  { value: 13, label: '80+ yrs' },
];

const GENHLTH_OPTIONS = [
  { value: 1, label: 'Excellent' },
  { value: 2, label: 'Very Good' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Fair' },
  { value: 5, label: 'Poor' },
];

const EDUCATION_OPTIONS = [
  { value: 1, label: '1 • Never Attended' },
  { value: 2, label: '2 • Elementary (Grades 1-8)' },
  { value: 3, label: '3 • Some High School' },
  { value: 4, label: '4 • High School Graduate' },
  { value: 5, label: '5 • Some College' },
  { value: 6, label: '6 • College Graduate' },
];

const INCOME_OPTIONS = [
  { value: 1, label: '1 • Under $10,000' },
  { value: 2, label: '2 • $10,000 - $15,000' },
  { value: 3, label: '3 • $15,000 - $20,000' },
  { value: 4, label: '4 • $20,000 - $25,000' },
  { value: 5, label: '5 • $25,000 - $35,000' },
  { value: 6, label: '6 • $35,000 - $50,000' },
  { value: 7, label: '7 • $50,000 - $75,000' },
  { value: 8, label: '8 • $75,000 or more' },
];

function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', tone: 'text-amber-700 bg-amber-50' };
  if (bmi < 25) return { label: 'Normal', tone: 'text-emerald-700 bg-emerald-50' };
  if (bmi < 30) return { label: 'Overweight', tone: 'text-amber-700 bg-amber-50' };
  if (bmi < 35) return { label: 'Obese I', tone: 'text-red-700 bg-red-50' };
  return { label: 'Obese II/III', tone: 'text-red-800 bg-red-100' };
}

// Clean borderless horizontal row instead of a nested box
function CleanBinaryRow({ label, hint, value, onChange, isProtective = false }) {
  const isYes = value === 1;
  const activeYesStyle = isProtective
    ? 'bg-teal-700 text-white'
    : 'bg-red-700 text-white';

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="pr-4">
        <div className="text-base font-semibold text-slate-900">{label}</div>
        <div className="text-sm text-slate-500 mt-0.5">{hint}</div>
      </div>
      <div className="inline-flex bg-slate-100 p-1 rounded-md shrink-0 self-start sm:self-center">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
            !isYes
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(1)}
          className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
            isYes
              ? activeYesStyle
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Yes
        </button>
      </div>
    </div>
  );
}

const INPUT_SECTIONS = [
  { id: 'clinical', title: '1. Vitals & Clinical', count: 6 },
  { id: 'lifestyle', title: '2. Lifestyle & Habits', count: 5 },
  { id: 'health', title: '3. General Health', count: 4 },
  { id: 'demographics', title: '4. Demographics', count: 6 },
];

export default function RiskWorkbench({
  indicators,
  onUpdateIndicator,
  presets,
  activePresetId,
  onSelectPreset,
  onApplyOptimalInterventions,
  prediction,
  isPredicting,
}) {
  const [activeSection, setActiveSection] = useState('clinical');
  const [rightTab, setRightTab] = useState('drivers');

  const bmiCat = getBmiCategory(indicators.BMI);

  const riskBadgeStyle =
    prediction?.risk_code === 'high'
      ? 'bg-red-50 text-red-800 border-red-200'
      : prediction?.risk_code === 'moderate'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  const riskBarColor =
    prediction?.risk_code === 'high'
      ? 'bg-red-700'
      : prediction?.risk_code === 'moderate'
      ? 'bg-amber-600'
      : 'bg-teal-700';

  const currentStepIndex = INPUT_SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Slim Sample Patient Bar (No Giant Cards) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-500 mr-1">
            Sample Profiles:
          </span>
          {presets.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3.5 py-1.5 text-[16px] font-medium rounded-md border transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{preset.name}</span>
                <span
                  className={`px-1.5 py-0.5 text-[14px] font-mono rounded-sm ${
                    isSelected ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {preset.preview_probability_pct?.toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {presets.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectPreset(presets[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[16px] font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main 12-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Single Clean Surface with 4 Step-Tabs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md overflow-hidden">
          {/* Section Step Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50">
            {INPUT_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`py-3.5 px-3 text-left border-b-2 transition-colors focus:outline-none ${
                    isActive
                      ? 'border-teal-700 bg-white text-slate-900 font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  <div className="text-sm truncate">{sec.title}</div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">
                    {sec.count} factors
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Section Form Rows (Clean divide-y list, NO nested boxes) */}
          <div className="p-6 divide-y divide-slate-200">
            {activeSection === 'clinical' && (
              <>
                {/* BMI Row */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="bmi-slider" className="text-base font-semibold text-slate-900">
                        Body Mass Index (BMI)
                      </label>
                      <p className="text-sm text-slate-500">
                        Weight-to-height ratio (Healthy reference: 18.5 to 24.9 kg/m²)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[14px] font-medium rounded-sm ${bmiCat.tone}`}>
                        {bmiCat.label}
                      </span>
                      <span className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                        {Number(indicators.BMI).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <input
                    id="bmi-slider"
                    type="range"
                    min="14"
                    max="60"
                    step="0.5"
                    value={indicators.BMI}
                    onChange={(e) => onUpdateIndicator('BMI', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>14.0</span>
                    <span>25.0 (Overweight)</span>
                    <span>30.0 (Obese)</span>
                    <span>60.0 kg/m²</span>
                  </div>
                </div>

                <CleanBinaryRow
                  label="High Blood Pressure"
                  hint="Ever diagnosed with hypertension by a doctor or nurse"
                  value={indicators.HighBP}
                  onChange={(v) => onUpdateIndicator('HighBP', v)}
                />
                <CleanBinaryRow
                  label="High Cholesterol"
                  hint="Ever told by a clinician that blood cholesterol is high"
                  value={indicators.HighChol}
                  onChange={(v) => onUpdateIndicator('HighChol', v)}
                />
                <CleanBinaryRow
                  label="Heart Disease or Heart Attack"
                  hint="History of coronary heart disease (CHD) or myocardial infarction"
                  value={indicators.HeartDiseaseorAttack}
                  onChange={(v) => onUpdateIndicator('HeartDiseaseorAttack', v)}
                />
                <CleanBinaryRow
                  label="History of Stroke"
                  hint="Ever diagnosed with a cerebrovascular stroke"
                  value={indicators.Stroke}
                  onChange={(v) => onUpdateIndicator('Stroke', v)}
                />
                <CleanBinaryRow
                  label="Cholesterol Checked in Past 5 Years"
                  hint="Preventive lipid screening within the last 5 years"
                  value={indicators.CholCheck}
                  onChange={(v) => onUpdateIndicator('CholCheck', v)}
                  isProtective={true}
                />
              </>
            )}

            {activeSection === 'lifestyle' && (
              <>
                <CleanBinaryRow
                  label="Regular Physical Activity"
                  hint="Exercise or physical activity in the past 30 days outside regular job"
                  value={indicators.PhysActivity}
                  onChange={(v) => onUpdateIndicator('PhysActivity', v)}
                  isProtective={true}
                />
                <CleanBinaryRow
                  label="History of Smoking"
                  hint="Smoked at least 100 cigarettes (5 packs) in entire lifetime"
                  value={indicators.Smoker}
                  onChange={(v) => onUpdateIndicator('Smoker', v)}
                />
                <CleanBinaryRow
                  label="Heavy Alcohol Consumption"
                  hint="Men >= 14 drinks/week or Women >= 7 drinks/week"
                  value={indicators.HvyAlcoholConsump}
                  onChange={(v) => onUpdateIndicator('HvyAlcoholConsump', v)}
                />
                <CleanBinaryRow
                  label="Daily Fruit Consumption"
                  hint="Consumes fruit 1 or more times per day"
                  value={indicators.Fruits}
                  onChange={(v) => onUpdateIndicator('Fruits', v)}
                  isProtective={true}
                />
                <CleanBinaryRow
                  label="Daily Vegetable Consumption"
                  hint="Consumes vegetables 1 or more times per day"
                  value={indicators.Veggies}
                  onChange={(v) => onUpdateIndicator('Veggies', v)}
                  isProtective={true}
                />
              </>
            )}

            {activeSection === 'health' && (
              <>
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-semibold text-slate-900">
                        Self-Reported General Health
                      </span>
                      <p className="text-sm text-slate-500">
                        Overall perceived health rating from Excellent (1) to Poor (5)
                      </p>
                    </div>
                    <span className="text-[14px] font-mono font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-sm">
                      Level {indicators.GenHlth} / 5
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {GENHLTH_OPTIONS.map((opt) => {
                      const active = indicators.GenHlth === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onUpdateIndicator('GenHlth', opt.value)}
                          className={`py-2 px-2 text-[16px] font-medium rounded-md border transition-colors ${
                            active
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="physhlth-slider" className="text-base font-semibold text-slate-900">
                        Poor Physical Health Days (Past 30 Days)
                      </label>
                      <p className="text-sm text-slate-500">
                        Days physical health (illness or injury) was not good
                      </p>
                    </div>
                    <span className="text-base font-mono font-bold text-slate-900 tabular-nums">
                      {indicators.PhysHlth} days
                    </span>
                  </div>
                  <input
                    id="physhlth-slider"
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={indicators.PhysHlth}
                    onChange={(e) => onUpdateIndicator('PhysHlth', parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="menthlth-slider" className="text-base font-semibold text-slate-900">
                        Poor Mental Health Days (Past 30 Days)
                      </label>
                      <p className="text-sm text-slate-500">
                        Days mental health (stress, depression, emotions) was not good
                      </p>
                    </div>
                    <span className="text-base font-mono font-bold text-slate-900 tabular-nums">
                      {indicators.MentHlth} days
                    </span>
                  </div>
                  <input
                    id="menthlth-slider"
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={indicators.MentHlth}
                    onChange={(e) => onUpdateIndicator('MentHlth', parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>

                <CleanBinaryRow
                  label="Difficulty Walking or Climbing Stairs"
                  hint="Serious mobility difficulty walking or climbing stairs"
                  value={indicators.DiffWalk}
                  onChange={(v) => onUpdateIndicator('DiffWalk', v)}
                />
              </>
            )}

            {activeSection === 'demographics' && (
              <>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label htmlFor="age-select" className="text-base font-semibold text-slate-900">
                      Age Bracket
                    </label>
                    <p className="text-sm text-slate-500">CDC BRFSS 13-tier adult age classification</p>
                  </div>
                  <select
                    id="age-select"
                    value={indicators.Age}
                    onChange={(e) => onUpdateIndicator('Age', parseInt(e.target.value, 10))}
                    className="px-3.5 py-2 text-[16px] font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    {AGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label} (Tier {o.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-base font-semibold text-slate-900">Biological Sex</span>
                    <p className="text-sm text-slate-500">Respondent biological sex</p>
                  </div>
                  <div className="inline-flex bg-slate-100 p-1 rounded-md">
                    <button
                      type="button"
                      onClick={() => onUpdateIndicator('Sex', 0)}
                      className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
                        indicators.Sex === 0
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateIndicator('Sex', 1)}
                      className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
                        indicators.Sex === 1
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label htmlFor="edu-select" className="text-base font-semibold text-slate-900">
                      Education Level
                    </label>
                    <p className="text-sm text-slate-500">Highest level of school completed</p>
                  </div>
                  <select
                    id="edu-select"
                    value={indicators.Education}
                    onChange={(e) => onUpdateIndicator('Education', parseInt(e.target.value, 10))}
                    className="px-3.5 py-2 text-[16px] font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    {EDUCATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label htmlFor="inc-select" className="text-base font-semibold text-slate-900">
                      Annual Household Income
                    </label>
                    <p className="text-sm text-slate-500">Total household income from all sources</p>
                  </div>
                  <select
                    id="inc-select"
                    value={indicators.Income}
                    onChange={(e) => onUpdateIndicator('Income', parseInt(e.target.value, 10))}
                    className="px-3.5 py-2 text-[16px] font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    {INCOME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <CleanBinaryRow
                  label="Health Insurance Coverage"
                  hint="Has any kind of healthcare coverage, insurance, or government plan"
                  value={indicators.AnyHealthcare}
                  onChange={(v) => onUpdateIndicator('AnyHealthcare', v)}
                  isProtective={true}
                />
                <CleanBinaryRow
                  label="Deferred Doctor Visit Due to Cost"
                  hint="Needed to see a doctor in the past 12 months but could not due to cost"
                  value={indicators.NoDocbcCost}
                  onChange={(v) => onUpdateIndicator('NoDocbcCost', v)}
                />
              </>
            )}
          </div>

          {/* Clean Step Navigation Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setActiveSection(INPUT_SECTIONS[currentStepIndex - 1].id)}
              className="px-4 py-2 text-[16px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              Previous Section
            </button>
            <span className="text-xs font-mono text-slate-500">
              Section {currentStepIndex + 1} of {INPUT_SECTIONS.length}
            </span>
            <button
              type="button"
              disabled={currentStepIndex === INPUT_SECTIONS.length - 1}
              onClick={() => setActiveSection(INPUT_SECTIONS[currentStepIndex + 1].id)}
              className="px-4 py-2 text-[16px] font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none"
            >
              Next Section
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Single Unified Diagnostic & Explainability Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 bg-white border border-slate-300 rounded-md divide-y divide-slate-200">
          {/* Top Section: Risk Readout & Gauge */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <HeartClinicalIcon className="w-5 h-5 text-teal-700" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Estimated Diabetes Risk
                </span>
              </div>
              <span className={`px-3 py-1 text-[14px] font-medium border rounded-md ${riskBadgeStyle}`}>
                {isPredicting ? 'Updating...' : prediction?.risk_tier || 'Ready'}
              </span>
            </div>

            {prediction && (
              <>
                <div className="flex items-baseline justify-between">
                  <div className="text-5xl font-mono font-bold text-slate-900 tabular-nums">
                    {prediction.probability_pct.toFixed(1)}%
                  </div>
                  <div className="text-right text-xs text-slate-500 space-y-0.5">
                    <div>
                      Population Avg: <strong className="font-mono text-slate-800">{prediction.population_baseline_pct}%</strong>
                    </div>
                    <div>
                      Relative Risk: <strong className="font-mono text-teal-800">{prediction.relative_to_population}x</strong>
                    </div>
                  </div>
                </div>

                {/* Single Clean Gauge Bar */}
                <div className="space-y-1.5">
                  <div className="relative h-3 w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${riskBarColor}`}
                      style={{ width: `${Math.min(100, Math.max(2, prediction.probability_pct))}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
                      style={{ left: '28%' }}
                      title="28% Clinical Screening Cut-Point"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0% Low</span>
                    <span className="font-semibold text-slate-700">28% Screening Cutoff</span>
                    <span>100%</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {prediction.clinical_summary}
                </p>
              </>
            )}
          </div>

          {/* Bottom Section: Clean 2-Tab Switcher (Why This Score vs What-If Plan) */}
          {prediction && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => setRightTab('drivers')}
                  className={`py-2 text-[16px] font-medium rounded-sm transition-colors ${
                    rightTab === 'drivers'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Key Risk Factors
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('whatif')}
                  className={`py-2 text-[16px] font-medium rounded-sm transition-colors ${
                    rightTab === 'whatif'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  What-If Action Plan
                </button>
              </div>

              {rightTab === 'drivers' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Exact percentage-point impact of this patient&apos;s top factors (+ increases risk, - protects against risk):
                  </p>
                  <div className="divide-y divide-slate-100">
                    {prediction.feature_contributions
                      .filter((fc) => Math.abs(fc.risk_contribution_pct) >= 0.05)
                      .slice(0, 7)
                      .map((fc) => {
                      const isIncreasing = fc.risk_contribution_pct > 0;
                      const isProtective = fc.risk_contribution_pct < 0;
                      const barWidth = Math.min(100, Math.max(6, Math.abs(fc.risk_contribution_pct) * 4.5));

                      return (
                        <div key={fc.feature} className="py-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-semibold text-slate-900">{fc.label}</span>
                              <span className="ml-2 text-xs font-mono text-slate-500">
                                ({fc.formatted_value})
                              </span>
                            </div>
                            <span
                              className={`font-mono font-bold text-xs tabular-nums ${
                                isIncreasing
                                  ? 'text-red-700'
                                  : isProtective
                                  ? 'text-emerald-700'
                                  : 'text-slate-500'
                              }`}
                            >
                              {fc.risk_contribution_pct > 0 ? '+' : ''}
                              {fc.risk_contribution_pct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                            <div
                              className={`h-full ${
                                isIncreasing
                                  ? 'bg-red-600'
                                  : isProtective
                                  ? 'bg-emerald-600'
                                  : 'bg-slate-400'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-teal-50/70 border border-teal-200 rounded-md">
                    <div>
                      <div className="text-xs text-teal-800 font-medium">Projected Risk After Changes</div>
                      <div className="text-2xl font-mono font-bold text-teal-950 tabular-nums mt-0.5">
                        {prediction.intervention_pathway.current_risk_pct.toFixed(1)}% →{' '}
                        {prediction.intervention_pathway.optimized_risk_pct.toFixed(1)}%
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[14px] font-mono font-bold bg-emerald-100 text-emerald-900 rounded-sm">
                      -{prediction.intervention_pathway.absolute_reduction_pct.toFixed(1)}% drop
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Recommended Modifiable Steps
                    </div>
                    <ul className="divide-y divide-slate-100 text-sm text-slate-700">
                      {prediction.intervention_pathway.recommended_actions.map((act, idx) => (
                        <li key={idx} className="py-2 flex items-center gap-2.5">
                          <CheckCircleIcon className="w-4 h-4 text-teal-700 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={onApplyOptimalInterventions}
                    className="w-full py-2.5 px-4 text-[16px] font-medium bg-teal-700 text-white rounded-md hover:bg-teal-800 active:bg-teal-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <SlidersIcon className="w-4 h-4" />
                    Simulate Healthy Lifestyle Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
