export const fetchStarWarsPlanets = async () => {
    try{
        const response = await fetch('https://swapi.dev/api/planets/')
        if (response) {
            const result = await response.json();
            return result.results
        } else {
            console.log('planet resonse is null')
            return null;
        }
    } catch {   
        console.log('error in loadgin planets')
        return null;
    }        
}