export const getRandomDogo = async (callback, setSpinnerIsVisible) => {
    try{
        setSpinnerIsVisible(true)
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        setSpinnerIsVisible(false)
        if (response) {
            const result = await response.json();
            if (result.status === 'success') {
                return callback(result);
            }
        }
    } catch {
        setSpinnerIsVisible(false)
        return callback({error: 'Coudn\'t get dogos from server'})
    }  
    return callback({error: 'Coudn\'t get dogos from server'})
}