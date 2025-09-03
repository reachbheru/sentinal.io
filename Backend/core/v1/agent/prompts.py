from typing import Dict, Any


class PromptTemplates:
    """Container for all prompt templates used in news analysis and fake news detection."""

    @staticmethod
    def instagram_analysis_system() -> str:
        """System prompt for analyzing Instagram content."""
        return """You are an expert fact-checker and social media analyst. Your task is to analyze Instagram posts and comments to extract information relevant to news verification and fact-checking.

Focus on analyzing:
- Post content, captions, and hashtags for factual claims
- User engagement patterns and comment sentiment
- Visual content analysis for potential misinformation
- Account credibility and verification status
- Temporal patterns and viral spread indicators
- Cross-referencing with known facts

Look for signs of misinformation, manipulated content, or unverified claims. Identify both supporting and contradicting evidence."""

    @staticmethod
    def instagram_analysis_user(user_query: str, instagram_data: str) -> str:
        """User prompt for analyzing Instagram content."""
        return f"""News/Data to Verify: {user_query}

Instagram Data (Posts & Comments): {instagram_data}

Please analyze this Instagram content for fact-checking. Identify any claims, evidence, or patterns that support or contradict the news/data being verified."""

    @staticmethod
    def twitter_analysis_system() -> str:
        """System prompt for analyzing Twitter content."""
        return """You are an expert fact-checker and social media analyst. Your task is to analyze Twitter posts and comments to extract information relevant to news verification and fact-checking.

Focus on analyzing:
- Tweet content and threads for factual claims
- Retweet patterns and viral spread
- User verification status and credibility
- Reply sentiment and fact-checking responses
- Hashtag trends and coordinated behavior
- Bot detection indicators
- Timeline correlation with news events

Look for signs of misinformation, coordinated inauthentic behavior, or manipulation. Identify both supporting and contradicting evidence."""

    @staticmethod
    def twitter_analysis_user(user_query: str, twitter_data: str) -> str:
        """User prompt for analyzing Twitter content."""
        return f"""News/Data to Verify: {user_query}

Twitter Data (Posts & Comments): {twitter_data}

Please analyze this Twitter content for fact-checking. Identify any claims, evidence, or patterns that support or contradict the news/data being verified."""

    @staticmethod
    def google_analysis_system() -> str:
        """System prompt for analyzing Google search results for news verification."""
        return """You are an expert fact-checker and news analyst. Analyze the provided Google search results to verify the authenticity and accuracy of news or data claims.

Focus on:
- Authoritative and credible news sources
- Official statements and press releases
- Expert opinions and academic sources
- Cross-verification across multiple reliable sources
- Timeline consistency and factual accuracy
- Detection of misleading or false information
- Identification of primary vs secondary sources

Evaluate the credibility of sources and highlight any inconsistencies or red flags that suggest misinformation."""

    @staticmethod
    def google_analysis_user(user_query: str, google_results: str) -> str:
        """User prompt for analyzing Google search results for news verification."""
        return f"""News/Data to Verify: {user_query}

Google Search Results: {google_results}

Please analyze these Google results to verify the authenticity of the news/data. Focus on credible sources and fact-checking."""

    @staticmethod
    def social_media_synthesis_system() -> str:
        """System prompt for analyzing combined social media data."""
        return """You are an expert fact-checker specializing in social media analysis. Analyze the combined Instagram and Twitter data to extract insights for news verification and fake news detection.

Focus on:
- Cross-platform consistency of claims and narratives
- User behavior patterns and engagement metrics
- Viral spread patterns and coordinated campaigns
- Sentiment analysis across platforms
- Detection of manipulation or inauthentic behavior
- Identification of reliable vs unreliable sources
- Timeline correlation and fact verification

Provide insights on the credibility and authenticity of the information based on social media evidence."""

    @staticmethod
    def social_media_synthesis_user(
        user_query: str, instagram_analysis: str, twitter_analysis: str
    ) -> str:
        """User prompt for analyzing combined social media data."""
        return f"""News/Data to Verify: {user_query}

Instagram Analysis: {instagram_analysis}

Twitter Analysis: {twitter_analysis}

Please synthesize these social media analyses to provide insights on the credibility and authenticity of the news/data."""

    @staticmethod
    def synthesis_system() -> str:
        """System prompt for final news verification and fake news detection synthesis."""
        return """You are an expert fact-checker and misinformation detection specialist. Synthesize all the provided analyses to determine the authenticity and credibility of the news or data being verified.

Your task:
- Combine insights from Google search and social media analyses (Instagram and Twitter)
- Identify consistent patterns and contradictions across sources
- Evaluate source credibility and reliability
- Detect signs of misinformation, manipulation, or fake news
- Assess the overall truthfulness and accuracy
- Provide a confidence score for your assessment
- Highlight any red flags or warning signs
- Structure the response with clear verification conclusions

Create a comprehensive fact-check report with a final verdict on whether the news/data is authentic, misleading, or false."""

    @staticmethod
    def synthesis_user(
        user_query: str,
        google_analysis: str,
        social_media_analysis: str,
    ) -> str:
        """User prompt for final news verification synthesis."""
        return f"""News/Data to Verify: {user_query}

Google Search Analysis: {google_analysis}

Social Media Analysis (Instagram + Twitter): {social_media_analysis}

Please synthesize these analyses to provide a comprehensive fact-check report. Determine if the news/data is authentic, misleading, or fake, and provide your reasoning."""


def create_message_pair(system_prompt: str, user_prompt: str) -> list[Dict[str, Any]]:
    """
    Create a standardized message pair for LLM interactions.

    Args:
        system_prompt: The system message content
        user_prompt: The user message content

    Returns:
        List containing system and user message dictionaries
    """
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


# Convenience functions for creating complete message arrays
def get_instagram_analysis_messages(
    user_query: str, instagram_data: str
) -> list[Dict[str, Any]]:
    """Get messages for Instagram content analysis."""
    return create_message_pair(
        PromptTemplates.instagram_analysis_system(),
        PromptTemplates.instagram_analysis_user(user_query, instagram_data),
    )


def get_twitter_analysis_messages(
    user_query: str, twitter_data: str
) -> list[Dict[str, Any]]:
    """Get messages for Twitter content analysis."""
    return create_message_pair(
        PromptTemplates.twitter_analysis_system(),
        PromptTemplates.twitter_analysis_user(user_query, twitter_data),
    )


def get_google_analysis_messages(
    user_query: str, google_results: str
) -> list[Dict[str, Any]]:
    """Get messages for Google results analysis."""
    return create_message_pair(
        PromptTemplates.google_analysis_system(),
        PromptTemplates.google_analysis_user(user_query, google_results),
    )


def get_social_media_synthesis_messages(
    user_query: str, instagram_analysis: str, twitter_analysis: str
) -> list[Dict[str, Any]]:
    """Get messages for social media synthesis analysis."""
    return create_message_pair(
        PromptTemplates.social_media_synthesis_system(),
        PromptTemplates.social_media_synthesis_user(
            user_query, instagram_analysis, twitter_analysis
        ),
    )


def get_synthesis_messages(
    user_query: str, google_analysis: str, social_media_analysis: str
) -> list[Dict[str, Any]]:
    """Get messages for final synthesis."""
    return create_message_pair(
        PromptTemplates.synthesis_system(),
        PromptTemplates.synthesis_user(
            user_query, google_analysis, social_media_analysis
        ),
    )