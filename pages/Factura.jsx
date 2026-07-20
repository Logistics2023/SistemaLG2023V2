import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import { getDayMonthYear } from "../utils/Fecha";
import { replaceUserData, replaceUserDataByRest, writeUserData, writeUserDataByRest } from '../firebase/utils';
import { generateUUID } from '../utils/uuid';
import style from '../styles/CotizacionLCL.module.css'
import facturaStyle from '../styles/Factura.module.css'
import Button from '../components/Button'
import Success from '../components/Success'
import Error from '../components/Error'
import dynamic from "next/dynamic";

const INVOICE_PREFIX = 'INV-'
const CHARGES_KEY = 'invoiceCharges'
const DEFAULT_CHARGES = ['']
const DEFAULT_SERVICE_DESCRIPTION = 'Freight Forwarding & Logistics Coordination Services'
const EMPTY_CLIENT = {
    empresa: '',
    pais: '',
    country: '',
}
const CURRENCY_OPTIONS = ['USD', 'EUR', 'BOB', 'CLP']
const TERM_OPTIONS = ['As agreed', 'Duo upon', 'Prepaid', 'Net 7', 'Net 15']
const TYPE_OPTIONS = ['KG', 'SHPT', 'TRUCK', 'CTR', 'BILL', 'AWB']
const PAYMENT_INSTRUCTION_FIELDS = [
    ['Beneficiary Name', 'beneficiaryName'],
    ['Beneficiary Address', 'beneficiaryAddress'],
    ['Bank Name', 'bankName'],
    ['Bank Address', 'bankAddress'],
    ['SWIFT / BIC Code', 'swiftBicCode'],
    ['Account Number', 'accountNumber'],
]

const InvoicePDF = dynamic(() => import("../components/pdfFactura"), {
    ssr: false,
});

