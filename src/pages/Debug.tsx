import React from 'react';
import MobileFrame from '@/components/MobileFrame';

const Debug = () => {
  const errRaw = typeof window !== 'undefined' ? localStorage.getItem('runtimeError') : null;
  let parsed: any = null;
  try { parsed = errRaw ? JSON.parse(errRaw) : null; } catch { parsed = { raw: errRaw }; }

  return (
    <MobileFrame>
      <div className="p-4">
        <h2 className="text-lg font-medium mb-2">Debug / Runtime Errors</h2>
        {!parsed && <div className="text-sm text-gray-500">No runtime error recorded.</div>}
        {parsed && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-600 mb-2">Message</div>
            <pre className="text-sm bg-gray-50 p-2 rounded">{String(parsed.message || parsed.raw || JSON.stringify(parsed, null, 2))}</pre>
            <div className="text-xs text-gray-600 mt-3 mb-1">Stack / Details</div>
            <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded">{String(parsed.stack || parsed.error || '')}</pre>
            <div className="text-xs text-gray-500 mt-3">Timestamp: {parsed?.time || '—'}</div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">If you see an error here, copy it and share it with me or open the browser console on desktop for more details.</div>
      </div>
    </MobileFrame>
  );
};

export default Debug;
