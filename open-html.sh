#!/bin/bash

# Get the current directory
DIR=$(pwd)

# Define the HTML file path
FILE="$DIR/index.html"

# Check if index.html exists
if [ -f "$FILE" ]; then
    echo "Opening index.html in your default browser..."
    
    # Open in the default browser based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$FILE"  # Linux
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$FILE"  # macOS
    elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start "" "$FILE"  # Windows
    else
        echo "Unsupported OS. Open the file manually."
    fi
else
    echo "Error: index.html not found in $DIR"
fi
