'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, Printer, ArrowLeft, Award, CheckCircle, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

const LC = {
  primary: '#D0171D',
  white: '#FFFFFF',
  white80: 'rgba(255, 255, 255, 0.8)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white40: 'rgba(255, 255, 255, 0.4)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white10: 'rgba(255, 255, 255, 0.1)',
  white05: 'rgba(255, 255, 255, 0.05)',
  black: '#000000',
  bgDark: '#0a0a0a',
  primary20: 'rgba(208, 23, 29, 0.2)',
  primary30: 'rgba(208, 23, 29, 0.3)',
};

// --- Laboratory Data (Requested by User) ---
const SAMPLE_DATA = {
    "credential_id": "VAR-2026-S34D",
    "recipient_name": "Jon doe3",
    "recipient_email": "jodoe3@gmail.com",
    "event_id": 2,
    "event_name": "test event2",
    "user_id": "2342039d-d09b-4f91-93e5-ccb2ffb945f2",
    "issue_date": "2026-04-12T13:02:31.351000",
    "is_claimed": true,
    "metadata_json": {},
    "id": "def5c676-ca5e-4a1e-8a84-6236191020dd"
};

export default function SampleCertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(SAMPLE_DATA.issue_date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate_${SAMPLE_DATA.recipient_name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-8 flex flex-col items-center gap-8 py-20 bg-[#0a0a0a]"
    >
      {/* Test Notice */}
      <div className="w-full max-w-2xl bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
               <ShieldCheck size={18} />
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-primary">Sample Generation Mode</div>
               <div className="text-[9px] font-medium text-white/50">Viewing data for Credential ID: {SAMPLE_DATA.credential_id}</div>
            </div>
         </div>
         <Link href={`/certificate?id=${SAMPLE_DATA.credential_id}`} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            Test Live Registry <ExternalLink size={12} />
         </Link>
      </div>

      {/* Action Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center no-print">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all opacity-40 hover:opacity-100 text-white">
          <ArrowLeft size={14} /> Back
        </Link>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50 bg-primary text-black"
        >
          {isDownloading ? 'Generating...' : <><Download size={14} /> Download Certificate</>}
        </button>
      </div>

      {/* Certificate Frame */}
      <div className="w-full max-w-2xl relative shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div 
          ref={certificateRef}
          className="aspect-[1/1.414] w-full overflow-hidden relative flex flex-col items-center p-12 sm:p-20 text-center"
          style={{ 
            backgroundColor: LC.black,
            border: `1px solid ${LC.primary20}`,
            backgroundImage: 'radial-gradient(circle at center, #111111 0%, #000000 100%)',
            color: LC.white
          }}
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/20 m-6" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/20 m-6" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/20 m-6" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/20 m-6" />

          {/* Logo Area */}
          <div className="mb-8 sm:mb-12 relative z-10 scale-75 sm:scale-100">
             <div className="w-16 h-16 bg-primary rounded-2xl rotate-45 flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(208,23,29,0.3)]">
                <Award size={32} className="-rotate-45 text-black" strokeWidth={2.5} />
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Voice of a Generation</div>
             <div className="text-3xl font-black uppercase tracking-tighter mt-1">VAR 37/38</div>
          </div>

          {/* Header */}
          <div className="mb-8 sm:mb-12 relative z-10">
             <div className="text-primary text-[8px] font-black uppercase tracking-[0.5em] mb-4">Official Accreditation</div>
             <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">Certificate of<br/>Participation</h1>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full">
             <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-4">This is to certify that</div>
             <div className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6 underline underline-offset-8 decoration-primary/30">
                {SAMPLE_DATA.recipient_name}
             </div>
             <div className="max-w-md text-sm sm:text-base font-medium text-white/60 leading-relaxed mb-6">
                Has successfully participated and completed the 
                <span className="text-white block mt-1 font-bold uppercase tracking-wide">
                   {SAMPLE_DATA.event_name}
                </span>
             </div>
             <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                Issued on {formattedDate}
             </div>
          </div>

          {/* Footer / Meta */}
          <div className="w-full pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
             <div className="text-left">
                <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Credential ID</div>
                <div className="text-[10px] font-mono font-bold text-primary tracking-wider bg-primary/5 px-2 py-1 rounded border border-primary/10">
                   {SAMPLE_DATA.credential_id}
                </div>
             </div>
             
             <div className="flex gap-4 items-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group">
                   <ShieldCheck size={24} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-right">
                   <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Authenticity</div>
                   <div className="text-[10px] font-black uppercase tracking-tighter text-white">Verified Security</div>
                </div>
             </div>
          </div>

          {/* Signature Line Overlay */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 border-b border-primary/20 no-print" />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest text-white/20 no-print">Official Registrar</div>

        </div>
      </div>

      <div className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
         Digital Asset Registry and Verification System v1.0
      </div>
    </div>
  );
}
