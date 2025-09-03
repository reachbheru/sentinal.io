"use client"

import React, { useRef, useState } from "react"

const base_url = "http://localhost:8080"

type FactCheckResult = {
  image_url: string
  vision_analysis: any
  fact_check_summary: string
  confidence_score: number
}

const ImageAnalysisPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FactCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResult(null)
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("image", file)
      const res = await fetch(`${base_url}/api/v1/upload-and-fact-check`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError("Failed to analyze image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleRemove() {
    setFile(null)
    setPreview("")
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-slate-900/80 rounded-2xl shadow-xl border border-cyan-700/30 p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-cyan-300 text-center mb-2">Image Fact Check & Analysis</h1>
        <p className="text-slate-300 text-center mb-4">
          Upload an image to analyze for authenticity and manipulation using AI-powered vision and fact-checking.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="block w-full text-slate-200 bg-slate-800 rounded-lg border border-cyan-700/30 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-700/20 hover:file:bg-cyan-700/40"
            onChange={handleFileChange}
            disabled={loading}
          />
          {preview && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg border border-cyan-700/30 shadow-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-cyan-400 hover:underline mt-1"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          )}
          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-xl font-bold text-white shadow-lg hover:from-blue-600 hover:to-cyan-400 transition disabled:opacity-50"
            disabled={!file || loading}
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </form>
        {error && (
          <div className="text-red-400 text-center mt-2">{error}</div>
        )}
        {result && (
          <div className="mt-6 bg-slate-800/80 rounded-xl p-5 border border-cyan-700/20 shadow-inner">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2 text-center">Analysis Result</h2>
            <div className="flex flex-col items-center gap-3">
              {result.image_url && (
                <a href={result.image_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={result.image_url}
                    alt="Analyzed"
                    className="max-h-48 rounded-lg border border-cyan-700/30 shadow"
                  />
                </a>
              )}
              <div className="text-cyan-200 text-center font-medium">
                {result.fact_check_summary}
              </div>
              <div className="text-sm text-cyan-400 text-center">
                Confidence Score: <span className="font-bold">{result.confidence_score}</span>
              </div>
              <details className="mt-2 w-full">
                <summary className="cursor-pointer text-cyan-400 underline">Show Raw Vision Analysis</summary>
                <pre className="bg-slate-900/80 rounded p-3 text-xs text-gray-200 overflow-x-auto mt-2">
                  {JSON.stringify(result.vision_analysis, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default ImageAnalysisPage;

