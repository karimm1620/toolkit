import { useState } from "react";
import { manipulatePdfPages } from "../services/api";

export default function PdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<"extract" | "remove" | "rotate">(
    "extract",
  );
  const [pages, setPages] = useState("");
  const [rotation, setRotation] = useState(90);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!file) return alert("Pilih file PDF");
    if (!pages && action !== "rotate") {
      return alert("Tentukan halaman yang akan diproses");
    }

    setLoading(true);
    try {
      const blob = await manipulatePdfPages(file, action, pages, rotation);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${action}_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses halaman",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Manipulasi Halaman PDF
      </h2>

      <div className="flex gap-2 mb-6 text-sm">
        {(["extract", "remove", "rotate"] as const).map((act) => (
          <button
            key={act}
            onClick={() => setAction(act)}
            className={`flex-1 py-2 rounded-lg font-medium border transition-colors ${
              action === act
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {act === "extract"
              ? "Ekstrak"
              : act === "remove"
                ? "Hapus"
                : "Putar"}
          </button>
        ))}
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pilihan Halaman (Contoh: 1, 3, 5-10)
        </label>
        <input
          type="text"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder={
            action === "rotate"
              ? "Kosongkan untuk memutar semua halaman"
              : "1, 3, 5-10"
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          {action === "extract" &&
            "Hanya halaman ini yang akan disimpan dalam PDF baru."}
          {action === "remove" && "Halaman ini akan dihapus dari PDF."}
          {action === "rotate" &&
            "Halaman ini akan diputar sesuai derajat di bawah."}
        </p>
      </div>

      {action === "rotate" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Derajat Putaran
          </label>
          <select
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 text-sm rounded-lg focus:border-blue-500 outline-none bg-white"
          >
            <option value={90}>90° Searah Jarum Jam</option>
            <option value={180}>180° Terbalik</option>
            <option value={270}>270° Berlawanan Arah</option>
          </select>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? "Memproses..." : "Terapkan & Unduh"}
      </button>
    </div>
  );
}
