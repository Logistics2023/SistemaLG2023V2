import { useRouter } from 'next/router'
import Image from 'next/image'
import { useReducer, useState } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'
import { getDayMonthYear } from "../utils/Fecha";

import { writeUserData } from '../firebase/utils';


import style from '../styles/Manifesto.module.css'
import Button from '../components/Button'
import dynamic from "next/dynamic";

const InvoicePDF = dynamic(() => import("../components/pdfMC"), {
    ssr: false,
});

function CotizacionTerrestre() {
    const { user, userDB, pdfData, setUserPdfData, setUserSuccess } = useUser()

    const [calc, setCalc] = useState({})

    const [counter, setCounter] = useState({})

    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([])
    const [excluye, setExcluye] = useState([""])



    function handleEventChange(e) {
        let data = { [`MC-${e.target.name}`]: e.target.value }
        setUserPdfData({ ...pdfData, ...data, tarifa, otrosGastos, incluye, excluye, ...counter, })
    }
    function handlerCounter(word) {
        const newTarifa = tarifa.map(i => i)
        newTarifa.pop()
        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa: [...tarifa, ...[""]], otrosGastos, incluye, excluye, ...counter, })
            setTarifa([...tarifa, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa: newTarifa, otrosGastos, incluye, excluye, ...counter, })
            setTarifa(newTarifa)
        }
    }

    function handlerCounterTwo(word) {
        const newIncluye = incluye.map(i => i)
        newIncluye.pop()
        word == "pluss" ? setIncluye([...incluye, ...[""]]) : setIncluye(newIncluye)

        if (word == "pluss") {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye: [...incluye, ...[""]], excluye, ...counter, })
            setIncluye([...incluye, ...[""]])
        } else {
            setUserPdfData({ ...pdfData, tarifa, otrosGastos, incluye: newIncluye, excluye, ...counter, })
            setIncluye(newIncluye)
        }
    }


    function handlerCalc(e, index) {

        let data = {
            ...calc,
            [e.target.name]: e.target.value,
        }
        setCalc(data)
        let arr = Object.entries(data)

        let red = arr.reduce((ac, i) => {
            let str = i[0]
            if (str.includes('CANTIDAD')) {
                return { ...ac, cantidad: ac && ac['cantidad'] && parseInt(ac['cantidad']) ? parseInt(ac['cantidad']) + parseInt(i[1]) : i[1] }
            }
            if (str.includes('PESO')) {
                return { ...ac, peso: ac && ac['peso'] && parseInt(ac['peso']) ? parseInt(ac['peso']) + parseInt(i[1]) : i[1] }
            }
            if (str.includes('VOLUMEN')) {
                return { ...ac, volumen: ac && ac['volumen'] && parseInt(ac['volumen']) ? parseInt(ac['volumen']) + parseInt(i[1]) : i[1] }
            }
        }, {})

        setCounter({ ...counter, ...red })
        return setUserPdfData({ ...{ ...counter, ...red } })

    }

    console.log(pdfData)

    function generateNO() {
        let cotizacionNo = userDB.NoDeManifiesto
            ? `${userDB.NoDeManifiesto + 1 < 10 ? '00' : ''}${userDB.NoDeManifiesto + 1 > 9
                && userDB.NoDeManifiesto + 1 < 100 ? '0' : ''}${userDB.NoDeManifiesto + 1}/${new Date().getFullYear().toString().substring(2, 4)}` : `001/${new Date().getFullYear().toString().substring(2, 4)}`
        let date = getDayMonthYear()


        userDB !== '' && setUserPdfData({
            ...pdfData,
            ["MC-COTIZACION No"]: cotizacionNo,
            ["MC-FECHA"]: date,
            operador: userDB.admins[user.uid].name
        })



        let object = {
            NoDeManifiesto: userDB.NoDeManifiesto ? userDB.NoDeManifiesto + 1 : 1
        }
        writeUserData('/', object, setUserSuccess)

    }

    return (
        <Layout>
            <div className={style.container}>
                <form className={style.form}>

                    <div className={style.subtitle}>MANIFIESTO DE CARGA </div>

                    <div className={style.containerFirstItems}>
                        <div className={style.imgForm}>
                            <Image src="/logo.svg" width="250" height="150" alt="User" />
                        </div>
                        <div className={style.firstItems}>
                            <div>
                                <h2 htmlFor="">MANIFIESTO DE CARGA</h2>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className={style.containerSecondItems}>

                        <div className={style.itemsTwo}>
                            <div>
                                <label htmlFor="">REMITENTE </label>
                            </div>
                            <div>
                                <input type="text" name={"NOMBRE DE EMPRESA"} onChange={handleEventChange} placeholder='NOMBRE DE EMPRESA' />
                            </div>
                            <div>
                                <input type="text" name={"DIRECCION"} onChange={handleEventChange} placeholder='DIRECCION' />
                            </div>
                            <div>
                                <input type="text" name={"CIUDAD - PAIS"} onChange={handleEventChange} placeholder='CIUDAD - PAIS' />
                            </div>
                            <div>
                                <input type="text" name={"NIT"} onChange={handleEventChange} placeholder='NIT' />
                            </div>
                        </div>

                        <div className={style.itemsThree}>
                            <div>
                                <label htmlFor="">MANIFIESTO DE LA CARGA</label>
                            </div>
                            <div>
                                <label className={style.label}>NO</label>
                                <input type="text" name={"COTIZACION No"} onChange={handleEventChange} placeholder='' defaultValue={pdfData['MC-COTIZACION No'] && pdfData['MC-COTIZACION No']} />
                            </div>

                            <div>
                                <label className={style.label}>FECHA</label>
                                <input type="text" name={"FECHA"} onChange={handleEventChange} placeholder='' defaultValue={pdfData['MC-FECHA'] && pdfData['MC-FECHA']} />

                            </div>
                            <div>
                                <label className={style.label}>OPERADOR</label>
                                <input type="text" name={"operador"} onChange={handleEventChange} placeholder='' defaultValue={pdfData['operador'] && pdfData['operador']} />
                            </div>

                            <div>
                                <label className={style.label}>CELULAR</label>
                                <input type="text" name={"CELULAR"} onChange={handleEventChange} placeholder='' />
                            </div>
                        </div>
                        <br />
                        <br />

                        <div className={style.itemsTwo}>
                            <div>
                                <label htmlFor="">CONSIGNATARIO</label>
                            </div>
                            <div>
                                <input type="text" name={"NOMBRE CONSIGNATARIO"} onChange={handleEventChange} placeholder='NOMBRE' />
                            </div>
                            <div>
                                <input type="text" name={"DIRECCION CONSIGNATARIO"} onChange={handleEventChange} placeholder='DIRECCION' />
                            </div>
                            <div>
                                <input type="text" name={"CIUDAD-PAIS CONSIGNATARIO"} onChange={handleEventChange} placeholder='CIUDAD-PAIS' />
                            </div>
                            <div>
                                <input type="text" name={"NIT CONSIGNATARIO"} onChange={handleEventChange} placeholder='NIT' />
                            </div>
                            <div>
                                <input type="text" name={"TELEFONO CONSIGNATARIO"} onChange={handleEventChange} placeholder='TELEFONO' />
                            </div>
                        </div>

                        <div className={style.itemsTwo}>

                            <div>
                                <label htmlFor="">TRANSPORTADOR</label>
                            </div>

                            <div>
                                <input type="text" value='LOGISTICS GEAR' />
                            </div>

                            <div>
                                <input type="text" value='Av. 14 de Septiembre esq. Calle 17 Edificio Mario Mercado Piso 5 Of 506' />
                            </div>
                            <div>
                                <input type="text" value='LA PAZ - BOLIVIA' />
                            </div>
                            <div>
                                <input type="text" value='+591 (2) 2780607' />
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />

                    <div className={style.subtitle}>DATOS DEL TRANSPORTISTA</div>
                    <br />
                    <div className={`${style.items} ${style.newStyle}`}>
                        <div>
                            <label className={style.label} htmlFor="">NOMBRE</label>
                            <input type="text" name={"NOMBRE TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">LICENCIA</label>
                            <input type="text" name={"LICENCIA TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">CELULAR</label>
                            <input type="text" name={"CELULAR TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">PLACA</label>
                            <input type="text" name={"PLACA TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">TIPO DE UNIDAD</label>
                            <input type="text" name={"TIPO DE UNIDAD TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label className={style.label} htmlFor="">COLOR</label>
                            <input type="text" name={"COLOR TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">MARCA</label>
                            <input type="text" name={"MARCA TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label className={style.label} htmlFor="">TRANSITO</label>
                            <input type="text" name={"TRANSITO TRANSPORTISTA"} onChange={handleEventChange} />
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className={style.subtitle}>INFORMACION DEL SERVICIO</div>
                    <br />
                    <div className={`${style.items} ${style.newStyle}`}>
                        <div>
                            <label className={style.label} htmlFor="">MERCANCIA</label>
                            <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                        </div>


                        <div>
                            <label className={style.label} htmlFor="">*TIPO DE CARGA</label>
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
                            <label className={style.label} htmlFor="">EMPAQUE</label>
                            <select name="EMPAQUE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="CAJAS DE CARTON">CAJAS DE CARTON</option>
                                <option value="CAJAS DE MADERA">CAJAS DE MADERA</option>
                                <option value="CARGA SUELTA">CARGA SUELTA</option>
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
                                <option value="PALLETIZADO">PALLETIZADO</option>

                            </select>
                        </div>
                        <div>
                            <label className={style.label} htmlFor="">SERVICIO</label>
                            <select name="SERVICIO" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="NACIONAL">NACIONAL</option>
                                <option value="INTERNACIONAL">INTERNACIONAL</option>
                                <option value="URBANO">URBANO</option>
                            </select>                        </div>
                        <div>
                            <label className={style.label} htmlFor="">ORIGEN</label>
                            <input type="text" name={"ORIGEN"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label className={style.label} htmlFor="">DESTINO</label>
                            <input type="text" name={"DESTINO"} onChange={handleEventChange} />
                        </div>

                    </div>
                    <br />

                    <div className={style.subtitle}>DESCRPCION DE LA CARGA<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>

                    <div className={`${style.containerFirstItems2} ${style.desktop}`}>
                        <span>Nº</span>
                        <span>ITEM</span>
                        <span>DESCRIPCION</span>
                        <span>MARCA Y/O PRESINTO</span>
                        <span>CANT</span>
                        <span>PESO (Kg)</span>
                        <span>VOLUMEN (M3)</span>
                        <span>DIRECCION DE ENTREGA</span>
                    </div>
                    {
                        tarifa.map((i, index) => {
                            return (
                                <div className={`${style.inputs}`} onChange={handleEventChange} key={index}>
                                    <span>{index + 1}</span>
                                    <input type="text" name={`ITEM${index}`} onChange={handleEventChange} placeholder="ITEM" />
                                    <input type="text" name={`DESCRIPCION${index}`} onChange={handleEventChange} placeholder="DESCRIPCION" />
                                    <input type="text" name={`MARCA${index}`} en onChange={handleEventChange} placeholder="MARCA Y/O PRESINTO" />
                                    <input type="number" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="CANTIDAD" />
                                    <input type="number" name={`PESO${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="PESO (Kg)" />
                                    <input type="number" name={`VOLUMEN${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="VOLUMEN (M3)" />
                                    <input type="text" name={`DIRECCION DE ENTREGA${index}`} onChange={handleEventChange} placeholder="DIRECCION DE ENTREGA" />
                                </div>
                            )
                        })
                    }
                    <div className={`${style.inputsYellow}`} >
                        <span className={style.total}>TOTAL</span>



                        <span className={style.span}>{counter && counter.cantidad && counter.cantidad}</span>
                        <span className={style.span}>{counter && counter.peso && counter.peso}</span>
                        <span className={style.span}>{counter && counter.volumen && counter.volumen}</span>

                        <label htmlFor="">Cantidad</label>
                        <span className={style.span}>{counter && counter.cantidad && counter.cantidad}</span>

                        <label htmlFor="">Peso</label>
                        <span className={style.span}>{counter && counter.peso && counter.peso}</span>

                        <label htmlFor="">Volumen</label>
                        <span className={style.span}>{counter && counter.volumen && counter.volumen}</span>
                    </div>
                    <br />
                    <br />
                    <div className={style.containerItems}>


                        <div className={style.itemsFour}>
                            <div>
                                <span htmlFor="">DOCUMENTACION SOPORTE</span>
                            </div>

                            <div className={style.Two}>
                                <div htmlFor="">DOCUMENTO</div>
                                <div htmlFor="">NUMERO</div>
                            </div>

                            <div>
                                <input type="text" name={"DOC1"} onChange={handleEventChange} placeholder='DEX' />
                                <input type="text" name={"NUM1"} onChange={handleEventChange} placeholder='201-2548/2022' />
                            </div>


                            {
                                incluye.map((i, index) => {
                                    return (

                                        <div key={index}>
                                            <input type="text" name={`DOC${index + 3}`} onChange={handleEventChange} />
                                            <input type="text" name={`NUM${index + 3}`} onChange={handleEventChange} />
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className={style.itemsFour}>
                            <div className={style.subtitle}>
                                <span htmlFor="">iNSTRUCCIONES DEL TRANSPORTE
                                </span>
                                <span className={style.counterPluss} onClick={() => handlerCounterTwo('pluss')}>+</span>
                                <span className={style.counterLess} onClick={() => handlerCounterTwo('less')}>-</span>
                            </div>

                            <div >
                                <input type="text" className={style.negrita} name={"INSTRUCCION1"} onChange={handleEventChange} value={'PLAZO DE ENTREGA'} />
                                <input type="text" name={"INSTRUCCION2"} onChange={handleEventChange} placeholder='3 DIAS' />

                            </div>
                            <div >
                                <input type="text" className={style.negrita} name={"INSTRUCCION3"} onChange={handleEventChange} value={'INSTRUCCION ESPECIAL'} />
                                <input type="text" name={"INSTRUCCION4"} onChange={handleEventChange} placeholder='REFRIGERAR A 18°C' />

                            </div>

                            {
                                incluye.map((i, index) => {
                                    return (

                                        <div key={index}>
                                            <input type="text" name={`INSTRUCCION01${index + 3}`} onChange={handleEventChange} />
                                            <input type="text" name={`INSTRUCCION02${index + 3}`} onChange={handleEventChange} />
                                        </div>
                                    )
                                })
                            }



                        </div>
                    </div>
                    <br />




                    <div className={style.subtitle}>OBSERVACIONES EN ORIGEN</div>

                    <div className={style.inputsAll} >
                        <textarea type="text" name={"INCLUYE"} onChange={handleEventChange} />
                    </div>
                    <br />
                    <div className={style.subtitle}>OBSERVACIONES EN DESTINO</div>

                    <div className={style.inputsAll} >
                        <textarea type="text" name={"EXCLUYE"} onChange={handleEventChange} />
                    </div>


                    <br />


                </form>
            </div >
            <div className={style.containerFilter}>
                <Button style={'buttonPrimary'} click={generateNO}>Generar N°</Button>
                <InvoicePDF />
            </div>

            <br />
            <br />
        </Layout >
    )
}

export default WithAuth(CotizacionTerrestre)
