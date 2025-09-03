import os
import uuid
from fastapi import HTTPException, UploadFile
import boto3
from botocore.exceptions import BotoCoreError, ClientError

# Initialize S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)


class S3Service:
    def __init__(self):
        self.bucket = os.getenv("S3_BUCKET_NAME")

    async def upload_file(self, file: UploadFile) -> str:
        """
        Uploads UploadFile to S3 and returns the public URL.
        """

        print("Uploading file to S3:", file.filename, file.content_type)
        # Generate a unique filename
        ext = file.filename.split(".")[-1]
        key = f"uploads/{uuid.uuid4().hex}.{ext}"

        try:
            # Read file bytes
            content = await file.read()

            # Upload to S3
            s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=content,
                ContentType=file.content_type,
                #ACL="public-read",  # make object publicly readable
            )

            print("File uploaded successfully to S3:", key)

            # Construct public URL
            url = f"https://{self.bucket}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
            return url

        except (BotoCoreError, ClientError) as e:
            raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(e)}")
