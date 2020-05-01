import React from 'react';
import './Card.css';

function Card(props) {
    if (props.round.playing && props.turn.pId === props.player) {
        return (
            <div className="card">
                <div className="word">{props.turn.word}</div>
                <div className="instructions">Give clues and get someone to guess your word! Don't rhyme, translate, or spell the word. The faster someone guesses your word, the more points that are awarded.</div>
            </div>
        );
    } else if (props.round.playing) {
        return (
            <div className="card flipped">
                <div className="profile"><img src={"https://api.adorable.io/avatars/75/" + props.turn.pId} alt={props.turn.pId + "'s Avatar"} /></div>
                <div className="instructions">Be the first to guess the word and earn points!</div>
            </div>
        );    
    } else {
        return (<div></div>);
    }
}

export default Card;