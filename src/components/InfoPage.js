import React from 'react';
import styled from 'styled-components'

// css styled component
const InfoSpan = styled.span`
    margin: 1em;
    width: 80%;
    text-align: center;
    min-height: 1.2em;
    font-size: ${props => 
        props.fontSize === undefined ? '3em' : props.fontSize};
    font-weight: ${props => 
        props.fontWeight === undefined ? '100' : props.fontWeight};
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
        <InfoSpan color={'gray'} fontSize={'1em'}>{speaking}</InfoSpan>
    </InfoWrapper>);
}

export default InfoPage;
