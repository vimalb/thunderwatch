import React, { Component } from 'react';
import flvjs from 'flv.js';


interface FlvVideoProps {
    className?: string
    style?: object
    url: string
}

export default class FlvVideo extends Component<FlvVideoProps> {

  flvPlayer: any = null

  initFlv = (vid) => {
    if (vid) {
      if (flvjs.isSupported()) {
        let flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: this.props.url
        });
        flvPlayer.attachMediaElement(vid);
        flvPlayer.load();
        flvPlayer.play();
        this.flvPlayer = flvPlayer;
      }
    }
  }

  componentWillUnmount() {
    if (this.flvPlayer) {
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
    }
  }

  render() {
    const { className, style } = this.props;
    return (
      <video
        className={className}
        style={{
          width: '100%',
          ...style
        }}
        muted={true}
        ref={this.initFlv}
      />
    )
  }
}