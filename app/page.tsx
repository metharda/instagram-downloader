"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  interface VideoDetails {
      thumbnail?: string;
      title?: string;
      username?: string;
      post_url?: string;
      downloadUrl?: string;
  }
  
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch video details")
      }

      const details = await response.json()
      setVideoDetails(details)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch video details")
      } else {
        setError("Failed to fetch video details")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (videoDetails?.downloadUrl) {
      const downloadUrl = videoDetails.downloadUrl;

      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch the video");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${videoDetails.title || "Instagram_Video"}.mp4`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the video:", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Instagram Video Downloader</CardTitle>
          <CardDescription className="text-center">Enter an Instagram video URL to download</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Paste Instagram URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !url}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Video"}
              </Button>
            </div>
          </form>

          {error && <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">{error}</div>}

          {videoDetails && (
            <div className="mt-6 space-y-4">
              <div className="relative w-full h-64">
                {videoDetails.thumbnail && (
                  <img
                  src={videoDetails.thumbnail}
                  alt={videoDetails.title || "Instagram video thumbnail"}
                  className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{videoDetails.title || "Instagram Video"}</h3>
                <p className="text-sm text-gray-500">By @{videoDetails.username || "unknown"}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {videoDetails && (
            <Button className="w-full" onClick={handleDownload}>
              Download Video
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}