import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Loader2, Link2, ImagePlus } from 'lucide-react';
import { api, uploadFile } from '../../lib/api';
import type { Project } from '../../lib/api';

type Props = { project: Project | null; categories: string[]; nextOrder: number; onClose: () => void; onSaved: () => void };

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ProjectForm({ project, categories, nextOrder, onClose, onSaved }: Props) {
  const [f, setF] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    category: project?.category ?? '',
    client: project?.client ?? '',
    year: project?.year ? String(project.year) : String(new Date().getFullYear()),
    role: project?.role ?? '',
    duration: project?.duration ?? '',
    description: project?.description ?? '',
    video_url: project?.video_url ?? '',
    thumbnail_url: project?.thumbnail_url ?? '',
    featured: project?.featured ?? false,
    sort_order: String(project?.sort_order ?? nextOrder),
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [vProg, setVProg] = useState<number | null>(null);
  const [tProg, setTProg] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const vInput = useRef<HTMLInputElement>(null);
  const tInput = useRef<HTMLInputElement>(null);

  const videoPreview = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : f.video_url), [videoFile, f.video_url]);
  const thumbPreview = useMemo(() => (thumbFile ? URL.createObjectURL(thumbFile) : f.thumbnail_url), [thumbFile, f.thumbnail_url]);

  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const pickVideo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) return setErrors((e) => ({ ...e, video_url: 'Please choose a video file' }));
    setVideoFile(file);
    setErrors((e) => ({ ...e, video_url: '' }));
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      if (isFinite(v.duration)) setF((p) => ({ ...p, duration: fmtDuration(v.duration) }));
    };
    v.src = url;
    if (!f.title) set('title', file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.title.trim()) errs.title = 'Title is required';
    if (!f.category.trim()) errs.category = 'Category is required';
    if (!videoFile && !f.video_url.trim()) errs.video_url = 'Upload a video or paste a URL';
    if (f.year && !/^\d{4}$/.test(f.year)) errs.year = 'Use a 4-digit year';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setError('');
    try {
      let video_url = f.video_url.trim();
      let thumbnail_url = f.thumbnail_url.trim();
      if (videoFile) {
        setVProg(0);
        video_url = await uploadFile(videoFile, 'videos', setVProg);
      }
      if (thumbFile) {
        setTProg(0);
        thumbnail_url = await uploadFile(thumbFile, 'thumbs', setTProg);
      }
      const body = { ...f, video_url, thumbnail_url, title: f.title.trim(), category: f.category.trim() };
      if (project) await api('/api/projects', { method: 'PUT', auth: true, body: { id: project.id, ...body } });
      else await api('/api/projects', { method: 'POST', auth: true, body });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const input = 'mt-1.5 w-full rounded-md border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent';
  const lbl = 'font-mono text-[10px] uppercase tracking-[0.2em] text-muted';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-ink/80 backdrop-blur-sm" onClick={onClose}>
      <motion.form
        onSubmit={submit}
        noValidate
        onClick={(e) => e.stopPropagation()}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        className="flex h-full w-full max-w-2xl flex-col border-l border-line bg-ink-2"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className={lbl}>{project ? 'Edit project' : 'New project'}</p>
            <h2 className="text-xl font-bold">{f.title || 'Untitled cut'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-ink-3" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Video */}
          <div>
            <p className={lbl}>Video *</p>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pickVideo(e.dataTransfer.files?.[0]);
              }}
              className={`mt-1.5 overflow-hidden rounded-lg border-2 border-dashed ${errors.video_url ? 'border-accent' : 'border-line'} bg-ink`}
            >
              {videoPreview ? (
                <div className="relative">
                  <video src={videoPreview} controls className="aspect-video w-full bg-black" />
                  <button type="button" onClick={() => vInput.current?.click()} className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur hover:bg-accent hover:text-ink">
                    Replace
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => vInput.current?.click()} className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-muted hover:text-paper">
                  <UploadCloud className="h-10 w-10" />
                  <span className="text-sm">Drop a video here or click to upload</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest">MP4 · MOV · WEBM</span>
                </button>
              )}
              {vProg !== null && (
                <div className="h-1.5 bg-ink-3">
                  <div className="h-full bg-accent transition-all" style={{ width: `${vProg}%` }} />
                </div>
              )}
            </div>
            <input ref={vInput} type="file" accept="video/*" hidden onChange={(e) => pickVideo(e.target.files?.[0])} />
            <div className="mt-2 flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0 text-muted" />
              <input
                value={videoFile ? videoFile.name : f.video_url}
                disabled={!!videoFile}
                onChange={(e) => set('video_url', e.target.value)}
                placeholder="…or paste a direct video URL"
                className="w-full bg-transparent py-1 text-sm text-muted outline-none disabled:opacity-60"
              />
              {videoFile && (
                <button type="button" onClick={() => setVideoFile(null)} className="font-mono text-[10px] uppercase text-accent">
                  Clear
                </button>
              )}
            </div>
            {errors.video_url && <p className="mt-1 text-xs text-accent">{errors.video_url}</p>}
            {vProg !== null && saving && <p className="mt-1 font-mono text-xs text-muted">Uploading video… {vProg}%</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <p className={lbl}>Thumbnail (optional — first frame is used otherwise)</p>
            <div className="mt-1.5 flex items-center gap-4">
              <button type="button" onClick={() => tInput.current?.click()} className="flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-line bg-ink text-muted hover:text-paper">
                {thumbPreview ? <img src={thumbPreview} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6" />}
              </button>
              <div className="flex-1">
                <input value={thumbFile ? thumbFile.name : f.thumbnail_url} disabled={!!thumbFile} onChange={(e) => set('thumbnail_url', e.target.value)} placeholder="Paste image URL or upload" className={input} />
                {(thumbFile || f.thumbnail_url) && (
                  <button
                    type="button"
                    onClick={() => {
                      setThumbFile(null);
                      set('thumbnail_url', '');
                    }}
                    className="mt-1 font-mono text-[10px] uppercase text-accent"
                  >
                    Remove
                  </button>
                )}
                {tProg !== null && saving && <p className="mt-1 font-mono text-xs text-muted">Uploading thumbnail… {tProg}%</p>}
              </div>
            </div>
            <input ref={tInput} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && setThumbFile(e.target.files[0])} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={lbl}>Title *</label>
              <input value={f.title} onChange={(e) => set('title', e.target.value)} className={`${input} ${errors.title ? 'border-accent' : ''}`} placeholder="Neon Lullaby" />
              {errors.title && <p className="mt-1 text-xs text-accent">{errors.title}</p>}
            </div>
            <div>
              <label className={lbl}>Category *</label>
              <input list="cats" value={f.category} onChange={(e) => set('category', e.target.value)} className={`${input} ${errors.category ? 'border-accent' : ''}`} placeholder="Music Video" />
              <datalist id="cats">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.category && <p className="mt-1 text-xs text-accent">{errors.category}</p>}
            </div>
            <div>
              <label className={lbl}>Client</label>
              <input value={f.client} onChange={(e) => set('client', e.target.value)} className={input} placeholder="Brand or artist" />
            </div>
            <div>
              <label className={lbl}>Year</label>
              <input value={f.year} onChange={(e) => set('year', e.target.value)} className={`${input} ${errors.year ? 'border-accent' : ''}`} />
              {errors.year && <p className="mt-1 text-xs text-accent">{errors.year}</p>}
            </div>
            <div>
              <label className={lbl}>Runtime</label>
              <input value={f.duration} onChange={(e) => set('duration', e.target.value)} className={input} placeholder="02:45" />
            </div>
            <div>
              <label className={lbl}>Role</label>
              <input value={f.role} onChange={(e) => set('role', e.target.value)} className={input} placeholder="Edit, Color, Sound" />
            </div>
            <div>
              <label className={lbl}>Slug</label>
              <input value={f.slug} onChange={(e) => set('slug', e.target.value)} className={input} placeholder="auto from title" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Description</label>
              <textarea rows={4} value={f.description} onChange={(e) => set('description', e.target.value)} className={`${input} resize-none`} placeholder="The brief, the approach, the result…" />
            </div>
            <div>
              <label className={lbl}>Order</label>
              <input type="number" value={f.sort_order} onChange={(e) => set('sort_order', e.target.value)} className={input} />
            </div>
            <label className="flex cursor-pointer items-center gap-3 self-end rounded-md border border-line px-3 py-2.5">
              <span className={`relative h-5 w-9 rounded-full transition-colors ${f.featured ? 'bg-accent' : 'bg-ink-3'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-all ${f.featured ? 'left-[18px]' : 'left-0.5'}`} />
              </span>
              <input type="checkbox" hidden checked={f.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span className="text-sm">Feature on homepage</span>
            </label>
          </div>
          {error && <p className="rounded-md bg-accent/10 p-3 text-sm text-accent">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2.5 text-sm text-muted hover:text-paper">
            Cancel
          </button>
          <button disabled={saving} className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : project ? 'Save changes' : 'Publish project'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
