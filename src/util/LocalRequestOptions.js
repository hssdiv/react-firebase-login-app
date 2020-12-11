export const generateLocalRequestOptions = (type, object) => {
    if (object) {
        return {
            method: type,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        }
    } else {
        return {
            method: type,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        }
    }
}
