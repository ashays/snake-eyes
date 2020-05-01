import React, { Component } from 'react';
import './Timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remaining: this.getRemainingTime(props.start)
        }
    }

    getRemainingTime() {
        return Math.floor((this.props.start + (this.props.duration * 1000) - new Date().getTime()) / 1000);
    }

    componentDidMount() {
        if (this.props.start) {
            this.interval = setInterval(() => {
                this.setState({remaining: this.getRemainingTime(this.props.start)});
            }, 1000);    
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.start !== prevProps.start) {
            this.setState({remaining: this.getRemainingTime(this.props.start)});
            this.interval = setInterval(() => {
                this.setState({remaining: this.getRemainingTime(this.props.start)});
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    render() {
        if (this.state.remaining) {
            return (
                <div className={this.state.remaining <= 10 ? "timer scary" : "timer"}>{this.state.remaining}</div>
            );    
        }
        return (<div></div>);
    }
}

export default Timer;