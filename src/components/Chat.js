import React from 'react';
import './Chat.css';

function Chat(props) {
    let prevSender = "";
    const chat = props.chat.map((message, i) => {
        let senderText;
        if (message.sender !== prevSender) {
            senderText = (<div className="sender">{message.sender}</div>);
            prevSender = message.sender;
        }
        return (
            <div key={i}>
                {senderText}
                <div className="message">{message.message}</div>
            </div>
        );
    });

    return (
        <div className="chat">{chat}</div>
    );
}

export default Chat;