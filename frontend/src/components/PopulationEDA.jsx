import React, { useState } from 'react';
import { SearchIcon } from './Icons.jsx';

export default function PopulationEDA({ eda }) {
  const [subTab, setSubTab] = useState('trends');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (!eda) return null;

  const categories = ['All', 'Clinical', 'Health Status', 'Lifestyle', 'Demographics', 'Healthcare'];
  const filteredFeatures = eda.feature_stats.filter((item) => {
    const matchesSearch =
      item.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const cd = eda.class_distribution;

  return (
    <div className="space-y-6">
      {/* Slim Summary Strip & Sub-View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div>
            <span className="text-slate-500">Total Cohort: </span>
            <strong className="font-mono text-slate-900">{eda.total_records.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500">Healthy (Class 0): </span>
            <strong className="font-mono text-slate-900">{cd.no_diabetes_pct}%</strong>
          </div>
          <div>
            <span className="text-slate-500">Diabetes / Prediabetes (Class 1): </span>
            <strong className="font-mono text-amber-800">{cd.diabetes_or_prediabetes_pct}%</strong>
          </div>
          <div>
            <span className="text-slate-500">Missing Values: </span>
            <strong className="font-mono text-emerald-700">0 (100% Clean)</strong>
          </div>
        </div>

        <div className="inline-flex bg-slate-200/80 p-1 rounded-md self-start">
          <button
            type="button"
            onClick={() => setSubTab('trends')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subTab === 'trends'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Age, BMI & Health
          </button>
          <button
            type="button"
            onClick={() => setSubTab('comorbidities')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subTab === 'comorbidities'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Risk Multipliers
          </button>
          <button
            type="button"
            onClick={() => setSubTab('dictionary')}
            className={`px-4 py-1.5 text-[16px] font-medium rounded-sm transition-colors ${
              subTab === 'dictionary'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            21-Variable Dictionary
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Age, BMI & General Health Trends */}
      {subTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-md p-6">
          {/* Age Gradient (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Diabetes Prevalence by Age Bracket (13 Tiers)
              </h3>
              <p className="text-sm text-slate-500">
                Percentage of respondents with prediabetes or diabetes across age groups
              </p>
            </div>
            <div className="space-y-2.5 pt-1">
              {eda.age_breakdown.map((row) => (
                <div key={row.age_code} className="grid grid-cols-12 items-center gap-3 text-sm">
                  <div className="col-span-3 sm:col-span-2 font-mono text-slate-700">
                    {row.age_group}
                  </div>
                  <div className="col-span-6 sm:col-span-7">
                    <div className="w-full h-3 bg-slate-100 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-teal-700"
                        style={{ width: `${Math.min(100, (row.prevalence_pct / 25) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 text-right font-mono tabular-nums text-slate-600 text-xs">
                    <strong className="text-slate-900 text-sm">{row.prevalence_pct.toFixed(1)}%</strong>{' '}
                    <span className="hidden sm:inline">({(row.total / 1000).toFixed(1)}k)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI & General Health (5 cols, separated by hairline) */}
          <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 space-y-8">
            <div className="space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900">
                  Prevalence by Clinical BMI Category
                </h3>
                <p className="text-sm text-slate-500">
                  WHO weight classification risk escalation
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {eda.bmi_breakdown.map((b) => (
                  <div key={b.category} className="py-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">{b.category}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {b.prevalence_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-slate-800"
                        style={{ width: `${Math.min(100, (b.prevalence_pct / 36) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prevalence by General Health Rating
                </h3>
                <p className="text-sm text-slate-500">
                  Self-reported 1 (Excellent) to 5 (Poor) health scale
                </p>
              </div>
              <div className="space-y-2.5">
                {eda.genhlth_breakdown.map((g) => (
                  <div key={g.code} className="grid grid-cols-12 items-center gap-2 text-sm">
                    <div className="col-span-4 font-medium text-slate-800">
                      {g.code}. {g.label}
                    </div>
                    <div className="col-span-5">
                      <div className="w-full h-2.5 bg-slate-100 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-amber-600"
                          style={{ width: `${Math.min(100, (g.prevalence_pct / 40) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {g.prevalence_pct.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Comorbidity & Lifestyle Risk Multipliers (Clean Table instead of 10 Boxes) */}
      {subTab === 'comorbidities' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Comorbidity & Lifestyle Risk Comparison Across 253,680 Adults
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Compares diabetes prevalence when each factor is Present (Yes = 1) vs. Absent (No = 0). Note: Heavy Alcohol in raw survey data exhibits reverse-causation (diagnosed patients quitting alcohol), which our Monotonic Clinical Model corrects during inference.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600">
                  <th className="py-3.5 px-6">Clinical / Lifestyle Factor</th>
                  <th className="py-3.5 px-4 text-right">Population Rate</th>
                  <th className="py-3.5 px-4 text-right">Diabetes Rate When Absent (0)</th>
                  <th className="py-3.5 px-4 text-right">Diabetes Rate When Present (1)</th>
                  <th className="py-3.5 px-6 text-right">Survey Relative Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {eda.binary_risk_comparison.map((item) => (
                  <tr key={item.feature} className="hover:bg-slate-50">
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      <span className="ml-2 text-xs font-mono text-slate-400">({item.feature})</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {item.population_rate_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums">
                      {item.prevalence_when_absent_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.prevalence_when_present_pct}%
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`px-2 py-0.5 text-[14px] rounded-sm ${
                          item.relative_risk_ratio > 1.0
                            ? 'bg-red-50 text-red-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {item.relative_risk_ratio}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Searchable 21-Variable Dictionary */}
      {subTab === 'dictionary' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                21-Variable Clinical Dictionary & Target Correlations
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Mean values stratified by diabetes status and Pearson correlation (r) with Diabetes_binary
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter variables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-[16px] font-medium rounded-md transition-colors ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600">
                  <th className="py-3 px-6">Variable</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Scale</th>
                  <th className="py-3 px-3 text-right">Mean (Healthy)</th>
                  <th className="py-3 px-3 text-right">Mean (Diabetic)</th>
                  <th className="py-3 px-3 text-right">Pearson r</th>
                  <th className="py-3 px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeatures.map((f) => (
                  <tr key={f.feature} className="hover:bg-slate-50">
                    <td className="py-3 px-6 font-semibold text-slate-900">
                      {f.label} <span className="font-mono text-xs text-slate-400">({f.feature})</span>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-600">{f.category}</td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-500">{f.unit}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                      {f.mean_no_diabetes.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {f.mean_diabetes.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={f.correlation > 0 ? 'text-red-700' : 'text-emerald-700'}>
                        {f.correlation > 0 ? '+' : ''}
                        {f.correlation.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-xs text-slate-500 max-w-xs">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
