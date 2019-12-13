import React, {useState} from 'react';
import '../css/App.css';
import SocketHandler from './SocketHandler';
import LandPage from './LandPage';
import Fade from './Fade';
import Tone from 'tone';

function App() {
  const [landing, setLanding] = useState(true);
  const [speak, setSpeak] = useState(false);
  let selectStart= () => {
    setLanding(false);
    setSpeak(true);

    //not sure where to put this...
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    const synth = new Tone.Synth();
    synth.oscillator.type = "sine";
    synth.toMaster();
    synth.triggerAttack("C4");
    setTimeout(()=>{synth.triggerRelease();}, 100);
  }
  return (
  <div>
    <Fade show={landing}>
      <LandPage select={selectStart}/>
    </Fade>
    <Fade show={speak}>
      <SocketHandler start={speak}/>
    </Fade>
    {/* <Speak /> */}
  </div>);
}

export default App;
