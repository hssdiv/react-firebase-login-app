import React from 'react'

function PlanetRowCellPortrait(props) {
    return (
        <div className='planet-div'>
            <span className='firstPlanetTableChild'><b>{props.name}</b></span>
            <span className='secondPlanetTableChild'>{props.value}</span>
        </div>
    )
}

export default PlanetRowCellPortrait
