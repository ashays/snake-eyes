import React from 'react';
import './Participant.css';

function Participant(props) {
    
    return (
        <div key={props.id} className="participant">
            <img className="propic" src={"https://api.adorable.io/avatars/75/" + props.id} alt={props.name + "'s Avatar"} />
            <div className="name">{props.name}</div>
            <div className="line"></div>
            {props.score !== undefined && 
                <div className="score">{props.score}</div>
            }
        </div>
    );
}

export default Participant;