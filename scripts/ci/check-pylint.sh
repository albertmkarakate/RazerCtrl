#!/bin/bash
# Check with pylint for errors
# Inspired by openrazer CI

cd "$(dirname "$0")/../.."

echo "Running pylint..."
pylint razerctrl/

if [ $? -eq 0 ]; then
    echo "Pylint check passed."
else
    echo "Pylint check failed."
    exit 1
fi
