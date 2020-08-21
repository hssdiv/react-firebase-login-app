import React from 'react'
import PlanetRowCellPortrait from './PlanetRowCellPortrait'

function PlanetRowPortrait(props) {
    return (
        <tr style={{ textAlign: 'left' }}>
            <td>
                <PlanetRowCellPortrait name='Name' value={props.name} />
                <PlanetRowCellPortrait name='Population' value={props.population} />
                <PlanetRowCellPortrait name='Climate' value={props.climate} />
                <PlanetRowCellPortrait name='Gravity' value={props.gravity} />
                <PlanetRowCellPortrait name='Terrain' value={props.terrain} />
            </td>
        </tr>
    )
}

export default PlanetRowPortrait
