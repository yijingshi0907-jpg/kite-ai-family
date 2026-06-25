#!/usr/bin/env bash
# Download family-site videos as <youtube-id>.mp4 into ./family-videos/
# Requires yt-dlp + ffmpeg:  brew install yt-dlp ffmpeg
#
# Usage:
#   bash scripts/download-family-videos.sh                 # download the full default set
#   bash scripts/download-family-videos.sh ID1 ID2 ...     # download only specific new IDs
set -euo pipefail

OUT_DIR="family-videos"
mkdir -p "$OUT_DIR"

# Default = all 24 originals (interviews + podcasts EP1–EP8).
# For weekly updates, pass only the NEW video IDs as arguments instead.
DEFAULT_IDS=(
  se1HXCqNC7E OMkE-eO4WX8 y1kDxjLH2-g kOcotZZUdgY KIKpZ8qopdY
  yOcPja2E5SU jS9Of4gn6p4 ozq2mhy9mE0 0JzWEb6cQ34 ERUp4hVxH-I
  OPX2QC9R7CY 6oGpazMpEhQ 7GoCutDVt6Y y9TKGidsjH0 YmsxlSwvJBk
  CokbdUYuIV0
  kf4rk-fGSnI kUdhjKhPT2s 5Z8B17z9F10 j70-zAL2Ljc XjcrjV-Ra9k
  SxsICD_RNas jEUKT39obJk FtGeQJkH38w
)

if [ "$#" -gt 0 ]; then
  IDS=("$@")
else
  IDS=("${DEFAULT_IDS[@]}")
fi

echo "Downloading ${#IDS[@]} videos into $OUT_DIR/ ..."
for id in "${IDS[@]}"; do
  if [ -f "$OUT_DIR/$id.mp4" ]; then
    echo "✓ $id.mp4 already exists, skipping"
    continue
  fi
  echo "↓ $id"
  yt-dlp \
    -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
    --merge-output-format mp4 \
    -o "$OUT_DIR/%(id)s.%(ext)s" \
    "https://www.youtube.com/watch?v=$id"
done

echo "Done. Files are in $OUT_DIR/ — upload these to your R2 bucket."
