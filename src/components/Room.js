import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Participants from './Participants';
import Chat from './Chat';
import './Room.css';

import medium from '../words/words';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHost: this.props.id === this.props.match.params.id,
            connections: {},
            turn: {},
            participants: this.props.id ? {[this.props.id]: {name: this.props.id, score: 0}} : {},
            chat: []
        }
        this.words = medium;
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
                // console.log("Connection opened, ", connection);
                // this.send({type: "log", message: `Hello from your host ${this.props.id}`}, [connection]);
                this.setState((state, props) => {
                    return ({
                        connections: {...state.connections, [connection.peer]: connection}, 
                        participants: {...state.participants, [connection.peer]: {name: connection.peer, score: 0}}
                    });
                }, () => {
                    // console.log("Sending participants: ", this.state.participants);
                    this.send({type: "participants", participants: this.state.participants});
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
                    this.send({type: "participants", participants: this.state.participants});
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
            case "turn":
                this.setState({turn: data.turn});
                break;
            case "participants":
                this.setState({participants: data.participants});
                break;
            default:
                console.log("Received ", data);
        }
    }

    nextTurn() {
        let word = this.words[Math.floor(Math.random() * this.words.length)];
        let participants = Object.keys(this.state.participants);
        let pIndex = 0;
        if (this.state.turn.pIndex !== undefined) {
            pIndex = this.state.turn.pIndex + 1 < participants.length ? this.state.turn.pIndex + 1: 0;
        }
        let turn = {
            pId: participants[pIndex],
            pIndex,
            word,
        };
        this.send({type: "turn", turn});
        this.setState({turn});
    }

    addToChat(message, sender) {
        if (this.state.isHost) {
            if (message === this.state.turn.word && this.state.turn.pId !== sender) {
                // They got the word!
                // TODO send announcement
                // Increment score
                let participants = {...this.state.participants};
                participants[this.state.turn.pId].score++;
                participants[sender].score++;
                this.setState({participants});
                this.send({type: "participants", participants: participants});
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
        let message = event.target.elements.message.value;
        if (this.state.isHost) {
            this.addToChat(message, this.props.id);
        } else {
            this.send({type: "chat", message});
        }
        event.target.elements.message.value = "";
    }
  
    render() {
        return (
            <div className="container">
                <Chat chat={this.state.chat} />
                <main>
                    <h1>Room</h1>
                    <Participants participants={this.state.participants} turn={this.state.turn} />
                    {this.state.isHost && this.state.turn.pIndex === undefined &&
                        <button type="button" onClick={this.nextTurn}>Start game!</button>
                    }
                    {this.state.turn.pId === this.props.id &&
                        <div className="word">{this.state.turn.word}</div>
                    }
                </main>
                <form onSubmit={this.sendChatMessage} autoComplete="off">
                    <input type="text" id="message" name="message" placeholder="Enter Message" />
                    <input type="submit" value="Send" />
                </form>
            </div>
        );
    }
}

export default withRouter(Room);