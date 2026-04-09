#!/bin/bash
# Setup fake OpenRazer environment for testing
# Based on the OpenRazer CI functional test setup

set -e

echo "Setting up fake OpenRazer environment..."

# The daemon wants the user to be in the plugdev group
sudo addgroup -S plugdev || true
sudo addgroup -S $USER plugdev || true

# 1. Clone openrazer if not exists
if [ ! -d "/tmp/openrazer" ]; then
    echo "Cloning openrazer..."
    git clone https://github.com/openrazer/openrazer.git /tmp/openrazer
fi

cd /tmp/openrazer

# Clean up background processes on exit
trap "pkill -f openrazer-daemon || true; pkill -f create_fake_dev || true; pkill -f dbus-daemon || true" EXIT

# 2. Launch dbus if not already running
if [ -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
    echo "Launching dbus..."
    eval $(dbus-launch --sh-syntax)
    export DBUS_SESSION_BUS_ADDRESS
    export DBUS_SESSION_BUS_PID
fi

# 3. Setup the fake driver
echo "Setting up the fake driver..."
./scripts/ci/setup-fakedriver.sh

# 4. Launch the daemon
echo "Launching the daemon..."
./scripts/ci/launch-daemon.sh

# 5. Wait for the daemon to be ready
echo "Waiting for daemon to be ready..."
sleep 5

# 6. Run a simple check to see if the daemon is alive
echo "Testing daemon..."
./scripts/ci/test-daemon.sh

echo "Fake OpenRazer environment is ready!"
echo "Starting Vite dev server..."

cd /
npm run dev:vite
