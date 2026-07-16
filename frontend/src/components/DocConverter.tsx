import { useState } from "react";
import { convertDocument } from "../services/api";

export default function DocConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"word-to-pdf" | "pdf-to-word">(
    "word-to-pdf",
  );
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!file) return alert("Pilih file terlebih dahulu");

    setLoading(true);
    try {
      const blob = await convertDocument(file, type);
      const ext = type === "word-to-pdf" ? ".pdf" : ".docx";

      const newFileName = file.name.replace(/\.[^/.]+$/, "") + ext;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat konversi",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Konversi Dokumen
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setType("word-to-pdf");
            setFile(null);
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${type === "word-to-pdf" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Word ke PDF
        </button>
        <button
          onClick={() => {
            setType("pdf-to-word");
            setFile(null);
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${type === "pdf-to-word" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          PDF ke Word
        </button>
      </div>

      <input
        type="file"
        accept={type === "word-to-pdf" ? ".docx,.doc" : ".pdf"}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
      />

      {file && (
        <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
          <strong>File terpilih:</strong> {file.name}
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? "Mengkonversi..." : "Mulai Konversi"}
      </button>
    </div>
  );
}
