#!/bin/bash
set -e
echo "[RazerCtrl] Installing dependencies for Arch Linux..."

sudo pacman -S --needed python python-pyqt6 python-evdev openrazer-daemon

# AUR packages — use yay or paru if available
if command -v yay &>/dev/null; then
  yay -S --needed python-openrazer python-uinput python-distro
elif command -v paru &>/dev/null; then
  paru -S --needed python-openrazer python-uinput python-distro
else
  echo "AUR helper not found. Install yay or paru, then run: yay -S python-openrazer python-uinput"
  exit 1
fi

# Ensure plugdev group exists and user is in it
if ! getent group plugdev > /dev/null; then
  sudo groupadd plugdev
fi
sudo gpasswd -a $USER plugdev

echo "[RazerCtrl] Done. Please log out and back in for group changes to take effect."
