import React, {useState, useEffect} from 'react';
import {connectSocket, onSocket, emitData, isSocketConnect } from '../usages/socketUsage';
import Speak from './Speak';
import {useInterval} from '../usages/tool';
import Fade from './Fade';
import {FullDiv} from '../usages/cssUsage';

function SocketHandler(props) {
    const [speak, setSpeak] = useState(false);
    const [id, setId] = useState(-1);
    const [changeVoice, setChangeVoice] = useState(false);
    const [launch, setLaunch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [speakData, setSpeakData] = useState({});
    const [voice, setVoice] = useState(); 
    const [socketConnect, setSocketConnect] = useState(null);

    useEffect(()=>{
        //if (props.start && socketConnect) {
        if (socketConnect) {
            changeVoiceEffect();
        }
    }, [socketConnect])

    //check if user changed
    useEffect(() => {
        if (!launch && voice) {
            emitData('speakConfig', {mode: 'changeVoice', voice: voice});
        }
    }, [launch, voice])

    useState(()=> {
        connectSocket('/receiver', ()=>{setSocketConnect(true);});
        onSocket('disconnect', ()=>{
            setSocketConnect(false);
        })
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
            else if (data.mode === 'showForm')
                setShowForm(true);
            else if (data.mode === 'hideForm') 
                setShowForm(false);
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
    }
    
    return (<>
        {/* <button onClick={sendChangeVoice}></button> */}
        <Fade show={socketConnect}>
            <Speak toSpeak={speak} data={speakData} speakOver={speakOver} 
                    changeVoice={changeVoice} changeVoiceCallback={changeVoiceCallback}
                    form={showForm}/>
        </Fade>
        <Fade show={socketConnect===false}>
            <FullDiv bgColor="black"><span>{'CONNECTING SERVER'}</span></FullDiv>
        </Fade>
    </>);
}

export default SocketHandler;