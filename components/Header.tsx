'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'democracy', label: 'Democracy Activated', href: '/democracy-activated' },
    { id: 'reports', label: 'Reports', href: '/reports' },
  ];

  return (
    <header className="w-full bg-background border-b-4 border-black p-4 md:p-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group active:translate-x-1 active:translate-y-1 transition-all"
        >
          <Image src="/var-logo-nobg.png" alt="VAR 37-38 Logo" width={100} height={100} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-black uppercase tracking-widest hover:bg-secondary px-3 py-1 rounded-lg border-2 border-transparent hover:border-black transition-all"
            >
              {item.label}
            </Link>
          ))}
          <button className="neu-button text-sm py-2 px-6">
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 bg-white border-4 border-black rounded-xl neu-shadow active:shadow-none transition-all"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b-4 border-black p-6 space-y-6 z-40"
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block text-xl font-black uppercase border-b-4 border-black/10 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="neu-button w-full text-lg">
              Get Started
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
