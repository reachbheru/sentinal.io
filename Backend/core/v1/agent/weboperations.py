from dotenv import load_dotenv
import os
import requests
from urllib.parse import quote_plus
from .snapshot import poll_snapshot_status, download_snapshot
from apify_client import ApifyClient

# Load environment variables
load_dotenv()

# Initialize Apify client
APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
client = ApifyClient(APIFY_API_TOKEN)

def clean_input_for_search(input_text):
    """
    Clean input text by removing spaces and special characters for hashtag searches.
    """
    if not input_text:
        return ""
    
    # Remove all spaces and special characters that might cause issues
    cleaned = input_text.replace(" ", "").replace("#", "").replace("!", "").replace("?", "").replace(".", "").replace(",", "").replace(":", "").replace(";", "").replace("-", "").replace("+", "").replace("=", "").replace("*", "").replace("&", "").replace("%", "").replace("$", "").replace("@", "").replace("/", "").replace("~", "").replace("^", "").replace("|", "").replace("<", "").replace(">", "").replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace("{", "").replace("}", "").replace("\"", "").replace("'", "").replace("`", "")
    
    return cleaned

def clean_keyword_for_search(input_text):
    """
    Clean input text for keyword searches (keeps spaces but removes special characters).
    """
    if not input_text:
        return ""
    
    # Remove special characters but keep spaces for search terms
    cleaned = input_text.replace("#", "").replace("!", "").replace("?", "").replace(".", "").replace(",", "").replace(":", "").replace(";", "").replace("+", "").replace("=", "").replace("*", "").replace("&", "").replace("%", "").replace("$", "").replace("@", "").replace("/", "").replace("~", "").replace("^", "").replace("|", "").replace("<", "").replace(">", "").replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace("{", "").replace("}", "").replace("\"", "").replace("'", "").replace("`", "")
    
    return cleaned.strip()

# Debug environment setup for BrightData (still used for SERP)
print("=" * 80)
print("DEBUG: Environment Check")
print("=" * 80)
api_key = os.getenv("BRIGHTDATA_API_KEY")
print(f"BRIGHTDATA_API_KEY found: {'Yes' if api_key else 'No'}")
apify_key = os.getenv("APIFY_API_TOKEN")
print(f"APIFY_API_TOKEN found: {'Yes' if apify_key else 'No'}")
if api_key:
    print(f"BrightData API Key length: {len(api_key)}")
    print(f"BrightData API Key (first 10 chars): {api_key[:10]}...")
    print(f"BrightData API Key (last 5 chars): ...{api_key[-5:]}")
else:
    print("WARNING: BRIGHTDATA_API_KEY not found in environment! (Still needed for SERP)")
if apify_key:
    print(f"Apify API Key length: {len(apify_key)}")
    print(f"Apify API Key (first 10 chars): {apify_key[:10]}...")
    print(f"Apify API Key (last 5 chars): ...{apify_key[-5:]}")
else:
    print("ERROR: APIFY_API_TOKEN not found in environment!")
print("=" * 80)

