import React, {Component} from "react";
import Anime from "react-anime";
import { Motion, spring} from "react-motion";
import {rgbToHsl} from "../usages/colorUsage";
import '../css/AnimeBox.css';
import styled from 'styled-components';

const LightBox = styled.div `
	background: rgba(0,0,0,1);
	position: absolute;
	margin: 0;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	z-index: -1;
`;

class AnimeBox extends Component {

	state = {
		defaultProp : {
			easing: "easeInOutQuad",
			loop: 2,
			duration: 500,
			direction: "alternate",
			delay: 0,
			endDelay: 0,
			background: "rgba(0,0,0,1)"
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		// only render when refresh animation
		// if ("mode" in nextProps.data){
		// 	if (nextProps.data.mode == "follow" 
		// 		
		// }
		if (nextProps.data.mode == "follow"
			&& nextProps.opacity != this.props.opacity) {

			return true;
		}
		return (nextProps.refresh !== this.props.refresh);
	}

	computeData(light) {
		//TODO: check if QQ?
		//TODO: if first time is follw: QQ?

		let alpha = 0;
		//console.log(`<background ?> ${JSON.stringify(light)}`);
		if ("color" in light) {
			light.colorTemp = light.color;
		}
		if ("alpha" in light) {
			alpha = light.alpha;
		} 
		if (light.mode == "follow"){
			alpha = this.props.opacity;
		}

		if (!("background" in light)) {
			light.direction = light.mode == "blink" ? "alternate" : "normal";
			light.loop = light.mode == "light" ? light.loopTime : light.loopTime*2;
		}
		light.background = `rgba(${light.colorTemp},${alpha})`;
		//console.log(light.background);
		//TODO: if mode == follow

		//delete light.mode;
		delete light.loopTime;
		delete light.color;
		delete light.alpha;
		
		return light;
	}

	genRgbStyle(colorStr, stiffness) {
		let bg = colorStr;
	  	let bgColor = bg.substring(5, bg.length-1).split(",");
	  	const config = {stiffness: stiffness, damping: 30}; // 70, 20
	  	return {
	  		style: {
		  		r: spring(parseFloat(bgColor[0]),config),
		  		g: spring(parseFloat(bgColor[1]),config),
		  		b: spring(parseFloat(bgColor[2]),config),
		  		a: spring(parseFloat(bgColor[3]),config),
		  	}, 
		  	motionFunc: this.rgbMotion
		  }
	  	
	}

	rgbMotion({r, g, b, a}) {
    	//console.log(r,g,b,a);
        return (
        	<div id="lightBox" key={Date.now()}
	          style={{
	            background:`rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${a})`
	          }}>
          </div>);
    }

	genHslStyle(colorStr) {
		let bg = colorStr;
	  	let bgColor = bg.substring(5, bg.length-1).split(",");
	  	const config = {stiffness: 80, damping: 20};
		let {h,s,l} = rgbToHsl(parseFloat(bgColor[0]), parseFloat(bgColor[1]), parseFloat(bgColor[2]));
	  	return {
	  		style: {
		  		h: spring(h,config),
		  		s: spring(s,config),
		  		l: spring(l,config),
		  		a: spring(parseFloat(bgColor[3]),config),
		  	},
		  	motionFunc: this.hslMotion
		}
	  	//console.log(hslStyle);
	}

	hslMotion({h, s, l, a}) {
    	//console.log(h,s,l,a);
        return (
        	<div id="lightBox" key={Date.now()}
	       
	          style={{
	            background:`hsla(${h*360},${s*100}%,${l*100}%,${a})`
	          }}>
          </div>);
    }

	render () {
		//console.log(`<render> animBOX`);
		let {defaultProp} = this.state;
		
		let lightProp = this.computeData(this.props.data);
		let animeProp = Object.assign(defaultProp, lightProp);
		//console.log(`<render animebox> ${JSON.stringify(animeProp)}`);
		
		//TODO: change rgb type
		//animeProp.background
		let {style, motionFunc} = this.genRgbStyle(animeProp.background, animeProp.duration);
		//let {style, motionFunc} = this.genHslStyle(this.props.opa);
		//console.log(animeProp.duration);
	  	let motion = (
	  		<Motion style={style}>
	  			{motionFunc}
        	</Motion>);
	  	
	  	let anime = (
			<Anime key={Date.now()} {...animeProp}>
		        <div id="lightBox"></div>
      		</Anime>);

	  	//return motion;
	  	//console.log(animeProp.mode == "blink"? "anime" : "motion")
	  	return animeProp.mode == "blink"? anime : motion;
	  		
	}

}

const colorInterpolate = (startValue, endValue, percentage) => {
	return (endValue - startValue) * percentage + startValue;
}

export default AnimeBox;