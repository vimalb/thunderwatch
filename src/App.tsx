import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { asyncComputed } from 'computed-async-mobx';
import FlvVideo from './FlvVideo';

@observer
class App extends React.Component {

    @observable.ref apiBusy = false;

    videoState = asyncComputed('OFF', 0, async () => {
        const result = await fetch('/api/state').then(resp => resp.text());
        return result;
    });

    doAction = async (action) => {
        this.apiBusy = true;
        await fetch(`/api/action/${action}`);
        this.apiBusy = false;
        this.videoState.refresh();
    }

    render() {

        const videoState = this.videoState.get();
        const { apiBusy, doAction } = this;

        return (
            <div>
                <div>
                    Current State: { videoState }
                </div>
                <div>
                    <button disabled={apiBusy} onClick={() => doAction('ON')}>Turn On</button>
                    <button disabled={apiBusy} onClick={() => doAction('OFF')}>Turn Off</button>
                    <button disabled={apiBusy} onClick={() => doAction('SHOOT')}>Take Photo</button>
                    <button disabled={apiBusy} onClick={() => doAction('BURST')}>Start Burst</button>
                    <button disabled={apiBusy} onClick={() => doAction('IDLE')}>Stop Burst</button>
                </div>
                <div>
                    {   
                        videoState !== 'OFF' && 
                        <FlvVideo
                            url={`http://${window.location.hostname}:8000/live/preview.flv`}
                            style={{ width: '75%' }}
                        />
                    }
                </div>
            </div>
        );
    }


}


export default App