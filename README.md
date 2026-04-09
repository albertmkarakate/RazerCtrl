# RazerCtrl

> A production-ready Linux desktop application for managing Razer peripherals — featuring RGB lighting control, DPI tuning, input remapping, macro recording, and profile management.

<p align="center">
  <img src="razerctrl/assets/icons/razerctrl.svg" alt="RazerCtrl Logo" width="120" />
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green" />
  <img alt="Python" src="https://img.shields.io/badge/python-3.10%2B-blue" />
  <img alt="Platform" src="https://img.shields.io/badge/platform-Linux-lightgrey" />
  <img alt="OpenRazer" src="https://img.shields.io/badge/requires-OpenRazer-red" />
</p>

---

## Features

| Feature | Description |
|---|---|
| 🎨 **Lighting Control** | Set RGB effects, colors, and brightness per zone |
| 🖱️ **DPI & Performance** | Adjust DPI stages and polling rates |
| 🔁 **Input Remapping** | Arbitrary button-to-key / button-to-macro mappings via `input-remapper` |
| 🎤 **Macro Recording** | Real-time keystroke capture with timeline editing |
| 💾 **Profile System** | Save and load device configs as JSON profiles |
| 🔌 **Device Detection** | Auto-detects Razer devices via OpenRazer D-Bus |
| 🐧 **Distro-Aware Installer** | Supports Arch, Fedora, and Debian-based distros |

### Supported Device Types

<p align="center">
  <img src="razerctrl/assets/devices/keyboard_generic.svg" alt="Keyboard" width="60" title="Keyboard" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/mouse_generic.svg" alt="Mouse" width="60" title="Mouse" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/headset_generic.svg" alt="Headset" width="60" title="Headset" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/mousepad_generic.svg" alt="Mousepad" width="60" title="Mousepad" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/keypad_generic.svg" alt="Keypad" width="60" title="Keypad" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/controller_generic.svg" alt="Controller" width="60" title="Controller" />
  &nbsp;&nbsp;
  <img src="razerctrl/assets/devices/accessory_generic.svg" alt="Accessory" width="60" title="Accessory" />
</p>

---

## Architecture

```
RazerCtrl
├── razerctrl/           # Python application package
│   ├── backend/         # FastAPI backend (uvicorn)
│   ├── core/            # Device & hardware logic
│   ├── frontend/        # React + Vite UI
│   ├── ui/              # PyQt6 UI components
│   ├── utils/           # Shared utilities
│   └── assets/          # Icons, device SVGs, .desktop file
└── src/                 # TypeScript/React source (top-level Vite app)
```

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python FastAPI + uvicorn |
| Hardware | OpenRazer (D-Bus) |
| Remapping | input-remapper (uinput) |
| Packaging | setuptools / pyproject.toml |

---

## Requirements

- Linux kernel (any modern distribution)
- Python **3.10+**
- Node.js **16+** and npm
- [OpenRazer](https://openrazer.github.io/) drivers and daemon
- [input-remapper](https://github.com/sezanzeb/input-remapper)

---

## Installation

### ⚡ Automatic (Recommended)

Clone the repo and run the universal installer — it detects your distro (Debian/Ubuntu, Arch, Fedora) and sets everything up automatically:

```bash
git clone https://github.com/albertmkarakate/RazerCtrl.git
cd RazerCtrl/razerctrl
chmod +x install.sh
./install.sh
```

Then **reboot** your system for group changes to take effect.

After reboot, start the backend service:

```bash
systemctl --user start razerctrl-backend
```

---

### 🐧 Manual Installation

#### Arch Linux / CachyOS / Manjaro

```bash
sudo pacman -S python-pyqt6 python-evdev openrazer-daemon python-distro nodejs npm
yay -S python-openrazer python-uinput
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
systemctl --user enable --now openrazer-daemon
```

#### Fedora

```bash
sudo dnf install python3-qt6 python3-evdev openrazer-daemon python3-openrazer nodejs npm
pip3 install --user python-uinput distro fastapi uvicorn
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
```

#### Debian / Ubuntu

```bash
sudo apt install python3-pyqt6 python3-evdev openrazer-meta python3-openrazer nodejs npm
pip3 install --user python-uinput distro fastapi uvicorn
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
```

After installing system dependencies (any distro):

```bash
# Install Python backend dependencies
pip3 install -r razerctrl/backend/requirements.txt

# Build the frontend
cd razerctrl/frontend
npm install
npm run build
cd ../..

# Enable the backend service
systemctl --user daemon-reload
systemctl --user enable --now razerctrl-backend
```

---

### 📦 Install as Python Package

```bash
pip install .
razerctrl
```

---

## Usage

```bash
# Start the app (after install)
razerctrl

# Development mode — run backend and frontend separately
systemctl --user start razerctrl-backend   # starts FastAPI on :8000
cd razerctrl/frontend && npm run dev        # starts Vite dev server

# Top-level Vite app (for UI development)
npm run dev

# Simulate OpenRazer devices (no hardware required)
npm run dev:fake
```

---

## Development

```bash
# Clone
git clone https://github.com/albertmkarakate/RazerCtrl.git
cd RazerCtrl

# Install Node dependencies
npm install

# Run linting
npm run lint          # TypeScript check
npm run lint:python   # Python formatting, pylint, vermin, hex casing

# Build frontend
npm run build
```

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

---

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/albertmkarakate/RazerCtrl/issues) or submit a pull request.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

> **Note:** RazerCtrl requires the `openrazer` daemon to be installed and running. You must also be a member of the `plugdev` group (log out and back in, or reboot, after adding yourself).