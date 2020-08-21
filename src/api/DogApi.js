//https://dog.ceo/api/breed/hound/list    {"message":["afghan","basset","blood","english","ibizan","plott","walker"],"status":"success"}
// or {"message":["shepherd"],"status":"success"}

//https://dog.ceo/api/breed/african/list   {"message":[],"status":"success"}

//https://dog.ceo/api/breeds/image/random   {"message": "https://images.dog.ceo/breeds/terrier-yorkshire/n02094433_7702.jpg","status": "success"}

export const getRandomDogo = async (callback) => {
    try{
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        if (response) {
            const result = await response.json();
            if (result.status === "success") {
                //console.log('vau:'+result.message)
                return callback(result);
            }
        }
    } catch {
        return callback({error: "Coudn't get dogos from server"})
    }  
    return callback({error: "Coudn't get dogos from server"})
}

/*export const getSubBreeds = async (breed, callback) => {
    try{
        const response = await fetch('https://dog.ceo/api/breed/' + breed + '/list')
        if (response) {
            const result = await response.json();
            if (result.status === "success") {
                console.log('vau:'+result.message)
                return callback(result);
            }
        }
    } catch {
        return callback({error: "Coudn't get dogos from server"})
    }  
    return callback({error: "Coudn't get dogos from server"})
}*/