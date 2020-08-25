export const fetchStarWarsPlanets = async (setPlanetsResult, setErrorMessage, setSpinnerIsVisible) => {
    try{
        setSpinnerIsVisible(true)
        const response = await fetch('https://swapi.dev/api/planets/')
        if (response) {
            const result = await response.json();
            setSpinnerIsVisible(false)
            setPlanetsResult(result.results)
        } else {
            console.log('planet resonse is null')
            setErrorMessage("Coudn't load planets from server")
            setPlanetsResult(null)
            setSpinnerIsVisible(false)
        }
    } catch {   
        setSpinnerIsVisible(false)
        setErrorMessage("Coudn't load planets from server")
    }        
}