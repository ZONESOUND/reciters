import React, {useState, useEffect} from 'react';
import '../css/App.css';
import Speak from './Speak';
import SocketHandler from './SocketHandler';

function App() {
  
  return (<>
    <SocketHandler />
    {/* <Speak /> */}
  </>);
}

export default App;
