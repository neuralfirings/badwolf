# Bad Wolf 

Write up on the product: http://blog.nyl.io/dog-treat-dispenser-v3/ 

Folder `pcb` contains the design files for the PCB board that connects your Pi to the Motor. This is not needed for your Raspberry Pi to work. More detailed write up on making custom PCBs [on my blog](http://blog.nyl.io/making-custom-pcbs/).

Folder `cad` is currently empty, but it will contain the Blender file + STLs that makes up the outer casing. This is not needed for your Raspberry Pi to work. More detailed write up to come. 

### Install Node
More info: https://learn.adafruit.com/node-embedded-development/installing-node-dot-js

```shell
pi@raspberrypi ~ $ curl -sLS https://apt.adafruit.com/add | sudo bash
pi@raspberrypi ~ $ sudo apt-get install node
```

### Install PM2 (Process Manager)
More info: https://www.npmjs.com/package/pm2

```shell
pi@raspberrypi ~ $ sudo npm install pm2 -g
```

### Install Firebase
More info: https://www.npmjs.com/package/firebase

```shell
pi@raspberrypi ~ $ sudo npm install firebase
```

### Install Motion
More info: http://www.lavrsen.dk/foswiki/bin/view/Motion/ConfigFileOptions

```shell
pi@raspberrypi ~ $ sudo apt-get install motion
pi@raspberrypi ~ $ sudo nano /etc/default/motion
```

### Install Sound
```shell
pi@raspberrypi ~ $ sudo apt-get install lame
```

### Install AWS
More info: http://aws.amazon.com/sdk-for-node-js/ 

```shell
pi@raspberrypi ~ $ npm install aws-sdk
pi@raspberrypi ~ $ cd ~
pi@raspberrypi ~ $ mkdir .aws
pi@raspberrypi ~ $ cd .aws
pi@raspberrypi ~/.aws $ sudo nano credentials
```

In `credentials`, copy/paste:
```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

Then `Ctrl+X` and `Y` then `Enter` to save file. 


### Set Internet

```shell
pi@raspberrypi ~ $ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

In `wpa_supplicant.conf`, write:

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
        ssid=“YOUR_SSID”
        key_mgmt=WPA-PSK
        psk=“YOUR_PASSWORD”
}
```

Then `Ctrl+X` and `Y` then `Enter` to save file. 

### Bad Wolf Files

```shell
pi@raspberrypi ~ $ cd ~
pi@raspberrypi ~ $ git clone https://github.com/neuralfirings/badwolf.git
pi@raspberrypi ~ $ cd badwolf
```
In the `badwolf` folder, edit the following files:

* edit `startup_mailer.py` include your gmail from/to info
* edit `config/aws-config.json` to include your aws info
* edit `badwolf.js`  include your Firebase info (towards the bottom)

### Start Up Files

```shell
pi@raspberrypi ~ $ sudo nano /etc/rc.local
```
In `rc.local`, copy/paste:

```
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
```

### Reboot
```shell
pi@raspberrypi ~ $ sudo reboot
```

### Frontend
use `frontend/index.html` page to pull the video, audio, and give treats

<!--
### Cyberduck
This is so your user `pi` is corrected permissioned to edit files directly from Cyberduck

```shell
pi@raspberrypi ~ $ sudo chown -R pi badwolf/
```
-->
<!--

# TODO
- figure out how to either dump or keep .swf in motion
- figure out SOUND better
- 
-->
