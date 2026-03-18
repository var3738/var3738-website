'use client';

import { Download, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportCardProps {
  title: string;
  date: string;
  description: string;
  type: string;
  pages: number;
  typeColor: string;
  index: number;
}

export default function ReportCard({
  title,
  date,
  description,
  type,
  pages,
  index,
}: ReportCardProps) {
  return (
    <motion.div
      className="glass-card flex flex-col p-8 rounded-3xl group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      {/* Report Type Badge */}
      <div className="w-fit px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mb-6">
        {type}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-black mb-4 flex-grow leading-tight group-hover:gradient-text transition-all">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        {description}
      </p>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Calendar size={14} className="text-primary" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <FileText size={14} className="text-secondary" />
          {pages} pages
        </div>
      </div>

      {/* Download Button */}
      <button className="premium-button w-full flex items-center justify-center gap-2 font-bold text-sm group-hover:scale-105 transition-transform">
        <Download size={18} />
        Download PDF
      </button>
    </motion.div>
  );
}
