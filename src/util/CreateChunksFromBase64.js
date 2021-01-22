export const createChunksFromBase64 = (str) => {
    const size = 64 * 1024; //64kb
    var chunks = [];
    while (str) {
        if (str.length < size) {
            chunks.push(str);
            break;
        }
        else {
            chunks.push(str.substr(0, size));
            str = str.substr(size);
        }
    }
    return chunks;
}