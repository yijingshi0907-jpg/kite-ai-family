#!/usr/bin/env bash
# Upload ./family-videos/*.mp4 to the Cloudflare R2 bucket (resilient settings).
# One-time setup (creds stored in ~/.config/rclone, NOT in this repo):
#   brew install rclone
#   rclone config create r2 s3 provider=Cloudflare \
#     access_key_id=YOUR_KEY secret_access_key=YOUR_SECRET \
#     endpoint=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
#
# Run:  bash scripts/upload-family-videos.sh
# Safe to re-run — skips files already in the bucket, resumes after drops.
set -euo pipefail

BUCKET="r2:cz-family-videos"
SRC="family-videos"

rclone copy "$SRC/" "$BUCKET" \
  --transfers 2 \
  --multi-thread-streams 1 \
  --s3-upload-concurrency 2 \
  --s3-chunk-size 32M \
  --retries 20 \
  --low-level-retries 30 \
  --retries-sleep 5s \
  --ignore-existing \
  --progress

echo "---"
echo "Files in bucket:"
rclone ls "$BUCKET" | sort -k2
