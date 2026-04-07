#!/bin/bash
set -e
echo "[RazerCtrl] Installing dependencies for Debian/Ubuntu..."

sudo apt update
sudo apt install -y python3 python3-pip python3-pyqt6 python3-evdev software-properties-common

sudo add-apt-repository -y ppa:openrazer/stable
sudo apt update
sudo apt install -y openrazer-meta python3-openrazer

pip3 install --user python-uinput distro

# Ensure plugdev group exists and user is in it
if ! getent group plugdev > /dev/null; then
  sudo groupadd plugdev
fi
sudo gpasswd -a $USER plugdev

echo "[RazerCtrl] Done. Please log out and back in for group changes to take effect."
