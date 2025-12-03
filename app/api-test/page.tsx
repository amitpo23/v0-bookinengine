"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TestResult {
  success?: boolean
  status?: number
  responseTime?: number
  responseLength?: number
  isArray?: boolean
  arrayLength?: number
  preview?: string
  parsedData?: any
  error?: string
  logs?: string[]
}

export default function ApiTestPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-simple")
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message, logs: [`Client error: ${error.message}`] })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8" dir="ltr">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Medici API Test</h1>
        <p className="text-gray-400 mb-6">Simple API connection test</p>

        <Button onClick={runTest} disabled={isLoading} className="mb-8">
          {isLoading ? "Testing..." : "Run Test"}
        </Button>

        {isLoading && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="py-8 text-center">
              <div className="animate-pulse text-yellow-400">Running API test...</div>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full ${result.success ? "bg-green-500" : "bg-red-500"}`} />
                  {result.success ? "API Connected Successfully" : "API Connection Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.status && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400">Status</div>
                      <div className={result.status === 200 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                        {result.status}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400">Response Time</div>
                      <div className="text-blue-400 font-bold">{result.responseTime}ms</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400">Response Size</div>
                      <div className="text-purple-400 font-bold">{result.responseLength} chars</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400">Results</div>
                      <div className="text-cyan-400 font-bold">
                        {result.arrayLength !== null ? `${result.arrayLength} items` : "N/A"}
                      </div>
                    </div>
                  </div>
                )}

                {result.error && (
                  <div className="bg-red-900/30 border border-red-800 rounded p-4">
                    <div className="text-red-400 font-bold">Error:</div>
                    <div className="text-red-300">{result.error}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logs Card */}
            {result.logs && result.logs.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded p-4 font-mono text-xs space-y-1 max-h-60 overflow-auto">
                    {result.logs.map((log, i) => (
                      <div key={i} className={log.includes("ERROR") ? "text-red-400" : "text-green-400"}>
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Response Preview */}
            {result.preview && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Response Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black rounded p-4 text-xs text-gray-300 overflow-auto max-h-60 whitespace-pre-wrap">
                    {result.preview}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Parsed Data */}
            {result.parsedData && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>
                    Parsed Data ({Array.isArray(result.parsedData) ? `${result.parsedData.length} hotels` : "object"})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black rounded p-4 text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                    {JSON.stringify(result.parsedData, null, 2).slice(0, 5000)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
