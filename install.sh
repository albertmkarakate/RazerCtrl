#!/bin/bash
set -e

echo "[RazerCtrl] Detecting distribution..."
# Try to get distro ID without the 'distro' python package first
if [ -f /etc/os-release ]; then
    DISTRO=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
else
    DISTRO=$(python3 -c "import distro; print(distro.id())" 2>/dev/null || echo "unknown")
fi

case "$DISTRO" in
  arch|cachyos|manjaro|endeavouros)
    echo "[RazerCtrl] Detected Arch-based distro ($DISTRO)."
    bash installers/install-arch.sh
    ;;
  fedora|rhel|centos)
    echo "[RazerCtrl] Detected Fedora-based distro ($DISTRO)."
    bash installers/install-fedora.sh
    ;;
  ubuntu|debian|linuxmint|pop|kali|raspbian)
    echo "[RazerCtrl] Detected Debian-based distro ($DISTRO)."
    bash installers/install-debian.sh
    ;;
  *)
    echo "[RazerCtrl] Unsupported or unknown distro: $DISTRO."
    echo "[RazerCtrl] Attempting to install generic dependencies via pip..."
    pip3 install --user PyQt6 openrazer evdev distro python-uinput
    ;;
esac

echo "[RazerCtrl] Installing Python package in editable mode..."
pip3 install -e .

echo "[RazerCtrl] Installation complete."
echo "[RazerCtrl] IMPORTANT: You may need to log out and back in for group changes (plugdev) to take effect."
echo "[RazerCtrl] Run 'razerctrl' to start the application."
