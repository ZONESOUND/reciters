import React, {useState, useEffect} from 'react';
import {onSocket} from '../usages/socketUsage';
import Tone from 'tone';

let soundStateNum = [15, 36, 48, 58];
let soundFiles = [];
let soundPlayer = [];
const importSoundFiles = () => {
    let context = require.context(`../sounds/`, true, /\.(mp3)$/);
    context.keys().forEach((filename)=>{
        soundFiles.push(context(filename));
    });
    //console.log(soundFiles);
}
const soundPreload = () => {
	console.log('soundPreload');
	//var meter = new Tone.Meter('level');
	//var fft = new Tone.Analyser('fft', 64);
	//var waveform = new Tone.Analyser('waveform', 32);
	//var soundPlayer = [];

    soundFiles.forEach((value)=> {
        var temp = new Tone.Player({
			"url": value,
			"fadeOut": 5,
            "fadeIn": 5
        }).toMaster();
			//}).connect(meter).connect(waveform).connect(fft).toMaster();
		soundPlayer.push(temp);
    });
    return soundPlayer;
	//return {meter: meter, fft: fft, waveform: waveform, soundPlayer:soundPlayer};
}
importSoundFiles();
soundPreload();

function MusicBoxMin(props) {
    //const [soundPlayer] = useState(soundPreload());
    const [nowOrder, setNowOrder] = useState(0);
    useState(()=>{
        onSocket('controlData', (data)=>{
            console.log('controlData', data);
            if (data.sound) processData(data.sound);
        })
    })
    
    let loadFinish = () => {
		console.log('load Finished!');
    }
    //TODO: handle loading?
    useEffect(()=>{
        Tone.Buffer.on('load', loadFinish);
    },[soundPlayer])

    useEffect(()=>{
        if (props.stop) {
            stopAll();
        }
    },[props.stop])

    let processData = (data) => {
        if (props.stop) return;

        console.log(data);
        if (data.stop && data.stop !== '*') {
            stopAll();
            return;
        }
        let order = -1;
        if (data.set) {
            order = Math.floor(Math.random() * (soundStateNum[data.set] - soundStateNum[data.set-1]));
            order += soundStateNum[data.set-1];
        } else if ('order' in data) {
            if (data.orderTo && data.orderTo > data.order) {
                order = Math.floor(Math.random() * (data.orderTo - data.order));
                order += data.order;
            } else order = data.order;
        }
        if (order >= 0) {
            stopNow();
            //console.log('o', order);
            if ('volume' in data) setVolume(order, data.volume);
            if (data.delay > 0) {
                setTimeout(() => {
                    playSound(order);
                }, Math.floor(Math.random()*data.delay));
            } else playSound(order);
        }   
        else if ('volume' in data) {
            if (soundPlayer[nowOrder] && soundPlayer[nowOrder].state !== 'stopped') {
                setVolume(nowOrder, data.volume);
            }
        }
    }

    let stopNow = () => {
        if (soundPlayer[nowOrder] && soundPlayer[nowOrder].loaded && soundPlayer[nowOrder].state !== 'stopped') {
            soundPlayer[nowOrder].stop();
        }
    }

    let stopAll = () => {
		soundPlayer.forEach((e) => {
			if (e !== undefined) {
				if (e.loaded && e.state !== 'stopped') e.stop();
			} 
        }) 
        setNowOrder(0);
    }
    
    let playSound = (order) => {
        //console.log(order);
		if (soundPlayer[order] !== undefined) {
			if (soundPlayer[order].loaded) {
				console.log(order, 'played!');
                soundPlayer[order].start();
                setNowOrder(order);
			} else {
				console.log(order+' not loaded!');
			}
		}
    }
    let setVolume = (order, volume) =>{
        if (soundPlayer[order] && soundPlayer[order].loaded) soundPlayer[order].volume.value = volume;
    }
    
    let randomPlay = () => {
        let order = Math.floor(Math.random() * (soundStateNum[1] - soundStateNum[0]));
            order += soundStateNum[0];
        playSound(order);
    }

    return(<div></div>);
}

export default MusicBoxMin;