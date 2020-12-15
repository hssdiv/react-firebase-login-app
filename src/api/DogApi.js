export const getRandomDog = async () => {
    try{
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        const result = await response.json();
        if (response.ok) {
            return result;
        }
    } catch {
        return null;
    }  
    return null;
}