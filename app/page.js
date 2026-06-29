'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

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
      </div>
    </main>
  );
}