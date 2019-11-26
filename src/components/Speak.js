import React, {useState} from 'react';
import { useInterval } from '../usages/tool';

function Speak(props) {
  const synth = window.speechSynthesis;  
  const [voices, getVoices] = useState(synth.getVoices());
  const [voiceIndex, changeVoice] = useState(0);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  let populateVoice = () => {
    let v = synth.getVoices();
    for (var i=0; i<v.length; i++) {
      if (v[i].default) {
        changeVoice(i);
        break;
      }
    }
    getVoices(v);
  }
  synth.onvoiceschanged = populateVoice;
  useInterval(() => {
    if (!synth.speaking) {
        //console.log('finish speak!');
        props.speakOver();
        setSpeaking(false);
    }
  }, speaking ? 400 : null);

  let speak = (event) => {
    event.preventDefault();
    speakTxt('hello');
  }

  let speakTxt = (txt) => {
    let utterThis = new SpeechSynthesisUtterance(txt);
    utterThis.voice = voices[voiceIndex];
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);

  }

  if (!speaking && props.speak && props.sentence !== undefined) {
    setSpeaking(true);
    console.log('<speak> speak!', props.sentence);
    speakTxt(props.sentence);
    //props.speakOver();
  }

  return (
    <form onSubmit={speak}>
      <select value={voiceIndex} onChange={(e) => {changeVoice(e.target.value)}}>
        {voices.map((value, index) => {
          return <option key={index} value={index}>{`${value.name} (${value.lang})`}</option>
        })}
      </select>
      <br/>
      <label htmlFor='pitch'>pitch</label>
      <input type='number' step={0.01} value={pitch} onChange={(e)=>{setPitch(e.target.value)}} id='pitch' />
      <br/>
      <label htmlFor='rate'>rate</label>
      <input type='number' step={0.01} value={rate}  onChange={(e)=>{setRate(e.target.value)}} id='rate'/>
      <input type='submit'></input>
    </form>
  );
}

export default Speak;
