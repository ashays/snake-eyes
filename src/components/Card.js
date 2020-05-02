import React from 'react';
import './Card.css';

function Card(props) {
    if (props.round.playing && props.turn.pId === props.player) {
        return (
            <div className="card">
                <div className="word">{props.turn.word}</div>
                <div className="instructions">Give clues and get someone to guess your word! No rhyming, translating, or spelling, and don't let the timer end on you!</div>
            </div>
        );
    } else if (props.round.playing) {
        return (
            <div className="card flipped">
                <img src={"https://api.adorable.io/avatars/75/" + props.turn.pId} alt={props.turn.pId + "'s Avatar"} />
                <div className="instructions">Be the first to guess the word to earn points!</div>
            </div>
        );    
    } else {
        return (<div></div>);
    }
}

export default Card;