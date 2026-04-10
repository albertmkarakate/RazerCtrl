# 🟢 NeonDesk Control (NeonSuite)

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/react-19-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenRazer](https://img.shields.io/badge/driver-OpenRazer-green.svg)](https://openrazer.github.io/)

A high-fidelity, open-source Linux desktop suite for professional configuration of Razer peripherals and hardware ecosystems. NeonDesk combines a premium, neon-accented React interface with a high-performance FastAPI backend to provide total control over your desk setup.

---

## ✨ Features

- 🖱️ **Device Ecosystem**: Automatic detection and management of Razer mice, keyboards, and headsets via OpenRazer.
- 🌈 **Chroma Studio**: Advanced multi-layer lighting editor with real-time hardware synchronization.
- ⚡ **Performance Tuning**: Granular DPI adjustment (with custom stages) and high-frequency polling rate control.
- ⌨️ **Advanced Remapping**: Powerful button-to-key and button-to-macro mappings powered by `input-remapper`.
- ⏺️ **Macro Engine**: Real-time keystroke recording with a visual timeline editor.
- 📁 **Profile Management**: Cloud-ready JSON profile system for game-specific configurations.
- 🌐 **Remote Node Sync**: Synchronize lighting across multiple machines on your local network.

---

## 🏗️ Architecture

NeonDesk is built with a modern, decoupled architecture:

- **Frontend**: React 19 + Vite + Tailwind CSS (Industrial Dark Aesthetic)
- **Backend**: Python 3.8+ FastAPI (Asynchronous Hardware Interface)
- **Hardware Layer**: OpenRazer D-Bus API
- **Input Layer**: `input-remapper` (uinput integration)

---

## 🚀 Getting Started

### Prerequisites

Before installing, ensure you have the following drivers installed on your system:

1. **OpenRazer**: [Installation Guide](https://openrazer.github.io/#download)
2. **input-remapper**: [Installation Guide](https://github.com/sezanzeb/input-remapper)

### Quick Installation (Recommended)

Run the universal installer to set up dependencies, groups, and system services automatically:

```bash
git clone https://github.com/your-username/neondesk-control.git
cd neondesk-control
chmod +x install.sh
./install.sh
```

> **Note**: A system reboot is required after the first installation to apply user group changes (`plugdev` and `input`).

---

## 🛠️ Manual Installation

If you prefer to set up the environment manually, follow the steps for your distribution:

### 1. Install System Dependencies

#### **Arch Linux / CachyOS**
```bash
sudo pacman -S openrazer-meta input-remapper python-pip nodejs npm
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
```

#### **Fedora**
```bash
sudo dnf install openrazer-meta input-remapper python3-pip nodejs npm
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
```

#### **Debian / Ubuntu**
```bash
sudo apt update
sudo apt install openrazer-meta input-remapper python3-pip nodejs npm
sudo gpasswd -a $USER plugdev
sudo gpasswd -a $USER input
```

### 2. Setup Backend & Frontend

```bash
# Install Python backend package
pip3 install -e backend/razerctrl

# Install frontend dependencies and build
cd frontend
npm install
npm run build
```

---

## 📡 Remote Node Sync

NeonDesk supports multi-device synchronization. You can run a lightweight receiver on other machines to act as remote lighting nodes.

1. **On the Remote Node**:
   ```bash
   pip install flask openrazer-python
   # Run the receiver
   razerctrl-remote
   ```
2. **In NeonDesk**:
   Navigate to **Studio**, enter the remote node's IP in the Inspector, and toggle **External Sync**.

---

## ❓ Troubleshooting

- **Device not detected**: Ensure `openrazer-daemon` is running and your user is in the `plugdev` group.
- **Permissions Error**: Run `sudo gpasswd -a $USER plugdev` and reboot.
- **UI not loading**: Check if the backend is running: `systemctl --user status razerctrl-backend`.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ for the Linux Gaming Community</p>
