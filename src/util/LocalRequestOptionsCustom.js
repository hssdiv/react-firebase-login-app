export const generateLocalRequestOptionsCustom = (type, object) => {
    
    console.log('inside generateLocalRequestOptionsCustom')
    //console.log(new URLSearchParams(object).toString())
    return {
        method: type,
        credentials: 'include',
        body: object
    }
}
