import React, {useState, useEffect} from 'react';
import '../css/App.css';
import Speak from './Speak';
import SocketHandler from './SocketHandler';
import LandPage from './LandPage';
import Fade from './Fade';

function App() {
  const [landing, setLanding] = useState(true);
  const [speak, setSpeak] = useState(false);
  let selectStart= () => {
    setLanding(false);
    setTimeout(()=>{setSpeak(true)}, 1000);

    //not sure where to put this...
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
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
