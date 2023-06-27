import { PDFDownloadLink, Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { useUser } from "../context/Context.js"
import { useState, useRef, useEffect } from 'react'
import Button from './Button'
Font.register({ family: "Inter", src: "/assets/font.otf" })

const styles = StyleSheet.create({
    body: {
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        backgroundColor: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
    },
    subtitle: {
        width: "100%",
        position: "relative",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        padding: "1px 100px",
        margin: "16px 0",

    },


    containerIntroItems: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#38569c",
    },
    introImg: {
        width: "100%",
        height: "100px",
        display: "flex",
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center"



    },
    logo: {
        position:"absolute",
        height: "auto",
        width: "150px",
        marginLeft: "35px",
    },
    introItems: {
        width: "100%",
    },
    items: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    introViewKeyValue: {
        width: "100%",
        display: "flex",
        flexDirection: "row"
    },
    viewKeyValue: {
        width: "50%",
        display: "flex",
        flexDirection: "row"
    },
    key: {
        margin: "0px",
        width: "50%",
        padding: "2px 5px 0px 5px ",
        border: "1px solid #294B98",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        fontSize: "8px",
        fontWeight: "100"

    },
    value: {
        width: "50%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid #294B98",
        color: "#000000",
        fontSize: "8px",
        fontWeight: "100"

    },
    valueTwo: {
        width: "100%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid #294B98",
        color: "#000000",
        fontSize: "8px",
        fontWeight: "100"

    },
    noValue: {
        width: "50%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid #294B98",
        color: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
        backgroundColor: "#294B98",

    },
    valueYellow: {
        width: "25%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid orange",
        color: "orange",
        fontSize: "8px",
        fontWeight: "100"

    },

    valueElaborador: {
        width: "33%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        color: "#000000",
        fontSize: "8px",
        fontWeight: "100",
        textAlign: "right",
        backgroundColor: "transparent",
    },
    valueElaboradorLine: {
        width: "34%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        borderTop: "1px solid #294B98",
        color: "#000000",
        fontSize: "8px",
        fontWeight: "100",
        textAlign: "center",
        backgroundColor: "transparent",
    },
    noValueYellow: {
        width: "25%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid orange",
        color: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
        backgroundColor: "orange",

    },
    viewKeyValueTwo: {
        width: "100%",
        display: "flex",
        flexDirection: "row"
    },
    viewKeyValueTwoYellow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        margin: "16px 0 0 0",
    },

    viewKeyValueElaborado: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        margin: "30px 0 0 0",
    },



})






