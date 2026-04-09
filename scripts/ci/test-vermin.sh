#!/bin/bash
# Check for Python version compatibility using vermin
# Inspired by openrazer CI

cd "$(dirname "$0")/../.."

echo "Running vermin..."
vermin -t=3.10- razerctrl/

if [ $? -eq 0 ]; then
    echo "Vermin check passed."
else
    echo "Vermin check failed."
    exit 1
fi
