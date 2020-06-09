const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const FOCUS = new Gpio(12, 'out'); //use GPIO pin 4, and specify that it is output
const SHUTTER = new Gpio(76, 'out'); //use GPIO pin 4, and specify that it is output
const POWER = new Gpio(200, 'out'); //use GPIO pin 4, and specify that it is output

const wait = (ms) => new Promise(res => setTimeout(res, ms));


(async () => {
  wait(250);
  POWER.writeSync(0);
  FOCUS.writeSync(1);
  SHUTTER.writeSync(1);
  wait(250);
})();
