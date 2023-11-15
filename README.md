# i-cube-smart-monochrome

This is a firmware and controller pair for
the [iCubeSmart 3D8-S-DIP (monochrome) LED cube](https://www.amazon.fr/iCubeSmart-danimation-%C3%A9lectronique-adolescents-dapprentissage/dp/B07GRDRPST/ref=sr_1_2?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&keywords=iCubeSmart+3D8-S-DIP&qid=1699997014&sr=8-2) (
DIY).

iCubeSmartMonochrome makes it possible to write - probably algorithmic - animations using Typescript and play them in
the cube utilizing the custom firmware provided here.
The animation player can be controlled through JSON requests.

## Precautions

### iCubeSmart

I couldn't find any usable webpage when I bought my cube, BUT they started one
since: [iCubeSmart.com](https://icubesmart.com/)

### Target audience

Since you bought or consider buying a DIY LED cube, I presume you are familiar with welding and have limitless patience.
Welding experience is not that important though, you will learn it by time you finish the cube regardless you wanted to
or not.

To use this controller you will need some programming / IT skills.

Also, I started writing this project for fun and to be used by myself.
It is mostly stable, but there might be some bugs.

#### Firmware

You have to compile the firmware yourself and upload it to your cube.
I have created the required scripts, but you might need some troubleshooting skills (and patience)

#### Controller

The controller is a simple Node.js app that provides a web interface.
You have to build it and daemonize it yourself.

## Why?

### Prebuilt

The cube itself comes with prebuilt animations, I wanted my own ones.
Also, I wanted more control over the played animations, e.g. parameters.

### From scratch

There are a few controllers that are able to generate animations, but they are Microsoft based and not providing a
webservice to control them.
I wanted mine to run as a daemon, so it could be integrated with home automation.

### Firmware

The firmwares I found didn't support 8 brightness levels and the baud rate was not high enough.

## Compatibility

The suggested OS for this project is Debian / Raspbian.

For development, creating animations I suggest using a desktop computer. It will be more convenient.

## Installation

First clone the project.

```shell
git clone https://github.com/gulyo/i-cube-smart-monochrome.git i-cube-smart-monochrome
```

### Firmware

#### Dependencies

You need:

- _[sdcc](https://sdcc.sourceforge.net/)_ to compile the firmware
- _[stcgal](https://github.com/grigorig/stcgal)_ to upload the firmware

```shell
sudo apt install sdcc
pip3 install stcgal
```

#### Notice

This process overwrites the firmware of your 8051 microcontroller.
Should you want to go back to factory default, create a backup first.

#### Compile & Upload

Go to the project folder.

Your cube should have come with a USB to ttl adapter.
Connect it to your cube and your computer.
_Consult the documentation regarding the pins._

Before uploading, check the *upload.sh* file and adjust `/dev/ttyUSB0` according to your setup.

```shell
cd firmware
./compile.sh
```

During the upload *stcgal* will give you instructions when to power the cube to do the flashing.

That's it, your cube should have the required firmware now.

### Controller

As serial port access in Node.js is architecture dependent, you must build your project on the appropriate architecture.
E.g. if you plan on creating animations on your desktop but run it on a Raspberry Pi, you have to build it twice.

Go to the project library.

```shell
nvm install
npm install
npm run build
```

The built application will be located in the *bundle* folder.

You can configure your controller by edition *bundle/config.json*

```json
{
	"serialPort": "/dev/ttyUSB0",
	"listPorts": false,
	"service": {
		"port": 8888,
		"url": {
			"start": "/start",
			"stop": "/stop",
			"list": "/"
		}
	}
}
```

Use Node to run the controller:

```shell
cd bundle
node iCubeSmart.js
```

#### Running as a service

```shell
sudo systemctl edit --force --full i-cube-smart.service
```

Supposing you used */opt/i-cube-smart-monochrome* as your project folder, your service file could be something like
this:

```text
[Unit]
Description=iCubeSmart controller service
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
ExecStart=node bundle/iCubeSmart.js
WorkingDirectory=/opt/i-cube-smart-monochrome/
Restart=always
RestartSec=1

[Install]
WantedBy=default.target
```

## Usage

Once the controller is running, you can send http requests to list, start or stop animations.
There is an [example file](callExamples/serviceCalls.http) I used during development included in this project.

### Home Assistant

If you have a working [Home Assistant](https://www.home-assistant.io/) installation, you can add *rest_command* entities
that can be used in scripts and automations.

Here is an example configuration:

*configuration.yaml*

```yaml
rest_command: !include rest_command.yaml
```

*rest_command.yaml*

```yaml
i_cube_smart_stop:
  url: http://your.controller.host:8888/stop
  method: POST
  content_type: 'application/json'


i_cube_smart_matrix:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "Matrix", "arg": {"count": 16, "backLight": false, "counterMod": 8}}'

i_cube_smart_nibbles:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "Nibbles"}'

i_cube_smart_night_rider:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "NightRider"}'


i_cube_smart_pulse_waves:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "PulseWaves"}'


i_cube_smart_shrinking_cube:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "ShrinkingCube"}'


i_cube_smart_stars:
  url: http://your.controller.host:8888/start
  method: POST
  content_type: 'application/json'
  payload: '{"calculator": "Stars", "arg": {"count": 32, "backLight": false, "counterMod": 6}}'

```