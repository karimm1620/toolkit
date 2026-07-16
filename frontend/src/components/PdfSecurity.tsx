import { useState } from "react";
import { securePdf } from "../services/api";

export default function PdfSecurity() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!file || !password) return alert("Pilih file dan masukkan password");

    setLoading(true);
    try {
      const blob = await securePdf(file, password, action);
      const prefix = action === "encrypt" ? "locked_" : "unlocked_";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = prefix + file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Keamanan PDF</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setAction("encrypt")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${action === "encrypt" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Kunci PDF (Encrypt)
        </button>
        <button
          onClick={() => setAction("decrypt")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${action === "decrypt" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Buka PDF (Decrypt)
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {action === "encrypt"
            ? "Buat Password Baru"
            : "Masukkan Password Lama"}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleProcess}
        disabled={!file || !password || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading
          ? "Memproses..."
          : action === "encrypt"
            ? "Kunci Dokumen"
            : "Hapus Kunci Dokumen"}
      </button>
    </div>
  );
}
