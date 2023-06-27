import { onAuth, signUpWithEmail, writeUserData } from '../firebase/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../context/Context'

import Image from 'next/image'
import { WithAuth } from '../HOCs/WithAuth'
import Button from '../components/Button'
import Error from '../components/Error'
import style from '../styles/Login.module.css'
import Link from 'next/link'

function Register() {
    const { user, userDB, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, monthAndYear } = useUser()
    const router = useRouter()

    const [name, setName] = useState(null);

    function save(e) {
        e.preventDefault()
        if (name == null || name == '') {
            setUserSuccess('complete')
            return
        }
        const fileName = user.uid
        const object = {
            [fileName]: {name, rol: 'AdminSec'} }
        const ruteDB = 'admins'
        writeUserData(ruteDB, object, setUserSuccess)
        router.replace('/Admin')

    }

    function handlePerfilName(e) {
        const name = e.target.value
        setName(name)
    }


    useEffect(() => {
        const uid = userDB.users ? user.uid in userDB.users : false
     
        if (user && userDB.users && uid) {
            router.replace('/Admin')
        }

     
        return

    }, [user, userDB]); 
    return (
        <div className={style.container}>
            <header className={style.header}>INICIO DE SESION LOGISTICS GEAR</header>
            <main className={style.main}>
            <Image src="/logo.svg" width="350" height="250" alt="User" />
                <br />
                <form className={style.form}>
                    <h4 className={style.subtitle}>Regitro de Usuario</h4>
                    <img src={'/User.svg'} className={style.perfil} alt="Perfil" />
                    <input className={style.input} type="text" onChange={handlePerfilName} placeholder="Nombres y apellidos" />
                    <div className={style.buttonsContainer}>
                        <Button style='buttonSecondary' click={save}>Registrate</Button>
                    </div>
                </form>
            </main>
            {success == false && <Error>ERROR: verifique e intente nuevamente</Error>}
            {success == 'complete' && <Error>Llene todo el formulario</Error>}
        </div>
    )
}

export default WithAuth(Register)
