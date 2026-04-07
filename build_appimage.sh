#!/bin/bash
# Script to package RazerCtrl as an AppImage
# This script downloads linuxdeploy and its python plugin to build the AppImage

set -e

APP=RazerCtrl
VERSION=0.1.0
APPDIR=$APP.AppDir

echo "[RazerCtrl] Starting AppImage build process..."

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

# 4. Download linuxdeploy and python plugin if not present
if [ ! -f linuxdeploy-x86_64.AppImage ]; then
    echo "[RazerCtrl] Downloading linuxdeploy..."
    wget -q https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage
    chmod +x linuxdeploy-x86_64.AppImage
fi

if [ ! -f linuxdeploy-plugin-python-x86_64.AppImage ]; then
    echo "[RazerCtrl] Downloading linuxdeploy-plugin-python..."
    wget -q https://github.com/linuxdeploy/linuxdeploy-plugin-python/releases/download/continuous/linuxdeploy-plugin-python-x86_64.AppImage
    chmod +x linuxdeploy-plugin-python-x86_64.AppImage
fi

# 5. Set environment variables for linuxdeploy-plugin-python
export PYTHON_VERSION=3.10
export APPDIR

# 6. Run linuxdeploy
echo "[RazerCtrl] Running linuxdeploy..."
./linuxdeploy-x86_64.AppImage --appdir $APPDIR \
    --plugin python \
    --output appimage \
    --desktop-file razerctrl/assets/razerctrl.desktop \
    --icon-file razerctrl/assets/icons/razerctrl.svg

echo "[RazerCtrl] Build process finished."
echo "[RazerCtrl] If successful, you should see a .AppImage file in the current directory."
echo "[RazerCtrl] Note: This script requires wget and a working internet connection."
