'use client';

import { useState } from 'react';
import { Download, Database, FileJson, CheckCircle } from 'lucide-react';

export default function DataExportPortal() {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleExport = async (level: number) => {
    setDownloading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/geo/export?admin_level=${level}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = level === 1 ? 'kenya_counties.geojson' : 'kenya_wards.geojson';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modern-card p-12 relative overflow-hidden bg-white/2 border-white/5">
      <div className="glow-orb -bottom-20 -left-20 opacity-10 blur-3xl"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 text-primary mb-6">
            <Database size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Open Data Registry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            Civic Data <br /><span className="text-primary italic">Sovereignty</span>
          </h2>
          <p className="text-sm text-white/50 leading-relaxed font-bold tracking-tight mb-10 max-w-md">
            Empower your local movements with raw geo-spatial data. All administrative boundaries are curated for high-integrity civic engagement. 
            Licensed under CC-BY-IGO.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { level: 1, label: 'Download County Boundaries', desc: '47 Counties | Simplified (1km)' },
            { level: 3, label: 'Download Ward Boundaries', desc: '1,450+ Wards | High Precision' }
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => handleExport(item.level)}
              disabled={downloading}
              className="flex items-center justify-between p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/40 group transition-all"
            >
              <div className="flex items-center gap-6">
                 <div className="p-4 rounded-xl bg-white/5 text-white/40 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <FileJson size={24} />
                 </div>
                 <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-widest text-white mb-1">{item.label}</div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.desc}</div>
                 </div>
              </div>
              <div className="p-2 rounded-full border border-white/10 text-white/20 group-hover:border-primary/40 group-hover:text-primary transition-all">
                 {completed ? <CheckCircle size={16} /> : <Download size={16} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
