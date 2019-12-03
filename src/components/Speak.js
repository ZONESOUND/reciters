import React, {useState, useEffect} from 'react';
import { useInterval, usePrevious } from '../usages/tool';
import InfoPage from './InfoPage';

function Speak(props) {
  const synth = window.speechSynthesis;  

  const [voices, getVoices] = useState(synth.getVoices());
  const [voiceIndex, changeVoiceIdx] = useState(0);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  //const [sentence, setSentence] = useState('');
  const {toSpeak, sentence, changeVoice} = props;
  const prevSpeak = usePrevious(toSpeak);
  const prevChangeVoice = usePrevious(changeVoice);
  const [revealSentence, setRevealSentence] = useState('');
  useEffect(()=>{
    if (!toSpeak || speaking) return;
    if (prevSpeak !== toSpeak && sentence !== undefined) {
      speakTxt(sentence);
    }
  }, [toSpeak, sentence]);

  useEffect(()=>{
    console.log(prevChangeVoice, changeVoice);
    if (prevChangeVoice !== changeVoice) {
      changeVoiceIdx(Math.floor(Math.random()*voices.length));
    }
  }, [changeVoice]);


  let populateVoice = () => {
    let v = synth.getVoices();
    for (var i=0; i<v.length; i++) {
      if (v[i].default) {
        changeVoiceIdx(i);
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
  }, speaking ? 200 : null);

  let submitSpeak = (event) => {
    event.preventDefault();
    speakTxt('hello');
  }

  let speakTxt = (txt) => {
    setSpeaking(true);
    setRevealSentence(txt);
    let utterThis = new SpeechSynthesisUtterance(txt);
    utterThis.voice = voices[voiceIndex];
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);

  }

  // if (!speaking && props.speak && props.sentence !== undefined) {
  //   setSpeaking(true);
  //   setSentence(props.sentence);
  //   console.log('<speak> speak!', props.sentence);
  //   speakTxt(props.sentence);
  //   //props.speakOver();
  // }

  return (
    <>{props.form &&
    <form onSubmit={submitSpeak}>
      <select value={voiceIndex} onChange={(e) => {changeVoiceIdx(e.target.value)}}>
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
    </form>}
    <InfoPage personName={voices[voiceIndex] !== undefined ? voices[voiceIndex].name : ''} sentence={revealSentence}/>
    </>
  );
}

export default Speak;
