import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div className="client">
            <Avatar name={username} size={44} round="6px" />
            <span className="userName text-sm">{username}</span>
        </div>
    );
};

export default Client;
