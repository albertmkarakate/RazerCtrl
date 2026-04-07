# RazerCtrl

Unified Razer device manager and input mapper for Linux.

![RazerCtrl Logo](razerctrl/assets/icons/razerctrl.svg)

## Features

- **Device Management**: Control lighting, DPI, and power settings for Razer devices via `openrazer`.
- **Input Mapping**: Remap keys and buttons using `evdev` and `uinput`.
- **Profile Support**: Save and switch between different configurations.
- **Dependency Checker**: Built-in tool to help install required system drivers and libraries.
- **Modern UI**: Clean PyQt6-based interface with dark mode support.

## Installation

### Automatic Installation

Run the universal installer script:

```bash
git clone https://github.com/username/razerctrl.git
cd razerctrl
chmod +x install.sh
./install.sh
```

### Manual Installation

#### Arch Linux
```bash
sudo pacman -S python-pyqt6 python-evdev openrazer-daemon
yay -S python-openrazer python-uinput
sudo gpasswd -a $USER plugdev
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
