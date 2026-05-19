#!/bin/bash

# RazerCtrl Installer for Linux

echo "Starting RazerCtrl installation..."

# 1. Check for system dependencies
echo "Checking system dependencies..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y openrazer-meta input-remapper python3-pip nodejs npm
elif command -v pacman &> /dev/null; then
    sudo pacman -Syu --noconfirm openrazer-meta input-remapper python-pip nodejs npm
else
    echo "Unsupported package manager. Please install openrazer-meta, input-remapper, python3-pip, nodejs, and npm manually."
fi

# 2. Add user to groups
echo "Adding user to plugdev and input groups..."
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input

# 3. Install Python dependencies
echo "Installing RazerCtrl package and dependencies..."
pip3 install -e .

# 4. Install Frontend dependencies and build
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# 5. Create systemd user service
echo "Setting up systemd user service..."
mkdir -p ~/.config/systemd/user/
cat <<EOF > ~/.config/systemd/user/razerctrl-backend.service
[Unit]
Description=RazerCtrl Backend API
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStart=$(which razerctrl-api)
Restart=always

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable razerctrl-backend.service

echo "--------------------------------------------------"
echo "RazerCtrl installation complete!"
echo "Please REBOOT your system for group changes to take effect."
echo "After reboot, start the backend with:"
echo "systemctl --user start razerctrl-backend"
echo "--------------------------------------------------"
