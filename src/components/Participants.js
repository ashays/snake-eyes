import React from 'react';
import './Participants.css';

function Participants(props) {
    const participantList = Object.entries(props.participants).map((entry) => (
        <div key={entry[0]} className={props.turn.pId === entry[0] ? "active participant" : "participant"}>
            <img className="propic" src={"https://api.adorable.io/avatars/75/" + entry[0]} alt={entry[1].name + "'s Avatar"} />
            <div className="name">{entry[1].name} [{entry[1].score}]</div>
        </div>
    ));

    return (
        <div className="participants">{participantList}</div>
    );
}

export default Participants;