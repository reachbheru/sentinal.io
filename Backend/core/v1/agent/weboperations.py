from dotenv import load_dotenv
import os
import requests
from urllib.parse import quote_plus
from .snapshot import poll_snapshot_status, download_snapshot

def _make_api_request(url, **kwargs):
    api_key = os.getenv("BRIGHTDATA_API_KEY")

    headers = {
        "Authorization" : f"Bearer {api_key}",
        "Content-Type" : "application/json",
    }

    try:
        response = requests.post(url, headers=headers, **kwargs)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None
    except Exception as e:
        print(f"Unknown error: {e}")
        return None
    
def serp_search(query, engine="google"):
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

    full_response = _make_api_request(url, json=payload)

    if not full_response:
        return None
    

    extracted_data = {
        "knowledge": full_response.get("knowledge", {}),
        "organic": full_response.get("organic", []),   
    }

    return extracted_data


def _trigger_and_download_snapshot(trigger_url, params, data, operation_name="operation"):
    trigger_result = _make_api_request(trigger_url, params=params, json=data)
    if not trigger_result:
        return None
    
    snapshot_id = trigger_result.get("snapshot_id")
    if not snapshot_id:
        return None
    
    if not poll_snapshot_status(snapshot_id):
        return None
    
    raw_data = download_snapshot(snapshot_id)
    return raw_data

def instagram_post_search(hashtag, num_of_posts=50):
    """
    Search Instagram posts by hashtag using Bright Data dataset API.
    """
    trigger_url = "https://api.brightdata.com/datasets/v3/trigger"

    params = {
        "dataset_id": "gd_lk5ns7kz21pck8jpis",  
        "include_errors": "true",
        "type": "discover_new",
        "discover_by": "hashtag"
    }

    data = [
        {
            "hashtag": hashtag,
            "num_of_posts": num_of_posts
        }
    ]

    raw_data = _trigger_and_download_snapshot(
        trigger_url, params, data, operation_name="instagram posts"
    )

    if not raw_data:
        return None

    parsed_data = []
    for post in raw_data:
        parsed_post = {
            "id": post.get("id"),
            "caption": post.get("caption"),
            "image_url": post.get("image_url"),
            "post_url": post.get("post_url"),
            "timestamp": post.get("timestamp"),
            "likes": post.get("likes"),
            "comments": post.get("comments")
        }
        parsed_data.append(parsed_post)

    return {"parsed_posts": parsed_data, "total_found": len(parsed_data)}

def twitter_search_by_keyword(keyword, num_of_posts=50, sort_by="latest"):
    """
    Search Twitter posts mentioning a keyword using Bright Data Datasets API.
    
    Args:
        keyword (str): The keyword or phrase to search for (e.g. VIP name).
        num_of_posts (int): Number of posts to fetch.
        sort_by (str): Sorting criteria, e.g. "latest", "popular" (depends on dataset support).
    """
    trigger_url = "https://api.brightdata.com/datasets/v3/trigger"

    params = {
        "dataset_id": "gd_lwxkxvnf1cynvib9co",   # Twitter Posts dataset
        "include_errors": "true",
        "type": "discover_new",
        "discover_by": "keyword",
    }

    data = [
        {
            "keyword": keyword,
            "num_of_posts": num_of_posts,
            "sort_by": sort_by
        }
    ]

    raw_data = _trigger_and_download_snapshot(
        trigger_url, params, data, operation_name="twitter keyword search"
    )

    if not raw_data:
        return None

    parsed_posts = []
    for post in raw_data:
        parsed_posts.append({
            "id": post.get("id"),
            "user": post.get("user_posted"),
            "text": post.get("description"),
            "date": post.get("date_posted"),
            "url": post.get("url"),
            "likes": post.get("likes"),
            "replies": post.get("replies"),
            "reposts": post.get("reposts"),
            "views": post.get("views"),
            "hashtags": post.get("hashtags"),
            "photos": post.get("photos"),
        })

    return {"parsed_posts": parsed_posts, "total_found": len(parsed_posts)}


