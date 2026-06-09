'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Loader2, MessageSquare, Send } from 'lucide-react';

const guestbookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  comment: z.string().min(3, 'Comment must be at least 3 characters'),
});

type GuestbookFormData = z.infer<typeof guestbookSchema>;

interface GuestbookProps {
  invitationId: string;
}

interface Wish {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

export default function Guestbook({ invitationId }: GuestbookProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookSchema),
  });

  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbooks')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishes(data || []);
    } catch (err) {
      console.error('Error fetching guestbook:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, [invitationId]);

  const onSubmit = async (data: GuestbookFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data: newWish, error } = await supabase
        .from('guestbooks')
        .insert({
          invitation_id: invitationId,
          name: data.name,
          comment: data.comment,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update of UI
      if (newWish) {
        setWishes((prev) => [newWish, ...prev]);
      }
      reset();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to submit wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-4 text-center tracking-tight text-primary flex items-center justify-center gap-2">
        <MessageSquare className="w-8 h-8" />
        Guestbook & Wishes
      </h2>
      <p className="text-center text-muted-foreground mb-8 text-sm max-w-md mx-auto">
        Leave a warm message or wedding wish for the bride and groom.
      </p>

      {/* Write Wish Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto text-left mb-12">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            {...register('name')}
            className={`w-full p-3 rounded-lg border bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none ${
              errors.name ? 'border-destructive focus:ring-destructive/50' : 'border-input'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Write your wishes here..."
            {...register('comment')}
            className={`w-full p-3 rounded-lg border bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none ${
              errors.comment ? 'border-destructive focus:ring-destructive/50' : 'border-input'
            }`}
          />
          {errors.comment && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.comment.message}</p>
          )}
        </div>

        {submitError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary/50 focus:outline-none shadow-sm cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Wish
            </>
          )}
        </button>
      </form>

      {/* Wishes Log List */}
      <div className="max-w-md mx-auto space-y-4 text-left">
        <h3 className="font-bold border-b border-muted pb-2 text-lg">Wishes ({wishes.length})</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : wishes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            No wishes yet. Be the first to write a message!
          </p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="p-4 bg-muted/30 rounded-xl border border-muted"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-primary">{wish.name}</h4>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(wish.created_at).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {wish.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
