#!/bin/bash
set -e
echo "[RazerCtrl] Installing dependencies for Arch Linux..."

# 1. Install official repo packages
sudo pacman -S --needed python python-pyqt6 python-evdev openrazer-daemon python-distro

# 2. Handle AUR packages
# Check for AUR helpers
AUR_HELPER=""
if command -v yay &>/dev/null; then
  AUR_HELPER="yay"
elif command -v paru &>/dev/null; then
  AUR_HELPER="paru"
fi

if [ -n "$AUR_HELPER" ]; then
  echo "[RazerCtrl] Using $AUR_HELPER to install AUR dependencies..."
  $AUR_HELPER -S --needed python-openrazer python-uinput
else
  echo "[RazerCtrl] WARNING: No AUR helper (yay/paru) found."
  echo "[RazerCtrl] Please install 'python-openrazer' and 'python-uinput' manually from AUR."
fi

# 3. Group and permissions
if ! getent group plugdev > /dev/null; then
  echo "[RazerCtrl] Creating 'plugdev' group..."
  sudo groupadd plugdev
fi

if ! groups $USER | grep -q "\bplugdev\b"; then
  echo "[RazerCtrl] Adding $USER to 'plugdev' group..."
  sudo gpasswd -a $USER plugdev
fi

# 4. Enable and start daemon
echo "[RazerCtrl] Enabling openrazer-daemon..."
systemctl --user enable --now openrazer-daemon || echo "[RazerCtrl] Note: Could not start daemon via systemctl --user. Ensure it is running."

echo "[RazerCtrl] Done. Please log out and back in for group changes to take effect."
