import { useUser } from "../context/Context.js"
import { useState, useEffect, useMemo } from 'react'
import buttonStyle from '../styles/Button.module.css'
import { getPdfLogoSrc } from "../utils/pdfAssets";
import PDFDownloadLink from "./StablePDFDownloadLink";
import { usePdfRenderer } from "../hooks/usePdfRenderer";

const INVOICE_PREFIX = 'INV-'
const CHARGES_KEY = 'invoiceCharges'

function createStyles(StyleSheet) {
return StyleSheet.create({
    body: {
        paddingTop: "18px",
        paddingBottom: "20px",
        paddingHorizontal: "28px",
        backgroundColor: "#ffffff",
        fontSize: "8px",
        color: "#1d1d1f",
    },
    topRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    companyBlock: {
        width: "62%",
        color: "#38569c",
    },
    companyTitle: {
        fontSize: "12px",
        marginBottom: "4px",
    },
    companyText: {
        fontSize: "8px",
        marginBottom: "2px",
    },
    logoWrap: {
        width: "38%",
        display: "flex",
        alignItems: "flex-end",
    },
    logo: {
        width: "120px",
        height: "auto",
        marginLeft: "auto",
    },
    sectionTitle: {
        width: "100%",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        textAlign: "center",
        padding: "4px 6px",
        marginBottom: "8px",
        marginTop: "8px",
    },
    sectionTitleAlt: {
        width: "100%",
        backgroundColor: "#F1BA06",
        color: "#000000",
        textAlign: "center",
        padding: "4px 6px",
        marginBottom: "8px",
        marginTop: "8px",
    },
    twoColGrid: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: "8px",
    },
    fieldHalf: {
        width: "50%",
        display: "flex",
        flexDirection: "row",
    },
    fieldFull: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    fieldKey: {
        width: "42%",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        border: "1px solid #294B98",
        padding: "4px 5px",
    },
    fieldValue: {
        width: "58%",
        border: "1px solid #294B98",
        padding: "4px 5px",
    },
    textBlock: {
        width: "100%",
        border: "1px solid #294B98",
        minHeight: "34px",
        padding: "6px",
        marginBottom: "8px",
    },
    chargesHeader: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        marginTop: "6px",
    },
    chargesRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    colDetail: {
        width: "32%",
        border: "1px solid #294B98",
        padding: "4px 3px",
    },
    colUnitRate: {
        width: "14%",
        border: "1px solid #294B98",
        padding: "4px 3px",
        textAlign: "center",
    },
    colCurrency: {
        width: "10%",
        border: "1px solid #294B98",
        padding: "4px 3px",
        textAlign: "center",
    },
    colUnit: {
        width: "10%",
        border: "1px solid #294B98",
        padding: "4px 3px",
        textAlign: "center",
    },
    colType: {
        width: "10%",
        border: "1px solid #294B98",
        padding: "4px 3px",
        textAlign: "center",
    },
    colAmount: {
        width: "14%",
        border: "1px solid #294B98",
        padding: "4px 3px",
        textAlign: "center",
    },
    headerCell: {
        backgroundColor: "#294B98",
        color: "#f2f2f2",
    },
    totalLabel: {
        width: "76%",
        border: "1px solid #294B98",
        backgroundColor: "#F1BA06",
        color: "#ffffff",
        padding: "5px 4px",
        textAlign: "center",
    },
    totalValue: {
        width: "14%",
        border: "1px solid #294B98",
        backgroundColor: "#F1BA06",
        color: "#ffffff",
        padding: "5px 4px",
        textAlign: "center",
    },
    totalCurrency: {
        width: "10%",
        border: "1px solid #294B98",
        backgroundColor: "#F1BA06",
        color: "#ffffff",
        padding: "5px 4px",
        textAlign: "center",
    },
    exchangeRow: {
        width: "50%",
        display: "flex",
        flexDirection: "row",
        marginTop: "10px",
        marginBottom: "8px",
    },
    exchangeLabel: {
        width: "60%",
        border: "1px solid #294B98",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        padding: "5px 6px",
    },
    exchangeValue: {
        width: "40%",
        border: "1px solid #294B98",
        padding: "5px 4px",
        textAlign: "center",
    },
    exchangeCurrency: {
        width: "10%",
        border: "1px solid #294B98",
        padding: "5px 4px",
        textAlign: "center",
    },
})
}

