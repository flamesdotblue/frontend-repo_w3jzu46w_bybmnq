import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';

export default function DocumentUploader() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const onSelect = (e) => {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;
    const mapped = list.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    }));
    setFiles((prev) => [...mapped, ...prev].slice(0, 20));
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files || []);
    const mapped = list.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    }));
    setFiles((prev) => [...mapped, ...prev].slice(0, 20));
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const prettySize = (n) => {
    if (n > 1e6) return `${(n / 1e6).toFixed(2)} MB`;
    if (n > 1e3) return `${(n / 1e3).toFixed(1)} KB`;
    return `${n} B`;
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <UploadCloud className="w-4 h-4 text-emerald-600" />
        <h3 className="font-semibold text-slate-900">Process Documents</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">Upload SOPs, quality protocols, kiln procedures, or audit trails. Files are held client-side for this demo.</p>

      <div
        onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={onDrop}
        className={`grid place-items-center text-center border-2 border-dashed rounded-lg p-8 transition-colors ${dragOver ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-slate-50'}`}
      >
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="w-8 h-8 text-emerald-600" />
          <div className="text-slate-900 font-medium">Drag & drop files here</div>
          <div className="text-xs text-slate-500">or</div>
          <button onClick={()=>inputRef.current?.click()} className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800">Browse files</button>
          <input ref={inputRef} type="file" multiple onChange={onSelect} className="hidden" />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-slate-500 mb-2">Recent uploads</div>
          <ul className="divide-y divide-slate-200">
            {files.map((f)=> (
              <li key={f.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-emerald-100 text-emerald-700"><FileText className="w-4 h-4" /></div>
                  <div className="min-w-0">
                    <div className="text-sm text-slate-900 truncate">{f.name}</div>
                    <div className="text-xs text-slate-500 truncate">{f.type || 'file'} • {prettySize(f.size)} • {new Date(f.uploadedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Added</span>
                  <button onClick={()=>removeFile(f.id)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900"><X className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
