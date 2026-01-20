import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MediaManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('public').list('', { limit: 100 });
    if (error) {
      console.error(error);
      return;
    }
    setFiles(data || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('public').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    setUploading(false);
    if (error) {
      alert('Upload error: ' + error.message);
    } else {
      fetchFiles();
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('حذف الملف؟')) return;
    const { error } = await supabase.storage.from('public').remove([name]);
    if (error) {
      alert('Delete error: ' + error.message);
    } else {
      fetchFiles();
    }
  };

  const publicUrl = (name: string) => {
    return supabase.storage.from('public').getPublicUrl(name).data.publicUrl;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">مدير الوسائط</h2>
      <div className="mb-4">
        <input type="file" onChange={handleUpload} />
        {uploading && <span>...جاري الرفع</span>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((f) => (
          <div key={f.name} className="border p-2">
            <img src={publicUrl(f.name)} alt={f.name} className="w-full h-40 object-cover mb-2" />
            <div className="text-sm break-words">{f.name}</div>
            <div className="mt-2 flex gap-2">
              <a className="text-blue-600" href={publicUrl(f.name)} target="_blank" rel="noreferrer">عرض</a>
              <button className="text-red-600" onClick={() => handleDelete(f.name)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}