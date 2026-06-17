'use client'; // Required because this file uses state hooks and event listeners

import { useState, useEffect } from 'react';

export default function Home() {
  // const [universities, setUniversities] = useState([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Connect Frontend to Backend Route Handler
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetches directly from your local /app/api/universities/route.js file
        const response = await fetch(`/api/universities?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed fetching data from your API:", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce: Wait 300ms after the user stops typing before making the API call
    const delayDebounce = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]); // Whenever searchTerm updates, fetch new data

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <header className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          🎓 China University Hub
        </h1>
        <p className="text-slate-500 mb-6">
          Search universities, majors, core courses, and career paths.
        </p>
        <input 
          type="text" 
          placeholder="Search majors, careers, or universities..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        {loading && (
          <p className="text-center text-slate-400 animate-pulse">Querying cloud database...</p>
        )}

        {!loading && universities.map((uni) => (
          <div key={uni.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-slate-900">{uni.name}</h2>
              {uni.tier && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                  {uni.tier}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-4">📍 {uni.location}</p>
            
            <div className="space-y-4">
              {/* Safely handle parsing your Supabase jsonb majors array */}
              {(Array.isArray(uni.majors) ? uni.majors : []).map((major: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-blue-900 mb-2">📘 {major.title}</h4>
                  {major.courses && (
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-700">Core Classes:</strong> {Array.isArray(major.courses) ? major.courses.join(', ') : major.courses}
                    </p>
                  )}
                  {major.careers && (
                    <p className="text-sm text-emerald-700">
                      <strong className="text-slate-700">Careers:</strong> {Array.isArray(major.careers) ? major.careers.join(' • ') : major.careers}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {!loading && universities.length === 0 && (
          <p className="text-center text-slate-400">No universities found matching that criteria.</p>
        )}
      </main>
    </div>
  );
}