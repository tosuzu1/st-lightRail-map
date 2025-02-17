#!/bin/bash

KIOSK_URL="127.0.0.1:1234/"

npm start

# Wait for services to come online.
sleep 10

echo 'Starting Chromium...'
/usr/bin/chromium-browser $KIOSK_URL --noerrdialogs --disable-infobars --kiosk --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar --start-maximized