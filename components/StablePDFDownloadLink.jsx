import { useState } from "react";

export default function StablePDFDownloadLink({
    document,
    fileName,
    className = "",
    style,
    children,
}) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState('')

    async function handleDownload() {
        if (!document || isGenerating) {
            return
        }

        setIsGenerating(true)
        setError('')

        try {
            const { pdf: renderPdf } = await import("@react-pdf/renderer")
            const resolvedDocument = typeof document === 'function' ? document() : document

            if (!resolvedDocument) {
                throw new Error('pdf-document-empty')
            }

            const blob = await renderPdf(resolvedDocument).toBlob()
            const url = window.URL.createObjectURL(blob)
            const link = window.document.createElement('a')

            link.href = url
            link.download = fileName || 'document.pdf'
            window.document.body.appendChild(link)
            link.click()
            window.document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('pdf-download-error', error)
            if (error && error.message === 'pdf-document-empty') {
                setError('Cargando exportador PDF...')
            } else {
                setError('No se pudo generar el PDF')
            }
        } finally {
            setIsGenerating(false)
        }
    }

    const resolvedChildren = typeof children === 'function'
        ? children({ loading: isGenerating, error, url: null, blob: null })
        : children

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span
                role="button"
                tabIndex={0}
                className={className}
                style={style}
                onClick={handleDownload}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleDownload()
                    }
                }}
            >
                {resolvedChildren}
            </span>
            {error && <span style={{ marginTop: '8px', color: '#d03838', fontSize: '12px', textAlign: 'center' }}>{error}</span>}
        </div>
    )
}