def _make_api_request(url, **kwargs):
    api_key = os.getenv("BRIGHTDATA_API_KEY")
    
    print("=" * 80)
    print("DEBUG: Making API Request")
    print("=" * 80)
    print(f"URL: {url}")
    print(f"API Key (first 10 chars): {api_key[:10] if api_key else 'None'}...")
    print(f"Request kwargs: {kwargs}")

    headers = {
        "Authorization" : f"Bearer {api_key}",
        "Content-Type" : "application/json",
    }
    
    print(f"Headers: {headers}")

    try:
        print("Sending POST request...")
        response = requests.post(url, headers=headers, **kwargs)
        
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response URL: {response.url}")
        
        if response.status_code != 200:
            print(f"ERROR Response Content: {response.text}")
            print(f"ERROR Response Reason: {response.reason}")
        
        response.raise_for_status()
        response_json = response.json()
        print(f"SUCCESS Response JSON (first 500 chars): {str(response_json)[:500]}...")
        return response_json
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Status Code: {e.response.status_code if e.response else 'Unknown'}")
        print(f"Response Text: {e.response.text if e.response else 'No response text'}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return None
    except Exception as e:
        print(f"Unknown error: {e}")
        return None
    
def serp_search(query, engine="google"):
    print("=" * 80)
    print(f"DEBUG: SERP Search Starting")
    print("=" * 80)
    print(f"Query: {query}")
    print(f"Engine: {engine}")
    
    if engine == "google":
        base_url = "https://www.google.com/search"
    else:
        raise ValueError(f"Unknown engine {engine}")

    url = "https://api.brightdata.com/request"

    payload = {
        "zone": "ai_agent_1",
        "url": f"{base_url}?q={quote_plus(query)}&brd_json=1",
        "format": "raw"
    }

    print(f"SERP API URL: {url}")
    print(f"SERP Payload: {payload}")
    print(f"Target URL being scraped: {payload['url']}")

    full_response = _make_api_request(url, json=payload)

    if not full_response:
        print("ERROR: No response from SERP search")
        return None
    

    extracted_data = {
        "knowledge": full_response.get("knowledge", {}),
        "organic": full_response.get("organic", []),   
    }

    return extracted_data


def normalize_instagram_post(post: dict) -> dict:
    """Convert Apify Instagram post into structured JSON for LLM."""
    try:
        # Safe image processing
        images = post.get("images", [])
        media_urls = []
        if isinstance(images, list):
            media_urls = [m.get("url") for m in images if isinstance(m, dict) and m.get("url")]
        
        return {
            "platform": "Instagram",
            "text": post.get("caption", ""),
            "url": post.get("url", ""),
            "timestamp": post.get("timestamp", ""),
            "user": post.get("ownerUsername", ""),
            "verified": post.get("ownerIsVerified", False),
            "followers": post.get("ownerProfilePage", ""),  # follower count not always available
            "likes": post.get("likesCount", 0),
            "comments": post.get("commentsCount", 0),
            "entities": post.get("hashtags", []),
            "media_urls": media_urls,
            "media_verification_status": "unknown",  # placeholder → you can plug reverse-image check
            "pre_flags": []
        }
    except Exception as e:
        print(f"Error normalizing Instagram post: {e}")
        print(f"Post data: {post}")
        return {
            "platform": "Instagram",
            "text": "",
            "url": "",
            "timestamp": "",
            "user": "",
            "verified": False,
            "followers": "",
            "likes": 0,
            "comments": 0,
            "entities": [],
            "media_urls": [],
            "media_verification_status": "unknown",
            "pre_flags": []
        }


def normalize_facebook_post(post: dict) -> dict:
    """Convert Apify Facebook post into structured JSON for LLM."""
    try:
        # Safe media processing
        media_urls = []
        images = post.get("images", [])
        if isinstance(images, list):
            media_urls = [img.get("url", "") for img in images if isinstance(img, dict) and img.get("url")]
        
        # Safe video processing
        videos = post.get("videos", [])
        if isinstance(videos, list):
            media_urls.extend([vid.get("url", "") for vid in videos if isinstance(vid, dict) and vid.get("url")])
        
        return {
            "platform": "Facebook",
            "text": post.get("text", "") or post.get("content", ""),
            "url": post.get("url", ""),
            "timestamp": post.get("time", "") or post.get("timestamp", ""),
            "user": post.get("author", "") or post.get("user", ""),
            "verified": post.get("verified", False),
            "likes": post.get("likes", 0) or post.get("reactionsCount", 0),
            "comments": post.get("comments", 0) or post.get("commentsCount", 0),
            "shares": post.get("shares", 0) or post.get("sharesCount", 0),
            "entities": [],  # Facebook hashtags are usually embedded in text
            "media_urls": media_urls,
            "media_verification_status": "unknown",
            "pre_flags": []
        }
    except Exception as e:
        print(f"Error normalizing Facebook post: {e}")
        print(f"Post data: {post}")
        return {
            "platform": "Facebook",
            "text": "",
            "url": "",
            "timestamp": "",
            "user": "",
            "verified": False,
            "likes": 0,
            "comments": 0,
            "shares": 0,
            "entities": [],
            "media_urls": [],
            "media_verification_status": "unknown",
            "pre_flags": []
        }


def instagram_post_search(hashtag, num_of_posts=50):
    """
    Search Instagram posts by hashtag using Apify.
    """
    print("=" * 80)
    print(f"DEBUG: Instagram Search Starting (Apify)")
    print("=" * 80)
    print(f"Original Hashtag: {hashtag}")
    
    # Clean hashtag using helper function
    clean_hashtag = clean_input_for_search(hashtag)
    
    print(f"Cleaned Hashtag: {clean_hashtag}")
    print(f"Number of posts requested: {num_of_posts}")
    
    try:
        run_input = {
            "hashtags": [clean_hashtag],
            "resultsLimit": num_of_posts,
            "searchType": "hashtags",
        }
        
        print(f"Apify Instagram run input: {run_input}")
        
        run = client.actor("apify/instagram-hashtag-scraper").call(run_input=run_input)
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items()) #type: ignore

        print(f"Retrieved {len(items)} items from Instagram")
        
        # Debug: Print first item to see structure
        if items:
            print(f"DEBUG: First item type: {type(items[0])}")
            print(f"DEBUG: First item content (first 500 chars): {str(items[0])[:500]}")
        
        # Filter out non-dict items and normalize
        valid_items = [item for item in items if isinstance(item, dict)]
        print(f"Valid dict items: {len(valid_items)}")
        
        normalized_posts = [normalize_instagram_post(item) for item in valid_items]
        
        # Convert to the expected format for compatibility with existing code
        parsed_data = []
        for post in normalized_posts:
            # Safe URL parsing
            url = post.get("url", "")
            post_id = None
            if url:
                url_parts = url.split("/")
                if len(url_parts) >= 2:
                    post_id = url_parts[-2]
            
            # Safe media URL extraction
            media_urls = post.get("media_urls", [])
            first_media = media_urls[0] if media_urls and len(media_urls) > 0 else None
            
            parsed_post = {
                "id": post_id,
                "caption": post.get("text", ""),
                "image_url": first_media,
                "post_url": url,
                "timestamp": post.get("timestamp", ""),
                "likes": post.get("likes", 0),
                "comments": post.get("comments", 0)
            }
            parsed_data.append(parsed_post)
        
        return {"parsed_posts": parsed_data, "total_found": len(parsed_data)}
        
    except Exception as e:
        print(f"ERROR: Instagram search failed: {e}")
        return None

