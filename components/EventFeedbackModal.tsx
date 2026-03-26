'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import Portal from './Portal';
import { api } from '@/lib/api';

interface EventFeedbackModalProps {
  eventId: number;
  eventName: string;
  onClose: () => void;
}

export default function EventFeedbackModal({ eventId, eventName, onClose }: EventFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await api.submitFeedback(eventId, rating, comment);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Check your connection or log in again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="modern-card max-w-md w-full p-8 relative bg-black/60 border border-white/10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Event Feedback</h3>
          <p className="text-sm text-white/40 mb-8 uppercase tracking-widest font-bold">{eventName}</p>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center mb-4">
                 <Send size={24} />
              </div>
              <p className="text-lg font-black uppercase tracking-widest text-white">Thank You</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Your feedback amplifies the movement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Rate your experience</label>
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-colors p-2 rounded-full hover:bg-white/10 ${rating >= star ? 'text-primary' : 'text-white/20'}`}
                    >
                      <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Additional Comments (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center font-bold tracking-widest uppercase">{error}</p>}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 crimson-btn text-xs font-black uppercase tracking-widest"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </Portal>
  );
}
