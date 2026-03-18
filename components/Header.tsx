'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'democracy', label: 'Democracy Activated', href: '/democracy-activated' },
    { id: 'reports', label: 'Reports', href: '/reports' },
  ];

  return (
    <header className="glass-header w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors"></div>
              <Image
                src="/var-logo.png"
                alt="VAR 37-38 Logo"
                width={50}
                height={50}
                className="h-10 w-auto relative z-10"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-lg leading-none gradient-text">VAR</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">37-38</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <button className="premium-button text-sm">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-10 space-y-6 pt-6 animate-in slide-in-from-top-4 duration-300">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block text-lg font-bold hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="w-full premium-button text-base">
              Get Started
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
