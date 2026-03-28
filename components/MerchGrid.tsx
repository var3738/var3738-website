'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api, Product } from '@/lib/api';

export default function MerchGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load merchandise.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading Collection...</p>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
          {error || 'No products available at the moment.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, idx) => (
        <Link key={product.id} href={`/merch/${product.id}`} className="group relative flex flex-col h-full cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col h-full"
          >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-all duration-500">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="text-white/10" size={48} />
                </div>
              )}
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                 <div className="bg-primary text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Buy Now <ArrowRight size={14} />
                </div>
              </div>
              
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <div className="absolute top-4 right-4 bg-primary text-black text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  Low Stock
                </div>
              )}
               {product.stock_quantity === 0 && (
                <div className="absolute top-4 right-4 bg-white/10 text-white/50 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md">
                  Sold Out
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="mt-6 flex flex-col gap-2 grow">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <span className="text-sm font-black text-primary">
                  KSH {product.price.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-bold leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
