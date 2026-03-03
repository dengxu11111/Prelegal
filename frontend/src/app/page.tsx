"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import AuthGuard from "@/components/AuthGuard";
import { NdaFormData, defaultFormData } from "@/lib/types";
import { generateFullNda } from "@/lib/generateNda";
import { tokenStore } from "@/lib/apiClient";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const markdown = generateFullNda(formData);

  const handleSignOut = () => {
    tokenStore.clear();
    router.replace("/login/");
  };

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
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white px-6 py-4 no-print">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: "#032147" }}
              >
                Prelegal
              </h1>
              <p className="text-sm" style={{ color: "#888888" }}>
                Mutual NDA Creator
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
              <button
                onClick={handleDownloadPdf}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#209dd7" }}
              >
                Download PDF
              </button>
            </div>
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
    </AuthGuard>
  );
}
