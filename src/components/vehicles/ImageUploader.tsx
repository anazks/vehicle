import React, { useState } from 'react';
import { UploadCloud, X, Star } from 'lucide-react';

interface ImageUploaderProps {
  coverImage: string;
  images: string[];
  onChange: (cover: string, imageList: string[]) => void;
}

const sampleBikeImages = [
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ coverImage, images, onChange }) => {
  const [customUrl, setCustomUrl] = useState('');

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    const updated = [...images, customUrl.trim()];
    const newCover = coverImage || customUrl.trim();
    onChange(newCover, updated);
    setCustomUrl('');
  };

  const handleSelectPreset = (url: string) => {
    if (!images.includes(url)) {
      const updated = [...images, url];
      const newCover = coverImage || url;
      onChange(newCover, updated);
    }
  };

  const handleRemoveImage = (url: string) => {
    const updated = images.filter(img => img !== url);
    const newCover = coverImage === url ? (updated[0] || '') : coverImage;
    onChange(newCover, updated);
  };

  const handleSetCover = (url: string) => {
    onChange(url, images);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 transition-colors text-center glass-card">
        <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-2" />
        <h5 className="text-sm font-bold text-slate-200">Add Bike / Superbike High-Res Photos</h5>
        <p className="text-xs text-slate-400 mt-1 mb-3">Paste Image URL or pick from sample motorcycle gallery below</p>

        <div className="flex items-center space-x-2 max-w-lg mx-auto">
          <input
            type="url"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="https://example.com/bike-photo.jpg"
            className="flex-1 glass-input rounded-xl p-2.5 text-xs"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
          >
            Add Photo
          </button>
        </div>
      </div>

      {/* Stock Presets */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Sample Motorcycle Presets</span>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {sampleBikeImages.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(url)}
              className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 shrink-0 transition-transform hover:scale-105"
            >
              <img src={url} alt="preset" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Selected Images Grid */}
      {images.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Uploaded Photos ({images.length}) - Click <Star className="w-3 h-3 inline text-amber-400 fill-current" /> to set Cover Photo
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((url, idx) => {
              const isCover = coverImage === url;
              return (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video">
                  <img src={url} alt="uploaded" className="w-full h-full object-cover" />

                  {isCover && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center shadow">
                      <Star className="w-2.5 h-2.5 mr-0.5 fill-current" /> COVER
                    </span>
                  )}

                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(url)}
                        className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                        title="Set as Cover"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
