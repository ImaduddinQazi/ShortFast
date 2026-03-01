import { useState } from 'react';
import { shortenURL } from '../services/api';
import { copyToClipboard, isValidURL } from '../utils/helpers';

function ShortenPage() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidURL(longUrl)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    const response = await shortenURL(longUrl);
    setLoading(false);

    if (response.success) {
      setResult(response.data);
      setLongUrl('');
    } else {
      setError(response.error);
    }
  };

  const handleCopy = async () => {
    if (result?.short_url) {
      const success = await copyToClipboard(result.short_url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownloadQR = () => {
    if (result?.qr_code) {
      const link = document.createElement('a');
      link.href = result.qr_code;
      link.download = `qr-${result.short_code}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Shorten Your Link</h1>
          <p className="text-gray-300">
            Paste a long URL and get a short, shareable link instantly
          </p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN - Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Short Link</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your long URL
                </label>
                <input
                  type="text"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </form>

            {/* Tips Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Quick tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>QR codes are generated automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Links are cached with Redis for instant redirects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Track clicks in the Analytics tab</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - Result */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Short URL Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Your Short Link</h3>
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      ✓ Created
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={result.short_url}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium whitespace-nowrap"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">Short code:</span>{' '}
                      <span className="font-mono">{result.short_code}</span>
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(result.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* QR Code Card */}
                {result.qr_code && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
                    <h3 className="font-bold text-gray-900 mb-4 text-center">
                      📱 QR Code
                    </h3>
                    <div className="flex flex-col items-center">
                      <img 
                        src={result.qr_code} 
                        alt="QR Code" 
                        className="w-48 h-48 border-4 border-white rounded-lg shadow-md mb-4"
                      />
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        Scan to access your shortened URL
                      </p>
                      <button
                        onClick={handleDownloadQR}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Download QR Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Shorten
                </h3>
                <p className="text-gray-600">
                  Enter a URL on the left to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortenPage;