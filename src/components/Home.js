import React from 'react';
import { Link } from "react-router-dom";
import './Home.css';

class Home extends React.Component {
  render() {
    return (
        <div>
            {this.props.id &&
                <div className="container" id="lobby">
                  <div className="instructions">
                      <h1>Hot Potato</h1>
                      <p>60 seconds on the clock. Take turns describing words to the other players. Correctly guess as many as you can, as quickly as you can—but don't let the timer end on your turn or you might lose it all.</p>
                      <Link to={"hotpotato/" + this.props.id} className="button">Create Room</Link>
                  </div>
                </div>
            }            
        </div>
    );
  }
}

export default Home;