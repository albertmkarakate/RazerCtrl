#!/bin/bash
set -e

echo "[RazerCtrl] Detecting distribution..."
# Try to get distro ID without the 'distro' python package first
if [ -f /etc/os-release ]; then
    DISTRO=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    # Handle variants like cachyos, manjaro, etc.
    ID_LIKE=$(grep "^ID_LIKE=" /etc/os-release | cut -d= -f2 | tr -d '"')
else
    DISTRO=$(python3 -c "import distro; print(distro.id())" 2>/dev/null || echo "unknown")
    ID_LIKE=""
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
    if [[ "$ID_LIKE" == *"arch"* ]]; then
        echo "[RazerCtrl] Detected Arch-like distro ($DISTRO)."
        bash installers/install-arch.sh
    elif [[ "$ID_LIKE" == *"debian"* || "$ID_LIKE" == *"ubuntu"* ]]; then
        echo "[RazerCtrl] Detected Debian-like distro ($DISTRO)."
        bash installers/install-debian.sh
    elif [[ "$ID_LIKE" == *"fedora"* ]]; then
        echo "[RazerCtrl] Detected Fedora-like distro ($DISTRO)."
        bash installers/install-fedora.sh
    else
        echo "[RazerCtrl] Unsupported or unknown distro: $DISTRO."
        echo "[RazerCtrl] Attempting to install generic dependencies via pip..."
        pip3 install --user PyQt6 openrazer evdev distro python-uinput
    fi
    ;;
esac

echo "[RazerCtrl] Installing Python package..."
# Handle PEP 668 (externally-managed-environment)
if ! pip3 install -e . 2>/dev/null; then
    echo "[RazerCtrl] System Python is externally managed. Creating a virtual environment with system site packages..."
    # Use --system-site-packages so we can use pacman-installed PyQt6 and OpenRazer
    python3 -m venv --system-site-packages venv
    source venv/bin/activate
    pip install -e .
    
    echo "[RazerCtrl] Creating wrapper script in ~/.local/bin/razerctrl..."
    mkdir -p ~/.local/bin
    cat <<EOF > ~/.local/bin/razerctrl
#!/bin/bash
# Wrapper script for RazerCtrl (C.T.R.L Edition)
PROJECT_DIR="$(pwd)"
if [ -f "\$PROJECT_DIR/venv/bin/razerctrl" ]; then
    "\$PROJECT_DIR/venv/bin/razerctrl" "\$@"
else
    "\$PROJECT_DIR/venv/bin/python" -m razerctrl.main "\$@"
fi
EOF
    chmod +x ~/.local/bin/razerctrl
    export PATH="$HOME/.local/bin:$PATH"
    echo "[RazerCtrl] Added ~/.local/bin to PATH for this session."
else
    echo "[RazerCtrl] Package installed successfully via pip."
fi

echo "[RazerCtrl] Installation complete."
echo "[RazerCtrl] IMPORTANT: You may need to log out and back in for group changes (plugdev) to take effect."
echo "[RazerCtrl] If 'razerctrl' command is not found, ensure ~/.local/bin is in your PATH."
echo "[RazerCtrl] Run 'razerctrl' to start the application."
