"use client";

import { useCallback, useRef, useState } from "react";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import { NdaFormData, defaultFormData } from "@/lib/types";
import { generateFullNda } from "@/lib/generateNda";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const previewRef = useRef<HTMLDivElement>(null);

  const markdown = generateFullNda(formData);

  const handleDownloadPdf = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const previewHtml = previewRef.current?.innerHTML ?? "";

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Mutual NDA</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111; font-size: 14px; line-height: 1.6; }
    h1 { font-size: 22px; text-align: center; margin-bottom: 8px; }
    h2 { font-size: 18px; margin-top: 24px; }
    h3 { font-size: 15px; margin-top: 16px; }
    p { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: center; font-size: 13px; }
    th { background: #f5f5f5; }
    td:first-child, th:first-child { text-align: left; font-weight: bold; }
    hr { border: none; border-top: 1px solid #ccc; margin: 24px 0; }
    ul { padding-left: 20px; }
    li { margin: 4px 0; }
    em { font-size: 12px; color: #666; }
  </style>
</head>
<body>${previewHtml}</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prelegal</h1>
            <p className="text-sm text-gray-500">Mutual NDA Creator</p>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Form Panel */}
          <div className="no-print rounded-lg border bg-white p-6 shadow-sm lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Fill in the details
            </h2>
            <NdaForm data={formData} onChange={setFormData} />
          </div>

          {/* Preview Panel */}
          <div
            ref={previewRef}
            className="rounded-lg border bg-white p-8 shadow-sm lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
          >
            <NdaPreview markdown={markdown} />
          </div>
        </div>
      </main>
    </div>
  );
}
