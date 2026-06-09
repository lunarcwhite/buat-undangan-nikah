'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Save, CheckCircle2, XCircle, Sparkles, Layout, Type } from 'lucide-react';
import ThemeWrapper from '@/components/Invitation/ThemeWrapper';
import Hero from '@/components/Invitation/Hero';
import Info from '@/components/Invitation/Info';
import RSVPForm from '@/components/Invitation/RSVPForm';
import Guestbook from '@/components/Invitation/Guestbook';

const formSchema = z.object({
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or hyphens only'),
  bride_name: z.string().min(1, 'Bride name is required'),
  groom_name: z.string().min(1, 'Groom name is required'),
  event_date: z.string().min(1, 'Event date is required'),
  location_name: z.string().min(1, 'Location name is required'),
  location_address: z.string().min(1, 'Location address is required'),
  location_maps_url: z.string().url('Must be a valid Google Maps URL').or(z.literal('')),
  event_time: z.string().min(1, 'Time is required'),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  fontFamily: z.enum(['sans', 'serif', 'outfit']),
  cloudinary_cloud_name: z.string().optional(),
  cloudinary_upload_preset: z.string().optional(),
  gallery_urls: z.array(z.string()).optional(),
  audio_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PRESETS = [
  {
    name: 'Rustic Forest',
    primaryColor: '#10b981',
    backgroundColor: '#064e3b',
    fontFamily: 'serif' as const,
  },
  {
    name: 'Elegant Gold',
    primaryColor: '#f59e0b',
    backgroundColor: '#1e1b4b',
    fontFamily: 'serif' as const,
  },
  {
    name: 'Minimal Rose',
    primaryColor: '#f43f5e',
    backgroundColor: '#0f172a',
    fontFamily: 'sans' as const,
  },
];

const AUDIO_PRESETS = [
  { name: 'Classic Piano (Canon in D)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Romantic Strings', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Elegant Wedding March', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function EditInvitationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'theme'>('details');

  // Slug verification state
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const cloudName = watch('cloudinary_cloud_name') || 'dwedding-app';
    const uploadPreset = watch('cloudinary_upload_preset') || 'invitations_unsigned';

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.secure_url) {
            uploadedUrls.push(data.secure_url);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        const current = watch('gallery_urls') || [];
        setValue('gallery_urls', [...current, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      alert('Upload failed. Confirm your Cloud Name and Unsigned Preset settings.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (indexToRemove: number) => {
    const current = watch('gallery_urls') || [];
    setValue('gallery_urls', current.filter((_, idx) => idx !== indexToRemove));
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
      bride_name: '',
      groom_name: '',
      event_date: '',
      location_name: '',
      location_address: '',
      location_maps_url: '',
      event_time: '',
      primaryColor: '#f59e0b',
      backgroundColor: '#0f172a',
      fontFamily: 'serif',
      cloudinary_cloud_name: 'dwedding-app',
      cloudinary_upload_preset: 'invitations_unsigned',
      gallery_urls: [],
      audio_url: '',
    },
  });

  const watchedSlug = watch('slug');
  const watchedValues = watch();

  // Load invitation details
  useEffect(() => {
    async function loadInvitation() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error loading invitation:', error);
        router.push('/dashboard');
        return;
      }

      setValue('slug', data.slug || '');
      setValue('bride_name', data.content_data?.bride_name || '');
      setValue('groom_name', data.content_data?.groom_name || '');
      setValue('event_date', data.content_data?.event_date || '');
      setValue('location_name', data.content_data?.location_name || '');
      setValue('location_address', data.content_data?.location_address || '');
      setValue('location_maps_url', data.content_data?.location_maps_url || '');
      setValue('event_time', data.content_data?.event_time || '');
      setValue('primaryColor', data.theme_config?.primaryColor || '#f59e0b');
      setValue('backgroundColor', data.theme_config?.backgroundColor || '#0f172a');
      setValue('fontFamily', data.theme_config?.fontFamily || 'serif');
      setValue('cloudinary_cloud_name', data.content_data?.cloudinary_cloud_name || 'dwedding-app');
      setValue('cloudinary_upload_preset', data.content_data?.cloudinary_upload_preset || 'invitations_unsigned');
      setValue('gallery_urls', data.content_data?.gallery_urls || []);
      setValue('audio_url', data.content_data?.audio_url || '');

      setIsLoading(false);
    }
    loadInvitation();
  }, [id, router, supabase, setValue]);

  // Debounced slug check
  useEffect(() => {
    if (!watchedSlug || watchedSlug.length < 3) {
      setSlugStatus('idle');
      return;
    }

    // Check slug requirements
    if (!/^[a-z0-9-]+$/.test(watchedSlug)) {
      setSlugStatus('idle');
      return;
    }

    setSlugStatus('checking');

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/invitations/check-slug?slug=${watchedSlug}&excludeId=${id}`);
        const data = await res.json();
        if (data.available) {
          setSlugStatus('available');
        } else {
          setSlugStatus('taken');
        }
      } catch (err) {
        setSlugStatus('idle');
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [watchedSlug, id]);

  const onSubmit = async (values: FormValues) => {
    if (slugStatus === 'taken') return;

    setIsSaving(true);
    const content_data = {
      bride_name: values.bride_name,
      groom_name: values.groom_name,
      event_date: values.event_date,
      location_name: values.location_name,
      location_address: values.location_address,
      location_maps_url: values.location_maps_url,
      event_time: values.event_time,
      cloudinary_cloud_name: values.cloudinary_cloud_name,
      cloudinary_upload_preset: values.cloudinary_upload_preset,
      gallery_urls: values.gallery_urls || [],
      audio_url: values.audio_url,
    };

    const theme_config = {
      primaryColor: values.primaryColor,
      backgroundColor: values.backgroundColor,
      fontFamily: values.fontFamily,
    };

    const { error } = await supabase
      .from('invitations')
      .update({
        slug: values.slug,
        content_data,
        theme_config,
      })
      .eq('id', id);

    setIsSaving(false);

    if (error) {
      alert('Error saving details: ' + error.message);
    } else {
      router.refresh();
    }
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setValue('primaryColor', preset.primaryColor);
    setValue('backgroundColor', preset.backgroundColor);
    setValue('fontFamily', preset.fontFamily);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Bind values for real-time preview
  const previewContent = {
    brideName: watchedValues.bride_name,
    groomName: watchedValues.groom_name,
    eventDate: watchedValues.event_date,
    locationName: watchedValues.location_name,
    locationAddress: watchedValues.location_address,
    locationMapsUrl: watchedValues.location_maps_url,
    eventTime: watchedValues.event_time,
  };

  const previewTheme = {
    primaryColor: watchedValues.primaryColor,
    backgroundColor: watchedValues.backgroundColor,
    fontFamily: watchedValues.fontFamily,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Left panel: Form editor */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col border-r border-slate-800 h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving || slugStatus === 'taken'}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Configuration
            </button>
            {Object.keys(errors).length > 0 && (
              <span className="text-rose-500 text-xs font-medium">Please fix form errors before saving</span>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Invitation Customizer</h2>

        {/* Tab triggers */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex justify-center items-center gap-2 ${
              activeTab === 'details' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            Content Details
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex justify-center items-center gap-2 ${
              activeTab === 'theme' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            Theme Design
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Slug Customizer */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Invitation URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-medium">royalinvite.com/</span>
                  <input
                    id="slug"
                    type="text"
                    {...register('slug')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-32 pr-10 text-sm font-medium focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="john-jane"
                  />
                  <div className="absolute right-3 top-3">
                    {slugStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                    {slugStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {slugStatus === 'taken' && <XCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                </div>
                {errors.slug && <p className="text-rose-450 text-xs mt-2">{errors.slug.message}</p>}
                {slugStatus === 'taken' && <p className="text-rose-450 text-xs mt-2 font-medium">This URL slug is already taken.</p>}
                {slugStatus === 'available' && <p className="text-emerald-400 text-xs mt-2 font-medium">This URL slug is available!</p>}
              </div>

              {/* Couple Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Bride&apos;s Name
                  </label>
                  <input
                    type="text"
                    {...register('bride_name')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="Bride Name"
                  />
                  {errors.bride_name && <p className="text-rose-450 text-xs mt-1">{errors.bride_name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Groom&apos;s Name
                  </label>
                  <input
                    type="text"
                    {...register('groom_name')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="Groom Name"
                  />
                  {errors.groom_name && <p className="text-rose-450 text-xs mt-1">{errors.groom_name.message}</p>}
                </div>
              </div>

              {/* Event Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Wedding Date & Start Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register('event_date')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none text-slate-300"
                  />
                  {errors.event_date && <p className="text-rose-450 text-xs mt-1">{errors.event_date.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Event Time Label
                  </label>
                  <input
                    type="text"
                    {...register('event_time')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="10:00 - Finish"
                  />
                  {errors.event_time && <p className="text-rose-450 text-xs mt-1">{errors.event_time.message}</p>}
                </div>
              </div>

              {/* Location details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Venue Location Name
                  </label>
                  <input
                    type="text"
                    {...register('location_name')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="Grand Plaza Hall"
                  />
                  {errors.location_name && <p className="text-rose-450 text-xs mt-1">{errors.location_name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Venue Address Details
                  </label>
                  <textarea
                    {...register('location_address')}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none resize-none"
                    placeholder="Main Street No. 42, Jakarta"
                  />
                  {errors.location_address && <p className="text-rose-450 text-xs mt-1">{errors.location_address.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Google Maps URL
                  </label>
                  <input
                    type="text"
                    {...register('location_maps_url')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                    placeholder="https://maps.google.com/..."
                  />
                  {errors.location_maps_url && <p className="text-rose-450 text-xs mt-1">{errors.location_maps_url.message}</p>}
                </div>
              </div>
              {/* Photo Gallery & Cloudinary upload widget */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  Photo Gallery Uploads (Cloudinary)
                </h3>
                
                {/* Cloudinary credentials setup */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Cloud Name</label>
                    <input
                      type="text"
                      {...register('cloudinary_cloud_name')}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-slate-350 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Unsigned Preset</label>
                    <input
                      type="text"
                      {...register('cloudinary_upload_preset')}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-slate-350 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload picker */}
                <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-slate-750 transition relative bg-slate-950/20">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      <span className="text-xs text-slate-450 font-medium">Uploading images...</span>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-2">
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-4 py-2 rounded-lg font-bold hover:bg-amber-500/15 transition">
                        Select Photos
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-3">Supports JPG, PNG, WEBP (multiple files)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Uploaded thumbnails list */}
                {watchedValues.gallery_urls && watchedValues.gallery_urls.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-450 mb-2">Uploaded Images ({watchedValues.gallery_urls.length})</div>
                    <div className="grid grid-cols-4 gap-2">
                      {watchedValues.gallery_urls.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-850 bg-slate-950">
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 font-bold transition text-xs cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Presets */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Pre-configured Themes
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="border border-slate-800 hover:border-slate-700 bg-slate-950 p-3 rounded-xl transition text-left cursor-pointer active:ring-1 active:ring-amber-500/50"
                    >
                      <div className="text-xs font-bold text-slate-300 mb-2 truncate">{preset.name}</div>
                      <div className="flex gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-800"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-slate-800"
                          style={{ backgroundColor: preset.backgroundColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Primary Accent Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      {...register('primaryColor')}
                      className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      {...register('primaryColor')}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs uppercase font-mono text-center focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      {...register('backgroundColor')}
                      className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      {...register('backgroundColor')}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs uppercase font-mono text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Font controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Typography Family
                </label>
                <select
                  {...register('fontFamily')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
                >
                  <option value="sans">Modern Sans-Serif (Inter)</option>
                  <option value="serif">Elegant Serif (Playfair Display)</option>
                  <option value="outfit">Playful Sans-Serif (Outfit)</option>
                </select>
              </div>
              {/* Background Music controls */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Background Music Track
                </label>
                <div className="space-y-3">
                  <select
                    value={
                      AUDIO_PRESETS.some((p) => p.url === watchedValues.audio_url)
                        ? watchedValues.audio_url
                        : watchedValues.audio_url
                        ? 'custom'
                        : ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setValue('audio_url', 'https://');
                      } else {
                        setValue('audio_url', val);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                  >
                    <option value="">No Background Music</option>
                    <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">Classic Piano (Canon in D)</option>
                    <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">Romantic Strings</option>
                    <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3">Elegant Wedding March</option>
                    <option value="custom">Custom Audio URL...</option>
                  </select>

                  {/* Render text input if custom audio url option is selected */}
                  {(!AUDIO_PRESETS.some((p) => p.url === watchedValues.audio_url) && watchedValues.audio_url && watchedValues.audio_url !== 'https://') || watchedValues.audio_url === 'https://' ? (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Direct MP3 Link</label>
                      <input
                        type="text"
                        {...register('audio_url')}
                        placeholder="https://example.com/song.mp3"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Right panel: Visual live preview */}
      <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-900 flex justify-center items-center h-screen sticky top-0 overflow-y-auto">
        <div className="w-full max-w-[375px] h-[720px] bg-slate-950 rounded-[40px] border-[12px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
          {/* Top Status Bar mock */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 z-40 flex justify-between px-6 items-center text-[10px] text-slate-400 font-semibold">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="flex gap-1">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Invitation view content inside the device */}
          <div className="flex-1 overflow-y-auto pt-6 scrollbar-hide">
            <ThemeWrapper themeConfig={previewTheme}>
              <main className="w-full bg-slate-900 text-slate-200">
                <Hero contentData={previewContent} />
                <Info contentData={previewContent} />
                <RSVPForm invitationId={id} />
                <Guestbook invitationId={id} />
              </main>
            </ThemeWrapper>
          </div>

          {/* Home indicator bar mock */}
          <div className="h-6 bg-slate-950 z-40 flex justify-center items-center pb-2">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
