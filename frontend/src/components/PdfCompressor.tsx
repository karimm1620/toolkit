import { useState } from 'react';
import { compressPdf } from '../services/api';

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!file) return alert('Pilih file PDF terlebih dahulu');
    
    setLoading(true);
    try {
      const blob = await compressPdf(file);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengompresi PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Kompresi PDF</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Kurangi ukuran file PDF Anda dengan mengoptimalkan struktur internalnya tanpa merusak kualitas visual dokumen.
      </p>
      
      <input 
        type="file" 
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
      />

      {file && (
        <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
          <strong>File terpilih:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? 'Mengompresi File...' : 'Mulai Kompresi'}
      </button>
    </div>
  );
}