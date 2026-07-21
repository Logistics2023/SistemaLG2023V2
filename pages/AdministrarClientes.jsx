import { handleSignOut, getData, removeData, writeUserData } from '../firebase/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
    const hasUsersNode = Boolean(userDB) && typeof userDB === 'object' && Object.prototype.hasOwnProperty.call(userDB, 'users')
    const usersNode = userDB?.users
    const usersLoadFailed = hasUsersNode && usersNode === null
    const users = usersNode && typeof usersNode === 'object' ? usersNode : {}
    const admins = userDB?.admins || {}
    const bankData = userDB?.bank || {}
    const currentAdmin = user ? admins[user.uid] : null
    const canManageAll = currentAdmin?.rol === 'Admin'
    const canViewClients = Boolean(user && userDB)
    const registrationEnabled = userDB?.register === true
    const visibleUsers = hasUsersNode ? Object.entries(users).filter(([id, data]) => {
        if (!data || id === user?.uid) {
            return false
        }

        if (filter === '') {
            return true
        }

        const ci = data.ci ? String(data.ci) : ''
        return ci.includes(filter)
    }) : []

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
        console.log('admin');
    }

    function edit(item) {
        const selectedUser = users[item]
        if (!selectedUser) {
            return
        }
        setRol(selectedUser.rol || '')
        setMode('edit')
        setItemSelect(selectedUser)
        setViewForm(true)
    }
    function editRol(data) {
        setRol(data)
    }
    function editConfirm() {
        if (!itemSelect || !itemSelect.ci) {
            return
        }
        writeUserData(`users/${itemSelect.ci}/`, { rol, }, setUserSuccess)
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
        if (!userDB) {
            return
        }
        writeUserData(`/`, { register: !registrationEnabled }, setUserSuccess)
    }

    function saveUpdateBank(e) {
        e.preventDefault()

        const getBankValue = (field, fallback) =>
            Object.prototype.hasOwnProperty.call(pdfData, field) ? pdfData[field] : fallback

        let obj = {
            banco: getBankValue('AD-BANCO', bankData.banco),
            direccionDeBanco: getBankValue('AD-DIRECCION DE BANCO', bankData.direccionDeBanco),
            codigoSWIFT: getBankValue('AD-CODIGO SWIFT', bankData.codigoSWIFT),
            cuentaEnBS: getBankValue('AD-NUMERO DE CUENTA EN BS', bankData.cuentaEnBS),
            cuentaEnUSD: getBankValue('AD-NUMERO DE CUENTA EN USD', bankData.cuentaEnUSD),
            tipoDeCuenta: getBankValue('AD-TIPO DE CUENTA', bankData.tipoDeCuenta),
            nombre2: getBankValue('AD-NOMBRE2', bankData.nombre2),
            direccion: getBankValue('AD-DIRECCION', bankData.direccion)
        }
        writeUserData(`bank/`, obj, setUserSuccess)
    }
    
    
    function generateLGC (e) {
     e.preventDefault()
        setLGC(`LGC${counter}`)
        setUserPdfData({...pdfData, ['AD-DNI']: `LGC${counter}`})
        }

    useEffect(() => {
        if (!userDB) {
            setCounter('001')
            return
        }

        const currentCounter = Number(userDB.counter || 0)
        let count = `${currentCounter + 1 < 10
                ? '00' : ''}${currentCounter + 1 > 9
                    && currentCounter + 1 < 100 ? '0' : ''}${currentCounter + 1}`
        setCounter(count)

    }, [success, userDB])

    console.log(pdfData)

    return (
        <Layout>
            <div className={style.container}>
                {user && userDB && canViewClients && <main className={style.main}>

                    {canManageAll && <div className={style.blueContainer}>
                        <span className={style.blue}>Register</span>

                        <span className={`${style.circleBlueContainer} ${registrationEnabled ? '' : style.circleLeadContainer}`} onClick={resetAutomatico}>
                            <span className={`${style.circleBlue} ${registrationEnabled ? '' : style.circleLead}`}></span>
                        </span>
                    </div>
                    }
                    <div className={style.containerIMG}>
                        <Image src="/logo.svg" width="350" height="250" alt="User" />
                    </div>

                    {canManageAll && <div className={style.containerButtons}>
                        <Button style='buttonTransparent' click={redirect}>
                            Datos de la empresa
                        </Button>     
        
                    </div>}
                    <br />
                    <input className={style.filter} onChange={handlerOnChange} placeholder='Buscar Por LGXXX' />
                    {!hasUsersNode && <div className={style.itemsAdmin}>
                        <span className={style.link}>Cargando clientes...</span>
                    </div>}
                    {usersLoadFailed && <div className={style.itemsAdmin}>
                        <span className={style.link}>No se pudieron cargar los clientes.</span>
                    </div>}
                    {hasUsersNode && !usersLoadFailed && <ul className={style.list}>
                        {visibleUsers.map(([item, data], i) => {
                            const primaryLabel = filter === ''
                                ? (data.nombre || data.email || data.nombre || item)
                                : (data.nombre || data.correo || item)
                            const secondaryLabel = filter === ''
                                ? (data.rol || data.ci || '')
                                : (data.ci || '')

                            return <div className={style.itemsAdmin} key={item || i}>
                                <span className={style.link}>{primaryLabel}</span>
                                <div className={style.itemsAdmin}>
                                    <span className={style.rol}>{secondaryLabel}</span>
                                    {canManageAll && <Image src="/Edit.svg" width="25" height="25" alt="User" onClick={() => edit(item)} />}
                                    {canManageAll && <Image src="/Delete.svg" width="25" height="25" alt="User" onClick={() => remove(item)} />}
                                </div>
                            </div>
                        })}
                        {visibleUsers.length === 0 && <div className={style.itemsAdmin}>
                            <span className={style.link}>No hay clientes para mostrar.</span>
                        </div>}
                    </ul>}
                    {canManageAll && <button className={style.pluss} onClick={handlerForm}>+</button>}
                </main>}
                {itemSelect !== '' && mode == 'remove' && <Modal mode={mode} click={x} confirm={removeConfirm} text={`Estas por eliminar a: ${users[itemSelect]?.correo || users[itemSelect]?.nombre || itemSelect}`}></Modal>}
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

                            <Button type='submit' style='buttonSecondary'>
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

