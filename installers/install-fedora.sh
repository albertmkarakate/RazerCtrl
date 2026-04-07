#!/bin/bash
set -e
echo "[RazerCtrl] Installing dependencies for Fedora..."

sudo dnf install -y python3 python3-pip python3-qt6 python3-evdev
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable -y whot/openrazer
sudo dnf install -y openrazer-daemon python3-openrazer

pip3 install --user python-uinput distro

# Ensure plugdev group exists and user is in it
if ! getent group plugdev > /dev/null; then
  sudo groupadd plugdev
fi
sudo gpasswd -a $USER plugdev

echo "[RazerCtrl] Done. Please log out and back in for group changes to take effect."
