import React from 'react'
import PlanetRowLandscape from './PlanetRowLandscape'

function PlanetsTableLandscape({ planets }) {
    return (
        <table className='planetTable'>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Population</th>
                    <th>Climate</th>
                    <th>Gravity</th>
                    <th>Terrain</th>
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
