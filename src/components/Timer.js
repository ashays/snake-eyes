import React, { Component } from 'react';
import './Timer.css';

import blop from '../assets/sounds/blop.mp3';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remaining: this.getRemainingTime(props.start)
        }
        this.timer = this.timer.bind(this);
        this.SCARY = 15;
    }

    getRemainingTime() {
        return Math.floor((this.props.start + (this.props.duration * 1000) - new Date().getTime()) / 1000);
    }

    componentDidMount() {
        this.blop = new Audio(blop);
        this.blop.loop = false;
        if (this.props.start) {
            this.timerInterval = setInterval(this.timer, 1000);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.start !== prevProps.start) {
            this.timerInterval = setInterval(this.timer, 1000);
        }
    }

    timer() {
        let remaining = this.getRemainingTime(this.props.start);
        this.setState({remaining});
        if (remaining > 40 && remaining % 2 === 0) {
            this.blop.play();
        } else if (remaining <= 40 && remaining > this.SCARY) {
            this.blop.play();
        } else if (remaining <= this.SCARY) {
            this.blop.play();
            setTimeout(() => { this.blop.play(); }, 500);
        } else if (remaining < 0) {
            clearInterval(this.timerInterval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }
    
    render() {
        if (this.state.remaining) {
            return (
                <div>
                    <div className={this.state.remaining <= this.SCARY ? "timer scary" : "timer"}>{this.state.remaining}</div>
                </div>
            );    
        }
        return (<div></div>);
    }
}

export default Timer;