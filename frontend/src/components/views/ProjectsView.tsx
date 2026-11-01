import React, { useState } from 'react';
import { FolderKanban, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState([
    { id: '1', name: 'TrityaLok_IITB_Innovation_Complex', date: 'Today, 14:32', floors: 2, pois: 13, status: 'Complete' }
  ]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    setProjects([
      { id: Date.now().toString(), name: newProjectName, date: 'Just now', floors: 1, pois: 5, status: 'Processing' },
      ...projects
    ]);
    setNewProjectName('');
    setShowNewModal(false);
    alert('Project created successfully! Initializing 3D pipeline...');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <FolderKanban className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Project Manager</h1>
          </div>
          <p className="text-xs text-slate-400">Manage spatial capture projects, history, and exports.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {showNewModal && (
        <div className="p-4 rounded-2xl bg-[#111827] border border-orange-500/40 space-y-3">
          <h2 className="text-sm font-bold text-white">Create New TrityaLok Spatial Project</h2>
          <input
            type="text"
            placeholder="Enter Project Name (e.g. Hostels_Block_12)"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full bg-[#070A0F] border border-[#1F293D] rounded-xl px-4 py-2 text-xs text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold cursor-pointer"
            >
              Initialize Project
            </button>
            <button
              onClick={() => setShowNewModal(false)}
              className="px-4 py-2 rounded-xl bg-[#172033] text-slate-300 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-200">Recent Projects</h2>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">{p.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Last modified: {p.date} • {p.floors} Floors • {p.pois} POIs</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{p.status}</span>
                <button onClick={() => alert(`Opening project: ${p.name}`)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setProjects(projects.filter(proj => proj.id !== p.id))} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
