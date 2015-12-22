var five = require("johnny-five");
var keypress = require("keypress");
var Barcli = require("barcli");


var board = new five.Board();
var motor1, motor2;
var throttle = 20;
var dir = 0;
var calibrating = true;

var eyes;

function drive() {
  if (throttle > 255) { throttle = 255; }
  if (throttle < -255) { throttle = -255; }

  if (dir < -50) { dir = -50; }
  if (dir > 50) { dir = 50; }


  if ( throttle > 0) {
    motor1.forward(throttle - dir);
    motor2.forward(throttle + dir);    
  } else if (throttle < 0) {
    motor1.reverse((throttle - dir) * -1);
    motor2.reverse((throttle + dir) * -1);
  } else {
    stop();
  }
}

function start() {
  motor1.start();
  motor2.start();
}

function stop() {
  motor1.stop();
  motor2.stop();
}


board.on("ready", function() {
  // Use pre-packaged shield config for Pololu
  var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

  // Instantiate the two motors
  // Keep in mind that "forward" and "reverse" are arbitrary labels.
  // If your motor is turning in the wrong direction you can just switch
  // the poles on the motor. Consider a robot with two motors connected
  // directly to the drive wheels. For your bot to go forward, one should
  // turn clockwise and the other should turn counter-clockwise. Switch
  // the poles on one of those motors so that you can use forward()
  // on both and have them work together.

  motor1 = new five.Motor(configs.M1);
  motor2 = new five.Motor(configs.M2);


  // Turn on the reflectance array (line sensor)
  // Normally you'd attach to 5v, but that header is
  // covered and in use by our motor driver
  var raPower = new five.Pin(4);
  raPower.high();

  // Instantiate our reflectance array
  eyes = new five.IR.Reflect.Array({
    emitter: 13,
    pins: ["A0", "A1", "A2"],
    freq: 25
  });

  eyes.calibrateUntil(function() {
    return !calibrating;
  });

  var range = [0, 1000];
  var graph1 = new Barcli({
    label: "Sensor 1",
    range: range,
  });
  var graph2 = new Barcli({
    label: "Sensor 2",
    range: range,
  });
  var graph3 = new Barcli({
    label: "Sensor 3",
    range: range,
  });

  // Print out the calibrated data we get back from the reflectance array
  eyes.on("calibratedData", function() {
    if (!calibrating) {
      graph1.update(this.values[0]);
      graph2.update(this.values[1]);
      graph3.update(this.values[2]);
    }
  });

  // Inject components into REPL for testing purposes
  board.repl.inject({
    motor1: motor1,
    motor2: motor2,
    start: start,
    stop: stop,
    eyes: eyes
  });

});

// Adjust throttle/direction with arrow keys
function controller(ch, key) {
  if (key) {
    if (key.name === "up") {
      throttle += 5;
    }

    if (key.name === "down") {
      throttle -= 5;
    }

    if (key.name === "left") {
      dir -= 5;
    }

    if (key.name === "right") {
      dir += 5;
    }

    if (key.name === "space") {
      throttle = 0;
      dir = 0;
    }

    if (key.name === "c") {
      calibrating = false;
    }

    drive();
  }
}

// Initialize keypress 
keypress(process.stdin);
process.stdin.on("keypress", controller);
process.stdin.setRawMode(true);
process.stdin.resume();
