import React, {useState} from 'react';
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

    return (
    <InfoWrapper>
        <InfoSpan color={props.nameColor}>{props.personName}</InfoSpan>
        <InfoSpan color={'orange'} fontSize={'2em'}>
            {props.sentence === '' ? '' : `"${props.sentence}"`}
        </InfoSpan>
    </InfoWrapper>);
}

export default InfoPage;
