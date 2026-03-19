'use client';

import Link from 'next/link';
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="w-full bg-[#000] text-white mt-32 border-t-8 border-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-start translate-y-2">
            <Image src="/var-logo-nobg.png" alt="VAR 37-38 Logo" width={100} height={100} />
            <p className="text-lg font-bold leading-tight max-w-sm text-white/80">
              The Voice of a Generation. Institutionalizing youth energy into democratic power through innovation and grassroots action.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start md:items-center">
            <div className="w-full max-w-xs p-8 bg-white/5 border-4 border-white/10 rounded-[2rem]">
              <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-8">Navigation</h4>
              <ul className="space-y-4 text-xl font-black italic">
                <li>
                  <Link href="/" className="hover:text-primary transition-all flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-primary transform scale-0 group-hover:scale-100 transition-transform"></div>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/democracy-activated" className="hover:text-primary transition-all flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-primary transform scale-0 group-hover:scale-100 transition-transform"></div>
                    Democracy Activated
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-primary transition-all flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-primary transform scale-0 group-hover:scale-100 transition-transform"></div>
                    Research & Reports
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <div className="w-full max-w-xs md:text-right">
              <h4 className="font-black text-xs uppercase tracking-widest text-secondary mb-8">Connect</h4>
              <div className="flex gap-4 md:justify-end">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="w-14 h-14 flex items-center justify-center bg-white border-4 border-black rounded-2xl text-black hover:bg-primary transition-all neu-shadow active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t-4 border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="font-black italic text-xl text-primary/60 uppercase tracking-tighter">
            Building the future of Kenyan Democracy.
          </p>
          <div className="flex flex-col md:items-end">
            <p className="font-black uppercase tracking-widest text-xs opacity-40">
              © {new Date().getFullYear()} VAR 37-38. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
