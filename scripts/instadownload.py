import sys
import json
import instaloader
import re

def extract_shortcode(url):
    match = re.search(r'instagram\.com/(?:p|reel|reels)/([^/]+)', url)
    if match:
        return match.group(1)
    return None

def download_instagram_post(url):
    shortcode = extract_shortcode(url)
    if not shortcode:
        return json.dumps({"error": "Could not extract post ID from URL"})
    
    try:
        L = instaloader.Instaloader(download_videos=True, download_video_thumbnails=True)
        post = instaloader.Post.from_shortcode(L.context, shortcode)
        username = post.owner_username
        caption = post.caption if post.caption else "No caption"
        is_video = post.is_video
        result = {
            "success": True,
            "title": caption[:50] + "..." if len(caption) > 50 else caption,
            "username": username,
            "shortcode": shortcode,
            "is_video": is_video,
            "post_url": f"https://www.instagram.com/p/{shortcode}/",
            "thumbnail": post.url if not is_video else post.video_url,
        }
        if is_video:
            video_url = post.video_url
            if video_url:
                result["downloadUrl"] = video_url
            else:
                result["downloadUrl"] = "Video URL not found"
        return json.dumps(result)
    
    except Exception as e:
        return json.dumps({"error": str(e)})

def fetch_video_details(url):
    if not url:
        return json.dumps({"error": "URL is required"})
    
    try:
        url_obj = re.match(r"(https://www.instagram.com/(?:p|reel|reels)/([^/]+)/)", url)
        if not url_obj:
            return json.dumps({"error": "Invalid Instagram URL"})
        return download_instagram_post(url)
    
    except Exception as e:
        return json.dumps({"error": f"An error occurred: {str(e)}"})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL specified"}))
        sys.exit(1)
    
    url = sys.argv[1]
    print(fetch_video_details(url))
