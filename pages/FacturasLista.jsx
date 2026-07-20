import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import { readUserDataByRest, subscribeToPath, writeUserData, writeUserDataByRest } from '../firebase/utils'
import Button from '../components/Button'
import Success from '../components/Success'
import Error from '../components/Error'
import style from '../styles/FacturasLista.module.css'

const InvoicePDF = dynamic(() => import("../components/pdfFactura"), {
    ssr: false,
})

function FacturasLista() {
    const { setUserPdfData, setUserSuccess, success } = useUser()
    const [invoiceData, setInvoiceData] = useState(null)
    const [invoiceError, setInvoiceError] = useState('')
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(true)
    const shouldUseRestReads = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'

    useEffect(() => {
        setUserPdfData({})
    }, [setUserPdfData])

    useEffect(() => {
        let isMounted = true

        async function loadInvoices() {
            setInvoiceError('')
            setIsInvoiceLoading(true)

            try {
                if (shouldUseRestReads) {
                    const data = await readUserDataByRest('/invoices')

                    if (!isMounted) {
                        return
                    }

                    setInvoiceData(data)
                    setIsInvoiceLoading(false)
                    return
                }

                const unsubscribe = subscribeToPath('/invoices', (data) => {
                    if (!isMounted) {
                        return
                    }

                    setInvoiceData(data)
                    setIsInvoiceLoading(false)
                })

                return unsubscribe
            } catch (error) {
                if (!isMounted) {
                    return
                }

                setInvoiceError(error && error.message ? error.message : 'No se pudieron cargar las facturas.')
                setInvoiceData(null)
                setIsInvoiceLoading(false)
            }
        }

        let unsubscribe = null

        loadInvoices().then((cleanup) => {
            unsubscribe = typeof cleanup === 'function' ? cleanup : null
        })

        return () => {
            isMounted = false
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [shouldUseRestReads])

    const invoices = useMemo(() => {
        const invoiceEntries = invoiceData ? Object.entries(invoiceData) : []

        return invoiceEntries
            .map(([firebaseId, invoice]) => ({
                firebaseId,
                invoiceId: invoice && invoice.invoiceId ? invoice.invoiceId : '-',
                date:
                    invoice &&
                    invoice.search &&
                    invoice.search.date
                        ? invoice.search.date
                        : '-',
                companyClient:
                    invoice &&
                    invoice.search &&
                    invoice.search.companyClient
                        ? invoice.search.companyClient
                        : '-',
                country:
                    invoice &&
                    invoice.search &&
                    invoice.search.country
                        ? invoice.search.country
                        : '-',
                totalCharges:
                    invoice &&
                    invoice.totals &&
                    invoice.totals.totalCharges
                        ? invoice.totals.totalCharges
                        : '-',
                invoiceState:
                    invoice && invoice.invoiceState
                        ? invoice.invoiceState
                        : 'active',
                record: invoice || null,
                createdAt:
                    invoice && invoice.createdAt
                        ? invoice.createdAt
                        : 0,
            }))
            .sort((a, b) => b.createdAt - a.createdAt)
    }, [invoiceData])

    function handleInvoiceState(firebaseId, invoiceState) {
        const updateInvoiceState = shouldUseRestReads ? writeUserDataByRest : writeUserData

        updateInvoiceState(`/invoices/${firebaseId}`, {
            invoiceState,
            updatedAt: Date.now(),
        }, setUserSuccess)
    }

    return (
        <Layout>
            <div className={style.page}>
                <div className={style.header}>
                    <h1>MIS FACTURAS</h1>
                    <p>Listado de facturas emitidas y control de anulacion.</p>
                </div>

                <div className={style.feedback}>
                    {success == 'save' && <Success>Factura actualizada correctamente</Success>}
                    {success == 'repeat' && <Error>No se pudo actualizar la factura</Error>}
                    {invoiceError && <Error>{invoiceError}</Error>}
                </div>

                <div className={style.table}>
                    <div className={`${style.row} ${style.headRow}`}>
                        <span>FACTURA NO.</span>
                        <span>DATE</span>
                        <span>COMPANY / CLIENT</span>
                        <span>COUNTRY</span>
                        <span>TOTAL</span>
                        <span>STATE</span>
                        <span>ACCIONES</span>
                    </div>

                    {isInvoiceLoading && (
                        <div className={style.emptyState}>
                            Cargando facturas...
                        </div>
                    )}

                    {!isInvoiceLoading && invoices.length === 0 && (
                        <div className={style.emptyState}>
                            No hay facturas guardadas todavia.
                        </div>
                    )}

                    {invoices.map((invoice) => (
                        <div key={invoice.firebaseId} className={style.row}>
                            <span className={style.invoiceNo} data-label="FACTURA NO.">{invoice.invoiceId}</span>
                            <span data-label="DATE">{invoice.date}</span>
                            <span data-label="COMPANY / CLIENT">{invoice.companyClient}</span>
                            <span data-label="COUNTRY">{invoice.country}</span>
                            <span data-label="TOTAL">{invoice.totalCharges}</span>
                            <span data-label="STATE">
                                <span
                                    className={
                                        invoice.invoiceState === 'voided'
                                            ? `${style.badge} ${style.badgeVoided}`
                                            : `${style.badge} ${style.badgeActive}`
                                    }
                                >
                                    {invoice.invoiceState}
                                </span>
                            </span>
                            <div className={style.actions} data-label="ACCIONES">
                                <InvoicePDF
                                    invoiceRecord={invoice.record}
                                    label="pdf"
                                    containerClassName={style.pdfActionWrap}
                                    linkClassName={style.actionLink}
                                />
                                {invoice.invoiceState === 'active' ? (
                                    <Button
                                        style={'buttonSecondary'}
                                        click={() => handleInvoiceState(invoice.firebaseId, 'voided')}
                                    >
                                        Anular
                                    </Button>
                                ) : (
                                    <Button
                                        style={'buttonPrimary'}
                                        click={() => handleInvoiceState(invoice.firebaseId, 'active')}
                                    >
                                        Activar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default WithAuth(FacturasLista)
