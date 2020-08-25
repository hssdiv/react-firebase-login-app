import React from 'react'
import PlanetRowLandscape from './PlanetRowLandscape'

function PlanetsTableLandscape({ planets }) {
    return (
        <table className='planetTable'>
            <tbody>
                <tr>
                    <th className='planet-th'>Name</th>
                    <th className='planet-th'>Population</th>
                    <th className='planet-th'>Climate</th>
                    <th className='planet-th'>Gravity</th>
                    <th className='planet-th'>Terrain</th>
                </tr>
                {planets.map(planet =>
                    <PlanetRowLandscape
                        key={planet.name}
                        name={planet.name}
                        population={planet.population}
                        climate={planet.climate}
                        gravity={planet.gravity}
                        terrain={planet.terrain}
                    />
                )}
            </tbody>
        </table>
    )
}

export default PlanetsTableLandscape
