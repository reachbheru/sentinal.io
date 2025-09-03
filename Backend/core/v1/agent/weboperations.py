from dotenv import load_dotenv
import os
import requests
from urllib.parse import quote_plus
from snapshot import poll_snapshot_status, download_snapshot

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
            "caption": post.get("description"),
            "image_url": post.get("photos"),
            "post_url": post.get("url"),
            "timestamp": post.get("date_posted"),
            "likes": post.get("likes")
        }
        parsed_data.append(parsed_post)

    return {"parsed_posts": parsed_data, "total_found": len(parsed_data)}

