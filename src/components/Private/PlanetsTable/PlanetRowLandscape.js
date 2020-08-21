import React from 'react'

function PlanetRowLandscape(props) {
    return (
        <tr>
            <td><b>{props.name}</b></td>
            <td>{props.population}</td>
            <td>{props.climate}</td>
            <td>{props.gravity}</td>
            <td>{props.terrain}</td>
        </tr>
    )
}

export default PlanetRowLandscape
