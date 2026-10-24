# services/ingest — PLACEHOLDER (M00). Auth hook and per-session stream IDs arrive in M07.
#
# The upstream image already runs MediaMTX; we only supply configuration. Either bake it in (below)
# or mount it at runtime:
#   docker run -v "$PWD/mediamtx.yml:/mediamtx.yml:ro" -p 8890:8890/udp -p 1935:1935 -p 8889:8889 -p 8888:8888 ...
# Pin the tag to a specific MediaMTX release before M07 production use.

FROM bluenviron/mediamtx:latest

COPY mediamtx.yml /mediamtx.yml
