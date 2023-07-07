# Image
	zxteamorg/traefik-with-python

# Build steps
## Build and Detect version of Traefik
```bash
docker build --tag zxteamorg/traefik-with-python:latest . && \
docker run --rm --interactive --tty zxteamorg/traefik-with-python:latest version
```
See `Version: X.Y.Z`

## Setup version
```bash
export VERSION=X.Y.Z_buildnum
```
where
* X.Y.Z is a version of Traefik
* buildnum is a our build number

## Tag version and Push
```bash
docker tag zxteamorg/traefik-with-python:latest zxteamorg/traefik-with-python:${VERSION} && \
docker push zxteamorg/traefik-with-python:${VERSION} && \
docker push zxteamorg/traefik-with-python:latest
```
