import { PDFDownloadLink, Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { useUser } from "../context/Context.js"
import { useState, useRef, useEffect } from 'react'
import { getDayMonthYear } from "../utils/Fecha";
import Button from './Button'
Font.register({ family: "Inter", src: "/assets/font.otf" })

const styles = StyleSheet.create({
    body: {
        padding: "1.5cm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        backgroundColor: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
    },

    title: {
        fontSize: '20px',
        fontWeight: 'bold',
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
        justifyContent: "center",
        alignItems: "center"



    },
    logo: {
        position: "absolute",
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
        width: "100%",
        display: "flex",
        flexDirection: "row"
    },

    key: {
        margin: "0px",
        width: "100%",
        padding: "2px 5px 0px 5px ",
        border: "1px solid #294B98",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        fontSize: "8px",
        fontWeight: "100"

    },
    keyCenter: {

        margin: "0px",
        width: "100%",
        padding: "2px 5px 0px 5px ",
        border: "1px solid #294B98",
        backgroundColor: "#294B98",
        color: "#f2f2f2",
        fontSize: "8px",
        fontWeight: "100",
        textAlign: 'center'

    },
    value: {
        margin: "0px",
        width: "100%",
        minHeight: '12px',
        padding: "2px 5px 0px 5px ",
        border: "1px solid #294B98",
        fontSize: "8px",
        fontWeight: "100",
        wordBreak: 'break-all',
        wordWrap: 'break-word',
        textOverflow: 'clip',
    },

    valueTarifa: {
        width: "50%",
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
    noValueWhite: {
        width: "50%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid #ffffff",
        color: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
        backgroundColor: "#ffffff",
    },
    valueYellow: {
        width: "25%",
        minHeight: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid orange",
        color: "orange",
        fontSize: "8px",
        fontWeight: "100"

    },

    noValueYellow: {
        width: "25%",
        minHeight: "12px",
        padding: "2px 5px 0px 5px ",
        border: "0.5px solid orange",
        color: "#ffffff",
        fontSize: "8px",
        fontWeight: "100",
        backgroundColor: "orange",
    },
    valueElaboradorLine: {
        width: "34%",
        height: "12px",
        padding: "2px 5px 0px 5px ",
        borderBottom: "1px solid #294B98",
        color: "#000000",
        fontSize: "8px",
        fontWeight: "100",
        textAlign: "center",
        backgroundColor: "transparent",
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


})

function Br() {
    return <Text> {'\n'} </Text>
}




function PDFView({ click }) {
    const { pdfData } = useUser()

    const [isCliente, setisCliente] = useState(false);


    useEffect(() => {
        setisCliente(true)
    }, []);


    return (
        <div style={{ textAlign: 'center', width: '90%', minWidth: '150px', maxWidth: '250px' }}>
            {isCliente && <PDFDownloadLink document={
                <Document>
                    <Page style={styles.body} size="A4" fixed >
                        <Text style={styles.subtitle}>MANIFIESTO DE CARGA </Text>
                        <View style={styles.containerIntroItems}>
                            <View style={styles.introImg}>
                                <Image style={styles.logo} src="/logo.png" />
                            </View>
                            <View style={styles.introItems}>
                                <Text style={styles.title}>MANIFIESTO DE CARGA</Text>
                            </View>
                        </View>
                        <View style={styles.items}>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>REMITENTE</Text>
                                <Text style={styles.key}>MANIFIESTO DE LA CARGA</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-NOMBRE DE EMPRESA"] && pdfData["MC-NOMBRE DE EMPRESA"]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>NO</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-COTIZACION No"] && pdfData["MC-COTIZACION No"]}</Text>
                                </View>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-DIRECCION"] && pdfData["MC-DIRECCION"]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>FECHA</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-FECHA"] && pdfData["MC-FECHA"]}</Text>
                                </View>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-CIUDAD - PAIS"] && pdfData["MC-CIUDAD - PAIS"]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>OPERADOR</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-operador"] && pdfData["MC-operador"]}</Text>
                                </View>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-NIT"] && pdfData["MC-NIT"]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>CELULAR</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-CELULAR"] && pdfData["MC-CELULAR"]}</Text>
                                </View>
                            </View>

                            <Br />
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>CONSIGNATARIO</Text>
                                <Text style={styles.key}>TRANSPORTADOR</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.value}>{pdfData && pdfData["MC-NOMBRE CONSIGNATARIO"] && pdfData["MC-NOMBRE CONSIGNATARIO"]}</Text>
                                <Text style={styles.value}>LOGISTICS GEAR</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.value}>{pdfData && pdfData["MC-DIRECCION CONSIGNATARIO"] && pdfData["MC-DIRECCION CONSIGNATARIO"]}</Text>
                                <Text style={styles.value}> Av. 14 de Septiembre esq. Calle 17 Edificio Mario Mercado Piso 5 Of 506</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.value}>{pdfData && pdfData["MC-CIUDAD-PAIS CONSIGNATARIO"] && pdfData["MC-CIUDAD-PAIS CONSIGNATARIO"]}</Text>
                                <Text style={styles.value}>LA PAZ - BOLIVIA</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.value}>{pdfData && pdfData["MC-NIT CONSIGNATARIO"] && pdfData["MC-NIT CONSIGNATARIO"]}</Text>
                                <Text style={styles.value}>+591 (2) 2780607</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.value}>{pdfData && pdfData["MC-TELEFONO CONSIGNATARIO"] && pdfData["MC-TELEFONO CONSIGNATARIO"]}</Text>
                                <Text style={styles.value}></Text>
                            </View>
                        </View>
                        <Br />
                        <Text style={styles.subtitle}>DATOS DEL TRANSPORTISTA</Text>
                        <View style={styles.items}>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>NOMBRE</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-NOMBRE TRANSPORTISTA"] && pdfData["MC-NOMBRE TRANSPORTISTA"]}</Text>
                                <Text style={styles.key}>LICENCIA</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-LICENCIA TRANSPORTISTA"] && pdfData["MC-LICENCIA TRANSPORTISTA"]}</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>CELULAR</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-CELULAR TRANSPORTISTA"] && pdfData["MC-CELULAR TRANSPORTISTA"]}</Text>
                                <Text style={styles.key}>PLACA</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-PLACA TRANSPORTISTA"] && pdfData["MC-PLACA TRANSPORTISTA"]}</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>TIPO DE UNIDAD</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-TIPO DE UNIDAD TRANSPORTISTA"] && pdfData["MC-TIPO DE UNIDAD TRANSPORTISTA"]}</Text>
                                <Text style={styles.key}>COLOR</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-COLOR TRANSPORTISTA"] && pdfData["MC-COLOR TRANSPORTISTA"]}</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>MARCA</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-MARCA TRANSPORTISTA"] && pdfData["MC-MARCA TRANSPORTISTA"]}</Text>
                                <Text style={styles.key}>TRANSITO</Text>
                                <Text style={styles.value}>{pdfData && pdfData["MC-TRANSITO TRANSPORTISTA"] && pdfData["MC-TRANSITO TRANSPORTISTA"]}</Text>
                            </View>
                        </View>
                        <Br />
                        <Text style={styles.subtitle}>INFORMACION DEL SERVICIO</Text>

                        <View style={styles.items}>
                            <View style={styles.viewKeyValue}>


                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>MERCANCIA</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-MERCANCIA"] && pdfData["MC-MERCANCIA"]}</Text>

                                </View>
                                <View style={styles.viewKeyValue}>

                                    <Text style={styles.key}>TIPO DE CARGA</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-TIPO DE CARGA"] && pdfData["MC-TIPO DE CARGA"]}</Text>
                                </View>

                            </View>
                            <View style={styles.viewKeyValue}>


                                <View style={styles.viewKeyValue}>

                                    <Text style={styles.key}>EMPAQUE</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-EMPAQUE"] && pdfData["MC-EMPAQUE"]}</Text>
                                </View>


                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>SERVICIO</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-SERVICIO"] && pdfData["MC-SERVICIO"]}</Text>

                                </View>

                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>ORIGEN</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-ORIGEN"] && pdfData["MC-ORIGEN"]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>DESTINO</Text>
                                    <Text style={styles.value}>{pdfData && pdfData["MC-DESTINO"] && pdfData["MC-DESTINO"]}</Text>
                                </View>

                            </View>
                        </View>
                        <Br />
                        <Text style={styles.subtitle}>DESCRIPCION DE LA CARGA</Text>
                        <Br />
                        <View style={styles.viewKeyValue}>
                            <Text style={{ ...styles.key, width: '5%' }}>No</Text>
                            <Text style={{ ...styles.key, width: '5%' }}>ITEM</Text>
                            <Text style={{ ...styles.key, width: '25%' }}>DESCRIPCION</Text>
                            <Text style={{ ...styles.key, width: '10%' }}>MARCA</Text>
                            <Text style={{ ...styles.key, width: '10%' }}>CANTIDAD</Text>
                            <Text style={{ ...styles.key, width: '10%' }}>PESO</Text>
                            <Text style={{ ...styles.key, width: '10%' }}>VOLUMEN</Text>
                            <Text style={{ ...styles.key, width: '25%' }}>DIRECCION DE ENTREGA</Text>

                        </View>

                        {pdfData && pdfData.tarifa && pdfData.tarifa.map((i, index) => {
                            return (

                                <View style={styles.viewKeyValue} key={index}>
                                    <Text style={{ ...styles.value, width: '5%' }}>{index + 1}</Text>
                                    <Text style={{ ...styles.value, width: '5%' }}>{pdfData && pdfData[`MC-ITEM${index}`] && pdfData[`MC-ITEM${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '25%' }}>{pdfData && pdfData[`MC-DESCRIPCION${index}`] && pdfData[`MC-DESCRIPCION${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '10%' }}>{pdfData && pdfData[`MC-MARCA${index}`] && pdfData[`MC-MARCA${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '10%' }}>{pdfData && pdfData[`MC-CANTIDAD${index}`] && pdfData[`MC-CANTIDAD${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '10%' }}>{pdfData && pdfData[`MC-PESO${index}`] && pdfData[`MC-PESO${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '10%' }}>{pdfData && pdfData[`MC-VOLUMEN${index}`] && pdfData[`MC-VOLUMEN${index}`]}</Text>
                                    <Text style={{ ...styles.value, width: '25%' }}>{pdfData && pdfData[`MC-DIRECCION DE ENTREGA${index}`] && pdfData[`MC-DIRECCION DE ENTREGA${index}`]}</Text>
                                </View>
                            )
                        })
                        }
                        <View style={styles.viewKeyValue} >
                            <Text style={{ ...styles.noValueYellow, width: '45%' }}>TOTAL</Text>
                            <Text style={{ ...styles.valueYellow, width: '10%' }}>{pdfData && pdfData[`cantidad`] && pdfData[`cantidad`]}</Text>
                            <Text style={{ ...styles.valueYellow, width: '10%' }}>{pdfData && pdfData[`peso`] && pdfData[`peso`]}</Text>
                            <Text style={{ ...styles.valueYellow, width: '10%' }}>{pdfData && pdfData[`volumen`] && pdfData[`volumen`]}</Text>

                        </View>
                        <Br />
                        <View style={styles.items}>
                            <View style={styles.viewKeyValue}>
                                <Text style={styles.key}>DOCUMENTACION SOPORTE</Text>
                                <Text style={styles.key}>INSTRUCCIONES DEL TRANSPORTE</Text>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.key}>DOCUMENTO</Text>
                                    <Text style={styles.key}>NUMERO</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>PLAZO DE ENTREGA</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`MC-INSTRUCCION2`] && pdfData[`MC-INSTRUCCION2`]}</Text>
                                </View>
                            </View>
                            <View style={styles.viewKeyValue}>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>{pdfData && pdfData[`MC-DOC1`] && pdfData[`MC-DOC1`]}</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`MC-NUM1`] && pdfData[`MC-NUM1`]}</Text>
                                </View>
                                <View style={styles.viewKeyValue}>
                                    <Text style={styles.value}>INSTRUCCION ESPECIAL</Text>
                                    <Text style={styles.value}>{pdfData && pdfData[`MC-INSTRUCCION4`] && pdfData[`MC-INSTRUCCION4`]}</Text>
                                </View>
                            </View>


                            {pdfData.incluye && pdfData.incluye.map((i, index) => {
                                return (
                                    <View style={styles.viewKeyValue} key={index}>
                                        <View style={styles.viewKeyValue}>
                                            <Text style={styles.value}>{pdfData && pdfData[`MC-DOC${index + 3}`] && pdfData[`MC-DOC${index + 3}`]}</Text>
                                            <Text style={styles.value}>{pdfData && pdfData[`MC-NUM${index + 3}`] && pdfData[`MC-NUM${index + 3}`]}</Text>
                                        </View>
                                        <View style={styles.viewKeyValue}>
                                            <Text style={styles.value}>{pdfData && pdfData[`MC-INSTRUCCION01${index + 3}`] && pdfData[`MC-INSTRUCCION01${index + 3}`]}</Text>
                                            <Text style={styles.value}>{pdfData && pdfData[`MC-INSTRUCCION02${index + 3}`] && pdfData[`MC-INSTRUCCION02${index + 3}`]}</Text>
                                        </View>
                                    </View>

                                )
                            })
                            }
                        </View>
                        <Br />
                        <Text style={styles.subtitle}>OBSERVACIONES EN ORIGEN</Text>
                        <Br />
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.value}>{pdfData[`MC-INCLUYE`] && pdfData[`MC-INCLUYE`]}</Text>
                        </View>
                        <Br />
                        <Text style={styles.subtitle}>OBSERVACIONES EN DESTINO</Text>
                        <Br />
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.value}>{pdfData[`MC-EXCLUYE`] && pdfData[`MC-EXCLUYE`]}</Text>
                        </View>
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.value}> NOTA: El transportista es responsable de que la carga llegue a destino en buenas condiciones y por ningun motivo debe descargar o cargar sin previa autorizacion de la Empresa.		
									
<Br/>
La firma de recepcion en este Manifiesto de Carga es la constancia de que se ha recibido la carga en destino.											
</Text>
                        


</View>
                        <Br />
                        <Br />
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.valueElaborador}>FIRMA Y SELLO:</Text>
                            <Text style={styles.valueElaboradorLine}></Text>
                            <Text style={styles.valueElaborador}>FIRMA Y SELLO:</Text>
                            <Text style={styles.valueElaboradorLine}></Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.valueElaborador}>NOMBRE:</Text>
                            <Text style={styles.valueElaboradorLine}></Text>
                            <Text style={styles.valueElaborador}>NOMBRE:</Text>
                            <Text style={styles.valueElaboradorLine}>{pdfData && pdfData["MC-NOMBRE TRANSPORTISTA"] && pdfData["MC-NOMBRE TRANSPORTISTA"]}</Text>
                        </View>
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.valueElaborador}>FECHA:</Text>
                            <Text style={styles.valueElaboradorLine}>{getDayMonthYear()}</Text>
                            <Text style={styles.valueElaborador}>FECHA:</Text>
                            <Text style={styles.valueElaboradorLine}>{getDayMonthYear()}</Text>
                        </View>
                  
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.noValueWhite}></Text>

                            <Text style={styles.keyCenter}>DESPACHADOR</Text>
                            <Text style={styles.noValueWhite}></Text>
                            <Text style={styles.keyCenter}>TRANSPORTISTA</Text>
                        </View>
                        <Br />
                        <Br />
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.valueElaborador}></Text>
                            <Text style={styles.valueElaborador}>FIRMA Y SELLO:</Text>
                            <Text style={styles.valueElaboradorLine}></Text>
                            <Text style={styles.valueElaborador}></Text>
                        </View>
                        <View style={styles.viewKeyValue}>
                            <Text style={styles.valueElaborador}></Text>
                            <Text style={styles.valueElaborador}>NOMBRE:</Text>
                            <Text style={styles.valueElaboradorLine}>{pdfData && pdfData["MC-NOMBRE CONSIGNATARIO"] && pdfData["MC-NOMBRE CONSIGNATARIO"]}</Text>
                            <Text style={styles.valueElaborador}></Text>
                        </View>
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.valueElaborador}></Text>
                            <Text style={styles.valueElaborador}>FECHA:</Text>
                            <Text style={styles.valueElaboradorLine}></Text>
                            <Text style={styles.valueElaborador}></Text>
                        </View>
                        <View style={styles.viewKeyValue} >
                            <Text style={styles.noValueWhite}></Text>

                            <Text style={styles.keyCenter}>CONSIGNATARIO</Text>
                            <Text style={styles.noValueWhite}></Text>

                        </View>
                    </Page>
                </Document>}
                fileName={`MANIFESTO DE CARGA ${pdfData && pdfData[`MC-COTIZACION No`] && pdfData[`MC-COTIZACION No`]}`}>

                <Button style={'buttonSecondary'} click={click}>pdf</Button>

            </PDFDownloadLink>}
        </div>
    )
}


export default PDFView
