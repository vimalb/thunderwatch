#!/bin/bash
gst-launch-1.0 -e v4l2src ! video/x-raw,width=1920,height=1080,framerate=7013/117,format=YUY2 ! videoconvert ! videoscale ! videorate ! video/x-raw,framerate=30/1 ! omxh264enc profile=2 control-rate=2 preset-level=3 bitrate=5500000 ! flvmux streamable=true ! queue ! rtmpsink location="rtmp://localhost/live/preview live=true"

