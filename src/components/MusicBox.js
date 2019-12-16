import React, {useState, useEffect} from 'react';
import {onSocket} from '../usages/socketUsage';
import Tone from 'tone';
import AnimeBox from './AnimeBox';

let soundStateNum = [];
let soundFiles = [];
let soundPlayer = [];
const importSoundFiles = () => {
    let context = require.context(`../sounds/`, true, /\.(mp3)$/);
    let count = 0;
    let prev = '';
    context.keys().forEach((filename)=>{
        //console.log(context(filename), count);
        if (filename.slice(0,4) !== prev) {
            prev = filename.slice(0,4);
            soundStateNum.push(count);
        }
        count ++;
        soundFiles.push(context(filename));
    });
    soundStateNum.push(count);
    console.log(soundStateNum);
}
const soundPreload = () => {
	console.log('soundPreload', soundStateNum[soundStateNum.length-2]);
	//var meter = new Tone.Meter('level');
	//var fft = new Tone.Analyser('fft', 64);
	//var waveform = new Tone.Analyser('waveform', 32);
	//var soundPlayer = [];
    soundFiles.forEach((value, ind)=> {
        var temp = new Tone.Player({
			"url": value,
			"fadeOut": ind < soundStateNum[4] ? 5 : 0,
            "fadeIn": ind < soundStateNum[4] ? 5 : 0
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
    const [refresh, setRefresh] = useState(false);
    
    let processData = (data) => {
        //let {sound} = data;
        if (data.sound) processSound(data.sound);
    }
    useState(()=>{
        if (props.socket)
            onSocket('controlData', processData);
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

    useEffect(()=>{
        if (props.refresh != refresh && props.data && JSON.stringify(props.data) !== '{}' ){
            processSound(props.data);
        }
        setRefresh(props.refresh);
    }, [props.refresh])

    let processSound = (data) => {
        if (props.stop) return;

        //console.log(data);
        if (data.stop && data.stop !== '*') {
            stopAll();
            return;
        }
        let order = -1;
        if (data.set && data.set < soundStateNum.length) {
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
            if ('delayFix' in data) {
                setTimeout(() => {
                    playSound(order);
                }, data.delayFix);
            } else if (data.delay > 0) {
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

    return(<></>);
}

export default MusicBoxMin;