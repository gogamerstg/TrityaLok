import React from 'react';
import { BarChart3, Download, TrendingUp, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const downloadReport = () => {
    alert('Generating PDF Analytics Report for TrityaLok Digital Twin...');
    setTimeout(() => alert('Download Started: Analytics_Report_IITB_Nexus.pdf'), 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Digital Twin Analytics & Reports</h1>
          </div>
          <p className="text-xs text-slate-400">Reconstruction quality reports, coverage metrics, and accuracy benchmarks.</p>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Mapping Coverage', value: '98.4%', desc: 'Total indoor area scanned' },
          { label: 'Mesh Accuracy', value: '< 2.5 cm', desc: 'Ground truth laser deviation' },
          { label: 'Texture Quality', value: '4K PBR', desc: 'Baking & surface optimization' },
        ].map(item => (
          <div key={item.label} className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-2">
            <div className="text-2xl font-bold text-white">{item.value}</div>
            <div className="text-xs font-semibold text-teal-400">{item.label}</div>
            <p className="text-[11px] text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
