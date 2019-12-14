import React, {Component} from 'react';
import AnimeBox from './AnimeBox';
// import MusicBox from './MusicBox';
import {connectSocket, onSocket} from '../usages/socketUsage';
import Fade from './Fade';
import MusicBoxMin from './MusicBox';

const rgbColors = ["255, 255, 255"];

const inArrRange = (num, len) => {
	//console.log(num >= 0 && num < len);
	return num >= 0 && num < len;
}

const genUUID = () => {
	var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
    sessionStorage.setItem("StageEffectUUID", uuid);
    return uuid;
}

const jsonCopy = (jsonObj) => {
  return JSON.parse(JSON.stringify(jsonObj));
}

//props: show, stop
class EffectBox extends Component {

	state = {
    	uuid: sessionStorage.getItem("StageEffectUUID") || genUUID(),
        refreshAnime: false,
        refreshMusic: false,
        socketData: {},
        lightData: {},
        soundData: {},
        //opa: "rgba(0,0,0,1)",
        opa: -1,
        opacity: 0,
    };

    componentDidMount() {

        // this.setState({
		// 	socket: connectSocket('/receiver', this.socketConnectFn)
        // })
        onSocket('controlData', this.receiveControlData.bind(this))
        
	}
	
	// socketConnectFn = () => {
	// 	let {socket} = this.state;
	// 	console.log('receiver connected to server');
	// 	console.log(this.state.uuid);
	// 	console.log(socket);
	// 	socket.emit('connected', {
	// 		uuid: this.state.uuid
	// 	});

	// 	 //this.setupBeforeUnloadListener(socket);
	// 	this.setState({socketID: socket.id});
	// 	 socket.on('debug', (data) => {
	// 		 console.log(`<socket> ${data}`);
	// 	 })

	// 	socket.on('controlData', this.receiveControlData.bind(this));
		
	// }

    receiveControlData(data) {
 		// console.log(`<data> ${JSON.stringify(data)}`);
 		
 		let {light, sound} = this.handleSocketData(data);
 		//console.log(`<sound data>  ${JSON.stringify(sound)}`)
 		if (JSON.stringify(sound) !== "{}") {
 			this.setState((prevState) => ({
	 			soundData: jsonCopy(sound),
	 			refreshMusic: !prevState.refreshMusic,
			}));
 		}
 		if (JSON.stringify(light) !== "{}") {
 			this.setState((prevState) => ({
 				soundData: jsonCopy(sound),
	 			lightData: jsonCopy(light),
	 			refreshAnime: !prevState.refreshAnime,
				
			}));
 		}
    }

    handleSocketData(data) {
    	//console.log(rgbColors);
    	var sound = 'sound' in data && data.sound !== '*' ? data.sound : {};
        var light = 'light' in data && data.light !== '*'? this.handleLightData(data.light) : {};
    	 
    	//console.log(`<sound in handleSocketData> ${JSON.stringify(sound)}`);
    	//console.log(`<light> ${JSON.stringify(light)}`);

    	if (!("color" in light) && JSON.stringify(light) !== "{}" && "order" in sound) {
    		//console.log(`color: ${rgbColors[sound.order % rgbColors.length]}`);
    		light.color = rgbColors[sound.order % rgbColors.length];
    	}
    	if ("color" in light && "order" in sound) {
    		if (light.color === "*") {
    			//console.log(`color: ${rgbColors[sound.order % rgbColors.length]}`);
    			light.color = rgbColors[sound.order % rgbColors.length];
    		}
    	}
    	if ("delay" in light && "order" in sound) {
    		sound.delayFix = light.delay;

    	}
    	if ("mode" in light && "order" in sound) {
    		sound.mode = light.mode;

    	}
    	if ("mode" in light && "stop" in sound) {
    		if (light.mode === "follow") light = {};
    	}
    	// TODO: if color mode == follow ? 

    	return {light: light, sound: sound};
    }

    // handleSoundData(sound) {
    // 	//if order not in range => no sound!
    // 	//console.log(`<handleSoundData> ${sound.order}`);

    // 	if (!inArrRange(sound.order, soundFileNum)) {
    // 		if (!('volume' in sound))
    // 			return {};
    // 		else {
    // 			delete sound.order;
    // 			return sound;
    // 		}
    // 	}

    // 	// if orderTo not in range or < order: to order
    // 	if (!inArrRange(sound.orderTo, soundFileNum+1) 
    // 		|| sound.orderTo < sound.order) {
	// 		sound.orderTo = sound.order;
	// 	}
		
    // 	//calculate random
	//     sound.order = sound.order + 
	//     		Math.floor(Math.random()*(sound.orderTo-sound.order));
	//     //console.log(`order ${sound.order}`); 

	//     if ("stop" in sound) {
    // 		if (sound.stop === "*") delete sound.stop;
    // 	}
	//     return sound;
    // }

    handleLightData(light) {
    	if (light.mode === "none") return {};
    	if ("color" in light) {
    		if (light.color === "*") delete light.color;
    	}
    	light.delay = Math.random()*light.delay;
    	return light;
    }

    changeHandler(v) {
    	//console.log(`changeHandler: ${v}`);
    	this.setState({opacity: v});
    }

	render(){
		//console.log('render');
		let {refreshAnime, refreshMusic, lightData, soundData, opacity} = this.state;

		return(
			<div id="wrap">
				<Fade show={this.props.show}>
					<AnimeBox refresh={refreshAnime} data={lightData} 
					opacity={opacity}></AnimeBox>
				</Fade>
                <MusicBoxMin stop={this.props.stop} refresh={refreshMusic} data={soundData}/>
				{/* <MusicBox show={this.props.show} refresh={refreshMusic} data={soundData} onChange={this.changeHandler.bind(this)} parent={this}></MusicBox> */}
			</div>
		);
	}

	setupBeforeUnloadListener = (socket) => {
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            socket.emit('disconnected', {
		        uuid: this.state.uuid
	    	})
	    	return event;
        });
    };

    clickButton = () => {
    	//console.log(`click ${this.state.refreshAnime}`);
    	//var r = Math.floor(Math.random()*255);
    	//var g = Math.floor(Math.random()*255);
    	//var b = Math.floor(Math.random()*255);
    	//testPlayer[0].start();
    	if (JSON.stringify(this.state.soundData) != "{}") {
    		this.setState((prevState) => ({
				refreshMusic: !prevState.refreshMusic,
			}));
    	}
    	if (JSON.stringify(this.state.lightData) != "{}") {
    		this.setState((prevState) => ({
				refreshAnime: !prevState.refreshAnime,
			}));
    	}
  //   	this.setState((prevState) => ({
		// 	refreshAnime: !prevState.refreshAnime,
		// 	refreshMusic: !prevState.refreshMusic,
		// 	//opa: `rgba(${r},${b},${b},1)`
		// 	//opa: `rgba(255,255,0,1)`
		// 	opa: prevState.opa*10
		// }));
		//console.log(rgbColors);
    }
}

export default EffectBox;
