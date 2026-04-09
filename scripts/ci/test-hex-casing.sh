#!/bin/bash
# Check for hex casing issues
# Inspired by openrazer CI

cd "$(dirname "$0")/../.."

echo "Checking for hex casing issues..."
# Find any hex values with uppercase letters (e.g. 0x1A instead of 0x1a)
# Exclude binary files and .git
grep -rI "0x[0-9a-fA-F]*[A-F][0-9a-fA-F]*" razerctrl/ | grep -v "Binary file"

if [ $? -eq 0 ]; then
    echo "Found uppercase hex values. Please use lowercase hex values."
    exit 1
else
    echo "Hex casing check passed."
    exit 0
fi
