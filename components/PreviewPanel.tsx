import React, { useRef, useEffect } from 'react';

interface PreviewPanelProps {
  code: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, [code]);

  return (
    <div className="flex flex-col bg-gray-950 items-center justify-center p-4 h-full">
      <div className="w-full h-full max-w-full max-h-full bg-gray-900 rounded-xl shadow-2xl shadow-black/30 border border-gray-800">
        <div className="bg-gray-800/80 p-2 rounded-t-xl flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="w-full h-[calc(100%-2.5rem)]">
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-full bg-white rounded-b-xl"
            sandbox="allow-scripts allow-forms allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};