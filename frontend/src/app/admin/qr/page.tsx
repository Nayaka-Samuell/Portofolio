"use client";

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Generate URL dynamically based on current origin
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(`${window.location.origin}/tap?src=qr`);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glassmorphism p-10 rounded-2xl flex flex-col items-center">
        <h1 className="text-2xl font-bold font-space text-white mb-2">QR Code Testing</h1>
        <p className="text-gray-400 text-sm mb-8">Scan to test /tap?src=qr route</p>
        
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8">
          {url && <QRCode value={url} size={200} />}
        </div>
        
        <div className="w-full text-center">
          <p className="text-xs text-blue-light font-mono truncate px-4 py-2 bg-blue-dark/30 rounded">
            {url}
          </p>
        </div>
      </div>
    </div>
  );
}
