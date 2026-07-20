export function getPdfLogoSrc() {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return `${window.location.origin}/logo-horizontal.png`
    }

    return '/logo-horizontal.png'
}