function mapInvoiceRecordToPdfData(invoiceRecord) {
    if (!invoiceRecord) {
        return {}
    }

    const mappedData = {
        [`${INVOICE_PREFIX}Invoice No.`]: invoiceRecord.header && invoiceRecord.header.invoiceNo ? invoiceRecord.header.invoiceNo : invoiceRecord.invoiceId || '',
        [`${INVOICE_PREFIX}Date`]: invoiceRecord.header && invoiceRecord.header.date ? invoiceRecord.header.date : invoiceRecord.search && invoiceRecord.search.date ? invoiceRecord.search.date : '',
        [`${INVOICE_PREFIX}Due Date`]: invoiceRecord.header && invoiceRecord.header.dueDate ? invoiceRecord.header.dueDate : '',
        [`${INVOICE_PREFIX}Term`]: invoiceRecord.header && invoiceRecord.header.term ? invoiceRecord.header.term : '',
        [`${INVOICE_PREFIX}Company / Client`]: invoiceRecord.billTo && invoiceRecord.billTo.companyClient ? invoiceRecord.billTo.companyClient : invoiceRecord.search && invoiceRecord.search.companyClient ? invoiceRecord.search.companyClient : '',
        [`${INVOICE_PREFIX}Country`]: invoiceRecord.billTo && invoiceRecord.billTo.country ? invoiceRecord.billTo.country : invoiceRecord.search && invoiceRecord.search.country ? invoiceRecord.search.country : '',
        [`${INVOICE_PREFIX}Consignor`]: invoiceRecord.shipment && invoiceRecord.shipment.consignor ? invoiceRecord.shipment.consignor : '',
        [`${INVOICE_PREFIX}Consignee`]: invoiceRecord.shipment && invoiceRecord.shipment.consignee ? invoiceRecord.shipment.consignee : '',
        [`${INVOICE_PREFIX}BL/AWB`]: invoiceRecord.shipment && invoiceRecord.shipment.blAwb ? invoiceRecord.shipment.blAwb : '',
        [`${INVOICE_PREFIX}Shipment Ref`]: invoiceRecord.shipment && invoiceRecord.shipment.shipmentRef ? invoiceRecord.shipment.shipmentRef : '',
        [`${INVOICE_PREFIX}BOOKING`]: invoiceRecord.shipment && invoiceRecord.shipment.booking ? invoiceRecord.shipment.booking : '',
        [`${INVOICE_PREFIX}Client Ref`]: invoiceRecord.shipment && invoiceRecord.shipment.clientRef ? invoiceRecord.shipment.clientRef : '',
        [`${INVOICE_PREFIX}Origin`]: invoiceRecord.shipment && invoiceRecord.shipment.origin ? invoiceRecord.shipment.origin : '',
        [`${INVOICE_PREFIX}Destination`]: invoiceRecord.shipment && invoiceRecord.shipment.destination ? invoiceRecord.shipment.destination : '',
        [`${INVOICE_PREFIX}Description of Packages and Goods`]: invoiceRecord.descriptions && invoiceRecord.descriptions.packagesAndGoods ? invoiceRecord.descriptions.packagesAndGoods : '',
        [`${INVOICE_PREFIX}Service Description`]: invoiceRecord.descriptions && invoiceRecord.descriptions.serviceDescription ? invoiceRecord.descriptions.serviceDescription : '',
        [`${INVOICE_PREFIX}TOTAL CHARGES`]: invoiceRecord.totals && invoiceRecord.totals.totalCharges ? invoiceRecord.totals.totalCharges : '',
        [`${INVOICE_PREFIX}Exchange Rate`]: invoiceRecord.totals && invoiceRecord.totals.exchangeRate ? invoiceRecord.totals.exchangeRate : '',
        [`${INVOICE_PREFIX}Beneficiary Name`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.beneficiaryName ? invoiceRecord.paymentInstructions.beneficiaryName : '',
        [`${INVOICE_PREFIX}Beneficiary Address`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.beneficiaryAddress ? invoiceRecord.paymentInstructions.beneficiaryAddress : '',
        [`${INVOICE_PREFIX}Bank Name`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.bankName ? invoiceRecord.paymentInstructions.bankName : '',
        [`${INVOICE_PREFIX}Bank Address`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.bankAddress ? invoiceRecord.paymentInstructions.bankAddress : '',
        [`${INVOICE_PREFIX}SWIFT / BIC Code`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.swiftBicCode ? invoiceRecord.paymentInstructions.swiftBicCode : '',
        [`${INVOICE_PREFIX}Account Number`]: invoiceRecord.paymentInstructions && invoiceRecord.paymentInstructions.accountNumber ? invoiceRecord.paymentInstructions.accountNumber : '',
    }

    const recordCharges = Array.isArray(invoiceRecord.charges) && invoiceRecord.charges.length > 0
        ? invoiceRecord.charges
        : ['']

    mappedData[CHARGES_KEY] = recordCharges.map(() => '')

    recordCharges.forEach((charge, index) => {
        if (typeof charge !== 'object') {
            return
        }

        mappedData[`${INVOICE_PREFIX}DETAIL${index}`] = charge.detail || ''
        mappedData[`${INVOICE_PREFIX}UNITRATE${index}`] = charge.unitRate || ''
        mappedData[`${INVOICE_PREFIX}RATECURRENCY${index}`] = charge.rateCurrency || ''
        mappedData[`${INVOICE_PREFIX}UNIT${index}`] = charge.unit || ''
        mappedData[`${INVOICE_PREFIX}TYPE${index}`] = charge.type || ''
        mappedData[`${INVOICE_PREFIX}AMOUNT${index}`] = charge.amount || ''
    })

    return mappedData
}

const PDFView = ({ invoiceRecord = null, label = 'pdf', linkClassName = '', containerClassName = '' }) => {
    const { pdfData } = useUser()
    const [isClient, setIsClient] = useState(false)
    const { renderer, rendererError } = usePdfRenderer()
    const { Document, Page, View, Text, Image, StyleSheet } = renderer || {}
    const styles = useMemo(() => (
        StyleSheet ? createStyles(StyleSheet) : null
    ), [StyleSheet])
    const pdfLogoSrc = getPdfLogoSrc()

    useEffect(() => {
        setIsClient(true)
    }, [])

    const sourceData = invoiceRecord ? mapInvoiceRecordToPdfData(invoiceRecord) : pdfData

    function getInvoiceKey(name) {
        return `${INVOICE_PREFIX}${name}`
    }

    function getValue(name) {
        return sourceData && sourceData[getInvoiceKey(name)] ? sourceData[getInvoiceKey(name)] : ''
    }

    function getPreferredExchangeCurrency() {
        const charges = Array.isArray(sourceData && sourceData[CHARGES_KEY]) ? sourceData[CHARGES_KEY] : ['']
        const selectedCurrencies = charges
            .map((item, index) => getValue(`RATECURRENCY${index}`))
            .filter((currency) => currency)

        return selectedCurrencies.find((currency) => currency !== 'USD') || 'USD'
    }

    const charges = Array.isArray(sourceData && sourceData[CHARGES_KEY]) && sourceData[CHARGES_KEY].length > 0
        ? sourceData[CHARGES_KEY]
        : ['']

    const preferredExchangeCurrency = getPreferredExchangeCurrency()
    const fileName = `INVOICE-${getValue('Invoice No.') || 'LGI'}.pdf`

    return (
        <div
            className={containerClassName}
            style={containerClassName ? undefined : { display: 'flex', justifyContent: 'center', width: '100%' }}
        >
            {rendererError && <span style={{ marginTop: '8px', color: '#d03838', fontSize: '12px', textAlign: 'center' }}>{rendererError}</span>}
            {isClient && <PDFDownloadLink
                document={() => (
                    renderer && styles ? <Document>
                        <Page size="A4" style={styles.body}>
                            <View style={styles.topRow}>
                                <View style={styles.companyBlock}>
                                    <Text style={styles.companyTitle}>LOGISTICS GEAR LLC</Text>
                                    <Text style={styles.companyText}>30 N Gould St Ste N, Sheridan, WY 82801, USA</Text>
                                    <Text style={styles.companyText}>Email: info@logisticsgear.com.bo | Web: logisticsgear.net</Text>
                                </View>
                                <View style={styles.logoWrap}>
                                    <Image style={styles.logo} src={pdfLogoSrc} />
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>INVOICE</Text>
                            <View style={styles.twoColGrid}>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>INVOICE NO.</Text>
                                    <Text style={styles.fieldValue}>{getValue('Invoice No.')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>DATE</Text>
                                    <Text style={styles.fieldValue}>{getValue('Date')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>DUE DATE</Text>
                                    <Text style={styles.fieldValue}>{getValue('Due Date')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>TERM</Text>
                                    <Text style={styles.fieldValue}>{getValue('Term')}</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionTitleAlt}>BILL TO</Text>
                            <View style={styles.twoColGrid}>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>COMPANY / CLIENT</Text>
                                    <Text style={styles.fieldValue}>{getValue('Company / Client')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>COUNTRY</Text>
                                    <Text style={styles.fieldValue}>{getValue('Country')}</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>SHIPMENT DETAILS</Text>
                            <View style={styles.twoColGrid}>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>CONSIGNOR</Text>
                                    <Text style={styles.fieldValue}>{getValue('Consignor')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>CONSIGNEE</Text>
                                    <Text style={styles.fieldValue}>{getValue('Consignee')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>BL/AWB</Text>
                                    <Text style={styles.fieldValue}>{getValue('BL/AWB')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>SHIPMENT REF</Text>
                                    <Text style={styles.fieldValue}>{getValue('Shipment Ref')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>BOOKING</Text>
                                    <Text style={styles.fieldValue}>{getValue('BOOKING')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>CLIENT REF</Text>
                                    <Text style={styles.fieldValue}>{getValue('Client Ref')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>ORIGIN</Text>
                                    <Text style={styles.fieldValue}>{getValue('Origin')}</Text>
                                </View>
                                <View style={styles.fieldHalf}>
                                    <Text style={styles.fieldKey}>DESTINATION</Text>
                                    <Text style={styles.fieldValue}>{getValue('Destination')}</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>DESCRIPTION OF PACKAGES AND GOODS</Text>
                            <View style={styles.textBlock}>
                                <Text>{getValue('Description of Packages and Goods')}</Text>
                            </View>

                            <Text style={styles.sectionTitle}>SERVICE DESCRIPTION</Text>
                            <View style={styles.textBlock}>
                                <Text>{getValue('Service Description')}</Text>
                            </View>

                            <Text style={styles.sectionTitleAlt}>CHARGES</Text>
                            <View style={styles.chargesHeader}>
                                <Text style={[styles.colDetail, styles.headerCell]}>FREIGHT & CHARGES</Text>
                                <Text style={[styles.colUnitRate, styles.headerCell]}>UNIT RATE</Text>
                                <Text style={[styles.colCurrency, styles.headerCell]}>CURRENCY</Text>
                                <Text style={[styles.colUnit, styles.headerCell]}>UNIT</Text>
                                <Text style={[styles.colType, styles.headerCell]}>TYPE</Text>
                                <Text style={[styles.colAmount, styles.headerCell]}>AMOUNT</Text>
                                <Text style={[styles.colCurrency, styles.headerCell]}>CURRENCY</Text>
                            </View>

                            {charges.map((item, index) => (
                                <View style={styles.chargesRow} key={index}>
                                    <Text style={styles.colDetail}>{getValue(`DETAIL${index}`)}</Text>
                                    <Text style={styles.colUnitRate}>{getValue(`UNITRATE${index}`)}</Text>
                                    <Text style={styles.colCurrency}>{getValue(`RATECURRENCY${index}`)}</Text>
                                    <Text style={styles.colUnit}>{getValue(`UNIT${index}`)}</Text>
                                    <Text style={styles.colType}>{getValue(`TYPE${index}`)}</Text>
                                    <Text style={styles.colAmount}>{getValue(`AMOUNT${index}`)}</Text>
                                    <Text style={styles.colCurrency}>USD</Text>
                                </View>
                            ))}

                            <View style={styles.chargesRow}>
                                <Text style={styles.totalLabel}>TOTAL CHARGES</Text>
                                <Text style={styles.totalValue}>{getValue('TOTAL CHARGES')}</Text>
                                <Text style={styles.totalCurrency}>USD</Text>
                            </View>

                            {preferredExchangeCurrency !== 'USD' && (
                                <View style={styles.exchangeRow}>
                                    <Text style={styles.exchangeLabel}>{`EXCHANGE RATE 1 ${preferredExchangeCurrency} =`}</Text>
                                    <Text style={styles.exchangeValue}>{getValue('Exchange Rate')} USD</Text>
                                </View>
                            )}

                            <Text style={styles.sectionTitle}>PAYMENT INSTRUCTIONS</Text>
                            <View style={styles.twoColGrid}>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>BENEFICIARY NAME</Text>
                                    <Text style={styles.fieldValue}>{getValue('Beneficiary Name')}</Text>
                                </View>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>BENEFICIARY ADDRESS</Text>
                                    <Text style={styles.fieldValue}>{getValue('Beneficiary Address')}</Text>
                                </View>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>BANK NAME</Text>
                                    <Text style={styles.fieldValue}>{getValue('Bank Name')}</Text>
                                </View>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>BANK ADDRESS</Text>
                                    <Text style={styles.fieldValue}>{getValue('Bank Address')}</Text>
                                </View>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>SWIFT / BIC CODE</Text>
                                    <Text style={styles.fieldValue}>{getValue('SWIFT / BIC Code')}</Text>
                                </View>
                                <View style={styles.fieldFull}>
                                    <Text style={styles.fieldKey}>ACCOUNT NUMBER</Text>
                                    <Text style={styles.fieldValue}>{getValue('Account Number')}</Text>
                                </View>
                            </View>
                        </Page>
                    </Document> : null
                )}
                fileName={fileName}
                className={linkClassName || `${buttonStyle.button} ${buttonStyle.buttonSecondaryPDF}`}
                style={{ textDecoration: 'none', textAlign: 'center' }}
            >
                {({ loading }) => (loading ? 'Generando PDF...' : label)}
            </PDFDownloadLink>}
        </div>
    )
}

export default PDFView
