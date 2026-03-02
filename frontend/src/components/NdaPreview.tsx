"use client";

import ReactMarkdown from "react-markdown";

interface NdaPreviewProps {
  markdown: string;
}

export default function NdaPreview({ markdown }: NdaPreviewProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-td:text-sm prose-th:text-sm">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
