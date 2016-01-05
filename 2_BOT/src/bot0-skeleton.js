var Barcli = require("barcli");
var five = require("johnny-five");

var board = new five.Board();
var motor1, motor2, eyes;

var calibrating = true;

// Wait for arduino connection to be ready
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

  // Calibrate reflectance array
  eyes.calibrateUntil(function() {
    return !calibrating;
  });

  // You need something to stop calibration
  setTimeout(function() {
    calibrating = false;
  }, 3000);

  // [Optional] Use Barcli to visualize sensor output
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

  // This is how you access data from reflectance array
  eyes.on("calibratedData", function() {
    if (!calibrating) {
      graph1.update(this.values[0]);
      graph2.update(this.values[1]);
      graph3.update(this.values[2]);
    }
  });

  // Control motors using Johnny-Five API
  // e.g. motor1.forward(50)

  // Inject components into REPL for testing purposes
  // so you can play with the components manually.
  // You might need to comment out the Barcli output
  // because it competes with REPL console input
  board.repl.inject({
    motor1: motor1,
    motor2: motor2,
    eyes: eyes
  });

});