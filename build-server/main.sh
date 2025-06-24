#!/bin/bash

# Export the Git repository URL correctly
export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

# Clone the repo to the output directory
git clone "$GIT_REPOSITORY_URL" /home/app/output

# Start the Node.js script
exec node script.js
