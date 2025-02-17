#!/bin/bash
source ${HOME}/.bashrc
KIOSK_URL="127.0.0.1:1234/"
cd /home/felix/Desktop/st-lightRail-map

npm start &

# Wait for services to come online.
sleep 10

echo 'Starting Chromium...'
/usr/bin/chromium-browser $KIOSK_URL --noerrdialogs --disable-infobars --kiosk --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar --start-maximized