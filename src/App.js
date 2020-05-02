import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home';
import Room from './components/Room';
import './App.css';

import Peer from 'peerjs';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      name: undefined
    };
    this.updateName = this.updateName.bind(this);
  }

  componentDidMount() {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      this.setState({ id, peer });
    });
  }

  componentWillUnmount() {
    this.state.peer.disconnect();
  };

  updateName(name) {
    this.setState({ name });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/room/:id">
            <Room id={this.state.id} peer={this.state.peer} player={this.state.name} updateName={this.updateName} />
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