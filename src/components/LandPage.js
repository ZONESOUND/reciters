import React from 'react';
import '../css/LandPage.css';
//import ReactHtmlParser from 'react-html-parser'; 

function LandPage(props) {
    return (
        <div id='LandpageWrapper'>
            <button className='selectBtn' onClick={props.select}>Start</button>
        </div>
    );
}

export default LandPage;