'use client';

import Link from 'next/link';
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/var3738_/', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/channel/UCichgvHKGtldAZuRDM2WeVw', label: 'YouTube' },
    { icon: Facebook, href: 'https://web.facebook.com/profile.php?id=61578676963897', label: 'Facebook' },
  ];

  return (
    <footer className="w-full bg-black text-white py-32 border-t border-white/5 relative overflow-hidden">
      <div className="glow-orb -bottom-20 -left-20 opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-10">
              <Image src="/var-logo-nobg.png" alt="VAR 37-38 Logo" width={80} height={80} className="brightness-200" />
            </Link>
            <p className="text-xl font-black tracking-tighter max-w-sm mb-10">
              Institutionalizing youth energy into structured civic participation and electoral power.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-primary hover:border-primary transition-all shadow-sm"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Practical Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8">Ecosystem</h4>
            <ul className="space-y-4">
              {[
                { label: 'About VAR', href: '/about' },
                { label: 'Democracy Activated', href: '/democracy-activated' },
                { label: 'Impact Dashboard', href: '/impact' },
                { label: 'National Agenda', href: '/agenda' },
                { label: 'Digital Resilience', href: '/tech' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8">Governance</h4>
            <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Resources</div>
              <a href="/privacy" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Privacy Protocol</a>
              <a href="/terms" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Terms of Action</a>
              <a href="/reports" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Impact Reports</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            Building the future of Kenyan Democracy.
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            © {new Date().getFullYear()} VAR 37-38. Systems for Continuity.
          </p>
        </div>
      </div>
    </footer>
  );
}
