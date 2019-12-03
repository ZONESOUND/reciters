import React, {useState, useEffect} from 'react';
import {connectSocket, onSocket, emitData } from '../usages/socketUsage';
import Speak from './Speak';
import {useInterval} from '../usages/tool';

function SocketHandler(props) {
    const [speak, setSpeak] = useState(false);
    const [sentence, setSentence] = useState('');
    const [id, setId] = useState(-1);
    const [changeVoice, setChangeVoice] = useState(false);
    const [launch, setLaunch] = useState(false);
    useEffect(()=>{
        if (props.start) {
            setLaunch(true);
        }
    }, [props.start])

    useState(()=> {
        connectSocket('/receiver');
        onSocket('debug', (data)=> {
            console.log(data);
        }); 
        onSocket('speak', (data)=> {
            
            if (!speak) {
                console.log('speak!', data);
                setSentence(data.text);
                setId(data.id);
                setSpeak(true);
            }
            //TODO: if speak -> do something?   
        })
    });

    useInterval(() => {
        setChangeVoice(!changeVoice);
    }, launch ? 100 : null);
    setTimeout(()=>{
        setLaunch(false);
    }, 2000);

    let sendDebug = () => {
        emitData('debug', 'testing');
    }
    let sendChangeVoice = () => {
        console.log('send change voice');
        setChangeVoice(!changeVoice);
    }
    useEffect(()=>{
        console.log('change~', changeVoice);
    }, [changeVoice])
    let speakOver = () => {
        setSpeak(false);
        console.log('speak over', id);
        //emitData('debug', {id: id});
        emitData('speakover', {id: id});
    }
    return (<>
        {/* <button onClick={sendChangeVoice}></button> */}
        <Speak toSpeak={speak} sentence={sentence} speakOver={speakOver} 
                changeVoice={changeVoice} form={false}/>
    </>);
}

export default SocketHandler;