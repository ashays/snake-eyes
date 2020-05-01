import React, { Component } from 'react';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remaining: this.getRemainingTime(props.start)
        }
    }

    getRemainingTime(start) {
        if (start) {
            return Math.floor((start + 60000 - new Date().getTime()) / 1000);
        } else {
            return false;
        }
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
        return (
            <div className="timer">{this.state.remaining}</div>
        );
    }
}

export default Timer;