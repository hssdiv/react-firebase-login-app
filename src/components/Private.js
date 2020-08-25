import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import PlanetsTableLandscape from '../context/PlanetsTable/PlanetsTableLandscape'
import PlanetsTablePortrait from '../context/PlanetsTable/PlanetsTablePortrait'
import GetWidth from '../ui/useWindowSize'
import '../styles/Private.css';
import SimpleErrorMessage from './SimpleErrorMessage'
import { fetchStarWarsPlanets } from '../api/PlanetsApi'
import Spinner from './Spinner'

function Private() {
    const { currentUser } = useContext(AuthContext)

    const [planetsResult, setPlanetsResult] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    
    useEffect(() => {
        fetchStarWarsPlanets(setPlanetsResult, setErrorMessage, setSpinnerIsVisible)
    }, [])

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
                    {spinnerIsVisible &&
                    <Spinner/>}
                </>
        </div>
    )
}

export default Private
