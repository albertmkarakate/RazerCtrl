#!/bin/bash
set -e
echo "[RazerCtrl] Installing dependencies for Debian/Ubuntu..."

# 1. Install official repo packages
sudo apt update
sudo apt install -y python3 python3-pip python3-pyqt6 python3-evdev python3-distro software-properties-common input-remapper

# 2. Handle OpenRazer via PPA
sudo add-apt-repository -y ppa:openrazer/stable
sudo apt update
sudo apt install -y openrazer-meta python3-openrazer

# 3. Pip dependencies
pip3 install --user python-uinput

# 4. Group and permissions
if ! getent group plugdev > /dev/null; then
  echo "[RazerCtrl] Creating 'plugdev' group..."
  sudo groupadd plugdev
fi

if ! groups $USER | grep -q "\bplugdev\b"; then
  echo "[RazerCtrl] Adding $USER to 'plugdev' group..."
  sudo gpasswd -a $USER plugdev
fi

# 5. Enable and start daemon
echo "[RazerCtrl] Enabling openrazer-daemon..."
systemctl --user enable --now openrazer-daemon || echo "[RazerCtrl] Note: Could not start daemon via systemctl --user. Ensure it is running."

echo "[RazerCtrl] Done. Please log out and back in for group changes to take effect."
