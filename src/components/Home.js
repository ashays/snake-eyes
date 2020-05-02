import React from 'react';
import { Link } from "react-router-dom";
import './Home.css';

class Home extends React.Component {
  render() {
    return (
        <div>
            {this.props.id &&
              <div className="game">
                <h2>Hot Potato</h2>
                <p>Describe and guess words as quickly as possible for more points... but don't let the buzzer end on you 🙀</p>
                <Link to={"room/" + this.props.id}>Play</Link>
              </div>
            }            
        </div>
    );
  }
}

export default Home;
