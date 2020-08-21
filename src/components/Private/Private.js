import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PlanetsTableLandscape from './PlanetsTable/PlanetsTableLandscape'
import PlanetsTablePortrait from './PlanetsTable/PlanetsTablePortrait'
import GetWidth from '../../ui/useWindowSize'
import '../../styles/Private.css';
import SimpleErrorMessage from '../SimpleErrorMessage'

function Private() {
    const { currentUser } = useContext(AuthContext)

    const [planetsResult, setPlanetsResult] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)


    useEffect(() => {
        planets()
    }, [])

    const planets = async function fetchStarWarsPlanets() {
        try{
            const response = await fetch('https://swapi.dev/api/planets/')
            if (response) {
                const result = await response.json();
                //console.log(result)
                setPlanetsResult(result.results)
            } else {
                console.log('planet resonse is null')
                setErrorMessage("Coudn't load planets from server")
                setPlanetsResult(null)
            }
        } catch {
            setErrorMessage("Coudn't load planets from server")
        }        
    }

    const currentScreenWidth = GetWidth()

    return (
        <div>
            <h1>Private page</h1>
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
                        errorMessage && <SimpleErrorMessage error={errorMessage}/>                        
                    }
                </>
        </div>
    )
}

export default Private
