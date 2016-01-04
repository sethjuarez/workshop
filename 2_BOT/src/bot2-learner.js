var five = require("johnny-five");
var keypress = require("keypress");
var dt = require("./decision-tree");

const SENSOR_PIN = 4;
const SPEED = 35;
const TURN_SPEED = 10;

var board = new five.Board();
var motor1, motor2, eyes;

var throttle = 0;
var dir = 0;

var calibrating = true;
var training = false;
var autopilot = false;

var trainingData = [];
var learner;

function drive() {
  // Combine throttle and direction into motor commands
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

// Helper functions to control both motors
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
  var raPower = new five.Pin(SENSOR_PIN);
  raPower.high();

  // Instantiate our reflectance array
  eyes = new five.IR.Reflect.Array({
    emitter: 13,
    pins: ["A0", "A1", "A2"],
    freq: 25
  });

  // Calibrate reflectance array
  eyes.calibrateUntil(function() {
    return !calibrating;
  });

  // Print out the calibrated data we get back from the reflectance array
  eyes.on("calibratedData", function() {
    var input = {
      "left"   : this.values[0],
      "center" : this.values[1],
      "right"  : this.values[2]
    }

    // If training mode, store human input and sensor values
    if (!calibrating && training && throttle > 0) {
      input.dir = dir;
      trainingData.push(input);
    }

    // IF autopilot, use learner to determine direction
    if (autopilot && learner) {
      throttle = SPEED;
      dir = learner.predict(input);
      drive();
    }

  });

  console.log("Calibrate line sensor by moving around black/white areas.");
  console.log("Press 'space' when finished calibrating.");
  console.log("Use arrow keys to drive, space to stop.");
  console.log("Press 't' to toggle training mode on and off.");
  console.log("Press 'a' to toggle autopilot driving.");
  console.log("Press 'q' to quit.");

  // Now that bot is ready, listen for input
  process.stdin.on("keypress", controller);

});

// Adjust throttle/direction with arrow keys
function controller(ch, key) {
  if (key) {
    if (key.name === "up") {
      throttle = SPEED;
      dir = 0;
    }

    if (key.name === "down") {
      throttle = SPEED * -1;
    }

    if (key.name === "left") {
      dir = TURN_SPEED * -1;
    }

    if (key.name === "right") {
      dir = TURN_SPEED;
    }

    if (key.name === "space") {
      throttle = 0;
      dir = 0;

      // Stop calibration if running
      if (calibrating) {
        calibrating = false;
        console.log("\nCalibration complete");        
      }

      // Stop training
      if (training) {
        training = false;
        console.log("Generating new decision tree");

        var config = {
          trainingSet: trainingData,
          categoryAttr: "dir",
          ignoredAttributes: []
        };
        learner = new dt.DecisionTree(config);
      }

      // Stop autopilot mode
      autopilot = false;
    }

    // Begin training mode
    if (key.name === "t") {
      training = true;
      learner = null;
      trainingData = [];
      console.log("\nBegin training mode");
    }

    // Begin autopilot mode
    if (key.name === "a") {
      autopilot = true;
      console.log("\nBegin autopilot mode");
    }

    if (key.name === "q") {
      process.exit();
    }

    // After changing throttle/dir, apply to motors
    drive();
  }
}

// Initialize keypress 
keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
