#!/bin/bash
# Check the formatting of the python code using autopep8
# Inspired by openrazer CI

cd "$(dirname "$0")/../.."

echo "Checking Python formatting with autopep8..."
autopep8 --diff --recursive --exit-code razerctrl/

if [ $? -eq 0 ]; then
    echo "Formatting check passed."
else
    echo "Formatting check failed. Run 'autopep8 --in-place --recursive razerctrl/' to fix."
    exit 1
fi
