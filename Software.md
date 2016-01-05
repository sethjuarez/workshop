# Software

## ML / AI Algorithms
Here are some ML / AI algorithms in C# and Javascript that you may choose to use for your robot or other project. We also encourage you to use your own implementation from Part 1 of the workshop!

### C# #

[NUML](http://numl.net/) - A general purpose machine learning framework

### JavaScript

We'll use a CommonJS wrapper around this DT implementation by @lagodiuk:
https://github.com/lagodiuk/decision-tree-js

Or feel free to experiment with any other learning algorithm you find in NPM.


## Alternate Hardware

### Raspberry Pi 2

Optional: If you want to go fully untethered for your bot, you can load your bot's code on the Raspberry Pi and plug the Arduino into it instead of your laptop. The Pi you received with your kit comes with Win10 by default. It should also work with Raspbian if you prefer.

Note, the community is working on Win 10 IoT Core plugin support for Johnny-Five, so check the Johnny-Five website for future release news. That would allow you to run directly off the GPIO pins instead of having to have the Arduino. (You can also use [rasp-io](https://github.com/nebrius/raspi-io) if you're running Raspbian.)

### Photon

Optional: If you already attended the Nodebots workshop and built a bot using the Photon, you may also use it here. Just add the reflectance array (line sensor) and you can follow along.

## Robot Example Code
Because we have a limited time for this workshop, we have provided working sample robot code in JavaScript using the Johnny-Five library to get you started. If you participated in the Nodebots workshop or just want to build your own, feel free! Your goal is to replace the manual robot control with your ML/AI algorithm to solve the task. 

1. Ensure that you have Node.js and npm installed on your laptop (see [workshop prerequisites](http://prereqs.codemash.org/) for CodeMash mirror)
2. Create a project directory and clone this repo for the sample code (cut and paste works fine too for individual files)
3. Install dependencies using `npm install`
4. Add your algorithm to solve the chosen task
5. Plug in your bot via USB and run `node bot.js` (or whatever you named it)

We have given you three starting points depending on your programming experience and/or time available in the workshop.

1. `bot0-skeleton.js` is a basic Johnny-Five app that shows you how to access the motors and sensor. Everything else is up to you. Your first task is to add some mechanism for driving the bot (forward, backward, turn, etc), probably with `keypress`, and ensure you're reading the sensor data correctly. Then proceed to the tasks listed below for the other starting points.
2. `bot1-drive.js` adds in some basic driving ability to give you a jumpstart. This example sets up a simple `drive()` function that controls the robot's motion by combining `throttle` and `dir` values. You'll need to add in a learner that can train against manual driving input (i.e. store the values of the sensor along with throttle and direction input), generate a model, and use that model to predict the correct way to turn in autonomous mode for any given set of sensor readings.
3. `bot2-learner.js` is if you're running out of time and want a very basic learner implementation to start with. There is still plenty of room to optimize and improve the results. Can you make the robot drive smoother in autonomous mode? Handle a wider variety of path types? Experiment with your inputs and parameters to the Decision Tree implementation. Or swap out the DT library for another learning algorithm you find or write.


