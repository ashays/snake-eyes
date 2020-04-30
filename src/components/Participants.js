import React from 'react';
import './Participants.css';

function Participants(props) {
    const participantList = Object.entries(props.participants).map((entry) => (
        <li key={entry[0]}>
            {props.turn.pId === entry[0] && "👑"}
            {entry[1].name}
            {entry[1].score}
        </li>
    ));

    return (
        <ul>{participantList}</ul>
    );
}

export default Participants;