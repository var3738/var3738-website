'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { certUtils } from '@/lib/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

function Content() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [data, setData] = useState<{ name: string; event: string; date: string } | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = certUtils.verifyToken(token);
      if (decoded) {
        setData(decoded);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  }, [token]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Stable resolution
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
      pdf.save(`Certificate_${data?.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isValid === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
             <ShieldCheck size={40} className="text-red-500 opacity-50" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Credential Verification Failed</h1>
          <p className="text-white/40 text-sm font-medium">This certificate link is invalid or has been tampered with. Please contact VAR 37/38 administration for assistance.</p>
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded hover:bg-white/20 transition-colors">Return to Base</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-primary">Decrypting Credentials...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 sm:p-8 flex flex-col items-center gap-8 py-20"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Action Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center no-print" style={{ color: '#FFFFFF' }}>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
          <ArrowLeft size={14} /> Back
        </Link>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black px-6 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50"
          style={{ backgroundColor: '#D0171D' }}
        >
          {isDownloading ? 'Generating...' : <><Download size={14} /> Download Certificate</>}
        </button>
      </div>

      {/* Certificate Frame */}
      <div className="w-full max-w-2xl relative shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div 
          ref={certificateRef}
          className="aspect-[1/1.414] w-full border overflow-hidden relative flex flex-col items-center p-12 sm:p-20 text-center"
          style={{ 
            backgroundColor: '#000000',
            borderColor: 'rgba(208, 23, 29, 0.2)',
            backgroundImage: 'radial-gradient(circle at center, #111111 0%, #000000 100%)' 
          }}
        >
          {/* Mockup Decorative Border */}
          <div 
            className="absolute inset-4 border pointer-events-none"
            style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
          ></div>
          
          {/* Central Logo Watermark (Simplified for html2canvas compatibility) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <img 
              src="/var-logo-nobg.png" 
              alt="Seal" 
              className="w-[80%]" 
              style={{ filter: 'grayscale(1) brightness(1.5) contrast(0)' }}
            />
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between py-10">
            {/* Header Logos */}
            <div className="flex flex-col items-center gap-6 mb-10 w-full">
               <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: '#D0171D' }}>
                 CERTIFICATE <br />
                 <span style={{ fontStyle: 'italic' }}>OF PARTICIPATION</span>
               </h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  This digital credential is proudly presented to
               </p>
            </div>

            {/* Recipient Name */}
            <div className="w-full">
               <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter" style={{ color: '#FFFFFF' }}>
                 {data.name}
               </h2>
               <div 
                className="max-w-[280px] text-[9px] sm:text-[11px] font-medium leading-relaxed uppercase tracking-widest mx-auto mt-4"
                style={{ color: 'rgba(255, 255, 255, 0.4)' }}
               >
                 For their valuable engagement and active contribution in the <br />
                 <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Civic Engagement Initiative</span>
               </div>
            </div>

            {/* Branding Hub */}
            <div className="flex flex-col items-center gap-4">
               <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                 DEMOCRACY <span style={{ color: '#D0171D' }}>ACTIVATED</span>
               </div>
               <div className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                 ORGANIZED BY
               </div>
               <div className="text-xl sm:text-2xl font-black tracking-tighter" style={{ color: '#FFFFFF' }}>
                 VAR 37/38
               </div>
               <div className="text-[10px] font-bold" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{data.date}</div>
            </div>

            {/* Signatures */}
            <div className="w-full grid grid-cols-2 gap-12 sm:gap-20 mt-12 px-4 sm:px-10">
              <div className="flex flex-col items-center gap-1" style={{ color: '#FFFFFF' }}>
                <div 
                  className="font-sacramento text-2xl sm:text-4xl transform -rotate-1 mb-[-10px] h-10 flex items-end"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Keno Manwar
                </div>
                <div className="w-full h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-2">Keno Manwar</div>
                <div className="text-[7px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Founder | VAR 37/38</div>
              </div>

              <div className="flex flex-col items-center gap-1" style={{ color: '#FFFFFF' }}>
                <div 
                  className="font-sacramento text-2xl sm:text-4xl transform rotate-1 mb-[-10px] h-10 flex items-end"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Ivy Muchoki
                </div>
                <div className="w-full h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-2">Ivy Muchoki</div>
                <div className="text-[7px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>National Coordinator</div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-12 flex flex-col items-center gap-4">
               <div className="flex items-center justify-center gap-6">
                 <div className="flex flex-col items-center gap-1">
                    <img src="/var-logo-nobg.png" alt="VAR" className="w-6 opacity-40 grayscale invert" />
                    <span className="text-[6px] font-bold text-white/20 uppercase tracking-widest">Issuer</span>
                 </div>
                 <div className="w-px h-8 bg-white/10"></div>
                 <div className="flex flex-col items-center gap-1">
                    <img 
                      src="/partners/IEBC_Emblem-nobg.png" 
                      alt="IEBC" 
                      className="w-8 opacity-60 grayscale invert brightness-150" 
                      style={{ filter: 'grayscale(1) invert(1) brightness(1.5)' }}
                    />
                    <span className="text-[6px] font-bold text-white/40 uppercase tracking-widest">IEBC Verified</span>
                 </div>
               </div>
               <div className="text-[7px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
                 VAR 37/38 © DEMOCRACY ACTIVATED | ID: {token?.slice(-8).toUpperCase() || 'UNVERIFIED'}
               </div>
            </div>
          </div>

          {/* Diagonal Corner Lines (Mockup Style) */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
             <div className="absolute top-4 left-4 w-12 h-px -rotate-45 origin-top-left" style={{ backgroundColor: 'rgba(208, 23, 29, 0.3)' }}></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
             <div className="absolute top-4 right-4 w-12 h-px rotate-45 origin-top-right" style={{ backgroundColor: 'rgba(208, 23, 29, 0.3)' }}></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
             <div className="absolute bottom-4 left-4 w-12 h-px rotate-45 origin-bottom-left" style={{ backgroundColor: 'rgba(208, 23, 29, 0.3)' }}></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
             <div className="absolute bottom-4 right-4 w-12 h-px -rotate-45 origin-bottom-right" style={{ backgroundColor: 'rgba(208, 23, 29, 0.3)' }}></div>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] font-bold uppercase tracking-widest italic no-print text-center max-w-sm" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
        * Institutionalizing Youth Power through Ideological Engagement. Verified Digital Credential Issued by VAR 37/38.
      </p>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}
