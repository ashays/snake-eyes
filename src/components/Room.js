import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './Room.css';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
        connection: undefined
    }
  }

  componentDidMount() {
    if (this.props.id && this.props.id !== this.props.match.params.id) {
        let conn = this.props.peer.connect(this.props.match.params.id);
        this.setupConnection(conn);
    } else if (this.props.id === this.props.match.params.id) {
        // User is the host
        this.props.peer.on('connection', (conn) => {
            this.setupConnection(conn);
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id && this.props.id !== this.props.match.params.id) {
        // TODO Potentially disconnect old id?
        let conn = this.props.peer.connect(this.props.match.params.id);
        this.setupConnection(conn);
    }
  }

  setupConnection(connection) {
    //   Save connection object
    this.setState({ connection });

    // When connection established
    connection.on('open', () => {
        // Send messages
        connection.send('Hello from ' + this.props.id);
    });

    // Receive messages
    connection.on('data', (data) => {
        console.log('Received', data);
    });
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
          <h1>Room</h1>
      </div>
    );
  }
}

export default withRouter(Room);
