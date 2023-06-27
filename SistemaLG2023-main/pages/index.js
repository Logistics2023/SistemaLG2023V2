import { onAuth, signInWithEmail } from '../firebase/utils'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '../context/Context'
import { WithoutAuth } from '../HOCs/WithoutAuth'
import Button from '../components/Button'
import Error from '../components/Error'
import style from '../styles/Login.module.css'

function Login() {
    const { user, userDB, setUserProfile, setUserSuccess, success, setUserData} = useUser()
    const router = useRouter()

    function loginWithEmailAndPassword(e) {
        e.preventDefault()
        if (e.target.form[0].value.length < 3 || e.target.form[1].value.length < 3) {
            setUserSuccess('complete')
            return
        }
        const email = e.target.form[0].value
        const password = e.target.form[1].value
        signInWithEmail(email, password, setUserSuccess)
    }
    function redirect (e) {
        e.preventDefault()
        router.push('SignUp')
    }

    useEffect(() => {
        onAuth(setUserProfile,setUserData)
        if (user) router.replace('/Admin')
    }, [user, success, setUserProfile, router]);
    return (
        <div className={style.container}>
            <header className={style.header}>INICIO DE SESION LOGISTICS GEAR</header>
            <main className={style.main}>
                <Image src="/logo.svg" width="350" height="250" alt="User" />
                <form className={style.form}>
                    <h4 className={style.subtitle}>LOGIN</h4>
                    <input className={style.input} type="text" placeholder="example@gmail.com" />
                    <input className={style.input} type="password" placeholder="contraseña" />
                    <div className={style.buttonsContainer}>
                        <Button style='buttonSecondary' click={loginWithEmailAndPassword}>Iniciar Sesion</Button>
                    </div>
                  { userDB && userDB.login && <div className={style.linkContainer} >No tienes una cuenta? <Link href="/SignUp" legacyBehavior><a className={style.link}>Registrate</a></Link></div>}
                </form>
            </main>
            {success == false && <Error>ERROR: verifique e intente nuevamente</Error>}
            {success == 'complete' && <Error>Llene todo el formulario</Error>}
        </div>
    )
}

export default WithoutAuth(Login)