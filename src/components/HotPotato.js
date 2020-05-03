import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Participants from './Participants';
import Profile from './Profile';
import Card from './Card';
import Timer from './Timer';
import Chat from './Chat';
import './HotPotato.css';

import randomWord from '../data/words';
import cheer from '../assets/sounds/cheer.mp3';
import ting from '../assets/sounds/ting.mp3';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHost: this.props.id === this.props.match.params.id,
            connections: {},
            round: {},
            turn: {},
            participants: this.props.id ? {[this.props.id]: {name: this.props.player, score: 0}} : {},
            chat: []
        };
        this.startRound = this.startRound.bind(this);
        this.endRound = this.endRound.bind(this);
        this.receive = this.receive.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
    }

    componentDidMount() {
        if (this.state.isHost) {
            this.props.peer.on('connection', (conn) => {
                this.setupConnection(conn);
            });
        }
    }

    componentDidUpdate(prevProps) {
        // If name or ID has changed (and both exist and is host), setup a connection with the host
        if (this.props.id !== prevProps.id || this.props.player !== prevProps.player) {
            if (!this.state.isHost && this.props.id && this.props.player) {
                let conn = this.props.peer.connect(this.props.match.params.id);
                this.setupConnection(conn);
            } else if (this.state.isHost && this.props.player) {
                this.receive({type: "name", name: this.props.player}, this.props.id);
            }
        }
    }

    setupConnection(connection) {
        // When connection established
        connection.on('open', () => {
            if (this.state.isHost) {
                this.setState((state, props) => ({
                        connections: {...state.connections, [connection.peer]: connection}, 
                        participants: {...state.participants, [connection.peer]: {name: connection.peer, score: 0}}
                }), () => {
                    this.send({type: "sync", prop: "participants", data: this.state.participants});
                });
            } else {
                this.setState((state, props) => ({connections: {...state.connections, [connection.peer]: connection}}));
                this.send({type: "name", name: this.props.player});
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
            case "redirect":
                this.props.history.push(data.location);
                break;
            case "name":
                let participants = {...this.state.participants};
                participants[sender].name = data.name;
                this.sendAndReceive({type: "sync", prop: "participants", data: participants});
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
        this.sendAndReceive({type: "sync", prop: "round", data: round});
        this.sendAndReceive({type: "redirect", location: `/hotpotato/${this.props.match.params.id}/play`});
    }

    endRound() {
        let round = {
            playing: false
        };
        this.sendAndReceive({type: "sync", prop: "round", data: round});
        // If it ends on your turn, you lose 5 points
        let participants = {...this.state.participants};
        let currentScore = participants[this.state.turn.pId].score;
        participants[this.state.turn.pId].score -= currentScore > 5 ? 5 : currentScore;
        this.sendAndReceive({type: "sync", prop: "participants", data: participants});
        this.sendAndReceive({type: "redirect", location: `/hotpotato/${this.props.match.params.id}/scores`});
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
        if (!this.props.player) {
            return (
                <Profile id={this.props.id} updateName={this.props.updateName} />
            );
        } else if (!this.state.isHost && !this.state.connections[this.props.match.params.id]) {
            return (<div className="loader"></div>);
        }
        return (
            <Switch>
                <Redirect exact from='/hotpotato/:id' to="/hotpotato/:id/lobby" />
                <Route path="/hotpotato/:id/lobby">
                    <div>
                        <h1>Hot Potato</h1>
                        <p>60 seconds on the clock. Take turns describing words to the other players. Correctly guess as many as you can, as quickly as you can—but don't let the timer end on your turn or you might lose it all.</p>
                        <Participants participants={this.state.participants} turn={this.state.turn} player={this.props.id} />
                        {this.state.isHost && !this.state.round.playing && Object.keys(this.state.participants).length > 1 &&
                            <button type="button" onClick={this.startRound}>Start</button>
                        }
                    </div>
                </Route>
                <Route path="/hotpotato/:id/play">
                    <div className="container">
                        <Chat chat={this.state.chat} participants={this.state.participants} />
                        <main>
                            <h1>Hot Potato</h1>
                            {Object.keys(this.state.participants).length < 2 &&
                                <p>Invite friends to play using the URL</p>
                            }
                            <Timer start={this.state.round.start} duration={60} isPlayersTurn={this.props.id === this.state.turn.pId} />
                            <Card round={this.state.round} player={this.props.id} turn={this.state.turn} />
                            <Participants participants={this.state.participants} turn={this.state.turn} player={this.props.id} />
                            {this.state.isHost && !this.state.round.playing && Object.keys(this.state.participants).length > 1 &&
                                <button type="button" onClick={this.startRound}>Start</button>
                            }
                        </main>
                        <form onSubmit={this.sendChatMessage} autoComplete="off" className="chatbar">
                            <input type="text" id="message" name="message" placeholder={this.state.round.playing ? "Enter Guess" : "Enter Message"} />
                            <input type="submit" value="Send" />
                        </form>
                    </div>
                </Route>
                <Route path="/hotpotato/:id/scores">
                    <h1>Scores</h1>
                    <Participants participants={this.state.participants} turn={this.state.turn} player={this.props.id} />
                    {this.state.isHost && !this.state.round.playing && Object.keys(this.state.participants).length > 1 &&
                        <button type="button" onClick={this.startRound}>Start</button>
                    }
                </Route>
            </Switch>
        );
    }
}

export default withRouter(Room);