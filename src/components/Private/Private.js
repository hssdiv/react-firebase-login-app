import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PlanetsTableLandscape from './PlanetsTableLandscape'
import PlanetsTablePortrait from './PlanetsTablePortrait'
import GetWidth from '../../ui/useWindowSize'
import '../../Styles/Private.css';

function Private() {
    const { currentUser } = useContext(AuthContext)

    const [planetsResult, setPlanetsResult] = useState()

    useEffect(() => {
        planets()
    }, [])

    const planets = async function fetchStarWarsPlanets() {
        const response = await fetch('https://swapi.dev/api/planets/')

        if (response) {
            const result = await response.json();
            console.log(result)
            setPlanetsResult(result.results)
        } else {
            console.log('resonse is null')
            setPlanetsResult(null)
        }
    }

    const currentScreenWidth = GetWidth()


    return (
        <div>
            <h1>Private page</h1>
            {currentUser
                ?
                <>
                    <div>hello: {currentUser.email}</div>
                    {planetsResult
                        ?
                        <>
                            {currentScreenWidth > 1000
                                ?
                                <PlanetsTableLandscape
                                    planets={planetsResult}
                                />
                                :
                                <PlanetsTablePortrait
                                    planets={planetsResult}
                                />
                            }
                        </>
                        :
                        <>
                        </>
                    }
                </>
                :
                <>
                </>
            }
        </div>
    )
}

export default Private
