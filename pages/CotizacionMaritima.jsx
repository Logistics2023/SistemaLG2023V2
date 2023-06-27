import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Button from '../components/Button'
import { writeUserData } from '../firebase/utils';
import { getDayMonthYear } from "../utils/Fecha";


import style from '../styles/CotizacionTerrestre.module.css'
import dynamic from "next/dynamic";

const InvoicePDF = dynamic(() => import("../components/pdfCM"), {
    ssr: false,
});

function CotizacionMaritima() {
    const { user, userDB, pdfData, setUserPdfData, setUserSuccess } = useUser()
    const router = useRouter()

    const [data, setData] = useState({})
    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([""])
    const [excluye, setExcluye] = useState([""])
    const [notas, setNotas] = useState([""])
    const [filter, setFilter] = useState("")
    const [autocomplete, setAutocomplete] = useState(false)
    const [itemSelect, setItemSelect] = useState({})

    const [calc, setCalc] = useState({})


    function handleEventChange(e) {
        let data = e.target.name !== 'nombre' &&
            e.target.name !== 'correo' &&
            e.target.name !== 'empresa' &&
            e.target.name !== 'telefono' &&
            e.target.name !== 'cargo' &&
            e.target.name !== 'ciudad' &&
            e.target.name !== 'ci'
            ? { [`CM-${e.target.name}`]: e.target.value } : { [`${e.target.name}`]: e.target.value }
        setUserPdfData({ ...pdfData, ...data, tarifa, otrosGastos, incluye, excluye, notas })
    }
    function handlerCounter(word) {
        const newTarifa = tarifa.map(i => i)
        newTarifa.pop()
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa: [...tarifa, ...[""]], otrosGastos, incluye, excluye, notas })
            setTarifa([...tarifa, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa: newTarifa, otrosGastos, incluye, excluye, notas })
            setTarifa(newTarifa)
        }
    }
    function handlerCounterTwo(word) {
        const newOtrosGastos = otrosGastos.map(i => i)
        newOtrosGastos.pop()
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos: [...otrosGastos, ...[""]], incluye, excluye, notas })
            setOtrosGastos([...otrosGastos, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos: newOtrosGastos, incluye, excluye, notas })
            setOtrosGastos(newOtrosGastos)
        }
    }
    function handlerCounterThree(word) {
        const newIncluye = incluye.map(i => i)
        newIncluye.pop()
        word == "pluss" ? setIncluye([...incluye, ...[""]]) : setIncluye(newIncluye)
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, notas, incluye: [...incluye, ...[""]], excluye })
            setIncluye([...incluye, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, notas, incluye: newIncluye, excluye })
            setIncluye(newIncluye)
        }
    }
    function handlerCounterFour(word) {
        const newExcluye = excluye.map(i => i)
        newExcluye.pop()
        word == "pluss" ? setExcluye([...excluye, ...[""]]) : setExcluye(newExcluye)
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye, notas, excluye: [...excluye, ...[""]] })
            setExcluye([...excluye, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye, notas, excluye: newExcluye })
            setExcluye(newExcluye)
        }
    }
    function handlerCounterFive(word) {
        const newNotas = notas.map(i => i)
        newNotas.pop()
        word == "pluss" ? setNotas([...notas, ...[""]]) : setNotas(newNotas)
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye, excluye, notas: [...notas, ...[""]] })
            setNotas([...notas, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye, excluye, notas: newNotas })
            setNotas(newNotas)
        }
    }

    function handlerCalc(e, index) {

        if (e.target.name == `CANTIDADFLETE${index}` && calc[`FLETEUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'FLETEUNITARIO', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            setUserPdfData({ ...pdfData, ...calc, ...object })
            return
        }

        if (e.target.name == `FLETEUNITARIO${index}` && calc[`CANTIDADFLETE${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDADFLETE', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            setUserPdfData({ ...pdfData, ...calc, ...object })
            return
        }

        if (e.target.name == `CANTIDAD${index}` && calc[`COSTOUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'COSTOUNITARIO', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            setUserPdfData({ ...pdfData, ...calc, ...object })
            return
        }

        if (e.target.name == `COSTOUNITARIO${index}` && calc[`CANTIDAD${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDAD', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            setUserPdfData({ ...pdfData, ...calc, ...object })
            return
        }

        let object = {

            [e.target.name]: e.target.name.includes('UNITARIO') ? formatoMexico(round(e.target.value).toFixed(2)) : e.target.value,
        }
        setCalc({ ...calc, ...object })

    }
    function round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }
    const formatoMexico = (number) => {

        const exp = /(\d)(?=(\d{3})+(?!\d))/g;

        const rep = '$1,';

        let arr = number.toString().split('.');

        arr[0] = arr[0].replace(exp, rep);

        return arr[1] ? arr.join('.') : arr[0];

    }

    function reducer(e, index, counter, prod, total) {

        let product = e.target.value * calc[`${counter}${index}`].replaceAll(',', '')

        let data = {

            ...calc,

            [e.target.name]: e.target.name.includes('UNITARIO') ? formatoMexico(round(e.target.value).toFixed(2)) : e.target.value,

            [`${prod}${index}`]: formatoMexico(round(product).toFixed(2)),

        }

        let arr = Object.entries(data)

        let red = arr.reduce((ac, i) => {

            let str = i[0]

            if (str.includes(total)) {

                return ac

            }

            if (prod == 'PRODUCT' && str.includes('PRODUCTFLETE')) {

                return ac

            }

            let res = str.includes(prod)

            let r = res ? i[1].replaceAll(',', '') * 1 + ac * 1 : ac * 1

            return r

        }, 0)

        let object = {

            [e.target.name]: e.target.name.includes('UNITARIO') ? formatoMexico(round(e.target.value).toFixed(2)) : e.target.value,

            [`${prod}${index}`]: formatoMexico(round(product).toFixed(2)),

            PRODUCTOFLETETOTAL: prod === 'PRODUCTFLETE' ? formatoMexico(round(red).toFixed(2)) : data['PRODUCTOFLETETOTAL'],

            PRODUCTOTOTAL: prod === 'PRODUCT' ? formatoMexico(round(red).toFixed(2)) : data['PRODUCTOTOTAL'],

        }

        let mainObj = { ...calc, ...object }

        let sumaTotal = mainObj.PRODUCTOTOTAL !== undefined && mainObj.PRODUCTOFLETETOTAL !== undefined ? (mainObj.PRODUCTOTOTAL.replaceAll(',', '') * 1 + mainObj.PRODUCTOFLETETOTAL.replaceAll(',', '') * 1).toFixed(2) : (mainObj.PRODUCTOTOTAL ? mainObj.PRODUCTOTOTAL : (mainObj.PRODUCTOFLETETOTAL && mainObj.PRODUCTOFLETETOTAL))

        return { ...mainObj, sumaTotal: formatoMexico(sumaTotal) }

    }



    function handlerPdfButton() {
        setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye, excluye })
        let object = {
            CotizacionMaritima: userDB.CotizacionMaritima ? userDB.CotizacionMaritima + 1 : 1
        }
        writeUserData('/', object, setUserSuccess)
    }




    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handlerFilterButton(e) {

        e.preventDefault()
        let obj = {
            nombre: '',
            correo: '',
            empresa: '',
            telefono: '',
            cargo: '',
            ciudad: '',
            ci: ''

        }
        let f = userDB.users[filter] ? userDB.users[filter] : obj

        setItemSelect(f)
        setUserPdfData({ ...pdfData, ...f })

        setAutocomplete(true)
        console.log(f)
    }



    function savei(e, word) {
        e.preventDefault()
        let obj = pdfData && Object.entries(pdfData).reduce((ac, i, index) => {
            return i[0].includes(`CM-${word.toUpperCase()}`) ? { ...ac, ...{ [i[0]]: i[1] } } : ac
        }, {})
        word === 'incluye' && writeUserData('/cm-incluye', obj, setUserSuccess)
        word === 'excluye' && writeUserData('/cm-excluye', obj, setUserSuccess)
        word === 'notas' && writeUserData('/cm-notas', obj, setUserSuccess)
    }
    function complete(e, word) {
        e.preventDefault()
        word === 'incluye' && setUserPdfData({ ...pdfData, ...userDB['cm-incluye'] })
        word === 'excluye' && setUserPdfData({ ...pdfData, ...userDB['cm-excluye'] })
        word === 'notas' && setUserPdfData({ ...pdfData, ...userDB['cm-notas'] })
    }




    function generateNO() {
        let cotizacionNo = userDB.CotizacionMaritima ? `${userDB.CotizacionMaritima + 1 < 10 ? '00' : ''}${userDB.CotizacionMaritima + 1 > 9 &&
            userDB.CotizacionMaritima + 1 < 100 ? '0' : ''}${userDB.CotizacionMaritima + 1}/${new Date().getFullYear().toString().substring(2, 4)}` : `001/${new Date().getFullYear().toString().substring(2, 4)}`
        let date = getDayMonthYear()

        userDB !== '' && setUserPdfData({
            ...pdfData,
            ["CM-COTIZACION No"]: cotizacionNo,
            ["CM-FECHA"]: date,
            operador: userDB.admins[user.uid].name

        })

        let object = {
            CotizacionMaritima: userDB.CotizacionMaritima ? userDB.CotizacionMaritima + 1 : 1
        }
        writeUserData('/', object, setUserSuccess)
    }

    useEffect(() => {


    }, [userDB, tarifa]);







    return (
        <Layout>
            <div className={style.container}>
                <form className={style.form}>

                    <div className={style.containerFilter}>
                        <input className={style.inputFilter} type="text" onChange={handleFilterChange} placeholder='Autocompletar por CI' />
                        <Button style={'buttonSecondary'} click={handlerFilterButton}>Completar</Button>
                    </div>

                    <div className={style.subtitle}>COTIZACIÓN TRANSPORTE MARITIMO</div>
                    <div className={style.containerFirstItems}>
                        <div className={style.imgForm}>
                            <Image src="/logo.svg" width="250" height="150" alt="User" />
                        </div>
                        <div className={style.firstItems}>
                            <div>
                                <label htmlFor="">COTIZACIÓN No</label>
                                <input type="text" name={"COTIZACION No"} onChange={handleEventChange} defaultValue={pdfData["CM-COTIZACION No"] && pdfData["CM-COTIZACION No"]} />
                            </div>
                            <div>
                                <label htmlFor="">FECHA</label>
                                <input type="text" name={"FECHA"} onChange={handleEventChange} defaultValue={pdfData["CM-FECHA"] && pdfData["CM-FECHA"]} />
                            </div>
                            <div>
                                <label htmlFor="">VALIDEZ</label>
                                <input type="text" name={"VALIDEZ"} onChange={handleEventChange} />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DATOS DE CLIENTE</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">NOMBRE</label>
                            <input type="text" name={"nombre"} onChange={handleEventChange} defaultValue={itemSelect['nombre'] ? itemSelect['nombre'] : ''} />
                        </div>
                        <div>
                            <label htmlFor="">CORREO</label>
                            <input type="text" name={"correo"} onChange={handleEventChange} defaultValue={itemSelect['correo'] ? itemSelect['correo'] : ''} />
                        </div>
                        <div>
                            <label htmlFor="">EMPRESA</label>
                            <input type="text" name={"empresa"} onChange={handleEventChange} defaultValue={itemSelect['empresa'] ? itemSelect['empresa'] : ''} />
                        </div>
                        <div>
                            <label htmlFor="">TELEFONO</label>
                            <input type="text" name={"telefono"} onChange={handleEventChange} defaultValue={itemSelect['telefono'] ? itemSelect['telefono'] : ''} />
                        </div>
                        <div>
                            <label htmlFor="">CARGO</label>
                            <input type="text" name={"cargo"} onChange={handleEventChange} defaultValue={itemSelect['cargo'] ? itemSelect['cargo'] : ''} />
                        </div>

                        <div>
                            <label htmlFor="">CIUDAD</label>
                            <input type="text" name={"ciudad"} onChange={handleEventChange} defaultValue={itemSelect['ciudad'] ? itemSelect['ciudad'] : ''} />
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DESCRIPCION DE LA CARGA</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">MERCANCIA</label>
                            <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*TIPO DE CARGA</label>
                            <select name="TIPO DE CARGA" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="GENERAL">GENERAL</option>
                                <option value="PELIGROSA">PELIGROSA</option>
                                <option value="ESPECIAL">ESPECIAL</option>
                                <option value="REFRIGERADA">REFRIGERADA</option>
                                <option value="PROYECTO">PROYECTO</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">EMPAQUE</label>
                            <select name="EMPAQUE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="CAJAS DE CARTON">CAJAS DE CARTON</option>
                                <option value="CAJAS DE MADERA">CAJAS DE MADERA</option>
                                <option value="CARGA SUELTA">CARGA SUELTA</option>
                                <option value="PALLETIZADO">PALLETIZADO</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">*VOLUMEN M3</label>
                            <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*PESO TN</label>
                            <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*CANTIDAD</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">INCOTERM</label>
                            <select name="INCOTERM" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="EXW">EXW</option>
                                <option value="FCA">FCA</option>
                                <option value="CPT">CPT</option>
                                <option value="CIP">CIP</option>
                                <option value="DAP">DAP</option>
                                <option value="DPU">DPU</option>
                                <option value="DDP">DDP</option>
                                <option value="CIF">CIF</option>
                                <option value="CFR">CFR</option>
                                <option value="FOB">FOB</option>
                                <option value="FAS">FAS</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">MODALIDAD</label>
                            <select name="MODALIDAD" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="MULTIMODAL">MULTIMODAL</option>
                                <option value="MARTIMO">MARTIMO</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DETALLES DEL SERVICIO</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">MEDIO DE TRANSPORTE</label>
                            <select name="MEDIO DE TRANSPORTE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="FCL">FCL</option>
                                <option value="BULK CARGO">BULK CARGO</option>
                                <option value="RORO">RORO</option>
                                <option value="CHARTER">CHARTER</option>
                                <option value="LCL">LCL</option>

                            </select>
                        </div>
                        <div>
                            <label htmlFor="">EQUIPO</label>
                            <select name="EQUIPO" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="20`STD">20`STD</option>
                                <option value="20`OT">20`OT</option>
                                <option value="20`FR">20`FR</option>
                                <option value="20`HARD TOP">20`HARD TOP</option>
                                <option value="20`OPEN SIDE">20`OPEN SIDE</option>
                                <option value="20`PLATAFORMA">20`PLATAFORMA</option>
                                <option value="20`RF">20`RF</option>
                                <option value="40`STD">40`STD</option>
                                <option value="40`HQ">40`HQ</option>
                                <option value="40`FR">40`FR</option>
                                <option value="40`OT">40`OT</option>
                                <option value="40`RF">40`RF</option>
                                <option value="40`HARD TOP">40`HARD TOP</option>
                                <option value="40`OPEN SIDE">40`OPEN SIDE</option>
                                <option value="40`PLATAFORMA">40`PLATAFORMA</option>
                                <option value="MAFI">MAFI</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">*ORIGEN</label>
                            <input type="text" name={"ORIGEN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*DESTINO</label>
                            <input type="text" name={"DESTINO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*CANTIDAD</label>
                            <input type="text" name={"CANTIDAD SERVICIO"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">*MONEDA</label>
                            <input type="text" name={"MONEDA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CARRIER</label>
                            <input type="text" name={"CARRIER"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">SERVICIO</label>
                            <select name="SERVICIO" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="EXPORTACIÓN">EXPORTACIÓN</option>
                                <option value="IMPORTACIÓN">IMPORTACIÓN</option>
                            </select>
                        </div>
                    </div>





                    {
                        pdfData && pdfData["CM-MEDIO DE TRANSPORTE"] && pdfData["CM-MEDIO DE TRANSPORTE"] == "FCL" && <>
                            <br />
                            <div className={style.subtitle}>TARIFA (Porta contenedores)<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>
                            <br />

                            <div className={`${style.containerFirstItems} ${style.desktop}`}>
                                <span>DETALLE</span>
                                <span>FLETE UNITARIO</span>
                                <span>CANTIDAD</span>
                                <span>FLETE TOTAL</span>
                            </div>
                            {
                                tarifa.map((i, index) => {
                                    return (
                                        <div className={`${style.inputs}`} key={index}>
                                            <input type="text" name={`DETALLEFLETE${index}`} onChange={handleEventChange} placeholder="DETALLE" />
                                            <input type="text" name={`FLETEUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`FLETEUNITARIO${index}`] && calc[`FLETEUNITARIO${index}`]} placeholder="FLETE UNITARIO" />
                                            <input type="text" name={`CANTIDADFLETE${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDADFLETE${index}`] && calc[`CANTIDADFLETE${index}`]} placeholder="CANTIDAD" />
                                            <input type="text" defaultValue={calc[`PRODUCTFLETE${index}`] && calc[`PRODUCTFLETE${index}`]} placeholder="FLETE TOTAL" />                                        </div>
                                    )
                                })
                            }

                            <div className={`${style.containerFirstItems}`}>
                                <span></span>
                                <span></span>
                                <span>TOTAL FLETES</span>
                                <p>{calc[`PRODUCTOFLETETOTAL`] && calc[`PRODUCTOFLETETOTAL`]}</p>
                            </div>
                        </>
                    }

                    {
                        pdfData && pdfData["CM-MEDIO DE TRANSPORTE"] && pdfData["CM-MEDIO DE TRANSPORTE"] !== "" && pdfData["CM-MEDIO DE TRANSPORTE"] !== "FCL" && <>
                            <br />
                            <div className={style.subtitle}>TARIFA (Bulk cargo, charter o roro)<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>
                            <br />

                            <div className={`${style.containerFirstItems} ${style.desktop}`}>
                                <span>DETALLE</span>
                                <span>FLETE W/M</span>
                                <span>W/M</span>
                                <span>FLETE TOTAL</span>
                            </div>
                            {
                                tarifa.map((i, index) => {
                                    return (
                                        <div className={`${style.inputs}`} key={index}>
                                            <input type="text" name={`DETALLEFLETE${index}`} onChange={handleEventChange} placeholder="DETALLE" />
                                            <input type="text" name={`FLETEUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`FLETEUNITARIO${index}`] && calc[`FLETEUNITARIO${index}`]} placeholder="FLETE W/M" />
                                            <input type="text" name={`CANTIDADFLETE${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDADFLETE${index}`] && calc[`CANTIDADFLETE${index}`]} placeholder="W/M" />
                                            <input type="text" defaultValue={calc[`PRODUCTFLETE${index}`] && calc[`PRODUCTFLETE${index}`]} placeholder="FLETE TOTAL" />
                                        </div>
                                    )
                                })
                            }
                            <div className={`${style.containerFirstItems}`}>
                                <span></span>
                                <span></span>
                                <span>TOTAL FLETES</span>
                                <p>{calc[`PRODUCTOFLETETOTAL`] && calc[`PRODUCTOFLETETOTAL`]}</p>
                            </div>
                        </>
                    }

                    <br />
                    <div className={style.subtitle}>OTROS GASTOS <span className={style.counterPluss} onClick={() => handlerCounterTwo('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterTwo('less')}>-</span></div>
                    <br />
                    <div className={`${style.containerFirstItems} ${style.desktop}`}>
                        <span>DETALLE</span>
                        <span>COSTO UNITARIO</span>
                        <span>CANTIDAD</span>
                        <span>COSTO TOTAL</span>
                    </div>
                    {
                        otrosGastos.map((i, index) => {

                            return (
                                <div className={`${style.inputs}`} key={index}>
                                    <input type="text" name={`DETALLE${index}`} onChange={handleEventChange} placeholder="DETALLE" />
                                    <input type="text" name={`COSTOUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`COSTOUNITARIO${index}`] && calc[`COSTOUNITARIO${index}`]} placeholder="COSTO UNITARIO" />
                                    <input type="text" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDAD${index}`] && calc[`CANTIDAD${index}`]} placeholder="CANTIDAD" />
                                    <input type="text" defaultValue={calc[`PRODUCT${index}`] && calc[`PRODUCT${index}`]} placeholder="COSTO TOTAL" />
                                </div>
                            )

                        })
                    }
                    <div className={`${style.containerFirstItems}`}>
                        <span></span>
                        <span></span>
                        <span>TOTAL OTROS GASTOS</span>
                        <p>{calc[`PRODUCTOTOTAL`] && calc[`PRODUCTOTOTAL`]}</p>
                    </div>
                    <br />

                    <div className={style.inputsSemi}>
                        <label htmlFor="">Costo Total</label><input type="text" defaultValue={calc.sumaTotal} />
                    </div>

                    <br />

                    <div className={style.containerFilter}>
                        <Button style={'buttonPrimary'} click={(e) => savei(e, 'incluye')}>Guardar</Button>

                        <Button style={'buttonSecondary'} click={(e) => complete(e, 'incluye')}>Completar</Button>
                    </div>
                    <br />
                    <div className={style.subtitle}>INCLUYE <span className={style.counterPluss} onClick={() => handlerCounterThree('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterThree('less')}>-</span></div>

                    {
                        incluye.map((i, index) => {
                            return (
                                <div className={style.inputsAll} key={index}>
                                    <input type="text" name={`INCLUYE${index}`} onChange={handleEventChange} defaultValue={pdfData[`CM-INCLUYE${index}`] && pdfData[`CM-INCLUYE${index}`]} />
                                </div>
                            )
                        })
                    }
                    <br />
                    <div className={style.containerFilter}>
                        <Button style={'buttonPrimary'} click={(e) => savei(e, 'excluye')}>Guardar</Button>

                        <Button style={'buttonSecondary'} click={(e) => complete(e, 'excluye')}>Completar</Button>
                    </div>
                    <br />
                    <div className={style.subtitle}>EXCLUYE <span className={style.counterPluss} onClick={() => handlerCounterFour('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterFour('less')}>-</span></div>

                    {
                        excluye.map((i, index) => {
                            return (

                                <div className={style.inputsAll} key={index}>
                                    <input type="text" name={`EXCLUYE${index}`} onChange={handleEventChange} defaultValue={pdfData[`CM-EXCLUYE${index}`] && pdfData[`CM-EXCLUYE${index}`]} />
                                </div>
                            )
                        })
                    }

                    <br />
                    <div className={style.containerFilter}>
                        <Button style={'buttonPrimary'} click={(e) => savei(e, 'notas')}>Guardar</Button>

                        <Button style={'buttonSecondary'} click={(e) => complete(e, 'notas')}>Completar</Button>
                    </div>
                    <br />
                    <div className={style.subtitle}>NOTAS <span className={style.counterPluss} onClick={() => handlerCounterFive('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterFive('less')}>-</span></div>
                    {
                        notas.map((i, index) => {
                            return (

                                <div className={style.inputsAll} key={index}>
                                    <input type="text" name={`NOTAS${index}`} onChange={handleEventChange} defaultValue={pdfData[`CM-NOTAS${index}`] && pdfData[`CM-NOTAS${index}`]} />
                                </div>
                            )
                        })
                    }
                    <br />
                </form>
            </div>
            <div className={style.containerFilter}>
                <Button style={'buttonPrimary'} click={generateNO}>Generar N°</Button>
                <InvoicePDF />
            </div>

            <br />
            <br />
        </Layout>
    )
}

export default WithAuth(CotizacionMaritima)



