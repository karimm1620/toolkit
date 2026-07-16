import { useState } from "react";
import { processImage, type ProcessImageOptions } from "../services/api";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [opts, setOpts] = useState<ProcessImageOptions>({
    width: 0,
    height: 0,
    format: "webp",
    cropWidth: 0,
    cropHeight: 0,
    rotate: 0,
    flipH: false,
    flipV: false,
    quality: 85, // Default quality
  });

  const handleProcess = async () => {
    if (!file) return alert("Pilih gambar terlebih dahulu");
    setLoading(true);

    try {
      const blob = await processImage(file, opts);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `processed_${file.name.split(".")[0]}.${opts.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Gagal memproses gambar ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Pemrosesan Gambar
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Bagian Resize */}
        <div className="col-span-2 sm:col-span-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Resize (Opsional)
          </h3>
          <input
            type="number"
            placeholder="Lebar (px)"
            value={opts.width || ""}
            onChange={(e) =>
              setOpts({ ...opts, width: Number(e.target.value) })
            }
            className="w-full mb-3 p-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Tinggi (px)"
            value={opts.height || ""}
            onChange={(e) =>
              setOpts({ ...opts, height: Number(e.target.value) })
            }
            className="w-full p-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Bagian Crop */}
        <div className="col-span-2 sm:col-span-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Crop Tengah (Opsional)
          </h3>
          <input
            type="number"
            placeholder="Lebar Crop (px)"
            value={opts.cropWidth || ""}
            onChange={(e) =>
              setOpts({ ...opts, cropWidth: Number(e.target.value) })
            }
            className="w-full mb-3 p-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Tinggi Crop (px)"
            value={opts.cropHeight || ""}
            onChange={(e) =>
              setOpts({ ...opts, cropHeight: Number(e.target.value) })
            }
            className="w-full p-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Rotasi, Format & Kualitas */}
        <div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Rotasi
              </label>
              <select
                value={opts.rotate}
                onChange={(e) =>
                  setOpts({ ...opts, rotate: Number(e.target.value) })
                }
                className="w-full p-2 border border-gray-300 text-sm rounded focus:border-blue-500 outline-none bg-white"
              >
                <option value={0}>Tidak Diputar</option>
                <option value={90}>90° Searah Jarum Jam</option>
                <option value={180}>180°</option>
                <option value={270}>270° Berlawanan Arah</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Format Output
              </label>
              <select
                value={opts.format}
                onChange={(e) => setOpts({ ...opts, format: e.target.value })}
                className="w-full p-2 border border-gray-300 text-sm rounded focus:border-blue-500 outline-none bg-white"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
          </div>

          {/* Slider Kualitas (Sembunyikan untuk PNG karena lossless) */}
          {opts.format !== "png" && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kualitas Kompresi
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {opts.quality}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={opts.quality}
                onChange={(e) =>
                  setOpts({ ...opts, quality: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Ukuran Kecil (Buram)</span>
                <span>Ukuran Besar (Tajam)</span>
              </div>
            </div>
          )}
        </div>

        {/* Flip */}
        <div className="col-span-2 flex gap-6 p-2">
          <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={opts.flipH}
              onChange={(e) => setOpts({ ...opts, flipH: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            Flip Horizontal
          </label>
          <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={opts.flipV}
              onChange={(e) => setOpts({ ...opts, flipV: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            Flip Vertical
          </label>
        </div>
      </div>

      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? "Memproses..." : "Terapkan & Unduh"}
      </button>
    </div>
  );
}
