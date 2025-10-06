import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function CookieDebugger() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCookies = async () => {
    setLoading(true);
    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';
    
    try {
      // Test 1: Check what cookies we have
      const allCookies = document.cookie;
      
      // Test 2: Call debug endpoint
      const response = await fetch(`${baseURL}/auth/debug-cookies/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      // Test 3: Check if cookies are accessible
      const hasAccessCookie = document.cookie.includes('access=');
      const hasRefreshCookie = document.cookie.includes('refresh=');
      
      setResults({
        frontendCookies: allCookies || 'No cookies found',
        backendReceived: data,
        hasAccessCookie,
        hasRefreshCookie,
        responseHeaders: Object.fromEntries([...response.headers.entries()]),
      });
    } catch (error) {
      setResults({
        error: error.message,
        stack: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ condition }) => {
    if (condition) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-800">Cookie Debug Tool</h1>
          </div>

          <button
            onClick={testCookies}
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 mb-6"
          >
            {loading ? 'Testing...' : 'Test Cookie Setup'}
          </button>

          {results && (
            <div className="space-y-6">
              {/* Frontend Cookies */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <StatusIcon condition={results.hasAccessCookie && results.hasRefreshCookie} />
                  Frontend Cookies (document.cookie)
                </h3>
                <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto text-slate-700">
                  {results.frontendCookies}
                </pre>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={results.hasAccessCookie} />
                    <span>Access cookie found: {results.hasAccessCookie ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={results.hasRefreshCookie} />
                    <span>Refresh cookie found: {results.hasRefreshCookie ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Backend Response */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <StatusIcon condition={results.backendReceived?.has_access} />
                  Backend Received
                </h3>
                <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto text-slate-700">
                  {JSON.stringify(results.backendReceived, null, 2)}
                </pre>
              </div>

              {/* Response Headers */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Response Headers</h3>
                <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto text-slate-700">
                  {JSON.stringify(results.responseHeaders, null, 2)}
                </pre>
              </div>

              {/* Error */}
              {results.error && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-3">Error</h3>
                  <pre className="text-sm text-red-700">{results.error}</pre>
                </div>
              )}

              {/* Diagnosis */}
              <div className="border-2 border-teal-200 rounded-lg p-4 bg-teal-50">
                <h3 className="font-semibold text-teal-900 mb-3">Diagnosis</h3>
                <div className="space-y-2 text-sm">
                  {!results.hasAccessCookie && (
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">
                        <strong>Cookies not set in browser.</strong> Check if your login response includes Set-Cookie headers.
                      </span>
                    </div>
                  )}
                  {results.hasAccessCookie && !results.backendReceived?.has_access && (
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">
                        <strong>Cookies exist but not sent to backend.</strong> Check CORS settings and withCredentials configuration.
                      </span>
                    </div>
                  )}
                  {results.hasAccessCookie && results.backendReceived?.has_access && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">
                        <strong>Cookies working correctly!</strong> Backend receives cookies properly.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Make sure you're logged in first</li>
              <li>Click "Test Cookie Setup" button</li>
              <li>Check the results to diagnose the issue</li>
              <li>If cookies aren't in frontend, check login response Set-Cookie headers</li>
              <li>If cookies aren't reaching backend, check CORS and axios config</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}