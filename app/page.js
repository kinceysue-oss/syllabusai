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
    <p className="text-sm text-gray-500 mb-6">{response.items.length} items found</p>

    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>

      {response.items
        .filter(item => item.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .map((item, i) => (
          <div key={i} className="relative flex gap-4 mb-6 pl-10">
            <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              item.type === 'exam' ? 'bg-red-100 text-red-700' :
              item.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {item.type === 'exam' ? 'E' : item.type === 'quiz' ? 'Q' : 'A'}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.due_date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'exam' ? 'bg-red-100 text-red-700' :
                    item.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type}
                  </span>
                  {item.weight_pct && (
                    <span className="text-xs text-gray-400">{item.weight_pct}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

      {response.items.filter(item => !item.due_date).length > 0 && (
        <div className="pl-10 mt-2">
          <p className="text-sm text-gray-400 mb-3">No specific due date</p>
          {response.items
            .filter(item => !item.due_date)
            .map((item, i) => (
              <div key={i} className="relative flex gap-4 mb-4">
                <div className={`absolute left-[-40px] w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.type === 'exam' ? 'bg-red-100 text-red-700' :
                  item.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.type === 'exam' ? 'E' : item.type === 'quiz' ? 'Q' : 'A'}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'exam' ? 'bg-red-100 text-red-700' :
                        item.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.type}
                      </span>
                      {item.weight_pct && (
                        <span className="text-xs text-gray-400">{item.weight_pct}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
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