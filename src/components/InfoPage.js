import React, {useState} from 'react';
import styled from 'styled-components';
import SiriWave from 'siriwave';
import '../css/InfoPage.css';

// css styled component
const InfoSpan = styled.span`
    margin: 1em;
    width: 80%;
    text-align: center;
    min-height: 1.2em;
    font-size: ${props => 
        props.fontSize === undefined ? '3em' : props.fontSize};
    font-weight: ${props => 
        props.fontWeight === undefined ? '200' : props.fontWeight};
    ${props => 
        props.color === undefined ? '' : 'color:'+props.color+';'}
    `;
const InfoWrapper = styled.div`
    margin: 0 auto;
    position: absolute;
    width: 100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    `;


function InfoPage(props) {
    const maxLen = 10;
    let speaking = '';
    let num = 0;
    if (props.speakingVoice.length > 0) {
        props.speakingVoice.forEach((v)=>{
            if (v == null) return;
            v = JSON.parse(v);
            if (!v.name) return;
            if (num > maxLen) {
                return;
            }
            if (`${v.name} (${v.lang})` !== props.personName) {
                num++;
                if (num > 1) speaking += num == maxLen ? ' and ' : ', ';
                speaking += v.name;
            }
        })
        if (num > 0) {
            speaking += num > 1 ? ' are ' : ' is ';
            speaking += 'speaking...';
        }
    }
    
    return (
    <InfoWrapper>
        <InfoSpan color={props.nameColor}>{props.personName}</InfoSpan>
        <InfoSpan color={'orange'} fontSize={'2em'}>
            {props.sentence === '' ? '' : `"${props.sentence}"`}
        </InfoSpan>
        <InfoSpan color={'gray'} fontSize={'1.5em'}>{speaking}</InfoSpan>
        <Wave start={props.sentence === '' ? false : true}/>
    </InfoWrapper>);
}

class Wave extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            siriWave: null,
        };
    }

    componentDidMount() {
        this.setState({siriWave:new SiriWave({
            container: this.myRef.current,
            style: 'ios9',
            width: 320,
            height: 100,
            //cover: true,
            speed: 0.2,
            amplitude: 0.1,
            autostart: true
        })})
        setTimeout(()=>{
            if (this.state.siriWave)
                this.state.siriWave.setAmplitude(0);
        }, 50)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.siriWave == null) return false;
        if (nextProps.start !== this.props.start) {
            if (nextProps.start) this.state.siriWave.setAmplitude(1);
            else this.state.siriWave.setAmplitude(0);
            return true;
        }
        return false;
    }

    render() {
        return (<>
            <div ref={this.myRef}></div>
        </>);
    }
  }

export default InfoPage;
