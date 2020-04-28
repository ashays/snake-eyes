import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home';
import Room from './components/Room';
import './App.css';

import Peer from 'peerjs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined
    };
  }

  componentDidMount() {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      this.setState({ id, peer });
    });
  }

  componentWillUnmount() {
    
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/room/:id">
            <Room id={this.state.id} peer={this.state.peer} />
          </Route>
          <Route path="/">
            <Home id={this.state.id} />
          </Route>
        </Switch>
      </Router>
    );  
  }
}

export default App;