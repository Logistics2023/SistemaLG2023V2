import { handleSignOut, getData, removeData, writeUserData } from '../firebase/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '../context/Context.js'
import { WithAuth } from '../HOCs/WithAuth'
import Modal from '../components/Modal'
import Error from '../components/Error'
import Button from '../components/Button'
import Layout from '../layout/Layout'
 

import Success from '../components/Success'
import style from '../styles/AdminUsers.module.css'

function Users() {
    const { user, userDB, setUserData, setUserSuccess, success, pdfData, setUserPdfData, } = useUser()
    const [mode, setMode] = useState('')
    const [itemSelect, setItemSelect] = useState('')
    const [rol, setRol] = useState('')
    const [filter, setFilter] = useState('')
    const [bank, setBank] = useState(false)
    const [counter, setCounter] = useState('')
    const [LGC, setLGC] = useState('')


    const [viewForm, setViewForm] = useState(false)



    function handleEventChange(e) {
        setUserPdfData({ ...pdfData, ...{ [`AD-${e.target.name}`]: e.target.value } })
    }
    const router = useRouter()

    function push(e) {
        e.preventDefault()
        router.push('/AddUser')
    }
    // function edit(item) {
    //     router.push(`/update/${item}`)
    // }
    function remove(item) {
        setMode('remove')
        setItemSelect(item)
    }
    function removeConfirm() {
        setItemSelect('')
        removeData(`users/${itemSelect}/`, setUserData, setUserSuccess)
        console.log('eli');
        getData(`/`, setUserData)
        console.log('admin');
    }

    function edit(item) {

        setRol(userDB.users[item].rol)
        setMode('edit')
        setItemSelect(userDB.users[item])
        setViewForm(true)
    }
    function editRol(data) {
        setRol(data)
    }
    function editConfirm() {
        writeUserData(`users/${itemSelect}/`, { rol, }, setUserSuccess)
        getData(`/`, setUserData)
        setViewForm(false)
    }

    function x() {
        setMode(null)
    }
    function signOut(e) {
        e.preventDefault()
        handleSignOut()
    }
    console.log(rol)
    function handlerOnChange(e) {
        // e.target.value
        setFilter(e.target.value)
    }

    function handlerForm() {
        viewForm == true && setItemSelect('')
        setViewForm(!viewForm)
    }
    function save(e) {
        e.preventDefault()

        if (pdfData['AD-NOMBRE'] &&
            pdfData['AD-CORREO'] &&
            pdfData['AD-EMPRESA'] &&
            pdfData['AD-TELEFONO'] &&
            pdfData['AD-CARGO'] &&
            pdfData['AD-CIUDAD'] &&
            pdfData['AD-DNI']
           
           ) 
            {
            let obj = {
                nombre: pdfData['AD-NOMBRE'] ? pdfData['AD-NOMBRE'] : null,
                correo: pdfData['AD-CORREO'] ? pdfData['AD-CORREO'] : null,
                empresa: pdfData['AD-EMPRESA'] ? pdfData['AD-EMPRESA'] : null,
                telefono: pdfData['AD-TELEFONO'] ? pdfData['AD-TELEFONO'] : null,
                cargo: pdfData['AD-CARGO'] ? pdfData['AD-CARGO'] : null,
                ciudad: pdfData['AD-CIUDAD'] ? pdfData['AD-CIUDAD'] : null,
                ci: pdfData['AD-DNI'] ? pdfData['AD-DNI'] : LGC

            }

            let rute = obj.ci

            writeUserData(`users/${rute}/`, obj, setUserSuccess)
            writeUserData(`/`, {counter: parseInt(counter)}, setUserSuccess)

        } else {
            setUserSuccess('Complete')
        }
    }



    function saveUpdate(e) {
        e.preventDefault()

        let obj = {
            nombre: pdfData['AD-NOMBRE'] ? pdfData['AD-NOMBRE'] : itemSelect['nombre'],
            correo: pdfData['AD-CORREO'] ? pdfData['AD-CORREO'] : itemSelect['correo'],
            empresa: pdfData['AD-EMPRESA'] ? pdfData['AD-EMPRESA'] : itemSelect['empresa'],
            telefono: pdfData['AD-TELEFONO'] ? pdfData['AD-TELEFONO'] : itemSelect['telefono'],
            cargo: pdfData['AD-CARGO'] ? pdfData['AD-CARGO'] : itemSelect['cargo'],
            ciudad: pdfData['AD-CIUDAD'] ? pdfData['AD-CIUDAD'] : itemSelect['ciudad'],
            ci: itemSelect['ci']
        }

        let rute = obj.ci
        writeUserData(`users/${rute}/`, obj, setUserSuccess)
    }

    function redirect() {
        setBank(!bank)
    }
    function closeDC() {
        setUserPdfData({})
        setViewForm(!viewForm)
    }
    function resetAutomatico() {
        writeUserData(`/`, { login: !userDB.login }, setUserSuccess)
    }

    function saveUpdateBank(e) {
        e.preventDefault()

        let obj = {
            banco: pdfData['AD-BANCO'] ? pdfData['AD-BANCO'] : userDB.bank.banco,
            direccionDeBanco: pdfData['AD-DIRECCION DE BANCO'] ? pdfData['AD-DIRECCION DE BANCO'] : userDB.bank.direccionDeBanco,
            codigoSWIFT: pdfData['AD-CODIGO SWIFT'] ? pdfData['AD-CODIGO SWIFT'] : userDB.bank.codigoSWIFT,
            cuentaEnBS: pdfData['AD-NUMERO DE CUENTA EN BS'] ? pdfData['AD-NUMERO DE CUENTA EN BS'] : userDB.bank.cuentaEnBS,
            cuentaEnUSD: pdfData['AD-NUMERO DE CUENTA EN USD'] ? pdfData['AD-NUMERO DE CUENTA EN USD'] : userDB.bank.cuentaEnUSD,
            tipoDeCuenta: pdfData['AD-TIPO DE CUENTA'] ? pdfData['AD-TIPO DE CUENTA'] : userDB.bank.tipoDeCuenta,
            nombre2: pdfData['AD-NOMBRE2'] ? pdfData['AD-NOMBRE2'] : userDB.bank.nombre2,
            direccion: pdfData['AD-DIRECCION'] ? pdfData['AD-DIRECCION'] : userDB.bank.direccion
        }
        writeUserData(`bank/`, obj, setUserSuccess)
    }
    
    
    function generateLGC (e) {
     e.preventDefault()
        setLGC(`LGC${counter}`)
        setUserPdfData({...pdfData, ['AD-DNI']: `LGC${counter}`})
        }

    useEffect(() => {
        let count = userDB.counter ? `${userDB.counter + 1 < 10
                ? '00' : ''}${userDB.counter + 1 > 9
                    && userDB.counter + 1 < 100 ? '0' : ''}${userDB.counter + 1}`
            : `001`
        setCounter(count)


        userDB && userDB.users[user.uid] && userDB.users[user.uid].rol !== 'Admin' && router.push('/Formularios')
    }, [userDB, success])

    console.log(pdfData)

    return (
        <Layout>
            <div className={style.container}>
                {user && userDB && userDB.users && <main className={style.main}>

                    {user && userDB && userDB.admins && userDB.admins[user.uid] && userDB.admins[user.uid].rol === 'Admin' && <div className={style.blueContainer}>
                        <span className={style.blue}>Register</span>

                        <span className={`${style.circleBlueContainer} ${userDB.login ? '' : style.circleLeadContainer}`} onClick={resetAutomatico}>
                            <span className={`${style.circleBlue} ${userDB.login ? '' : style.circleLead}`}></span>
                        </span>
                    </div>
                    }
                    <div className={style.containerIMG}>
                        <Image src="/logo.svg" width="350" height="250" alt="User" />
                    </div>

                    {user && userDB && userDB.admins && userDB.admins[user.uid] && userDB.admins[user.uid].rol === 'Admin' && <div className={style.containerButtons}>
                        <Button style='buttonTransparent' click={redirect}>
                            Datos de la empresa
                        </Button>

                    </div>}
                    <br />
                    <input className={style.filter} onChange={handlerOnChange} placeholder='Buscar Por CI' />
                    {user && userDB && userDB.users && <ul className={style.list}>
                        {Object.keys(userDB.users).map((item, i) => {
                            if ( userDB.users && userDB.users[item] && userDB.users[item].ci && userDB.users[item].ci.includes(filter) && user.uid !== item) {
                                return <div className={style.itemsAdmin} key={i}>
                                    <Link href="#" >
                                        <a className={style.link}>{userDB.users[item].nombre}</a>
                                    </Link>
                                    <div className={style.itemsAdmin}>
                                        <span className={style.rol}>{userDB.users[item].ci}</span>

                                        <Image src="/Edit.svg" width="25" height="25" alt="User" onClick={() => edit(item)} />
                                        <Image src="/Delete.svg" width="25" height="25" alt="User" onClick={() => remove(item)} />
                                    </div>
                                </div>
                            }

                            if (filter == '' && user.uid !== item) {
                                return <div className={style.itemsAdmin} key={i}>
                                    <Link href="validator/[User]" as={`validator/${item}`} >
                                        <a className={style.link}>{userDB.users[item].email}</a>
                                    </Link>
                                    <div className={style.itemsAdmin}>
                                        <span className={style.rol}>{userDB.users[item].rol}</span>
                                        <Image src="/Edit.svg" width="25" height="25" alt="User" onClick={() => edit(item)} />
                                        <Image src="/Delete.svg" width="25" height="25" alt="User" onClick={() => remove(item)} />
                                    </div>
                                </div>
                            }
                        }
                        )}
                    </ul>}
                    <button className={style.pluss} onClick={handlerForm}>+</button>
                </main>}
                {itemSelect !== '' && mode == 'remove' && <Modal mode={mode} click={x} confirm={removeConfirm} text={`Estas por eliminar a: ${userDB.users[itemSelect].correo}`}></Modal>}
                {viewForm && itemSelect !== '' && mode == 'edit' &&
                    <div className={style.formContainer}>
                        <form className={style.form} onSubmit={saveUpdate}>
                            <span onClick={handlerForm} className={style.x}>X</span>
                            <div className={style.subtitle}>DATOS DE CLIENTE</div>
                            <br />
                            <div className={style.items}>
                                <div>
                                    <label htmlFor="">NOMBRE</label>
                                    <input type="text" name={"NOMBRE"} onChange={handleEventChange} defaultValue={itemSelect['nombre']} />
                                </div>
                                <div>
                                    <label htmlFor="">CORREO</label>
                                    <input type="text" name={"CORREO"} onChange={handleEventChange} defaultValue={itemSelect['correo']} />
                                </div>
                                <div>
                                    <label htmlFor="">EMPRESA</label>
                                    <input type="text" name={"EMPRESA"} onChange={handleEventChange} defaultValue={itemSelect['empresa']} />
                                </div>
                                <div>
                                    <label htmlFor="">TELEFONO</label>
                                    <input type="text" name={"TELEFONO"} onChange={handleEventChange} defaultValue={itemSelect['telefono']} />
                                </div>
                                <div>
                                    <label htmlFor="">CARGO</label>
                                    <input type="text" name={"CARGO"} onChange={handleEventChange} defaultValue={itemSelect['cargo']} />
                                </div>

                                <div>
                                    <label htmlFor="">CIUDAD</label>
                                    <input type="text" name={"CIUDAD"} onChange={handleEventChange} defaultValue={itemSelect['ciudad']} />
                                </div>
                                <div>
                                    <label htmlFor="">CI</label>
                                    <input type="text" name={"DNI"} onChange={handleEventChange} value={itemSelect['ci']} />
                                </div>
                            </div>
                            <br />
                            <div className={style.containerFilter}>

                                <Button style='buttonSecondary'>
                                    Guardar
                                </Button>
                            </div>                        </form>
                    </div>}
                {userDB && viewForm && itemSelect == '' &&
                    <div className={style.formContainer}>
                        <form className={style.form}>
                            <span onClick={closeDC} className={style.x}>X</span>
                            <div className={style.subtitle}>DATOS DE CLIENTE</div>
                            <br />
                            <div className={style.items}>
                                <div>
                                    <label htmlFor="">NOMBRE</label>
                                    <input type="text" name={"NOMBRE"} onChange={handleEventChange} />
                                </div>
                                <div>
                                    <label htmlFor="">CORREO</label>
                                    <input type="text" name={"CORREO"} onChange={handleEventChange} />
                                </div>
                                <div>
                                    <label htmlFor="">EMPRESA</label>
                                    <input type="text" name={"EMPRESA"} onChange={handleEventChange} />
                                </div>
                                <div>
                                    <label htmlFor="">TELEFONO</label>
                                    <input type="text" name={"TELEFONO"} onChange={handleEventChange} />
                                </div>
                                <div>
                                    <label htmlFor="">CARGO</label>
                                    <input type="text" name={"CARGO"} onChange={handleEventChange} />
                                </div>

                                <div>
                                    <label htmlFor="">CIUDAD</label>
                                    <input type="text" name={"CIUDAD"} onChange={handleEventChange} />
                                </div>
                                <div>
                                    <label htmlFor="">CI</label>
                                    <input type="text" name={"DNI"} defaultValue={pdfData['AD-DNI']} onChange={handleEventChange} />
                                </div>
                            </div>
                            <br />
                            <div className={style.containerFilter}>
                                <Button style='buttonPrimary' click={generateLGC}>

                                    Generas LGC

                                </Button>
                                <Button style='buttonSecondary' click={save}>
                                    Guardar
                                </Button>
                            </div>             
                            </form>
                    </div>
                }
                {bank && userDB && <div className={style.formContainer}>
                    <form className={style.form} onSubmit={saveUpdateBank}>
                        <div className={style.subtitle}>DATOS BANCARIOS</div>
                        <br />
                        <span onClick={redirect} className={style.x}>X</span>
                        <div className={style.containerFirstItems}>
                            <div className={style.firstItems}>
                                <div>
                                    <label htmlFor="">BANCO</label>
                                    <input type="text" name={"BANCO"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.banco && userDB.bank.banco} />
                                </div>
                                <div>
                                    <label htmlFor="">DIRECCION DE BANCO</label>
                                    <input type="text" name={"DIRECCION DE BANCO"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.direccionDeBanco && userDB.bank.direccionDeBanco} />
                                </div>
                                <div>
                                    <label htmlFor="">CODIGO SWIFT</label>
                                    <input type="text" name={"CODIGO SWIFT"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.codigoSWIFT && userDB.bank.codigoSWIFT} />
                                </div>
                                <div>
                                    <label htmlFor="">NUMERO DE CUENTA EN BS</label>
                                    <input type="text" name={"NUMERO DE CUENTA EN BS"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.cuentaEnBS && userDB.bank.cuentaEnBS} />
                                </div>
                                <div>
                                    <label htmlFor="">NUMERO DE CUENTA EN USD</label>
                                    <input type="text" name={"NUMERO DE CUENTA EN USD"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.cuentaEnUSD && userDB.bank.cuentaEnUSD} />
                                </div>
                                <div>
                                    <label htmlFor="">TIPO DE CUENTA</label>
                                    <input type="text" name={"TIPO DE CUENTA"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.tipoDeCuenta && userDB.bank.tipoDeCuenta} />
                                </div>
                                <div>
                                    <label htmlFor="">NOMBRE</label>
                                    <input type="text" name={"NOMBRE2"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.nombre2 && userDB.bank.nombre2} />
                                </div>
                                <div>
                                    <label htmlFor="">DIRECCION</label>
                                    <input type="text" name={"DIRECCION"} onChange={handleEventChange} defaultValue={userDB.bank && userDB.bank.direccion && userDB.bank.direccion} />
                                </div>
                            </div>

                        </div>
                        <br />
                        <div className={style.containerFilter}>

                            <Button style='buttonSecondary'>
                                Guardar
                            </Button>
                        </div>

                    </form>
                </div>}
                {success == 'save' && <Success>Correcto</Success>}
                {success == 'repeat' && <Error>Verifica e intenta de nuevo</Error>}
                {success == 'Complete' && <Error>Completa el formulario</Error>}
            </div>
        </Layout>
    )
}
export default WithAuth(Users) 

