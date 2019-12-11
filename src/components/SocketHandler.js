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
    const [showForm, setShowForm] = useState(true);
    const [speakData, setSpeakData] = useState({});
    const [voice, setVoice] = useState(); 

    useEffect(()=>{
        if (props.start) {
            //setLaunch(true);
            changeVoiceEffect();
        }
    }, [props.start])

    useEffect(() => {
        if (!launch && voice) {
            console.log('launch!', voice);
        }
    }, [launch, voice])

    useState(()=> {
        connectSocket('/receiver');
        onSocket('debug', (data)=> {
            console.log(data);
            if (data.mode === 'showForm') 
                setShowForm(data.value);
        }); 
        onSocket('speak', (data)=> {
            
            if (!speak) {
                console.log('speak!', data);
                //setSentence(data.text);
                setSpeakData(data);
                setId(data.id);
                setSpeak(true);
            }
            //TODO: if speak -> do something?   
        });
        onSocket('speakConfig', (data)=> {
            console.log(data);
            if (data.mode === 'changeVoice') 
                changeVoiceEffect();
        }); 
    });

    useInterval(() => {
        setChangeVoice(!changeVoice);
    }, launch ? 100 : null);

    let changeVoiceEffect = () => {
        setLaunch(true);
        setTimeout(()=>{
            setLaunch(false);
        }, 2000);
    }

    let sendDebug = () => {
        emitData('debug', 'testing');
    }
    let sendChangeVoice = () => {
        console.log('send change voice');
        setChangeVoice(!changeVoice);
    }
    let speakOver = () => {
        setSpeak(false);
        console.log('speak over', id);
        //emitData('debug', {id: id});
        if (id !== -1)
            emitData('speakOver', {id: id});
    }
    let changeVoiceCallback = (voice) => {
        setVoice(voice);
        // if (!launch) {
        //     //emit server!
        //     console.log('changed!', voice);
        // }
    }
    
    return (<>
        {/* <button onClick={sendChangeVoice}></button> */}
        <Speak toSpeak={speak} data={speakData} speakOver={speakOver} 
                changeVoice={changeVoice} changeVoiceCallback={changeVoiceCallback}
                form={showForm}/>
    </>);
}

export default SocketHandler;