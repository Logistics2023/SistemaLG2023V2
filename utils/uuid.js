function getCryptoApi() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
        return globalThis.crypto
    }

    return null
}

function getRandomBytes(size) {
    const cryptoApi = getCryptoApi()

    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
        return cryptoApi.getRandomValues(new Uint8Array(size))
    }

    const bytes = new Uint8Array(size)

    for (let index = 0; index < size; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256)
    }

    return bytes
}

export function generateUUID() {
    const cryptoApi = getCryptoApi()

    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
        return cryptoApi.randomUUID()
    }

    const bytes = getRandomBytes(16)

    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))

    return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10, 16).join(''),
    ].join('-')
}
