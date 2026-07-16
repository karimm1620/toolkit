import { useState } from "react";
import { splitPdf } from "../services/api";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSplit = async () => {
    if (!file) return alert("Pilih file PDF terlebih dahulu");

    setLoading(true);
    try {
      const blob = await splitPdf(file);

      // Download ZIP
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split_${file.name.replace(".pdf", "")}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memisahkan PDF",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Pisahkan PDF (Split)
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Pilih satu file PDF. Sistem akan memisahkan setiap halamannya dan
        mengunduhnya untuk Anda dalam format <strong>.zip</strong>.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
      />

      {file && (
        <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
          <strong>File terpilih:</strong> {file.name} (
          {(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      <button
        onClick={handleSplit}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Memproses dan Mengemas ZIP..." : "Pisahkan PDF Sekarang"}
      </button>
    </div>
  );
}
