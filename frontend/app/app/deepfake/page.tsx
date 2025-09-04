'use client'
import React from 'react'

import { useState, useRef } from 'react'

export default function DeepfakePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setVideoUrl("");
    }
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVideoUrl(inputUrl);
    setFile(null);
    setPreview("");
  }

  function handleRemove() {
    setFile(null);
    setPreview("");
    setVideoUrl("");
    setInputUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-slate-900/80 rounded-2xl shadow-xl border border-cyan-700/30 p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-cyan-300 text-center mb-2">Deepfake Video Tester</h1>
        <p className="text-slate-300 text-center mb-4">Upload a video or paste a link to check if it's a deepfake. (Demo UI)</p>
        <div className="flex flex-col gap-4">
          <label className="block text-cyan-200 font-semibold">Upload Video File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="block w-full text-slate-200 bg-slate-800 rounded-lg border border-cyan-700/30 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-700/20 hover:file:bg-cyan-700/40"
            onChange={handleFileChange}
          />
          <div className="text-center text-slate-400 text-sm">or</div>
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="Paste video URL (YouTube, etc)"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="flex-1 rounded-lg border border-cyan-700/30 bg-slate-800 p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition"
              disabled={!inputUrl}
            >
              Link
            </button>
          </form>
        </div>
        {(preview || videoUrl) && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="w-full aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              {preview ? (
                <video src={preview} controls className="w-full h-full object-contain" />
              ) : videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              ) : null}
            </div>
            <button
              onClick={handleRemove}
              className="mt-2 text-xs text-cyan-400 hover:underline"
            >Remove</button>
          </div>
        )}
        <button
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-xl font-bold text-white shadow-lg hover:from-blue-600 hover:to-cyan-400 transition disabled:opacity-50"
          disabled={!(preview || videoUrl)}
        >
          Test for Deepfake
        </button>
      </div>
    </main>
  )
}
