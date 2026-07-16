import { useState } from "react";
import PdfMerger from "./components/PdfMerger";
import PdfSplitter from "./components/PdfSplitter";
import ImageResizer from "./components/ImageResizer";
import DocConverter from "./components/DocConverter";
import PdfSecurity from "./components/PdfSecurity";
import PdfPages from "./components/PdfPages";

type TabType =
  | "pdf-merge"
  | "pdf-split"
  | "doc-convert"
  | "image-resize"
  | "pdf-security"
  | "pdf-manipulated";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("pdf-merge");

  // Fungsi utilitas untuk styling tombol navigasi yang aktif/tidak aktif
  const getTabClass = (tabName: TabType) => {
    return `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeTab === tabName
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ToolkitPro.
          </h1>
          <nav className="flex space-x-2 overflow-x-auto">
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
              onClick={() => setActiveTab("pdf-security")}
              className={getTabClass("pdf-security")}
            >
              PDF Security
            </button>
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
              Image Resizer
            </button>
            <button
              onClick={() => setActiveTab("pdf-manipulated")}
              className={getTabClass("pdf-manipulated")}
            >
              PDF Manipulated
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {activeTab === "pdf-merge" && <PdfMerger />}
        {activeTab === "pdf-split" && <PdfSplitter />}
        {activeTab === "pdf-security" && <PdfSecurity />}
        {activeTab === "doc-convert" && <DocConverter />}
        {activeTab === "image-resize" && <ImageResizer />}
        {activeTab === "pdf-manipulated" && <PdfPages />}
      </main>
    </div>
  );
}

export default App;
