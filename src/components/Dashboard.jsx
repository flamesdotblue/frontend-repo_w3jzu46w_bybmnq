import React, { useEffect, useMemo, useState } from 'react';
import { Battery, Flame, Gauge, Leaf, Activity, SlidersHorizontal, PlayCircle, Factory, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

function Sparkline({ values = [], color = '#059669' }) {
  const path = useMemo(() => {
    if (!values.length) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const norm = values.map(v => (v - min) / (max - min || 1));
    const pts = norm.map((n, i) => `${(i / (values.length - 1)) * 100},${100 - n * 100}`).join(' ');
    return pts;
  }, [values]);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-10">
      <polyline fill="none" stroke={color} strokeWidth="3" points={path} />
    </svg>
  );
}

function GaugeRing({ value = 72, color = 'emerald' }) {
  const pct = Math.max(0, Math.min(100, value));
  const angle = (pct / 100) * 360;
  const style = {
    background: `conic-gradient(var(--c) ${angle}deg, #e5e7eb ${angle}deg)`
  };
  return (
    <div className="relative w-28 h-28">
      <div className={`absolute inset-0 rounded-full`} style={{ ...style, ['--c']: `oklch(var(--${color}-600))` }} />
      <div className="absolute inset-2 bg-white rounded-full grid place-items-center border border-slate-200">
        <div className="text-center">
          <div className="text-xl font-semibold text-slate-900">{pct}%</div>
          <div className="text-[10px] text-slate-500">score</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ currentPage }) {
  const [energy, setEnergy] = useState([420, 410, 415, 400, 398, 392, 389, 395, 390]);
  const [eff, setEff] = useState([78, 79, 77, 80, 81, 82, 83, 84, 82]);
  const [quality, setQuality] = useState([98, 97, 99, 96, 97, 98, 99, 98, 99]);
  const [sust, setSust] = useState(72);

  useEffect(() => {
    const id = setInterval(() => {
      setEnergy((prev) => [...prev.slice(1), Math.max(360, Math.min(430, prev[prev.length - 1] + (Math.random() * 10 - 5)))]);
      setEff((prev) => [...prev.slice(1), Math.max(70, Math.min(95, prev[prev.length - 1] + (Math.random() * 4 - 2)))]);
      setQuality((prev) => [...prev.slice(1), Math.max(92, Math.min(100, prev[prev.length - 1] + (Math.random() * 2 - 1)))]);
      setSust((v) => Math.round(Math.max(40, Math.min(95, v + (Math.random() * 4 - 2)))));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const MetricCard = ({ title, value, unit, icon: Icon, color, series }) => (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-500 text-xs">{title}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}<span className="text-sm text-slate-500 ml-1">{unit}</span></div>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-700`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <Sparkline values={series} color={`#10b981`} />
      </div>
    </div>
  );

  const [sim, setSim] = useState({ raw: 0, clinker: 0, fuel: 0 });
  const [simResult, setSimResult] = useState(null);

  const runSimulation = () => {
    const energyDelta = - (sim.fuel * 0.8 + sim.raw * 0.4 + sim.clinker * 0.6);
    const qualityDelta = sim.raw * 0.3 - sim.fuel * 0.1 + sim.clinker * 0.2;
    const sustainDelta = sim.fuel * 1.2 + sim.raw * 0.4;
    setSimResult({
      energy: Math.max(320, Math.round(energy[energy.length - 1] + energyDelta)),
      quality: Math.max(90, Math.min(100, Math.round(quality[quality.length - 1] + qualityDelta))),
      sustain: Math.max(30, Math.min(100, Math.round(sust + sustainDelta)))
    });
  };

  const Section = ({ title, desc, children, icon: Icon }) => (
    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">{desc}</p>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentPage === 'dashboard' && (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Energy Consumption" value={energy[energy.length - 1]} unit="kWh/t" icon={Battery} color="emerald" series={energy} />
            <MetricCard title="Process Efficiency" value={eff[eff.length - 1]} unit="%" icon={Gauge} color="sky" series={eff} />
            <MetricCard title="Quality Index" value={quality[quality.length - 1]} unit="/100" icon={Activity} color="violet" series={quality} />
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
              <div>
                <div className="text-slate-500 text-xs">Sustainability</div>
                <div className="text-sm text-slate-600">Composite ESG score</div>
              </div>
              <GaugeRing value={sust} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Section
              title="Raw Material Optimization"
              icon={Factory}
              desc="Analyze variability and fine-tune grinding to reduce energy while stabilizing LSF/SM/AM."
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Grinding Pressure</div>
                  <input type="range" min="-10" max="10" value={sim.raw} onChange={(e)=>setSim((s)=>({...s, raw: Number(e.target.value)}))} className="w-full" />
                  <div className="text-xs text-slate-600">Adjustment: {sim.raw}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Separator Speed</div>
                  <input type="range" min="-10" max="10" value={sim.clinker} onChange={(e)=>setSim((s)=>({...s, clinker: Number(e.target.value)}))} className="w-full" />
                  <div className="text-xs text-slate-600">Adjustment: {sim.clinker}</div>
                </div>
              </div>
              <button onClick={runSimulation} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"><PlayCircle className="w-4 h-4" /> Run Simulation</button>
              {simResult && (
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800">
                    <div className="text-xs">Energy</div>
                    <div className="text-lg font-semibold">{simResult.energy} kWh/t</div>
                  </div>
                  <div className="p-3 rounded-lg bg-violet-50 text-violet-800">
                    <div className="text-xs">Quality</div>
                    <div className="text-lg font-semibold">{simResult.quality} /100</div>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-50 text-teal-800">
                    <div className="text-xs">Sustainability</div>
                    <div className="text-lg font-semibold">{simResult.sustain}%</div>
                  </div>
                </div>
              )}
            </Section>

            <Section
              title="Clinkerization Control"
              icon={Flame}
              desc="Balance kiln parameters to reduce heat demand and emissions, safeguarding quality indices."
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Kiln Main Drive</div>
                  <input type="range" min="-10" max="10" className="w-full" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">O₂ at Preheater</div>
                  <input type="range" min="-10" max="10" className="w-full" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">ID Fan</div>
                  <input type="range" min="-10" max="10" className="w-full" />
                </div>
              </div>
            </Section>

            <Section
              title="Fuel & Energy Management"
              icon={Battery}
              desc="Model alternative fuel blends and optimize TSR while holding process stability."
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">RDF %</div>
                  <input type="range" min="0" max="60" value={sim.fuel} onChange={(e)=>setSim((s)=>({...s, fuel: Number(e.target.value)}))} className="w-full" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Biomass %</div>
                  <input type="range" min="0" max="60" className="w-full" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Moisture %</div>
                  <input type="range" min="0" max="20" className="w-full" />
                </div>
              </div>
            </Section>

            <Section
              title="AI Insights & Recommendations"
              icon={SlidersHorizontal}
              desc="Generative AI proposes safe setpoint changes with quantified impact and guardrails."
            >
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• Increase separator speed by 3% to stabilize Blaine 3400±50.</li>
                <li>• Shift 12% of grinding to off-peak to reduce kWh/t by ~5%.</li>
                <li>• Raise TSR to 45% using 60:40 RDF:biomass → -17 kcal/kg clinker.</li>
              </ul>
            </Section>

            <Section
              title="Sustainability Dashboard"
              icon={Leaf}
              desc="Track CO₂, TSR, clinker factor, and water footprint to improve ESG score."
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-teal-50 text-teal-800">
                  <div className="text-xs">CO₂ Intensity</div>
                  <div className="text-xl font-semibold">576 kg/t</div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800">
                  <div className="text-xs">TSR</div>
                  <div className="text-xl font-semibold">42%</div>
                </div>
              </div>
            </Section>
          </div>
        </>
      )}

      {currentPage === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="text-slate-500 text-xs mb-1">Integrations</div>
            <div className="text-slate-900 font-semibold">Cloud & Data</div>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Connect Firebase Auth</li>
              <li>• Stream sensors to BigQuery</li>
              <li>• Deploy APIs on Cloud Run</li>
              <li>• Vision for image QA</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="text-slate-500 text-xs mb-1">Models</div>
            <div className="text-slate-900 font-semibold">Gemini & Vertex</div>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Generative controller</li>
              <li>• Forecast energy</li>
              <li>• Quality predictions</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="text-slate-500 text-xs mb-1">Ops</div>
            <div className="text-slate-900 font-semibold">Pipelines</div>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Data governance</li>
              <li>• Feature store</li>
              <li>• CI/CD</li>
            </ul>
          </div>
        </div>
      )}

      {currentPage === 'reports' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2"><Truck className="w-4 h-4 text-emerald-600" /><h3 className="font-semibold text-slate-900">Monthly Energy Report</h3></div>
            <p className="text-sm text-slate-600 mb-3">Summary of kWh/t, peak loads, and cost savings.</p>
            <Sparkline values={energy} color={'#0ea5e9'} />
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-600" /><h3 className="font-semibold text-slate-900">Quality Trends</h3></div>
            <p className="text-sm text-slate-600 mb-3">Fineness, residues, and corrective actions.</p>
            <Sparkline values={quality} color={'#8b5cf6'} />
          </div>
        </div>
      )}
    </div>
  );
}
