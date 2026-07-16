import { useState } from 'react';
import { addPdfWatermark } from '../services/api';

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<'watermark' | 'pagenumbers'>('watermark');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!file) return alert('Pilih file PDF terlebih dahulu');
    if (action === 'watermark' && !text) return alert('Teks watermark tidak boleh kosong');
    
    setLoading(true);
    try {
      const blob = await addPdfWatermark(file, action, text);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Prefix penamaan file hasil unduhan
      const prefix = action === 'watermark' ? 'watermarked_' : 'numbered_';
      a.download = `${prefix}${file.name}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses dokumen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Stempel & Nomor Halaman</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setAction('watermark')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
            action === 'watermark' 
              ? 'border-blue-600 bg-blue-50 text-blue-700' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Teks Watermark
        </button>
        <button 
          onClick={() => { setAction('pagenumbers'); setText(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
            action === 'pagenumbers' 
              ? 'border-blue-600 bg-blue-50 text-blue-700' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Nomor Halaman
        </button>
      </div>

      <input 
        type="file" 
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
      />

      {file && (
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
          <strong>File terpilih:</strong> {file.name}
        </div>
      )}

      {action === 'watermark' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teks Watermark</label>
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: DOKUMEN RAHASIA"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Teks akan dicetak melintang (diagonal) dengan opasitas 50% di seluruh halaman.
          </p>
        </div>
      )}

      {action === 'pagenumbers' && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
            Nomor halaman akan ditambahkan secara otomatis di bagian bawah tengah (Bottom-Center) pada setiap halaman dengan format <strong>"Page 1 of X"</strong>.
          </p>
        </div>
      )}

      <button
        onClick={handleProcess} 
        disabled={!file || loading}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? 'Memproses...' : 'Terapkan & Unduh'}
      </button>
    </div>
  );
}