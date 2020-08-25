import React from 'react'

function PlanetRowLandscape(props) {
    return (
        <tr>
            <td className='planet-td'><b>{props.name}</b></td>
            <td className='planet-td'>{props.population}</td>
            <td className='planet-td'>{props.climate}</td>
            <td className='planet-td'>{props.gravity}</td>
            <td className='planet-td'>{props.terrain}</td>
        </tr>
    )
}

export default PlanetRowLandscape
