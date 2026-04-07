#!/bin/bash
set -e

echo "[RazerCtrl] Detecting distribution..."
DISTRO=$(python3 -c "import distro; print(distro.id())" 2>/dev/null || cat /etc/os-release | grep "^ID=" | cut -d= -f2 | tr -d '"')

case "$DISTRO" in
  arch|cachyos|manjaro|endeavouros)
    echo "[RazerCtrl] Detected Arch-based distro."
    bash installers/install-arch.sh
    ;;
  fedora|rhel|centos)
    echo "[RazerCtrl] Detected Fedora-based distro."
    bash installers/install-fedora.sh
    ;;
  ubuntu|debian|linuxmint|pop|kali)
    echo "[RazerCtrl] Detected Debian-based distro."
    bash installers/install-debian.sh
    ;;
  *)
    echo "[RazerCtrl] Unsupported distro: $DISTRO. Please install dependencies manually."
    exit 1
    ;;
esac

echo "[RazerCtrl] Installing Python package..."
pip install -e .

echo "[RazerCtrl] Installation complete. Please restart your session if you were added to the 'plugdev' group."
echo "[RazerCtrl] Run 'razerctrl' to start the application."
