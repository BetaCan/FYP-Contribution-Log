// Card.js
import React from 'react'
import './Card.scss'

export default function Card({ title, description, ...props }) {
    return (
        <div className='card'>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className='card-details'>
                {Object.keys(props).map((key) => (
                    <p key={key}>
                        <strong>{key}:</strong> {props[key]}
                    </p>
                ))}
            </div>
        </div>
    )
}
