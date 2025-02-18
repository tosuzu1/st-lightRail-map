#!/bin/bash
source ${HOME}/.bashrc
KIOSK_URL="127.0.0.1:1234/"
cd /home/felix/Desktop/st-lightRail-map

npm start &
#/home/felix/.nvm/versions/node/v23.8.0/bin/npm start &
# Wait for services to come online.
sleep 10

echo 'Starting Chromium...'
/usr/bin/chromium-browser 127.0.0.1:1234/ --noerrdialogs --disable-infobars --kiosk  --start-maximized
