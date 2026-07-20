import { useEffect, useState } from 'react'

export function usePdfRenderer() {
    const [renderer, setRenderer] = useState(null)
    const [rendererError, setRendererError] = useState('')

    useEffect(() => {
        let isMounted = true

        import('@react-pdf/renderer/lib/react-pdf.browser.cjs.js')
            .then((module) => {
                if (!isMounted) {
                    return
                }                

                setRenderer(module)
            })
            .catch((error) => {
                console.error('pdf-renderer-load-error', error)

                if (!isMounted) {
                    return
                }

                setRendererError('No se pudo cargar el exportador PDF')
            })

        return () => {
            isMounted = false
        }
    }, [])

    return {
        renderer,
        rendererError,
    }
}
