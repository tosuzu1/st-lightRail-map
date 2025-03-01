#!/bin/bash
source ${HOME}/.bashrc
KIOSK_URL="127.0.0.1:1234/"

# Wait for services to come online.
sleep 10

echo 'Starting Chromium...'
/usr/bin/chromium-browser 127.0.0.1:1234/ --noerrdialogs --disable-infobars --kiosk  --start-maximized
