import React, {useState, useEffect} from 'react';
import {connectSocket, onSocket, emitData } from '../usages/socketUsage';
import Speak from './Speak';

function SocketHandler() {
    const [speak, setSpeak] = useState(false);
    const [sentence, setSentence] = useState();
    const [id, setId] = useState(-1);
    useState(()=> {
        connectSocket('/receiver');
        onSocket('debug', (data)=> {
            console.log(data);
        }); 
        onSocket('speak', (data)=> {
            //console.log('speak!', data);
            if (!speak) {
                setSentence(data.text);
                setId(data.id);
                setSpeak(true);
            }
            //TODO: if speak -> do something?   
        })
    });
    let sendDebug = () => {
        emitData('debug', 'testing');
    }
    let speakOver = () => {
        setSpeak(false);
        console.log('speak over', id);
        //emitData('debug', {id: id});
        emitData('speakover', {id: id});
    }
    return (<>
        <button onClick={sendDebug}></button>
        <Speak speak={speak} sentence={sentence} speakOver={speakOver}/>
    </>);
}

export default SocketHandler;