function Factura() {
    const { userDB, pdfData, setUserPdfData, setUserSuccess, success } = useUser()

    const [charges, setCharges] = useState(() => {
        return Array.isArray(pdfData[CHARGES_KEY]) && pdfData[CHARGES_KEY].length > 0
            ? pdfData[CHARGES_KEY]
            : DEFAULT_CHARGES
    })
    const [mode, setMode] = useState('')
    const [filter, setFilter] = useState("")
    const [calc, setCalc] = useState({})
    const [saveErrorMessage, setSaveErrorMessage] = useState('')
    const shouldUseRestWrites = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'

    const getInvoiceKey = (name) => `${INVOICE_PREFIX}${name}`

    function round(num) {
        const value = Number(num)
        const m = Number((Math.abs(value) * 100).toPrecision(15))
        return Math.round(m) / 100 * Math.sign(value)
    }

    function formatAmount(number) {
        if (number === '' || number === null || number === undefined) {
            return ''
        }

        const value = Number(number)

        if (Number.isNaN(value)) {
            return ''
        }

        const parts = round(value).toFixed(2).split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return parts.join('.')
    }

    function parseAmount(value) {
        if (value === null || value === undefined || value === '') {
            return NaN
        }

        const parsed = Number(value.toString().replaceAll(',', '').trim())
        return Number.isFinite(parsed) ? parsed : NaN
    }

    function syncPdfData(partialData = {}, nextCharges = charges, nextCalc = calc) {
        setUserPdfData((prev) => ({
            ...prev,
            ...partialData,
            ...nextCalc,
            [CHARGES_KEY]: nextCharges,
        }))
    }

    function getValue(name) {
        return pdfData[getInvoiceKey(name)] || calc[getInvoiceKey(name)] || ''
    }

    function getValueFromData(data, name) {
        return data[getInvoiceKey(name)] || ''
    }

    function getPreferredExchangeCurrencyFromData(data) {
        const selectedCurrencies = charges
            .map((item, index) => getValueFromData(data, `RATECURRENCY${index}`))
            .filter((currency) => currency)

        return selectedCurrencies.find((currency) => currency !== 'USD') || 'USD'
    }

    function getPreferredExchangeCurrency() {
        return getPreferredExchangeCurrencyFromData({
            ...pdfData,
            ...calc,
        })
    }

    function buildInvoiceSnapshot(overrides = {}) {
        const mergedData = {
            ...pdfData,
            ...calc,
            ...overrides,
            [CHARGES_KEY]: charges,
        }

        const normalizedCharges = charges
            .map((item, index) => ({
                detail: getValueFromData(mergedData, `DETAIL${index}`),
                unitRate: getValueFromData(mergedData, `UNITRATE${index}`),
                rateCurrency: getValueFromData(mergedData, `RATECURRENCY${index}`),
                unit: getValueFromData(mergedData, `UNIT${index}`),
                type: getValueFromData(mergedData, `TYPE${index}`),
                amount: getValueFromData(mergedData, `AMOUNT${index}`),
                amountCurrency: 'USD',
            }))
            .filter((item) => Object.values(item).some((value) => value))

        const preferredCurrency = getPreferredExchangeCurrencyFromData(mergedData)
        const timestamp = Date.now()

        return {
            invoiceId: getValueFromData(mergedData, 'Invoice No.'),
            invoiceState: 'active',
            createdAt: timestamp,
            updatedAt: timestamp,
            search: {
                invoiceNo: getValueFromData(mergedData, 'Invoice No.'),
                date: getValueFromData(mergedData, 'Date'),
                companyClient: getValueFromData(mergedData, 'Company / Client'),
                country: getValueFromData(mergedData, 'Country'),
                totalCharges: getValueFromData(mergedData, 'TOTAL CHARGES'),
            },
            header: {
                invoiceNo: getValueFromData(mergedData, 'Invoice No.'),
                date: getValueFromData(mergedData, 'Date'),
                dueDate: getValueFromData(mergedData, 'Due Date'),
                term: getValueFromData(mergedData, 'Term'),
            },
            billTo: {
                companyClient: getValueFromData(mergedData, 'Company / Client'),
                country: getValueFromData(mergedData, 'Country'),
            },
            shipment: {
                consignor: getValueFromData(mergedData, 'Consignor'),
                consignee: getValueFromData(mergedData, 'Consignee'),
                blAwb: getValueFromData(mergedData, 'BL/AWB'),
                shipmentRef: getValueFromData(mergedData, 'Shipment Ref'),
                booking: getValueFromData(mergedData, 'BOOKING'),
                clientRef: getValueFromData(mergedData, 'Client Ref'),
                origin: getValueFromData(mergedData, 'Origin'),
                destination: getValueFromData(mergedData, 'Destination'),
            },
            descriptions: {
                packagesAndGoods: getValueFromData(mergedData, 'Description of Packages and Goods'),
                serviceDescription: getValueFromData(mergedData, 'Service Description'),
            },
            charges: normalizedCharges,
            totals: {
                totalCharges: getValueFromData(mergedData, 'TOTAL CHARGES'),
                exchangeCurrency: preferredCurrency,
                exchangeRate: preferredCurrency === 'USD' ? '1' : getValueFromData(mergedData, 'Exchange Rate'),
                totalCurrency: 'USD',
            },
            paymentInstructions: {
                beneficiaryName: getValueFromData(mergedData, 'Beneficiary Name'),
                beneficiaryAddress: getValueFromData(mergedData, 'Beneficiary Address'),
                bankName: getValueFromData(mergedData, 'Bank Name'),
                bankAddress: getValueFromData(mergedData, 'Bank Address'),
                swiftBicCode: getValueFromData(mergedData, 'SWIFT / BIC Code'),
                accountNumber: getValueFromData(mergedData, 'Account Number'),
            },
        }
    }

    function buildInvoicePaymentDefaults(sourceData = pdfData) {
        return PAYMENT_INSTRUCTION_FIELDS.reduce((acc, [fieldName, nodeKey]) => {
            acc[nodeKey] = getValueFromData(sourceData, fieldName)
            return acc
        }, {})
    }

    function recalcCharges(nextCalc, nextCharges = charges) {
        const exchangeRate = parseAmount(nextCalc[getInvoiceKey('Exchange Rate')])
        let total = 0

        nextCharges.forEach((item, index) => {
            const unitRate = parseAmount(nextCalc[getInvoiceKey(`UNITRATE${index}`)])
            const unit = parseAmount(nextCalc[getInvoiceKey(`UNIT${index}`)])
            const rowCurrency = nextCalc[getInvoiceKey(`RATECURRENCY${index}`)]

            if (Number.isNaN(unitRate) || Number.isNaN(unit)) {
                nextCalc[getInvoiceKey(`AMOUNT${index}`)] = ''
                return
            }

            if (rowCurrency && rowCurrency !== 'USD') {
                if (Number.isNaN(exchangeRate)) {
                    nextCalc[getInvoiceKey(`AMOUNT${index}`)] = ''
                    return
                }

                nextCalc[getInvoiceKey(`AMOUNT${index}`)] = formatAmount(unitRate * unit * exchangeRate)
            } else {
                nextCalc[getInvoiceKey(`AMOUNT${index}`)] = formatAmount(unitRate * unit)
            }

            const amountValue = parseAmount(nextCalc[getInvoiceKey(`AMOUNT${index}`)])

            if (!Number.isNaN(amountValue)) {
                total += amountValue
            }
        })

        return {
            ...nextCalc,
            [getInvoiceKey('TOTAL CHARGES')]: total > 0 ? formatAmount(total) : '',
        }
    }

    function handleEventChange(e) {
        const partialData = {
            [getInvoiceKey(e.target.name)]: e.target.value,
        }

        if (e.target.name === 'Exchange Rate') {
            const mergedCalc = recalcCharges({
                ...calc,
                ...partialData,
            })

            setCalc(mergedCalc)
            syncPdfData(partialData, charges, mergedCalc)
            return
        }

        syncPdfData(partialData)
    }

    function handleChargeCounter(word) {
        let nextCharges = charges

        if (word === 'pluss') {
            nextCharges = [...charges, '']
        } else if (charges.length > 1) {
            nextCharges = charges.slice(0, -1)
        }

        const nextCalc = { ...calc }

        Object.keys(nextCalc).forEach((key) => {
            const match = key.match(/(\d+)$/)

            if (match && Number(match[1]) >= nextCharges.length) {
                delete nextCalc[key]
            }
        })

        const mergedCalc = recalcCharges(nextCalc, nextCharges)

        setCharges(nextCharges)
        setCalc(mergedCalc)
        syncPdfData({}, nextCharges, mergedCalc)
    }

    function handleChargeChange(e, index) {
        const { name, value } = e.target
        const nextCalc = {
            ...calc,
            [getInvoiceKey(name)]: value,
        }

        const mergedCalc = recalcCharges(nextCalc)

        setCalc(mergedCalc)
        syncPdfData({}, charges, mergedCalc)
    }

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handlerFilterButton(e) {
        e.preventDefault()

        const selectedClient =
            userDB && userDB.users && userDB.users[filter]
                ? userDB.users[filter]
                : EMPTY_CLIENT

        syncPdfData({
            [getInvoiceKey('Company / Client')]: selectedClient.empresa || '',
            [getInvoiceKey('Country')]:
                selectedClient.pais || selectedClient.country || '',
        })
    }

    function openGenerateModal(e) {
        e.preventDefault()
        setMode('generateInvoice')
    }

    function closeGenerateModal() {
        setMode('')
    }

    async function generateInvoiceNumber() {
        const currentCounter =
            userDB && typeof userDB === 'object' && Number.isFinite(Number(userDB.invoice))
                ? Number(userDB.invoice)
                : 0
        const nextCounter = currentCounter + 1
        const invoiceNo = `LGI-${nextCounter.toString().padStart(3, '0')}`
        const today = getDayMonthYear()
        const nextInvoiceData = {
            [getInvoiceKey('Invoice No.')]: invoiceNo,
            [getInvoiceKey('Date')]: today,
            [getInvoiceKey('Due Date')]: today,
            [getInvoiceKey('Term')]: getValue('Term') || 'As agreed',
        }

        try {
            const updateCounterRequest = shouldUseRestWrites ? writeUserDataByRest : writeUserData
            const saveInvoiceRequest = shouldUseRestWrites ? replaceUserDataByRest : replaceUserData
            const mergedData = {
                ...pdfData,
                ...calc,
                ...nextInvoiceData,
                [CHARGES_KEY]: charges,
            }
            const snapshot = buildInvoiceSnapshot(nextInvoiceData)
            const paymentInstructionDefaults = buildInvoicePaymentDefaults(mergedData)
            const invoiceStorageKey = generateUUID()

            syncPdfData(nextInvoiceData)
            await updateCounterRequest('/', { invoice: nextCounter }, null)
            await saveInvoiceRequest(`/invoices/${invoiceStorageKey}`, {
                ...snapshot,
                uuid: invoiceStorageKey,
            }, null)
            await saveInvoiceRequest('/invoicePaymentInstructions', paymentInstructionDefaults, null)

            closeGenerateModal()
            setUserSuccess('save')
        } catch (error) {
            closeGenerateModal()
            const errorCode = error && error.code ? error.code : 'firebase/unknown'
            const errorMessage = error && error.message ? error.message : 'No se pudo generar y guardar la factura en Firebase.'
            setSaveErrorMessage(`${errorCode}: ${errorMessage}`)
            setUserSuccess('repeat')
        }
    }

    useEffect(() => {
        const serviceDescriptionKey = getInvoiceKey('Service Description')

        setUserPdfData((prev) => {
            if (prev[serviceDescriptionKey] !== undefined) {
                return prev
            }

            return {
                ...prev,
                [serviceDescriptionKey]: DEFAULT_SERVICE_DESCRIPTION,
            }
        })
    }, [setUserPdfData])

    useEffect(() => {
        const savedPaymentInstructions =
            userDB && typeof userDB === 'object' && userDB.invoicePaymentInstructions
                ? userDB.invoicePaymentInstructions
                : null

        if (!savedPaymentInstructions) {
            return
        }

        setUserPdfData((prev) => {
            let hasChanges = false
            const nextData = { ...prev }

            PAYMENT_INSTRUCTION_FIELDS.forEach(([fieldName, nodeKey]) => {
                const invoiceKey = getInvoiceKey(fieldName)

                if (prev[invoiceKey] !== undefined) {
                    return
                }

                nextData[invoiceKey] = savedPaymentInstructions[nodeKey] || ''
                hasChanges = true
            })

            return hasChanges ? nextData : prev
        })
    }, [setUserPdfData, userDB])

    const preferredExchangeCurrency = getPreferredExchangeCurrency()

    useEffect(() => {
        if (preferredExchangeCurrency !== 'USD') {
            return
        }

        setUserPdfData((prev) => {
            if (prev[getInvoiceKey('Exchange Rate')] === '1') {
                return prev
            }

            return {
                ...prev,
                [getInvoiceKey('Exchange Rate')]: '1',
            }
        })
    }, [preferredExchangeCurrency, setUserPdfData])

    return (
        <Layout>
            {mode === 'generateInvoice' && (
                <div className={facturaStyle.confirmOverlay}>
                    <div className={facturaStyle.confirmCard}>
                        <button
                            type="button"
                            className={facturaStyle.confirmClose}
                            onClick={closeGenerateModal}
                        >
                            X
                        </button>
                        <span className={facturaStyle.confirmEyebrow}>Confirmacion</span>
                        <h3 className={facturaStyle.confirmTitle}>
                            Generar numero de factura
                        </h3>
                        <p className={facturaStyle.confirmText}>
                            Esta accion asignara el siguiente correlativo, guardara la factura actual y actualizara el contador general.
                        </p>
                        <div className={facturaStyle.confirmActions}>
                            <Button style={'buttonSecondary'} click={closeGenerateModal}>
                                Cancelar
                            </Button>
                            <Button
                                style={'buttonPrimary'}
                                click={generateInvoiceNumber}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {success == 'save' && <Success>Factura guardada correctamente</Success>}
            {success == 'number-generated' && <Success>Numero de factura generado correctamente</Success>}
            {success == 'invoice-number-required' && <Error>Primero genera el numero de factura</Error>}
            {success == 'repeat' && <Error>Verifica e intenta de nuevo</Error>}
            {saveErrorMessage && <Error>{saveErrorMessage}</Error>}
            <div className={style.container}>
                <form className={`${style.form} ${facturaStyle.formShell}`}>
                    {/* <div className={style.containerFilter}>
                        <input
                            className={style.inputFilter}
                            type="text"
                            onChange={handleFilterChange}
                            placeholder="Autocompletar por CI"
                        />
                        <Button style={'buttonSecondary'} click={handlerFilterButton}>
                            Completar
                        </Button>
                    </div> */}

                    {/* <div className={style.subtitle}>INVOICE</div> */}
                    <div className={facturaStyle.containerFirstItems}>

                        <div className={facturaStyle.firstItems}>
                            <h3>LOGISTICS GEAR LLC</h3>
                            <p>30 N Gould St Ste N, Sheridan, WY 82801, USA</p>
                            <p>Email: info@logisticsgear.com.bo   |   Web: logisticsgear.net</p>
                        </div>

                        <div className={style.imgForm}>
                            <Image src="/logo.svg" width="250" height="150" alt="User" />
                        </div>

                    </div>
                    <br />
                    <div className={style.subtitle}>INVOICE</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">INVOICE NO.</label>
                            <input
                                type="text"
                                name="Invoice No."
                                onChange={handleEventChange}
                                value={getValue('Invoice No.')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">DATE</label>
                            <input
                                type="text"
                                name="Date"
                                onChange={handleEventChange}
                                value={getValue('Date')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">DUE DATE</label>
                            <input
                                type="text"
                                name="Due Date"
                                onChange={handleEventChange}
                                value={getValue('Due Date')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">TERM</label>
                            <select
                                name="Term"
                                onChange={handleEventChange}
                                value={getValue('Term')}
                            >
                                <option value="">CHOOSE</option>
                                {TERM_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className={facturaStyle.subtitle2}>BILL TO</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">COMPANY / CLIENT</label>
                            <input
                                type="text"
                                name="Company / Client"
                                onChange={handleEventChange}
                                value={getValue('Company / Client')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">COUNTRY</label>
                            <input
                                type="text"
                                name="Country"
                                onChange={handleEventChange}
                                value={getValue('Country')}
                            />
                        </div>
                    </div>

                    <br />
                    <div className={style.subtitle}>SHIPMENT DETAILS</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">CONSIGNOR</label>
                            <input
                                type="text"
                                name="Consignor"
                                onChange={handleEventChange}
                                value={getValue('Consignor')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">CONSIGNEE</label>
                            <input
                                type="text"
                                name="Consignee"
                                onChange={handleEventChange}
                                value={getValue('Consignee')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">BL/AWB</label>
                            <input
                                type="text"
                                name="BL/AWB"
                                onChange={handleEventChange}
                                value={getValue('BL/AWB')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">SHIPMENT REF</label>
                            <input
                                type="text"
                                name="Shipment Ref"
                                onChange={handleEventChange}
                                value={getValue('Shipment Ref')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">BOOKING</label>
                            <input
                                type="text"
                                name="BOOKING"
                                onChange={handleEventChange}
                                value={getValue('BOOKING')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">CLIENT REF</label>
                            <input
                                type="text"
                                name="Client Ref"
                                onChange={handleEventChange}
                                value={getValue('Client Ref')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">ORIGIN</label>
                            <input
                                type="text"
                                name="Origin"
                                onChange={handleEventChange}
                                value={getValue('Origin')}
                            />
                        </div>
                        <div>
                            <label htmlFor="">DESTINATION</label>
                            <input
                                type="text"
                                name="Destination"
                                onChange={handleEventChange}
                                value={getValue('Destination')}
                            />
                        </div>
                    </div>

                    <br />
                    <div className={style.subtitle}>DESCRIPTION OF PACKAGES AND GOODS</div>
                    <br />
                    <textarea
                        name="Description of Packages and Goods"
                        onChange={handleEventChange}
                        value={getValue('Description of Packages and Goods')}
                        className={facturaStyle.textArea}
                        rows={1}
                    />

                    <br />
                    <br />
                    <div className={style.subtitle}>SERVICE DESCRIPTION</div>
                    <br />
                    <textarea
                        name="Service Description"
                        onChange={handleEventChange}
                        value={getValue('Service Description')}
                        className={`${facturaStyle.textArea}`}
                        rows={1}
                    />

                    <br />
                    <br />
                    <div className={facturaStyle.subtitle2}>
                        CHARGES
                        <span
                            className={style.counterPluss}
                            onClick={() => handleChargeCounter('pluss')}
                        >
                            +
                        </span>
                        <span
                            className={style.counterLess}
                            onClick={() => handleChargeCounter('less')}
                        >
                            -
                        </span>
                    </div>

                    <br />
                    <div className={facturaStyle.chargesTable}>
                        <div className={facturaStyle.chargesHeader}>
                            <span>FREIGHT & CHARGES</span>
                            <span>UNIT RATE</span>
                            <span>CURRENCY</span>
                            <span>UNIT</span>
                            <span>TYPE</span>
                            <span>AMOUNT</span>
                            <span>CURRENCY</span>
                        </div>

                        {charges.map((item, index) => {
                            return (
                                <div key={index} className={facturaStyle.chargeRow}>
                                    <div className={facturaStyle.chargeCell} data-label="FREIGHT & CHARGES">
                                        <input
                                            className={facturaStyle.chargeControl}
                                            type="text"
                                            name={`DETAIL${index}`}
                                            onChange={(e) => handleChargeChange(e, index)}
                                            placeholder="FREIGHT & CHARGES"
                                            value={getValue(`DETAIL${index}`)}
                                        />
                                    </div>
                                    <div className={facturaStyle.chargeCell} data-label="UNIT RATE">
                                        <input
                                            className={facturaStyle.chargeControl}
                                            type="text"
                                            name={`UNITRATE${index}`}
                                            onChange={(e) => handleChargeChange(e, index)}
                                            placeholder="UNIT RATE"
                                            value={getValue(`UNITRATE${index}`)}
                                        />
                                    </div>
                                    <div className={facturaStyle.chargeCell} data-label="CURRENCY">
                                        <select
                                            className={facturaStyle.chargeControl}
                                            name={`RATECURRENCY${index}`}
                                            onChange={(e) => handleChargeChange(e, index)}
                                            value={getValue(`RATECURRENCY${index}`)}
                                        >
                                            <option value="">CURRENCY</option>
                                            {CURRENCY_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={facturaStyle.chargeCell} data-label="UNIT">
                                        <input
                                            className={facturaStyle.chargeControl}
                                            type="text"
                                            name={`UNIT${index}`}
                                            onChange={(e) => handleChargeChange(e, index)}
                                            placeholder="UNIT"
                                            value={getValue(`UNIT${index}`)}
                                        />
                                    </div>
                                    <div className={facturaStyle.chargeCell} data-label="TYPE">
                                        <select
                                            className={facturaStyle.chargeControl}
                                            name={`TYPE${index}`}
                                            onChange={(e) => handleChargeChange(e, index)}
                                            value={getValue(`TYPE${index}`)}
                                        >
                                            <option value="">TYPE</option>
                                            {TYPE_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={facturaStyle.chargeCell} data-label="AMOUNT">
                                        <input
                                            className={facturaStyle.chargeControl}
                                            type="text"
                                            name={`AMOUNT${index}`}
                                            value={getValue(`AMOUNT${index}`)}
                                            placeholder="AMOUNT"
                                            readOnly
                                        />
                                    </div>
                                    <div className={facturaStyle.chargeCell} data-label="CURRENCY">
                                        <span className={facturaStyle.chargeStaticValue}>
                                            USD
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    <div className={facturaStyle.totalRow}>
                        <div className={facturaStyle.totalLabel} data-label="TOTAL">
                            TOTAL CHARGES
                        </div>
                        <div className={facturaStyle.totalValue} data-label="AMOUNT">
                            {getValue('TOTAL CHARGES')}
                        </div>
                        <div className={facturaStyle.totalCurrency} data-label="CURRENCY">
                            USD
                        </div>
                    </div>
                    {preferredExchangeCurrency !== 'USD' && (
                        <>
                            <br />
                            <div className={facturaStyle.middleRow}>
                                <div>
                                    <label htmlFor="">{`EXCHANGE RATE 1 ${preferredExchangeCurrency} =`}</label>
                                    <div> <input
                                        type="text"
                                        name="Exchange Rate"
                                        onChange={handleEventChange}
                                        value={getValue('Exchange Rate')}
                                    /> <span>USD</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <br />
                    <div className={style.subtitle}>PAYMENT INSTRUCTIONS</div>
                    <br />
                    <div className={style.containerFirstItems}>
                        <div className={style.firstItems}>
                            <div>
                                <label htmlFor="">BENEFICIARY NAME</label>
                                <input
                                    type="text"
                                    name="Beneficiary Name"
                                    onChange={handleEventChange}
                                    value={getValue('Beneficiary Name')}
                                />
                            </div>
                            <div>
                                <label htmlFor="">BENEFICIARY ADDRESS</label>
                                <input
                                    type="text"
                                    name="Beneficiary Address"
                                    onChange={handleEventChange}
                                    value={getValue('Beneficiary Address')}
                                />
                            </div>
                            <div>
                                <label htmlFor="">BANK NAME</label>
                                <input
                                    type="text"
                                    name="Bank Name"
                                    onChange={handleEventChange}
                                    value={getValue('Bank Name')}
                                />
                            </div>
                            <div>
                                <label htmlFor="">BANK ADDRESS</label>
                                <input
                                    type="text"
                                    name="Bank Address"
                                    onChange={handleEventChange}
                                    value={getValue('Bank Address')}
                                />
                            </div>
                            <div>
                                <label htmlFor="">SWIFT / BIC CODE</label>
                                <input
                                    type="text"
                                    name="SWIFT / BIC Code"
                                    onChange={handleEventChange}
                                    value={getValue('SWIFT / BIC Code')}
                                />
                            </div>
                            <div>
                                <label htmlFor="">ACCOUNT NUMBER</label>
                                <input
                                    type="text"
                                    name="Account Number"
                                    onChange={handleEventChange}
                                    value={getValue('Account Number')}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className={`${style.containerFilter} ${facturaStyle.actionBar}`}>
                <Button style={'buttonPrimary'} click={openGenerateModal}>
                    Generar No
                </Button>
                <InvoicePDF />
            </div>

            <br />
            <br />
        </Layout>
    )
}

export default WithAuth(Factura)
