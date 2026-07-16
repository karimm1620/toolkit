import { useState } from 'react';
import { mergePdfs } from '../services/api';

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) return alert('Pilih minimal 2 file PDF');
    
    setLoading(true);
    try {
      const blob = await mergePdfs(files);
      
      // Memicu proses unduh di browser
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hasil_merge.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Gabungkan PDF</h2>
      <p className="text-gray-500 mb-6 text-sm">Pilih 2 atau lebih file PDF untuk digabungkan menjadi satu file.</p>
      
      <input 
        type="file" 
        multiple 
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
      />

      <ul className="mb-6 space-y-2">
        {files.map((file, i) => (
          <li key={i} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {i + 1}. {file.name}
          </li>
        ))}
      </ul>

      <button
        onClick={handleMerge}
        disabled={files.length < 2 || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Memproses...' : 'Gabungkan Sekarang'}
      </button>
    </div>
  );
}