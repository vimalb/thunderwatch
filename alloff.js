const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })

const OFF = '6';
const IDLE = '7';
const FOCUS = '5';
const SHOOT = '1'; 


const wait = (ms) => new Promise(res => setTimeout(res, ms));
const write = (data) => new Promise(res => port.write(data, res));
const drain = () => new Promise(res => port.drain(res));
const close = () => new Promise(res => port.close(res));

port.on('data', data => console.log(data));


(async () => {
  await wait(100);
  await write(OFF);
  await drain();
  await wait(100);
  await close();
  await wait(100);
})();
