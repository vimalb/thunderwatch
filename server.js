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


const app = express();

app.get('/api/ON', async (req, res) => {
    console.log(`Turning Camera On`);
    killStream();
    await write(COMMANDS.IDLE);
    await wait(5000);
    launchStream();
    res.send("ON");
});

app.get('/api/OFF', async (req, res) => {
    console.log(`Turning Camera Off`);
    killStream();
    await write(COMMANDS.IDLE);
    await wait(5000);
    await write(COMMANDS.OFF);
    res.send("OFF");
});

app.get('/api/SHOOT', async (req, res) => {
    console.log(`Taking Single Shot`);
    await write(COMMANDS.FOCUS);
    await wait(100);
    await write(COMMANDS.SHOOT);
    await wait(100);
    await write(COMMANDS.IDLE);
    res.send("SHOOT");
});

app.get('/api/BURST', async (req, res) => {
    console.log(`Starting Burst`);
    await write(COMMANDS.FOCUS);
    await wait(100);
    await write(COMMANDS.SHOOT);
    res.send("BURST");
});

app.get('/api/IDLE', async (req, res) => {
    console.log(`Setting Camera Idle`);
    await write(COMMANDS.IDLE);
    res.send("IDLE");
});


app.get('/api/:command', async (req, res) => {
    console.log(`Running ${req.params.command}`);
    const command = COMMANDS[req.params.command];
    await write(command);
    if(command === COMMANDS.OFF) {
        killStream();
    }
    if(command === COMMANDS.ON) {
        killStream();
        await wait(3000);
        launchStream();
    }
    res.send(command);
});

app.use('/', express.static('frontend'));
app.listen(3000, '0.0.0.0', () => console.log(`App listening`));

