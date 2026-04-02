import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Save, UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url' | 'date' | 'file' | 'richtext' | 'select';
  folder?: string; // used for file uploads to Cloudinary
  multiple?: boolean;
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface CMSFormModalProps {
  title: string;
  fields: FormField[];
  initialData?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function CMSFormModal({
  title,
  fields,
  initialData,
  isOpen,
  onClose,
  onSubmit
}: CMSFormModalProps) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track individual file upload states
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

  // Ensure formData is reset when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, folderName: string, multiple?: boolean) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingFields(prev => ({ ...prev, [fieldName]: true }));
    setError(null);

    try {
      const urls: string[] = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('folder', folderName || 'general');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to upload a file to Cloudinary');
        urls.push(data.url);
      }

      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: multiple ? [...(prev[fieldName] || []), ...urls] : urls[0]
      }));
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any uploads are still pending
    if (Object.values(uploadingFields).some(isUploading => isUploading)) {
      setError('Please wait for all files to finish uploading before saving.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during save.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-black uppercase tracking-widest text-primary wrap-break-word">{title}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                ) : field.type === 'richtext' ? (
                  <div className="bg-white/95 rounded-lg text-black overflow-hidden [&_.ql-toolbar]:bg-gray-100 [&_.ql-container]:min-h-[250px] [&_.ql-editor]:min-h-[250px]">
                    <ReactQuill 
                      theme="snow"
                      value={formData[field.name] || ''}
                      onChange={(content) => setFormData((prev: any) => ({ ...prev, [field.name]: content }))}
                    />
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none"
                  >
                    <option value="" disabled className="bg-background">Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-background">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* File Upload Button */}
                      <div className="relative overflow-hidden w-full max-w-[200px]">
                        <button
                          type="button"
                          disabled={uploadingFields[field.name]}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          {uploadingFields[field.name] ? (
                            <><Loader2 size={16} className="animate-spin text-primary" /> Uploading...</>
                          ) : (
                            <><UploadCloud size={16} /> Choose File</>
                          )}
                        </button>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          multiple={field.multiple}
                          onChange={(e) => handleFileUpload(e, field.name, field.folder || 'general', field.multiple)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploadingFields[field.name]}
                        />
                      </div>
                      
                      <div className="text-xs text-white/30 font-bold uppercase tracking-widest">OR PULL URL</div>
                    </div>
                    
                    {/* Fallback external URL string input */}
                    <div className="flex relative items-center">
                      <LinkIcon size={16} className="absolute left-3 text-white/30" />
                      <input
                        type="url"
                        name={field.name}
                        value={Array.isArray(formData[field.name]) ? formData[field.name][0] || '' : formData[field.name] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev: any) => ({
                            ...prev,
                            [field.name]: field.multiple ? (val ? [val] : []) : val
                          }));
                        }}
                        disabled={field.multiple && formData[field.name]?.length > 1}
                        placeholder={field.multiple ? "https://... (disables multi-upload if used)" : "https://..."}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                      />
                    </div>
                    
                    {/* Preview logic */}
                    {formData[field.name] && !uploadingFields[field.name] && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(Array.isArray(formData[field.name]) ? formData[field.name] : [formData[field.name]]).map((url: string, idx: number) => (
                           <div key={idx} className="text-xs text-primary flex items-center gap-2 bg-primary/10 p-2 rounded border border-primary/20">
                             {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('cloudinary') ? (
                               <ImageIcon size={14} />
                             ) : (
                               <LinkIcon size={14} />
                             )}
                             <span className="truncate max-w-[150px]">{url.split('/').pop()}</span>
                             <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-white/50 hover:text-white">View</a>
                             {field.multiple && (
                               <button type="button" onClick={() => {
                                 setFormData((prev: any) => ({
                                   ...prev,
                                   [field.name]: prev[field.name].filter((_: any, i: number) => i !== idx)
                                 }));
                               }} className="ml-2 text-white/50 hover:text-red-500"><X size={12}/></button>
                             )}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[10px] uppercase font-black tracking-widest text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)}
              className="crimson-btn flex items-center gap-2 px-8 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
