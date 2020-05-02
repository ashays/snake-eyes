import React from 'react';
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
        <div>
            <h2>Home</h2>
            {this.props.id &&
              <Link to={"room/" + this.props.id}>Create Room</Link>
            }            
        </div>
    );
  }
}

export default Home;
