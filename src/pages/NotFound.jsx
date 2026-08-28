import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-400 mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
