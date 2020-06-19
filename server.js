const express = require('express');
const NodeMediaServer = require('node-media-server');
const SerialPort = require('serialport');
const { execSync, execFile } = require('child_process');


const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();


const COMMANDS = {
    OFF: '6',
    IDLE: '7',
    FOCUS: '5',
    SHOOT: '1'    
}

const wait = (ms) => new Promise(res => setTimeout(res, ms));

const write = async (data) => {
    const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
    await wait(100);
    await new Promise(res => port.write(data, res));
    await new Promise(res => port.drain(res));
    await new Promise(res => port.close(res));
    await wait(100);
}

(async () => {
  await write(COMMANDS.OFF);
})();


const killStream = () => {
    try {
        execSync("killall gst-launch-1.0");
    } catch (e) {
        console.log(e);
    }
}
const launchStream = () => {
    execFile("/home/ubuntu/thunderwatch/stream-local-camlink.sh");
}
killStream();


const STATES = {
    OFF: 'OFF',
    IDLE: 'IDLE',
    BURST: 'BURST'
}
var state = STATES.OFF;

const app = express();

app.get('/api/state', async (req, res) => {
    res.send(state);
});

app.get('/api/action/ON', async (req, res) => {
    console.log(`Turning Camera On`);
    killStream();
    await write(COMMANDS.IDLE);
    await wait(3000);
    launchStream();
    await wait(2000);
    state = STATES.IDLE;
    res.send("ON");
});

app.get('/api/action/OFF', async (req, res) => {
    console.log(`Turning Camera Off`);
    killStream();
    await write(COMMANDS.IDLE);
    await wait(5000);
    await write(COMMANDS.OFF);
    state = STATES.OFF;
    res.send("OFF");
});

app.get('/api/action/SHOOT', async (req, res) => {
    console.log(`Taking Single Shot`);
    state = STATES.BURST;
    await write(COMMANDS.FOCUS);
    await wait(100);
    await write(COMMANDS.SHOOT);
    await wait(100);
    await write(COMMANDS.IDLE);
    state = STATES.IDLE;
    res.send("SHOOT");
});

app.get('/api/action/BURST', async (req, res) => {
    console.log(`Starting Burst`);
    await write(COMMANDS.FOCUS);
    await wait(100);
    await write(COMMANDS.SHOOT);
    state = STATES.BURST;
    res.send("BURST");
});

app.get('/api/action/IDLE', async (req, res) => {
    console.log(`Setting Camera Idle`);
    await write(COMMANDS.IDLE);
    state = STATES.IDLE;
    res.send("IDLE");
});




app.use('/', express.static('dist'));
app.listen(3000, '0.0.0.0', () => console.log(`App listening`));

