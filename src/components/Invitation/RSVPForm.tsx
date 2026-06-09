'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Loader2 } from 'lucide-react';

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: z.enum(['attending', 'declined', 'tentative'], {
    message: 'Please select attendance status',
  }),
  guestsCount: z.number().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  invitationId: string;
}

export default function RSVPForm({ invitationId }: RSVPFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestsCount: 1,
    },
  });

  const selectedStatus = watch('status');

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('rsvps').insert({
        invitation_id: invitationId,
        name: data.name,
        status: data.status,
        guests_count: data.status === 'attending' ? data.guestsCount : 0,
      });

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-6 max-w-md mx-auto bg-primary/5 rounded-2xl border border-primary/20 shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground">Your RSVP has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-6 max-w-xl mx-auto border-b border-muted">
      <h2 className="text-3xl font-extrabold mb-4 text-center tracking-tight text-primary">
        RSVP Confirmation
      </h2>
      <p className="text-center text-muted-foreground mb-8 text-sm max-w-md mx-auto">
        Please confirm your attendance by filling out the form below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto text-left">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
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
          <label className="block text-sm font-bold mb-2">Attendance Status</label>
          <div className="grid grid-cols-3 gap-3">
            {(['attending', 'declined', 'tentative'] as const).map((status) => (
              <label
                key={status}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer select-none text-center transition-all ${
                  selectedStatus === status
                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                    : 'border-input hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  value={status}
                  {...register('status')}
                  className="sr-only"
                />
                <span className="capitalize text-sm">{status}</span>
              </label>
            ))}
          </div>
          {errors.status && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.status.message}</p>
          )}
        </div>

        {selectedStatus === 'attending' && (
          <div>
            <label htmlFor="guestsCount" className="block text-sm font-bold mb-2">
              Number of Guests
            </label>
            <input
              id="guestsCount"
              type="number"
              min="1"
              max="10"
              {...register('guestsCount', { valueAsNumber: true })}
              className={`w-full p-3 rounded-lg border bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none ${
                errors.guestsCount ? 'border-destructive focus:ring-destructive/50' : 'border-input'
              }`}
            />
            {errors.guestsCount && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.guestsCount.message}
              </p>
            )}
          </div>
        )}

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
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Confirm Attendance'
          )}
        </button>
      </form>
    </section>
  );
}
