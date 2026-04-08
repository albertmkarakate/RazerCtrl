#!/bin/bash
set -e

echo "== RazerCtrl (Unbreakable Edition) Installer =="

# Detect distro
if grep -qi arch /etc/os-release; then
    DISTRO="arch"
elif grep -qi fedora /etc/os-release; then
    DISTRO="fedora"
elif grep -qi debian /etc/os-release || grep -qi ubuntu /etc/os-release; then
    DISTRO="debian"
else
    echo "Unsupported distro. Please install dependencies manually."
    exit 1
fi

echo "Detected Distro: $DISTRO"

# Install system dependencies
case $DISTRO in
    "arch")
        echo "Installing Arch dependencies..."
        sudo pacman -S --needed \
            openrazer-daemon \
            python-openrazer \
            libappindicator-gtk3 \
            webkit2gtk \
            base-devel \
            curl \
            wget \
            openssl \
            dbus
        ;;
    "fedora")
        echo "Installing Fedora dependencies..."
        sudo dnf install -y \
            openrazer \
            python3-openrazer \
            webkit2gtk3-devel \
            openssl-devel \
            curl \
            wget \
            dbus-devel \
            libappindicator-gtk3-devel
        ;;
    "debian")
        echo "Installing Debian/Ubuntu dependencies..."
        sudo apt update
        sudo apt install -y \
            openrazer-daemon \
            python3-openrazer \
            libwebkit2gtk-4.0-dev \
            build-essential \
            curl \
            wget \
            libssl-dev \
            libgtk-3-dev \
            libappindicator3-dev \
            librsvg2-dev
        ;;
esac

# Add user to plugdev group
echo "Adding $USER to plugdev group..."
sudo gpasswd -a $USER plugdev || true

# Enable and start openrazer-daemon
echo "Enabling OpenRazer daemon..."
systemctl --user daemon-reexec || true
systemctl --user enable openrazer-daemon || true
systemctl --user start openrazer-daemon || true

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "Rust not found. Installing via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

echo "Installing Node.js dependencies..."
npm install

echo "== Installation Complete =="
echo "You may need to log out and log back in for group changes to take effect."
echo "To start development: npm run tauri dev"
