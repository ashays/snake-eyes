import React from 'react';
import './Participants.css';

function Participant(props) {
    
    return (
        <div key={props.id} className="participant">
            <div className="propic"><img src={"https://api.adorable.io/avatars/75/" + props.id} alt={props.name + "'s Avatar"} /></div>
            <div className="name">{props.name}</div>
            {props.score && 
                <div className="score-line"></div>
            }
            {props.score && 
                <div className="score">{props.score}</div>
            }
        </div>
    );
}

export default Participant;