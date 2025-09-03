"""
API package initialization
"""

from typing import Final


class APIConfig:
    VERSION: Final[str] = "0.1.0"
    TITLE: Final[str] = "Sentinel.io API"
    DESCRIPTION: Final[str] = "Backend Web Services API for Sentinel.io"

    V1_PREFIX: Final[str] = "/api/v1"