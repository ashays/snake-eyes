import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './Room.css';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isHost: this.props.id === this.props.match.params.id,
        connections: {},
        turn: -1,
        participants: this.props.id ? {[this.props.id] : {}} : {},
        chat: []
    }
    this.receive = this.receive.bind(this);
    this.sendChatMessage = this.sendChatMessage.bind(this);
  }

  componentDidMount() {
    if (this.props.id && !this.state.isHost) {
        let conn = this.props.peer.connect(this.props.match.params.id);
        this.setupConnection(conn);
    } else if (this.state.isHost) {
        // User is the host
        this.props.peer.on('connection', (conn) => {
            console.log("Setting up connection w", conn);
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
            console.log("Connection opened, ", connection);
            this.send({type: "log", message: `Hello from your host ${this.props.id}`}, [connection]);
            this.setState((state, props) => {
                return ({
                    connections: {...state.connections, [connection.peer]: connection}, 
                    participants: {...state.participants, [connection.peer]: {}}
                });
            }, () => {
                console.log("Sending participants: ", this.state.participants);
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
                console.log("Sending participants: ", this.state.participants);
                this.send({type: "participants", participants: this.state.participants});
            });
        }
    });

    // Receive messages
    connection.on('data', this.receive);
  }

  send(data, connections = this.state.connections) {
      for (const id in connections) {
          connections[id].send(data);
      }
  }

  receive(data) {
    switch (data.type) {
        case "log":
            console.log(data.message)
            break;
        case "participants":
            this.setState({participants: data.participants});
            break;
        case "chat":
            this.addToChat(data.message);
            break;
        default:
          console.log("Received ", data);
      }
  }

  addToChat(message) {
      if (this.state.isHost) {
          this.send({type: "chat", message});
      }
      this.setState((state, props) => ({chat : [...state.chat, message]}));
  }

  sendChatMessage(event) {
      event.preventDefault();
      let message = event.target.elements.message.value;
      if (this.state.isHost) {
          this.addToChat(message);
      } else {
        this.send({type: "chat", message});
      }
      event.target.elements.message.value = "";
  }
  
  render() {
      const participantList = Object.keys(this.state.participants).map((key) =>
        (<li key={key}>{key}</li>)
      );
      const chat = this.state.chat.map((message, i) => 
        (<div key={i}>{message}</div>)
      );
      return (
        <div>
            <h1>Room</h1>
            <ul>{participantList}</ul>
            <div className="chat">{chat}</div>
            <form onSubmit={this.sendChatMessage} autoComplete="off">
                <input type="text" id="message" name="message" placeholder="Enter Message" />
                <input type="submit" value="Send" />
            </form>
        </div>
      );
  }
}

export default withRouter(Room);
