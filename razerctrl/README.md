# RazerCtrl

A complete, open-source Linux desktop application for configuring Razer (and other supported) peripherals.

## Features

- **Device Management**: Automatic detection of Razer devices via OpenRazer.
- **Lighting Control**: Set effects, colors, and brightness for various zones.
- **Performance Tuning**: Adjust DPI (including stages) and polling rates.
- **Advanced Remapping**: Arbitrary button-to-key or button-to-macro mappings via `input-remapper`.
- **Macro Recording**: Real-time keystroke capture and timeline editing.
- **Profile System**: Save and load device configurations as JSON profiles.

## Architecture

- **Frontend**: React + Vite (Dark Industrial UI)
- **Backend**: Python FastAPI
- **Hardware Layer**: OpenRazer (D-Bus)
- **Remapping Layer**: input-remapper (uinput)

## Installation

1. Clone the repository.
2. Run the installer:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Reboot your system.
4. The backend starts automatically via systemd.
5. Run the application:
   ```bash
   razerctrl
   ```

## Requirements

- Linux Kernel
- OpenRazer drivers
- input-remapper
- Python 3.8+
- Node.js 16+
