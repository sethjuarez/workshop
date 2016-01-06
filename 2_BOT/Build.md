# Let's Build a Robot!

## Robot Chassis

You have a simple robot chassis kit that you'll need to assemble.

We have pre-soldered almost all the components for you (due to lack of time for workshop)
but we wanted to give you a chance to have some soldering experience in case you've never
soldered before! So one of the first things you'll need to do is solder the red and black
wires onto the motors included with your kit.
We'll give a brief demonstration in the workshop, but feel free to grab one of us if you have problems.

But where do I solder the wires? Good question. There are two copper tabs on each motor. You need to connect a black and a red wire to each motor. It doesn't matter which tab--the only difference is which way the motor spins. You can compensate by which terminals you connect the motor to later. (Or in software.)

Once you have your motor wires soldered, proceed with assembling the robot kit. For this workshop, you won't need the wheel encoder--the small disk with little holes in it. If you had a wheel encoder sensor, you could place it by the disk to count revolutions and have more accurate driving.

## Adding the Brains

Once the kit is assembled, you need to place the supplied Arduino on your bot. You can use double sided foam tape or zip ties to attach it. (You might want to wait until you get a working bot to permanently affix the board.) The Arduino must be flashed with the Standad Firmata firmware to work with the Johnny-Five library. We've taken care of that for you by pre-flashing all the boards for the workshop.

## Adding the Motor Controller

The motor controller is a piece of hardware that simplifies your interaction with the motors. The one we are using for the workshop is designed to attach directly to your Arduino for a nice compact installation.

Although the Arduino will be powered via the USB connection to your laptop, you'll have to use the battery pack to power your motors. Insert the batteries and attach the red wire to `vin` screw terminal on the motor controller. Attach the black wire to `gnd`. Then attach the red and black wires of one motor to the two M1 terminals and the wires from the second motor to M2. The order (red/black) depends on which tab you soldred the wires to. If your robot drives in circles, just switch one of the pairs.

Note: we don't have many extra batteries, so you may want to disconnect one of the battery wires when you're not actually running your bot. (Or go buy more batteries in the gift shop?)

## Connecting the Line Sensor

We're using a reflectance sensor array as a "line sensor". It is designed to return a calibrated value between 0 and 1000 to indicate white and black respectively. The sensor needs to be mounted close to the ground (a few mm). You can use twist ties as an easy way to attach the sensor array to your chassis. Or go out to the "Factory" and get creative with some of the other build materials.

The Line sensor has five pins that need to be connected to your Arduino. Normally you'd connect `vcc` to the Arduino `5V` pin, but it's covered by the motor shield. Instead, attach it to a digital pin (e.g. pin 4) and we'll just turn it `HIGH` in software to send it 5V. Connect the sensor's `gnd` pin to one of the remaining exposed `gnd` pins on your Arduino. The remaining three pins for each individual sensor of the array needs to be connected to an analog pin on the Arduino. (e.g. "A0", "A1", and "A2")

Note that the sensor needs to be calibrated before it returns correct values. In the sample code you'll see where we start the sensor out in calibration mode and you'll need to exit that mode (either after a specific amount of time, or based on user input).

