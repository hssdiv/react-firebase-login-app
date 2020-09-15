import React, { useState, useEffect, useContext } from 'react'
import { PlanetsContext } from '../../context/PlanetsContext'
import PlanetsTableLandscape from '../PlanetsTable/PlanetsTableLandscape'
import PlanetsTablePortrait from '../PlanetsTable/PlanetsTablePortrait'
import GetWidth from '../../ui/useWindowSize'
import SimpleErrorMessage from '../SimpleErrorMessage'
import Spinner from '../Spinner'

export function Planets() {
    const [errorMessage, setErrorMessage] = useState(null)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)

    const { planetsResult, planetsMethods } = useContext(PlanetsContext)

    useEffect(() => {
        setSpinnerIsVisible(true)

        const call = async () => {
            const result = await planetsMethods.fetchPlanets();
            if (result) {
                if (result.loaded) {
                    setSpinnerIsVisible(false);
                    setErrorMessage(null);
                } else {
                    setSpinnerIsVisible(false);
                    setErrorMessage(result.errorMessage);
                }
            } else {
                setSpinnerIsVisible(false);
                setErrorMessage(null);
            }
        }
        call();
        
    }, [planetsMethods])

    const currentScreenWidth = GetWidth()

    return (
        <div>
            <h1>Planets page</h1>
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
                errorMessage &&
                <SimpleErrorMessage
                    error={errorMessage}
                />
            }
            {spinnerIsVisible &&
                <Spinner />}
        </div>
    )
}