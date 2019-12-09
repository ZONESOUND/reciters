import React, {useState, useEffect} from 'react';
import { useInterval, usePrevious } from '../usages/tool';
import InfoPage from './InfoPage';
import Fade from './Fade';
import styled from 'styled-components'

const FullDiv = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -10;
  background: ${props => 
    props.bgColor === undefined ? "white" : props.bgColor};  
`


function Speak(props) {
  const synth = window.speechSynthesis;  

  const [first, setFirst] = useState(true);
  const [voices, setVoices] = useState(synth.getVoices());
  const [voiceIndex, changeVoiceIdx] = useState(0);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  //const [sentence, setSentence] = useState('');
  const {toSpeak, data, changeVoice} = props;
  const prevSpeak = usePrevious(toSpeak);
  const prevChangeVoice = usePrevious(changeVoice);
  const [revealSentence, setRevealSentence] = useState('');

  useEffect(()=>{
    if (!toSpeak || speaking) return;
    if (prevSpeak !== toSpeak && data.text) {
      if (data.rate) setRate(data.rate);
      if (data.pitch) setPitch(data.pitch);
      //speakTxt(data.text);
      speakTxtWithPR(data.text, data.pitch?data.pitch:pitch, data.rate?data.rate:rate);
    }
  }, [toSpeak, data]);

  useEffect(()=>{
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
    setVoices(v);
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

  let speakTxtWithPR = (txt, p, r) => {
    setSpeaking(true);
    setRevealSentence(txt);
    let utterThis = new SpeechSynthesisUtterance(txt);
    utterThis.voice = voices[voiceIndex];
    utterThis.pitch = p;
    utterThis.rate = r;
    synth.speak(utterThis);
  }

  const formProps = {
    onSubmitF: submitSpeak,
    voiceIndex: voiceIndex, 
    voiceOnChanged: changeVoiceIdx, 
    voices: voices, 
    pitch: pitch, 
    rate: rate, 
    pitchOnChanged: setPitch, 
    rateOnChanged: setRate
  }

  let personName = voices[voiceIndex] !== undefined ? 
        `${voices[voiceIndex].name} (${voices[voiceIndex].lang})` : '';

  return (
    <>
      {props.form && <SpeakForm {...formProps}/>}
      <InfoPage personName={personName} 
        sentence={revealSentence} nameColor={speaking ? 'black': 'white'} /> 
      <Fade show={speaking} speed={'0.3s'}>
        <FullDiv/>
      </Fade>
    </>
  );
}

function SpeakForm(props) {
  const {onSubmitF, voiceIndex, 
        voiceOnChanged, voices, pitch, rate, 
        pitchOnChanged, rateOnChanged} = props;
  console.log('speak form', voiceIndex);
  return (
    <form onSubmit={onSubmitF}>
      <select value={voiceIndex} onChange={(e) => {voiceOnChanged(e.target.value)}}>
        {voices.map((value, index) => {
          return <option key={index} value={index}>{`${value.name} (${value.lang})`}</option>
        })}
      </select>
      <br/>
      <label htmlFor='pitch'>pitch</label>
      <input type='number' step={0.01} value={pitch} onChange={(e)=>{pitchOnChanged(e.target.value)}} id='pitch' />
      <br/>
      <label htmlFor='rate'>rate</label>
      <input type='number' step={0.01} value={rate}  onChange={(e)=>{rateOnChanged(e.target.value)}} id='rate'/>
      <input type='submit'></input>
    </form>
  )
}

export default Speak;
