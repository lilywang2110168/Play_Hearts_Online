/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

import React, { Component }     from 'react';
import md5                      from 'md5';


function GravHash(email, size) {
    let hash = email.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    hash = hash.toLowerCase();
    hash = md5(hash);
    return `https://www.gravatar.com/avatar/${hash}?size=${size}`;
}

/*************************************************************************/

export const Gravitar = ({ email, size, onClick }) => {
    return <img className="gravitar" src={GravHash(email, size)} onClick={onClick?onClick:undefined}/> ;
};

Gravitar.propTypes = {
    email:  React.PropTypes.string.isRequired,
    size:   React.PropTypes.number,
    onClick:React.PropTypes.func
};
Gravitar.defaultProps = {
    size:   50
};
