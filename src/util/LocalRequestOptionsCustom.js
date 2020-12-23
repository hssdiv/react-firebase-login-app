export const generateLocalRequestOptionsCustom = (type, object) => {
    
    console.log('vau')
    //console.log(new URLSearchParams(object).toString())
    return {
        method: type,
        credentials: 'include',
        body: object
    }
}
