# Install Node
<!-- https://learn.adafruit.com/node-embedded-development/installing-node-dot-js -->
pi@raspberrypi ~ $ curl -sLS https://apt.adafruit.com/add | sudo bash
pi@raspberrypi ~ $ sudo apt-get install node
pi@raspberrypi ~ $ node -v
<!-- should get "v0.12.0" -->

## Install PM2 (Process Manager)
<!-- https://www.npmjs.com/package/pm2 -->
pi@raspberrypi ~ $ sudo npm install pm2 -g

## Install PI-GPIO (Use Node to control the GPIO)
<!-- https://www.npmjs.com/package/rpi-gpio -->
pi@raspberrypi ~ $ sudo npm install rpi-gpio

# Install Firebase
<!-- https://www.npmjs.com/package/firebase -->
pi@raspberrypi ~ $ sudo npm install firebase

# Install AWS
<!-- http://aws.amazon.com/sdk-for-node-js/ -->
pi@raspberrypi ~ $ npm install aws-sdk
pi@raspberrypi ~ $ cd ~
pi@raspberrypi ~ $ mkdir .aws
pi@raspberrypi ~ $ cd .aws
pi@raspberrypi ~ $ sudo nano credentials
<!-- WRITE:
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
-->

# Install Motion
<!-- http://www.lavrsen.dk/foswiki/bin/view/Motion/ConfigFileOptions -->
pi@raspberrypi ~ $ cd ~
pi@raspberrypi ~ $ sudo apt-get install motion
pi@raspberrypi ~ $ sudo nano /etc/default/motion

# Install Sound
pi@raspberrypi ~ $ sudo apt-get install lame

# Set Internet
pi@raspberrypi ~ $ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
<!-- WRITE:
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
        ssid=“YOUR_SSID”
        key_mgmt=WPA-PSK
        psk=“YOUR_PASSWORD”
}
-->

# Bad Wolf Files
copy /home/badwolf/*
<!-- 
edit startup_mailer.py include your gmail from/to info
edit config/aws-config.json to include your aws info
edit badwolf.js  include your Firebase info (towards the bottom)
-->

# Start Up Files
pi@raspberrypi ~ $ sudo nano /etc/rc.local
<!-- WRITE:
# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
  python /home/pi/badwolf/startup_mailer.py &
fi

# Audio Folder
sudo mkdir -m 777 /tmp/badwolfaudio
sudo mkdir -m 777 /tmp/motion 
sleep 10

# Start Listener
cd /home/pi/badwolf && sudo pm2 start /home/pi/badwolf/badwolf.js

# Start Motion
cp /home/pi/badwolf/config/motion_start.conf /etc/motion/motion.conf && sudo service motion restart
sleep 10
cp /home/pi/badwolf/config/motion_default.conf /etc/motion/motion.conf && sudo service motion restart

exit 0
-->

# Reboot
pi@raspberrypi ~ $ sudo reboot

# Frontend
use frontend/index.html page to pull the video, audio, and give treats

---

# TODO
- figure out how to either dump or keep .swf in motion
- figure out SOUND better
- treat.py, audio.js >> treat.js
