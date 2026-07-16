import { useState } from "react";
import PdfMerger from "./components/PdfMerger";
import PdfSplitter from "./components/PdfSplitter";
import PdfSecurity from "./components/PdfSecurity";
import PdfPages from "./components/PdfPages";
import PdfCompressor from "./components/PdfCompressor";
import DocConverter from "./components/DocConverter";
import ImageResizer from "./components/ImageResizer";

type TabType =
  | "pdf-merge"
  | "pdf-split"
  | "pdf-pages"
  | "pdf-security"
  | "pdf-compress"
  | "doc-convert"
  | "image-resize";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("pdf-merge");

  // Fungsi utilitas untuk styling tombol navigasi yang aktif/tidak aktif
  const getTabClass = (tabName: TabType) => {
    return `whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeTab === tabName
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header & Navigasi */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              ToolkitPro.
            </h1>

            {/* Scrollable Navigasi untuk layar kecil */}
            <nav className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <button
                onClick={() => setActiveTab("pdf-merge")}
                className={getTabClass("pdf-merge")}
              >
                PDF Merger
              </button>
              <button
                onClick={() => setActiveTab("pdf-split")}
                className={getTabClass("pdf-split")}
              >
                PDF Splitter
              </button>
              <button
                onClick={() => setActiveTab("pdf-pages")}
                className={getTabClass("pdf-pages")}
              >
                PDF Pages
              </button>
              <button
                onClick={() => setActiveTab("pdf-security")}
                className={getTabClass("pdf-security")}
              >
                PDF Security
              </button>
              <button
                onClick={() => setActiveTab("pdf-compress")}
                className={getTabClass("pdf-compress")}
              >
                PDF Compressor
              </button>
              <div className="w-px bg-gray-300 mx-2 hidden md:block"></div>{" "}
              {/* Divider visual */}
              <button
                onClick={() => setActiveTab("doc-convert")}
                className={getTabClass("doc-convert")}
              >
                Doc Converter
              </button>
              <button
                onClick={() => setActiveTab("image-resize")}
                className={getTabClass("image-resize")}
              >
                Image Processor
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {activeTab === "pdf-merge" && <PdfMerger />}
        {activeTab === "pdf-split" && <PdfSplitter />}
        {activeTab === "pdf-pages" && <PdfPages />}
        {activeTab === "pdf-security" && <PdfSecurity />}
        {activeTab === "pdf-compress" && <PdfCompressor />}
        {activeTab === "doc-convert" && <DocConverter />}
        {activeTab === "image-resize" && <ImageResizer />}
      </main>
    </div>
  );
}

export default App;
