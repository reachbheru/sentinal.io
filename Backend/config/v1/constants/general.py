import os
from pathlib import Path

# Path to the cellbot package folder
PACKAGE_ROOT = Path(__file__).parent.parent.parent.parent
PROMPTS_PATH = PACKAGE_ROOT / "prompts/v1/"  # Path to the prompt templates directory