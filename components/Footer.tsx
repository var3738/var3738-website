'use client';

import Link from 'next/link';
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="w-full bg-transparent mt-32 border-t border-white/5 relative overflow-hidden">
      {/* Footer Aurora Glow */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-primary/10 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <h3 className="font-black text-3xl mb-4 gradient-text">VAR 37-38</h3>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              The Voice of a Generation. Institutionalizing youth energy into democratic power through innovation and grassroots action.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start md:items-center">
            <div className="w-full max-w-xs transition-transform hover:scale-105 duration-500">
              <h4 className="font-bold text-sm uppercase tracking-widest text-foreground mb-8">Navigation</h4>
              <ul className="space-y-4 text-base">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-all hover:pl-2">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/democracy-activated" className="text-muted-foreground hover:text-primary transition-all hover:pl-2">
                    Democracy Activated
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-muted-foreground hover:text-primary transition-all hover:pl-2">
                    Research & Reports
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <div className="w-full max-w-xs md:text-right">
              <h4 className="font-bold text-sm uppercase tracking-widest text-foreground mb-8">Connect</h4>
              <div className="flex gap-4 md:justify-end">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="text-muted-foreground font-medium italic">
            VAR 37-38: Building the future of Kenyan Democracy.
          </p>
          <div className="flex flex-col md:items-end">
            <p className="text-muted-foreground opacity-60 font-medium">
              © {new Date().getFullYear()} VAR 37-38. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
