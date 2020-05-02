import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Participants from './Participants';
import Card from './Card';
import Timer from './Timer';
import Chat from './Chat';
import './Room.css';

import randomWord from '../data/words';
import cheer from '../assets/sounds/cheer.mp3';
import ting from '../assets/sounds/ting.mp3';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHost: this.props.id === this.props.match.params.id,
            connections: {},
            round: {},
            turn: {},
            participants: this.props.id ? {[this.props.id]: {name: this.props.id, score: 0}} : {},
            chat: []
        };
        this.startRound = this.startRound.bind(this);
        this.endRound = this.endRound.bind(this);
        this.receive = this.receive.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
    }

    componentDidMount() {
        if (this.props.id && !this.state.isHost) {
            let conn = this.props.peer.connect(this.props.match.params.id);
            this.setupConnection(conn);
        } else if (this.state.isHost) {
            // User is the host
            this.props.peer.on('connection', (conn) => {
                // console.log("Setting up connection w", conn);
                this.setupConnection(conn);
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && !this.state.isHost) {
            // TODO Potentially disconnect old id?
            let conn = this.props.peer.connect(this.props.match.params.id);
            this.setupConnection(conn);
        }
    }

    setupConnection(connection) {
        // When connection established
        connection.on('open', () => {
            if (this.state.isHost) {
                this.setState((state, props) => {
                    return ({
                        connections: {...state.connections, [connection.peer]: connection}, 
                        participants: {...state.participants, [connection.peer]: {name: connection.peer, score: 0}}
                    });
                }, () => {
                    this.send({type: "sync", prop: "participants", data: this.state.participants});
                });
            } else {
                this.setState((state, props) => ({connections: {...state.connections, [connection.peer]: connection}}));
            }
        });

        connection.on('error', (err) => {
            console.error(err);
            // Try again
            if (this.props.id && !this.state.isHost) {
                let conn = this.props.peer.connect(this.props.match.params.id);
                this.setupConnection(conn);
            }
        });

        connection.on('close', () => {
            if (this.state.isHost) {
                this.setState((state, props) => {
                    let connections = {...state.connections};
                    let participants = {...state.participants};
                    delete connections[connection.peer];
                    delete participants[connection.peer];
                    return ({connections, participants});
                }, () => {
                    // console.log("Sending participants: ", this.state.participants);
                    this.send({type: "sync", prop: "participants", data: this.state.participants});
                });
            }
        });

        // Receive messages
        connection.on('data', (data) => {
            this.receive(data, connection.peer);
        });
    }

    send(data, connections = this.state.connections) {
        for (const id in connections) {
            connections[id].send(data);
        }
    }

    receive(data, sender) {
        switch (data.type) {
            case "log":
                console.log(data.message)
                break;
            case "chat":
                this.addToChat(data.message, sender);
                break;
            case "sync":
                this.setState({[data.prop]: data.data});
                break;
            case "sound":
                let tingAudio = new Audio(ting);
                tingAudio.play();
                break;
            default:
                console.log("Received ", data);
        }
    }

    sendAndReceive(data, connections = this.state.connections) {
        this.send(data, connections);
        this.receive(data, this.props.id);
    }

    nextTurn() {
        let word = randomWord();
        let participants = Object.keys(this.state.participants);
        let pIndex = 0;
        if (this.state.turn.pIndex !== undefined) {
            pIndex = this.state.turn.pIndex + 1 < participants.length ? this.state.turn.pIndex + 1: 0;
        }
        let turn = {
            pId: participants[pIndex],
            pIndex,
            word,
            start: new Date().getTime()
        };
        this.send({type: "sync", prop: "turn", data: turn});
        this.setState({turn});
    }

    startRound() {
        let round = {
            playing: true,
            start: new Date().getTime()
        };
        setTimeout(this.endRound, 60000);
        this.nextTurn();
        this.send({type: "sync", prop: "round", data: round});
        this.setState({round});
    }

    endRound() {
        let round = {
            playing: false
        };
        this.send({type: "sync", prop: "round", data: round});
        this.setState({round});
        // If it ends on your turn, you lose 5 points
        let participants = {...this.state.participants};
        let currentScore = participants[this.state.turn.pId].score;
        participants[this.state.turn.pId].score -= currentScore > 5 ? 5 : currentScore;
        this.setState({participants});
        this.send({type: "sync", prop: "participants", data: participants});
    }

    addToChat(message, sender) {
        if (this.state.isHost) {
            if (this.state.round.playing && message && message.toLowerCase() === this.state.turn.word.toLowerCase() && this.state.turn.pId !== sender) {
                // They got the word!
                this.sendAndReceive({type: "sound", name: "ting"});
                // TODO send announcement
                // Increment score
                let participants = {...this.state.participants};
                let points = 10 - Math.floor((new Date().getTime() - this.state.turn.start) / 1000); 
                participants[this.state.turn.pId].score += points > 0 ? points : 1;
                participants[sender].score += points > 0 ? points : 1;
                this.sendAndReceive({type: "sync", prop: "participants", data: participants});
                // Start next turn
                this.nextTurn();
            }
            this.send({type: "chat", message: {message, sender}});
            this.setState((state, props) => ({chat : [...state.chat, {message, sender}]}));
        } else {
            this.setState((state, props) => ({chat : [...state.chat, message]}));
        }
    }

    sendChatMessage(event) {
        event.preventDefault();
        let message = event.target.elements.message.value.trim();
        if (message) {
            if (this.state.isHost) {
                this.addToChat(message, this.props.id);
            } else {
                this.send({type: "chat", message});
            }
            if (this.state.round.playing && message && message.toLowerCase() === this.state.turn.word.toLowerCase() && this.state.turn.pId !== this.props.id) {
                let cheerAudio = new Audio(cheer);
                cheerAudio.play();
            }
        }
        event.target.elements.message.value = "";
    }
  
    render() {
        if (!this.state.isHost && !this.state.connections[this.props.match.params.id]) {
            return (<div className="loader"></div>);
        }
        return (
            <div className="container">
                <Chat chat={this.state.chat} />
                <main>
                    <Timer start={this.state.round.start} duration={60} isPlayersTurn={this.props.id === this.state.turn.pId} />
                    <Card round={this.state.round} player={this.props.id} turn={this.state.turn} />
                    <Participants participants={this.state.participants} turn={this.state.turn} />
                    {this.state.isHost && !this.state.round.playing &&
                        <button type="button" onClick={this.startRound}>Start game!</button>
                    }
                </main>
                <form onSubmit={this.sendChatMessage} autoComplete="off">
                    <input type="text" id="message" name="message" placeholder={this.state.round.playing ? "Enter Guess" : "Enter Message"} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        );
    }
}

export default withRouter(Room);