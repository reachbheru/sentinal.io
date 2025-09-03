from dotenv import load_dotenv
from typing import Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
from Backend.core.v1.agent.schema.state import State, InstagramURLAnalysis, TwitterURLAnalysis    
from Backend.api.v1.dependencies.service_deps import get_gemini
from Backend.core.v1.agent.weboperations import serp_search, instagram_post_search, twitter_search_by_keyword
from Backend.core.v1.agent.prompts import (
    get_instagram_analysis_messages,
    get_twitter_analysis_messages,
    get_google_analysis_messages,
    get_social_media_synthesis_messages,
    get_synthesis_messages
)

class NewsVerificationFlow:
    def __init__(self):
        self.state_graph = StateGraph(State)
        self.llm = get_gemini()
        self._build_graph()

    def google_search(self, state: State):
        """Search Google for news verification data."""
        user_question = state.get("user_question", "")
        print(f"Searching Google for: {user_question}")
        
        google_results = serp_search(user_question, engine="google")
        print(google_results)
        
        # Convert to string for prompt processing
        return {"google_results": str(google_results) if google_results else ""}
    
    def instagram_search(self, state: State):
        """Search Instagram for posts and comments related to the query."""
        user_question = state.get("user_question", "") or ""
        print(f"Searching Instagram for: {user_question}")
        
        # Use the actual Instagram search functionality
        instagram_data = instagram_post_search(user_question)
        
        if instagram_data:
            print(f"Found {instagram_data.get('total_found', 0)} Instagram posts")
            # Format data for better LLM processing
            formatted_data = self._format_instagram_data(instagram_data)
        else:
            print("No Instagram data found")
            formatted_data = "No Instagram posts found for this query."
        
        return {"instagram_data": formatted_data}

    def twitter_search(self, state: State):
        """Search Twitter for posts and comments related to the query."""
        user_question = state.get("user_question", "") or ""
        print(f"Searching Twitter for: {user_question}")
        
        # Use the actual Twitter search functionality
        twitter_data = twitter_search_by_keyword(user_question)
        
        if twitter_data:
            print(f"Found {twitter_data.get('total_found', 0)} Twitter posts")
            # Format data for better LLM processing
            formatted_data = self._format_twitter_data(twitter_data)
        else:
            print("No Twitter data found")
            formatted_data = "No Twitter posts found for this query."
        
        return {"twitter_data": formatted_data}

    def _format_instagram_data(self, instagram_data: dict) -> str:
        """Format Instagram data for LLM processing."""
        if not instagram_data or not instagram_data.get("parsed_posts"):
            return "No Instagram posts found."
        
        formatted_posts = []
        for i, post in enumerate(instagram_data.get("parsed_posts", [])[:10], 1):  # Limit to 10 posts
            # Skip None or empty posts
            if not post or not isinstance(post, dict):
                continue
                
            post_info = f"""
Post {i}:
- ID: {post.get('id', 'N/A')}
- Caption: {post.get('caption', 'No caption')[:300]}...
- Likes: {post.get('likes', 0)}
- Comments: {post.get('comments', 0)}
- Timestamp: {post.get('timestamp', 'N/A')}
- URL: {post.get('post_url', 'N/A')}
"""
            formatted_posts.append(post_info)
        
        return f"Found {instagram_data.get('total_found', 0)} Instagram posts. Here are the top posts:\n" + "\n".join(formatted_posts)

    def _format_twitter_data(self, twitter_data: dict) -> str:
        """Format Twitter data for LLM processing."""
        if not twitter_data or not twitter_data.get("parsed_posts"):
            return "No Twitter posts found."
        
        formatted_posts = []
        for i, post in enumerate(twitter_data.get("parsed_posts", [])[:10], 1):  # Limit to 10 posts
            # Skip None or empty posts
            if not post or not isinstance(post, dict):
                continue
                
            post_info = f"""
Tweet {i}:
- ID: {post.get('id', 'N/A')}
- User: {post.get('user', 'N/A')}
- Text: {post.get('text', 'No text')[:300]}...
- Date: {post.get('date', 'N/A')}
- Likes: {post.get('likes', 0)}
- Replies: {post.get('replies', 0)}
- Reposts: {post.get('reposts', 0)}
- Views: {post.get('views', 0)}
- Hashtags: {post.get('hashtags', [])}
- URL: {post.get('url', 'N/A')}
"""
            formatted_posts.append(post_info)
        
        return f"Found {twitter_data.get('total_found', 0)} Twitter posts. Here are the top posts:\n" + "\n".join(formatted_posts)

    def analyze_google_results(self, state: State):
        """Analyze Google search results for news verification."""
        print("Analyzing Google search results")
        
        user_question = state.get("user_question", "") or ""
        google_results = state.get("google_results", "") or ""
        
        messages = get_google_analysis_messages(user_question, google_results)
        reply = self.llm.invoke(messages)
        
        return {"google_analysis": reply.content}

    def analyze_instagram_results(self, state: State):
        """Analyze Instagram posts and comments for fact-checking."""
        print("Analyzing Instagram search results")
        
        user_question = state.get("user_question", "") or ""
        instagram_data = state.get("instagram_data", "") or ""
        
        messages = get_instagram_analysis_messages(user_question, instagram_data)
        reply = self.llm.invoke(messages)
        
        return {"instagram_analysis": reply.content}

    def analyze_twitter_results(self, state: State):
        """Analyze Twitter posts and comments for fact-checking."""
        print("Analyzing Twitter search results")
        
        user_question = state.get("user_question", "") or ""
        twitter_data = state.get("twitter_data", "") or ""
        
        messages = get_twitter_analysis_messages(user_question, twitter_data)
        reply = self.llm.invoke(messages)
        
        return {"twitter_analysis": reply.content}

    def synthesize_social_media(self, state: State):
        """Synthesize Instagram and Twitter analyses."""
        print("Synthesizing social media analyses")
        
        user_question = state.get("user_question", "") or ""
        instagram_analysis = state.get("instagram_analysis", "") or ""
        twitter_analysis = state.get("twitter_analysis", "") or ""
        
        messages = get_social_media_synthesis_messages(
            user_question, instagram_analysis, twitter_analysis
        )
        reply = self.llm.invoke(messages)
        
        return {"social_media_analysis": reply.content}

    def synthesize_analyses(self, state: State):
        """Combine Google and social media analyses for final verdict."""
        print("Combining all results for final news verification")
        
        user_question = state.get("user_question", "") or ""
        google_analysis = state.get("google_analysis", "") or ""
        social_media_analysis = state.get("social_media_analysis", "") or ""
        
        messages = get_synthesis_messages(
            user_question, google_analysis, social_media_analysis
        )
        
        reply = self.llm.invoke(messages)
        final_answer = reply.content
        
        return {
            "final_answer": final_answer, 
            "messages": [{"role": "assistant", "content": final_answer}]
        }

    def _build_graph(self):
        """Build the LangGraph workflow."""
        # Add nodes
        self.state_graph.add_node("google_search", self.google_search)
        self.state_graph.add_node("instagram_search", self.instagram_search)
        self.state_graph.add_node("twitter_search", self.twitter_search)
        self.state_graph.add_node("analyze_google_results", self.analyze_google_results)
        self.state_graph.add_node("analyze_instagram_results", self.analyze_instagram_results)
        self.state_graph.add_node("analyze_twitter_results", self.analyze_twitter_results)
        self.state_graph.add_node("synthesize_social_media", self.synthesize_social_media)
        self.state_graph.add_node("synthesize_analyses", self.synthesize_analyses)

        # Add edges - parallel searches first
        self.state_graph.add_edge(START, "google_search")
        self.state_graph.add_edge(START, "instagram_search")
        self.state_graph.add_edge(START, "twitter_search")

        # Then parallel analysis of each source
        self.state_graph.add_edge("google_search", "analyze_google_results")
        self.state_graph.add_edge("instagram_search", "analyze_instagram_results")
        self.state_graph.add_edge("twitter_search", "analyze_twitter_results")

        # Synthesize social media after both analyses are complete
        self.state_graph.add_edge("analyze_instagram_results", "synthesize_social_media")
        self.state_graph.add_edge("analyze_twitter_results", "synthesize_social_media")

        # Final synthesis after all analyses are complete
        self.state_graph.add_edge("analyze_google_results", "synthesize_analyses")
        self.state_graph.add_edge("synthesize_social_media", "synthesize_analyses")

        # End workflow
        self.state_graph.add_edge("synthesize_analyses", END)

    def compile(self):
        """Compile the graph for execution."""
        return self.state_graph.compile()

    def run_news_verification(self, user_query: str):
        """Run the complete news verification workflow."""
        print("News Verification Agent")
        print(f"Verifying: {user_query}")
        
        state: State = {
            "messages": [{"role": "user", "content": user_query}],
            "user_question": user_query,
            "google_results": None,
            "instagram_data": None,
            "twitter_data": None,
            "google_analysis": None,
            "instagram_analysis": None,
            "twitter_analysis": None,
            "social_media_analysis": None,
            "final_answer": None,
        }

        print("\nStarting parallel research process...")
        print("Launching Google, Instagram, and Twitter searches...\n")
        
        graph = self.compile()
        final_state = graph.invoke(state)

        if final_state.get("final_answer"):
            print(f"\nFinal Verification Report:\n{final_state.get('final_answer')}\n")
            return final_state.get('final_answer')

        print("-" * 80)
        return None
    

if __name__ == "__main__":
    load_dotenv(".env")
    news_verification_flow = NewsVerificationFlow()
    user_query = "Salman Khan"
    news_verification_flow.run_news_verification(user_query)
