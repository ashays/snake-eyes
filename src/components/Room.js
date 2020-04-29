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
        participants: [{id: this.props.id}],
        chat: []
    }
    this.receive = this.receive.bind(this);
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
            this.send([connection], {type: "log", message: `Hello from your host ${this.props.id}`});
            this.setState((state, props) => {
                let connections = state.connections;
                let participants = state.participants;
                if (!(connection.peer in connections)) {
                    connections[connection.peer] = connection;
                    participants.push({id: connection.peer});    
                }
                return ({connections, participants});
            }, () => {
                console.log("Sending participants: ", this.state.participants);
                this.send(this.state.connections, {type: "participants", participants: this.state.participants});
            });
        } else {
            this.setState((state, props) => {
                let connections = state.connections;
                connections[connection.peer] = connection;
                return ({connections});
            });
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
                let connections = state.connections;
                let participants = state.participants;
                delete connections[connection.peer];
                participants.forEach((participant, i) => {
                    if (participant.id === connection.peer) {
                        participants.splice(i, 1);
                    }
                });
                return ({connections, participants});
            }, () => {
                console.log("Sending participants: ", this.state.participants);
                this.send(this.state.connections, {type: "participants", participants: this.state.participants});
            });
        }
    });

    // Receive messages
    connection.on('data', this.receive);
  }

  send(connections, data) {
      for (const id in connections) {
          connections[id].send(data);
      }
  }

  receive(data) {
      if (data.type && data.type === "log") {
          console.log(data.message)
      } else if (data.type && data.type === "participants") {
          this.setState({participants: data.participants});
      }
  }

  componentWillUnmount() {

  }
  
  render() {
      const participantList = this.state.participants.map((participant) =>
        (<li key={participant.id}>{participant.id}</li>)
      );
      return (
        <div>
            <h1>Room</h1>
            <ul>{participantList}</ul>
        </div>
      );
  }
}

export default withRouter(Room);
