#!/bin/bash
# Script to package RazerCtrl as an AppImage
# This script downloads linuxdeploy and its python plugin to build the AppImage

set -e

APP=RazerCtrl
VERSION=0.1.0
APPDIR=$APP.AppDir

echo "[RazerCtrl] Starting AppImage build process..."

# 0. Check for FUSE (required to run AppImages)
# On Arch/CachyOS, you need 'fuse2' for most AppImages to run
if ! command -v fusermount >/dev/null 2>&1 && ! command -v fusermount3 >/dev/null 2>&1; then
    echo "[RazerCtrl] ERROR: FUSE is not installed. Please install 'fuse2' or 'fuse3'."
    exit 1
fi

# 1. Clean up previous builds
rm -rf $APPDIR
rm -f RazerCtrl-*.AppImage

# 2. Create AppDir structure
mkdir -p $APPDIR/usr/share/icons/hicolor/scalable/apps
mkdir -p $APPDIR/usr/share/applications

# 3. Copy assets
cp razerctrl/assets/icons/razerctrl.svg $APPDIR/razerctrl.svg
cp razerctrl/assets/icons/razerctrl.svg $APPDIR/usr/share/icons/hicolor/scalable/apps/razerctrl.svg
cp razerctrl/assets/razerctrl.desktop $APPDIR/usr/share/applications/

# 4. Download tools using curl (more reliable for redirects)
download_tool() {
    local url=$1
    local output=$2
    if [ ! -f "$output" ]; then
        echo "[RazerCtrl] Downloading $output..."
        # Use --location to follow redirects and --fail to exit on server errors
        # We'll use --progress-bar to show progress without complex terminal codes
        if ! curl -L --progress-bar --fail "$url" -o "$output"; then
            echo "[RazerCtrl] ERROR: Failed to download $url"
            echo "[RazerCtrl] Attempting fallback with wget..."
            if ! wget --show-progress -q "$url" -O "$output"; then
                echo "[RazerCtrl] ERROR: Both curl and wget failed. Check your internet connection."
                return 1
            fi
        fi
        chmod +x "$output"
    fi
}

download_tool "https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage" "linuxdeploy-x86_64.AppImage"
download_tool "https://github.com/linuxdeploy/linuxdeploy-plugin-python/releases/download/continuous/linuxdeploy-plugin-python-x86_64.AppImage" "linuxdeploy-plugin-python-x86_64.AppImage"

# 5. Set environment variables for linuxdeploy-plugin-python
export PYTHON_VERSION=3.10
export APPDIR
export OUTPUT="RazerCtrl-${VERSION}-x86_64.AppImage"

# 6. Run linuxdeploy
echo "[RazerCtrl] Running linuxdeploy..."
# Some environments (like CachyOS/Arch) might need --appimage-extract-and-run if FUSE is not perfectly configured
# We'll try to run it normally first, then fallback
if ! ./linuxdeploy-x86_64.AppImage --appdir $APPDIR \
    --plugin python \
    --output appimage \
    --desktop-file razerctrl/assets/razerctrl.desktop \
    --icon-file razerctrl/assets/icons/razerctrl.svg; then
    
    echo "[RazerCtrl] Normal run failed, trying with --appimage-extract-and-run..."
    ./linuxdeploy-x86_64.AppImage --appimage-extract-and-run --appdir $APPDIR \
        --plugin python \
        --output appimage \
        --desktop-file razerctrl/assets/razerctrl.desktop \
        --icon-file razerctrl/assets/icons/razerctrl.svg
fi

echo "[RazerCtrl] Build process finished."
echo "[RazerCtrl] Output: $OUTPUT"
