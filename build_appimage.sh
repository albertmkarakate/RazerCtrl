#!/bin/bash
# Script to package RazerCtrl as an AppImage
# Requires appimagetool and a pre-built python environment

set -e

APP=RazerCtrl
VERSION=0.1.0
APPDIR=$APP.AppDir

echo "Building AppDir..."
mkdir -p $APPDIR/usr/bin
mkdir -p $APPDIR/usr/share/applications
mkdir -p $APPDIR/usr/share/icons/hicolor/scalable/apps

# Copy files
cp razerctrl/assets/razerctrl.desktop $APPDIR/
cp razerctrl/assets/icons/razerctrl.svg $APPDIR/razerctrl.svg
cp razerctrl/assets/icons/razerctrl.svg $APPDIR/usr/share/icons/hicolor/scalable/apps/razerctrl.svg

# In a real build, we would bundle a python interpreter and all dependencies here
# For this demo, we'll just show the structure
cat <<EOF > $APPDIR/AppRun
#!/bin/bash
HERE="\$(dirname "\$(readlink -f "\${0}")")"
export PATH="\$HERE/usr/bin:\$PATH"
exec python3 -m razerctrl.main "\$@"
EOF
chmod +x $APPDIR/AppRun

echo "AppDir structure created. To build the AppImage, run:"
echo "appimagetool $APPDIR"
