import React, {useState} from 'react';
import '../css/InfoPage.css';

function InfoPage(props) {
    return (<div id='infoPage'>
        <span id='name'> {props.personName}</span>
        <span id='sentence'> {props.sentence}</span>
    </div>);
}

export default InfoPage;
