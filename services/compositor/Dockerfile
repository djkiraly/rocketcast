# services/compositor — PLACEHOLDER (M00). Real image arrives with the M01 spike, hardened in M07.
#
# Intended base: NVIDIA CUDA runtime on Ubuntu LTS so NVDEC/NVENC are available to GStreamer.
#   FROM nvidia/cuda:12.6.3-runtime-ubuntu24.04
#
# Intended GStreamer packages (apt):
#   gstreamer1.0-tools gstreamer1.0-plugins-base gstreamer1.0-plugins-good
#   gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav
#   gstreamer1.0-nice gstreamer1.0-rtsp libgstreamer1.0-dev libgstreamer-plugins-bad1.0-dev
#   libnvidia-encode-* / libnvidia-decode-* (host driver passthrough via nvidia-container-toolkit)
#   srt-tools libsrt-openssl-dev                     # SRT pull from ingest
#   One of (decided in M01): wpewebkit + gstreamer1.0-wpe | chromium (headless) | skia bindings
#
# Intended runtime: Node LTS (worker agent, TypeScript) or a Rust binary — decided in M01.
# Run with: docker run --gpus all ... (requires nvidia-container-toolkit on the host).

FROM ubuntu:24.04

CMD ["echo", "compositor placeholder"]