const PDFView = () => {
    const { pdfData } = useUser()

    const [isCliente, setisCliente] = useState(false);


    useEffect(() => {
        setisCliente(true)
    }, []);

    console.log(pdfData)

    return (
        <PDFViewer>
            <Document>
                <Page style={styles.body} size="A4" fixed >
                    <Text style={styles.subtitle}>COTIZACIÓN TRANSPORTE </Text>
                    <View style={styles.containerIntroItems}>
                        <View style={styles.introImg}>
                            <Image style={styles.logo} src="/logo.png" />
                        </View>
                        <View style={styles.introItems}>
                            <View style={styles.introViewKeyValue}>
                                <Text style={styles.key}>COTIZACIÓN No</Text>
                                <Text style={styles.value}>{pdfData && pdfData["CT-COTIZACIÓN No"] && pdfData["CT-COTIZACIÓN No"]}</Text>
                            </View>
                            <View style={styles.introViewKeyValue}>
                                <Text style={styles.key}>FECHA</Text>
                                <Text style={styles.value}>{pdfData && pdfData["CT-FECHA"] && pdfData["CT-FECHA"]}</Text>
                            </View>
                            <View style={styles.introViewKeyValue}>
                                <Text style={styles.key}>VALIDEZ</Text>
                                <Text style={styles.value}>{pdfData && pdfData["CT-VALIDEZ"] && pdfData["CT-VALIDEZ"]}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>DATOS DE CLIENTE</Text>

                    <View style={styles.items}>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>NOMBRE</Text>
                            <Text style={styles.value}>{pdfData && pdfData["nombre"] && pdfData["nombre"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>CORREO</Text>
                            <Text style={styles.value}>{pdfData && pdfData["correo"] && pdfData["correo"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>EMPRESA</Text>
                            <Text style={styles.value}>{pdfData && pdfData["empresa"] && pdfData["empresa"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>TELEFONO</Text>
                            <Text style={styles.value}>{pdfData && pdfData["telefono"] && pdfData["telefono"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>CARGO</Text>
                            <Text style={styles.value}>{pdfData && pdfData["cargo"] && pdfData["cargo"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>CIUDAD</Text>
                            <Text style={styles.value}>{pdfData && pdfData["ciudad"] && pdfData["ciudad"]}</Text>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>DESCRIPCION DE LA CARGA</Text>
                    <View style={styles.items}>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>MERCANCIA</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-MERCANCIA"] && pdfData["CT-MERCANCIA"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*TIPO DE CARGA</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-TIPO DE CARGA"] && pdfData["CT-TIPO DE CARGA"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>EMPAQUE</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-EMPAQUE"] && pdfData["CT-EMPAQUE"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*VOLUMEN M3</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-VOLUMEN M3"] && pdfData["CT-VOLUMEN M3"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*PESO TN</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-PESO TN"] && pdfData["CT-PESO TN"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*CANTIDAD</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-CANTIDAD"] && pdfData["CT-CANTIDAD"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>INCOTERM</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-INCOTERM"] && pdfData["CT-INCOTERM"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>MODALIDAD</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-MODALIDAD"] && pdfData["CT-MODALIDAD"]}</Text>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>DETALLES DEL SERVICIO</Text>
                    <View style={styles.items}>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*SERVICIO</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-SERVICIO"] && pdfData["CT-SERVICIO"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*TIPO DE UNIDAD</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-TIPO DE UNIDAD"] && pdfData["CT-TIPO DE UNIDAD"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*ORIGEN</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-ORIGEN"] && pdfData["CT-ORIGEN"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*DESTINO</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-DESTINO"] && pdfData["CT-DESTINO"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*CANTIDAD</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-CANTIDAD"] && pdfData["CT-CANTIDAD"]}</Text>
                        </View>

                        <View style={styles.viewKeyValue}>
                            <Text style={styles.key}>*MONEDA</Text>
                            <Text style={styles.value}>{pdfData && pdfData["CT-MONEDA"] && pdfData["CT-MONEDA"]}</Text>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>TARIFA</Text>
                    <View style={styles.viewKeyValueTwo}>
                        <Text style={styles.key}>DETALLE</Text>
                        <Text style={styles.key}>FLETE UNITARIO</Text>
                        <Text style={styles.key}>CANTIDAD</Text>
                        <Text style={styles.key}>FLETE TOTAL</Text>
                    </View>




                    {
                        pdfData.tarifa && pdfData.tarifa.map((i, index) => {
                            return (

                                <View style={styles.viewKeyValueTwo} key={index}>
                                    <Text style={styles.value}>{pdfData && pdfData[`CT-DETALLEFLETE${index}`] && pdfData[`CT-DETALLEFLETE${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`FLETEUNITARIO${index}`] && pdfData[`FLETEUNITARIO${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`CANTIDADFLETE${index}`] && pdfData[`CANTIDADFLETE${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`PRODUCTFLETE${index}`] && pdfData[`PRODUCTFLETE${index}`]}</Text>
                                </View>


                            )
                        })
                    }

                    <View style={styles.viewKeyValueTwo} >
                        <Text style={styles.noValue}></Text>
                        <Text style={styles.noValue}></Text>
                        <Text style={styles.noValue}>TOTAL FLETES</Text>
                        <Text style={styles.value}>{pdfData && pdfData[`PRODUCTOFLETETOTAL`] && pdfData[`PRODUCTOFLETETOTAL`]}</Text>
                    </View>


                    <Text style={styles.subtitle}>OTROS GASTOS</Text>
                    <View style={styles.viewKeyValueTwo}>
                        <Text style={styles.key}>DETALLE</Text>
                        <Text style={styles.key}>COSTO UNITARIO</Text>
                        <Text style={styles.key}>CANTIDAD</Text>
                        <Text style={styles.key}>COSTO TOTAL</Text>
                    </View>



                    {
                        pdfData.otrosGastos && pdfData.otrosGastos.map((i, index) => {
                            return (

                                <View style={styles.viewKeyValueTwo} key={index}>


                                    <Text style={styles.value}>{pdfData && pdfData[`CT-DETALLE${index}`] && pdfData[`CT-DETALLE${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`FLETEUNITARIO${index}`] && pdfData[`FLETEUNITARIO${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`CANTIDADFLETE${index}`] && pdfData[`CANTIDADFLETE${index}`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`PRODUCTFLETE${index}`] && pdfData[`PRODUCTFLETE${index}`]}</Text>




                                </View>


                            )
                        })
                    }


                    <View style={styles.viewKeyValueTwo} >
                        <Text style={styles.noValue}></Text>
                        <Text style={styles.noValue}></Text>
                        <Text style={styles.noValue}>TOTAL OTROS GASTOS</Text>
                        <Text style={styles.value}>{pdfData && pdfData[`PRODUCTOTOTAL`] && pdfData[`PRODUCTOTOTAL`]}</Text>
                    </View>


                    <View style={styles.viewKeyValueTwoYellow} >
                        <Text style={styles.noValueYellow}>Costo Total</Text>
                        <Text style={styles.valueYellow}>{pdfData.PRODUCTOTOTAL && pdfData.PRODUCTOFLETETOTAL ? pdfData.PRODUCTOTOTAL + pdfData.PRODUCTOFLETETOTAL : (pdfData.PRODUCTOTOTAL ? pdfData.PRODUCTOTOTAL : (pdfData.PRODUCTOFLETETOTAL && pdfData.PRODUCTOFLETETOTAL))}</Text>
                    </View>




                    <Text style={styles.subtitle}>INCLUYE</Text>
                    {
                        pdfData.incluye && pdfData.incluye.map((i, index) => {
                            return (

                                <View style={styles.viewKeyValueTwo} key={index}>
                                    <Text style={styles.valueTwo}>{pdfData[`CT-INCLUYE${index}`]}</Text>
                                </View>
                            )
                        })
                    }
                    <Text style={styles.subtitle}>EXCLUYE</Text>
                    {
                        pdfData.excluye && pdfData.excluye.map((i, index) => {
                            return (

                                <View style={styles.viewKeyValueTwo} key={index}>
                                    <Text style={styles.valueTwo}>{pdfData[`CT-EXCLUYE${index}`]}</Text>
                                </View>
                            )
                        })
                    }


                    <View style={styles.viewKeyValueElaborado} >
                        <Text style={styles.valueElaborador}></Text>
                        <Text style={styles.valueElaborador}>ELABORADO POR:</Text>
                        <Text style={styles.valueElaboradorLine}>{pdfData && pdfData[`CT-ELABORADOR`] && pdfData[`CT-ELABORADOR`]}</Text>
                    </View>

                    <View style={styles.viewKeyValueTwoYellow} >
                        <Text style={styles.valueElaborador}></Text>
                        <Text style={styles.valueElaborador}>ACEPTACION DE SERVICIO:</Text>
                        <Text style={styles.valueElaborador}></Text>
                    </View>
                    <View style={styles.viewKeyValueTwo}>
                        <Text style={styles.valueElaborador}></Text>
                        <Text style={styles.valueElaborador}>NOMBRE:</Text>
                        <Text style={styles.valueElaboradorLine}></Text>
                    </View>
                    <View style={styles.viewKeyValueTwo} >
                        <Text style={styles.valueElaborador}></Text>
                        <Text style={styles.valueElaborador}>CI:</Text>
                        <Text style={styles.valueElaborador}></Text>
                    </View>

                </Page>
            </Document>

        </PDFViewer>
    )
}


export default PDFView
