import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const videoUrl = url.searchParams.get("url")

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: "URL is required" }), { status: 400 })
  }

  try {
    const { stdout, stderr } = await execPromise(`python3 scripts/instadownload.py "${videoUrl}"`)

    if (stderr) {
      return new Response(JSON.stringify({ error: `Error fetching video details: ${stderr}` }), { status: 500 })
    }

    const videoDetails = JSON.parse(stdout)
    if (videoDetails.error) {
      return new Response(JSON.stringify({ error: videoDetails.error }), { status: 400 })
    }

    return new Response(JSON.stringify(videoDetails), { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch video details" }), { status: 500 })
  }
}
