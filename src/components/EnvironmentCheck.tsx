import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";
import { ReactNode } from "react";

interface EnvironmentCheckProps {
  children: ReactNode;
}

/**
 * Component that validates required environment variables are present
 * Shows a helpful error message if configuration is missing
 */
export const EnvironmentCheck = ({ children }: EnvironmentCheckProps) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const isConfigured = !!(supabaseUrl && supabaseKey);

  // If environment is properly configured, render the app normally
  if (isConfigured) {
    return <>{children}</>;
  }

  // Show configuration error with helpful instructions
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Configuration Required
            </h1>
            <p className="text-gray-600 text-sm">
              Environment variables not found
            </p>
          </div>
        </div>

        {/* Main Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-gray-800 mb-2">
            <strong>The Civil Rights Hub app is not configured properly.</strong>
          </p>
          <p className="text-gray-700 text-sm">
            This deployment is missing required Supabase environment variables.
            The app cannot function without these credentials.
          </p>
        </div>

        {/* Missing Variables */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Missing Configuration:</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className={supabaseUrl ? "text-green-600" : "text-red-600"}>
                {supabaseUrl ? "✓" : "✗"}
              </span>
              <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                VITE_SUPABASE_URL
              </code>
              <span className="text-gray-600">
                {supabaseUrl ? "(Set)" : "(Missing)"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={supabaseKey ? "text-green-600" : "text-red-600"}>
                {supabaseKey ? "✓" : "✗"}
              </span>
              <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                VITE_SUPABASE_PUBLISHABLE_KEY
              </code>
              <span className="text-gray-600">
                {supabaseKey ? "(Set)" : "(Missing)"}
              </span>
            </li>
          </ul>
        </div>

        {/* Instructions for Vercel */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            For Vercel Administrators:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
            <li>Go to your Vercel project dashboard</li>
            <li>Navigate to <strong>Settings → Environment Variables</strong></li>
            <li>Add both required variables (see VERCEL_SETUP.md for values)</li>
            <li>Redeploy the application</li>
          </ol>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </button>

            <a
              href="https://vercel.com/docs/projects/environment-variables"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Vercel Docs
            </a>
          </div>
        </div>

        {/* Technical Details */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            Technical Details
          </summary>
          <div className="mt-3 p-4 bg-gray-100 rounded text-xs font-mono">
            <div className="text-gray-800">
              <div>Build Environment Check:</div>
              <div className="mt-2 space-y-1 text-gray-600">
                <div>VITE_SUPABASE_URL: {supabaseUrl || "undefined"}</div>
                <div>VITE_SUPABASE_PUBLISHABLE_KEY: {supabaseKey ? "[SET - " + supabaseKey.substring(0, 20) + "...]" : "undefined"}</div>
                <div className="mt-2">Location: {window.location.href}</div>
                <div>User Agent: {navigator.userAgent}</div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default EnvironmentCheck;
