import os
from pathlib import Path

from dotenv import load_dotenv

# ==== Load Environment Variables ====
env_path = (
    Path(".env.prod")
    if os.getenv("ENVIRONMENT") == "production"
    else Path(".env.local")
)
if env_path.exists():
    load_dotenv(env_path)

# ==== FastAPI App ====
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from Backend.api import APIConfig
from Backend.api.v1.middlewares.error_handler import ErrorHandlerMiddleware
from Backend.api.v1.routes import (

)
from Backend.core.v1.common.logger import get_logger

logger = get_logger(__name__)
logger.info(f"Loading environment variables from {env_path}")

app = FastAPI(
    title=APIConfig.TITLE,
    description=APIConfig.DESCRIPTION,
    version=APIConfig.VERSION,
    redirect_slashes=False,
)

# === Add Middlewares ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)
app.add_middleware(ErrorHandlerMiddleware)


@app.middleware("http")
async def log_request_response(request: Request, call_next):
    # Log request details
    logger.info(f"Request URL: {request.url}")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request headers: {request.headers}")

    # Try to log request body if available
    try:
        body = await request.body()
        if body:
            logger.info(f"Request body: {body.decode()}")
    except Exception as e:
        logger.error(f"Error reading request body: {e}")

    # Process the request and return the response without logging it
    response = await call_next(request)

    # Log response status code and headers
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response headers: {response.headers}")

    return response


# === Add Routes ===
# app.include_router(router, prefix=APIConfig.V1_PREFIX + "/endpoint", tags=["endpoint"])


# ==== Root Route ====
@app.get("/", include_in_schema=False)
def root():
    return {"status": "OK"}


# ==== Health Check ====
@app.get("/health", tags=["health"])
def health():
    return {"status": "OK"}


# ====================================================================

# Poetry Commands
#
# dev: Run the app in development mode
# start: Run the app in production mode


def dev():
    """Run the app in development mode for local development"""
    import uvicorn

    uvicorn.run(
        "Backend.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8080")),
        reload=True,
        log_level=os.getenv("LOG_LEVEL", "debug").lower(),
    )


# def start():
#     """Run the app in production mode"""
#     import gunicorn.app.base

#     class StandaloneApplication(gunicorn.app.base.BaseApplication):
#         def __init__(self, app, options=None):
#             self.options = options or {}
#             self.application = app
#             super().__init__()

#         def load_config(self):
#             for key, value in self.options.items():
#                 self.cfg.set(key, value)

#         def load(self):
#             return self.application

#     options = {
#         "bind": f"0.0.0.0:{os.getenv('PORT', '8080')}",
#         "workers": int(os.getenv("WORKERS", "4")),
#         "worker_class": "uvicorn.workers.UvicornWorker",
#         "loglevel": os.getenv("LOG_LEVEL", "debug").lower(),
#         "timeout": int(os.getenv("WORKER_TIMEOUT", "600")),
#     }
#     StandaloneApplication(app, options).run()


if __name__ == "__main__":
    dev()