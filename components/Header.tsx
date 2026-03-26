'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Democracy Activated', href: '/democracy-activated' },
    { label: 'Impact', href: '/impact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Merch', href: '/merch' },
    
  ];

  return (
    <header className="glass-header">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/var-logo-nobg.png" alt="VAR 37-38 Logo" width={80} height={80} className="brightness-200"  />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowRegister(true)}
            className="crimson-btn-outline text-xs py-2 px-5 hidden md:block"
          >
            Register
          </button>
          
          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-bold uppercase tracking-tight text-white hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setShowRegister(true);
                  setIsMenuOpen(false);
                }}
                className="crimson-btn w-full"
              >
                Register
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showRegister && (
        <RegistrationForm 
          wardName="Join the Movement" 
          onClose={() => setShowRegister(false)} 
        />
      )}
    </header>
  );
}