def facebook_posts_by_keyword(keyword: str, limit: int = 10):
    """
    Fetch Facebook posts by keyword using Apify scrapers.
    """
    print(f"Fetching Facebook posts for keyword: {keyword}")
    
    # Clean keyword
    clean_keyword = clean_keyword_for_search(keyword)
    
    # Try different Facebook scrapers in order of preference
    scrapers = [
        ("apify/facebook-posts-scraper", {
            "searchKeywords": [clean_keyword],
            "maxPosts": limit,
        }),
        ("dtrungtin/facebook-posts-scraper", {
            "keywords": [clean_keyword],
            "limit": limit,
        })
    ]
    
    for scraper_name, run_input in scrapers:
        try:
            print(f"Trying scraper: {scraper_name}")
            run = client.actor(scraper_name).call(run_input=run_input)
            
            if run and "defaultDatasetId" in run:
                dataset_items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
                if dataset_items:
                    print(f"Retrieved {len(dataset_items)} items from Facebook using {scraper_name}")
                    return dataset_items
                else:
                    print(f"No data from {scraper_name}")
            else:
                print(f"No response from {scraper_name}")
        except Exception as e:
            print(f"Error with {scraper_name}: {e}")
            continue
    
    print("No Facebook data could be retrieved")
    return []

def facebook_search_by_keyword(keyword, num_of_posts=50, sort_by="latest"):
    """
    Search Facebook posts mentioning a keyword using Apify.
    
    Args:
        keyword (str): The keyword or phrase to search for (e.g. VIP name).
        num_of_posts (int): Number of posts to fetch.
        sort_by (str): Sorting criteria, e.g. "latest", "popular" (depends on dataset support).
    """
    print("=" * 80)
    print(f"DEBUG: Facebook Keyword Search Starting (Apify)")
    print("=" * 80)
    print(f"Original Keyword: {keyword}")
    
    # Clean keyword using helper function
    clean_keyword = clean_keyword_for_search(keyword)
    
    print(f"Cleaned Keyword: {clean_keyword}")
    print(f"Number of posts requested: {num_of_posts}")
    print(f"Sort by: {sort_by}")
    
    try:
        # List of Facebook scrapers to try
        scrapers_to_try = [
            ("apify/facebook-posts-scraper", {
                "searchKeywords": [clean_keyword],
                "maxPosts": num_of_posts,
            }),
            ("dtrungtin/facebook-posts-scraper", {
                "keywords": [clean_keyword],
                "limit": num_of_posts,
            }),
            ("apify/facebook-pages-scraper", {
                "searchKeywords": [clean_keyword],
                "maxPosts": num_of_posts,
            }),
        ]
        
        items = []
        successful_scraper = None
        
        for scraper_name, scraper_input in scrapers_to_try:
            try:
                print(f"Trying Facebook scraper: {scraper_name}")
                print(f"Input for {scraper_name}: {scraper_input}")
                run = client.actor(scraper_name).call(run_input=scraper_input)
                
                if run and "defaultDatasetId" in run:
                    items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
                    
                    if items:
                        successful_scraper = scraper_name
                        print(f"SUCCESS: Retrieved {len(items)} items from {scraper_name}")
                        break
                    else:
                        print(f"No items from {scraper_name}, trying next...")
                else:
                    print(f"No run result from {scraper_name}")
            except Exception as scraper_error:
                print(f"ERROR with {scraper_name}: {scraper_error}")
                continue

        print(f"Retrieved {len(items)} items from Facebook")
        if successful_scraper:
            print(f"Successful scraper: {successful_scraper}")
        
        # Debug: Print first item to see structure
        if items:
            print(f"DEBUG: First Facebook item type: {type(items[0])}")
            print(f"DEBUG: First Facebook item content (first 500 chars): {str(items[0])[:500]}")
        
        # Filter out non-dict items and normalize
        valid_items = [item for item in items if isinstance(item, dict)]
        print(f"Valid Facebook dict items: {len(valid_items)}")
        
        normalized_posts = [normalize_facebook_post(item) for item in valid_items]
        
        # Convert to the expected format for compatibility with existing code
        parsed_posts = []
        for post in normalized_posts:
            parsed_post = {
                "id": post.get("url", "").split("/")[-1] if post.get("url") else None,  # Extract ID from URL
                "user": post.get("user", ""),
                "text": post.get("text", ""),
                "date": post.get("timestamp", ""),
                "url": post.get("url", ""),
                "likes": post.get("likes", 0),
                "comments": post.get("comments", 0),
                "shares": post.get("shares", 0),
                "photos": post.get("media_urls", []),
            }
            parsed_posts.append(parsed_post)

        return {"parsed_posts": parsed_posts, "total_found": len(parsed_posts)}
        
    except Exception as e:
        print(f"ERROR: Facebook search failed: {e}")
        return None


