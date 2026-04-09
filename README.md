# RazerCtrl (Unbreakable Edition)

Unified Razer device manager for Linux, powered by a high-performance Rust backend and React frontend.

![RazerCtrl Logo](razerctrl/assets/icons/razerctrl.svg)

## Features

- **Rust Backend**: Memory-safe, high-performance core for hardware control.
- **Tauri Architecture**: Modern desktop app architecture for a lightweight and secure experience.
- **Device Management**: Control lighting, DPI, and power settings for Razer devices via OpenRazer D-Bus.
- **Input Mapping**: Remap keys and buttons using `evdev` and `uinput`.
- **Macro Recording**: Record and assign complex macros to your device buttons.
- **Universal Installer**: Distro-aware installer for Arch, Fedora, and Debian.

## Installation

### Automatic Installation

Run the universal installer script:

```bash
git clone https://github.com/username/razerctrl.git
cd razerctrl
bash install.sh
```

### AppImage Build

To build a portable AppImage:

```bash
bash build_appimage.sh
```
*Note: Requires `fuse2` or `fuse3` to be installed on your system.*

## Manual Installation

#### Arch Linux / CachyOS
```bash
sudo pacman -S python-pyqt6 python-evdev openrazer-daemon python-distro
yay -S python-openrazer python-uinput
sudo gpasswd -a $USER plugdev
systemctl --user enable --now openrazer-daemon
```

#### Fedora
```bash
sudo dnf install python3-qt6 python3-evdev openrazer-daemon python3-openrazer
pip3 install --user python-uinput distro
sudo gpasswd -a $USER plugdev
```

#### Debian/Ubuntu
```bash
sudo apt install python3-pyqt6 python3-evdev openrazer-meta python3-openrazer
pip3 install --user python-uinput distro
sudo gpasswd -a $USER plugdev
```

## Usage

Run the application:
```bash
razerctrl
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Note: This application requires the `openrazer` daemon to be installed and running.*
