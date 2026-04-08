# RazerCtrl (C.T.R.L Edition)

Unified Razer device manager and input mapper for Linux.

![RazerCtrl Logo](razerctrl/assets/icons/razerctrl.svg)

## Features

- **C.T.R.L Branding**: New high-tech interface and icon design.
- **Device Management**: Control lighting, DPI, and power settings for Razer devices via `openrazer`.
- **Input Mapping**: Launch and control presets with `input-remapper` from inside RazerCtrl.
- **Macro Recording**: Record and assign complex macros to your device buttons.
- **Profile Support**: Save and switch between different configurations.
- **Universal Installer**: Distro-aware installer for Arch, Fedora, and Debian.
- **AppImage Support**: Build portable executables that run on any distribution.

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
sudo pacman -S python-pyqt6 python-evdev openrazer-daemon python-distro input-remapper
yay -S python-openrazer python-uinput
sudo gpasswd -a $USER plugdev
systemctl --user enable --now openrazer-daemon
```

#### Fedora
```bash
sudo dnf install python3-qt6 python3-evdev openrazer-daemon python3-openrazer input-remapper
pip3 install --user python-uinput distro
sudo gpasswd -a $USER plugdev
```

#### Debian/Ubuntu
```bash
sudo apt install python3-pyqt6 python3-evdev openrazer-meta python3-openrazer input-remapper
pip3 install --user python-uinput distro
sudo gpasswd -a $USER plugdev
```

## Usage

Run the application:
```bash
razerctrl
```

### Input Mapper workflow (recommended)

1. Open the **Input Mapper** page in RazerCtrl and click **Open Input Remapper UI**.
2. In Input Remapper, select your device and create a preset.
3. Add mappings (or macros) in the Output field and click **Apply**.
4. Back in RazerCtrl, use **Start Preset** / **Stop Injection** for quick control.

Useful shortcuts in Input Remapper:

- `Ctrl + Del`: stop injection
- `Ctrl + R`: refresh devices
- `Ctrl + Q`: quit the UI

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Note: This application requires the `openrazer` daemon to be installed and running.*
