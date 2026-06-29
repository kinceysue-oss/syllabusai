'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
    }
  }

  function handleFileInput(e) {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/extract', {
  method: 'POST',
  body: formData,
});
const text = await res.text();
console.log('Raw response:', text);
try {
  const data = JSON.parse(text);
  setResponse(data);
} catch(e) {
  setResponse({ error: 'Parse failed', raw: text });
}
setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SyllabusAI</h1>
        <p className="text-gray-500 mb-8">Upload a syllabus. See your semester in seconds.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          {file ? (
            <p className="text-gray-800 font-medium">📄 {file.name}</p>
          ) : (
            <>
              <p className="text-gray-500 mb-4">Drag and drop your syllabus PDF here</p>
              <label className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Or browse files
                <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
              </label>
            </>
          )}
        </div>

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Syllabus'}
          </button>
        )}

        {response && !response.error && (
  <div className="mt-6">
    <h2 className="text-xl font-bold text-gray-900 mb-1">{response.course_name}</h2>
    <p className="text-sm text-gray-500 mb-4">{response.items.length} items found</p>
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-3 font-medium text-gray-600">Name</th>
            <th className="text-left p-3 font-medium text-gray-600">Type</th>
            <th className="text-left p-3 font-medium text-gray-600">Due Date</th>
            <th className="text-left p-3 font-medium text-gray-600">Weight</th>
          </tr>
        </thead>
        <tbody>
          {response.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              <td className="p-3 text-gray-900 font-medium">{item.name}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'exam' ? 'bg-red-100 text-red-700' :
                  item.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="p-3 text-gray-600">{item.due_date || '—'}</td>
              <td className="p-3 text-gray-600">{item.weight_pct ? `${item.weight_pct}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{response && response.error && (
  <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
    Something went wrong. Try uploading again.
  </div>
)}
      </div>
    </main>
  );
}