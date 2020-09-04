import React from 'react'
import PlanetRowPortrait from './PlanetRowPortrait'
import { formatBigNumber } from '../../util/BigNumberFormat'

function PlanetsTablePortrait({ planets }) {
    

    return (
        <table  className='planetTable' style={{ borderCollapse: 'collapse', borderSpacing: '5px' }}>
            <tbody>
                {planets.map(planet =>
                    <PlanetRowPortrait
                        key={planet.name}
                        name={planet.name}
                        population={formatBigNumber(planet.population)}
                        climate={planet.climate}
                        gravity={planet.gravity}
                        terrain={planet.terrain}
                    />
                )}
            </tbody>
        </table>
    )
}

export default PlanetsTablePortrait
