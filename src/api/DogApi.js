export const getRandomDog = async () => {
    try{
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        if (response) {
            const result = await response.json();
            if (result.status === 'success') {
                return result;
            }
        }
    } catch {
        return null;
    }  
    return null;
}