def fetch_instagram_posts(hashtag: str, limit: int = 20):
    """Fetch Instagram posts for a hashtag and return normalized data for LLM."""
    return instagram_post_search(hashtag, limit)


def fetch_facebook_posts(keyword: str, limit: int = 20):
    """Fetch Facebook posts for a keyword and return normalized data for LLM."""
    return facebook_search_by_keyword(keyword, limit)


if __name__ == "__main__":
    # Test with both original and cleaned inputs
    test_queries = ["Salman Khan", "SalmanKhan"]
    
    for keyword in test_queries:
        print(f"\n🔎 Testing with: '{keyword}'")
        print(f"🔎 Fetching Instagram posts for: {keyword}")
        ig_data = fetch_instagram_posts(keyword, 5)
        if ig_data and ig_data.get("parsed_posts"):
            for post in ig_data["parsed_posts"][:2]:  # Show first 2 posts
                print(post, "\n")
        else:
            print("No Instagram data found\n")

        print(f"🔎 Fetching Facebook posts for: {keyword}")
        fb_data = fetch_facebook_posts(keyword, 5)
        if fb_data and fb_data.get("parsed_posts"):
            for post in fb_data["parsed_posts"][:2]:  # Show first 2 posts
                print(post, "\n")
        else:
            print("No Facebook data found\n")
        
        print("=" * 50)