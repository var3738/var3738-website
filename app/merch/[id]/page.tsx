'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { api, Product } from '@/lib/api';
import { Loader2, ArrowLeft, ShieldCheck, Box } from 'lucide-react';
import Link from 'next/link';

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!params?.id) return;
      try {
        const data = await api.getProduct(params.id as string);
        setProduct(data);
      } catch (err: any) {
        console.error('Failed to load product:', err);
        setError('Merchandise not found or out of stock.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [params?.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading Inventory...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <span className="text-2xl font-black">!</span>
        </div>
        <p className="text-[12px] font-black uppercase tracking-widest text-white/50">{error || 'Product not found'}</p>
        <button onClick={() => router.push('/merch')} className="text-primary hover:underline text-[10px] uppercase font-black tracking-widest">
          Return to Store
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background selection:bg-primary selection:text-black">
      <div className="max-w-6xl mx-auto px-4">
        <Link 
          href="/merch" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Merch</span>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square relative modern-card overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-12"
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="object-contain w-full h-full drop-shadow-2xl" />
            ) : (
              <Box size={100} className="text-white/10" />
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Republic Gear</div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-white/80 mb-8 tracking-tighter uppercase">
              KSH {product.price.toLocaleString()}
            </p>
            
            <p className="text-lg text-white/50 font-bold tracking-tight leading-relaxed mb-12">
              {product.description || "Official gear for the Viable Alternative Republic movement."}
            </p>

            <div className="space-y-6">
               <button 
                 disabled={product.stock_quantity <= 0}
                 className="crimson-btn w-full py-5 text-[12px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {product.stock_quantity > 0 ? 'Purchase Now' : 'Out of Stock'}
               </button>
               
               <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                 <ShieldCheck size={14} className="text-primary" />
                 <span>Secure Verification via Paybill</span>
               </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">PCODE</div>
                  <div className="text-xs font-bold font-mono text-white/60">{product.id.slice(0,8)}</div>
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Availability</div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${product.stock_quantity > 0 ? 'text-primary' : 'text-red-500'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'UNAVAILABLE'}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
