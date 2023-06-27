import { handleSignOut } from '../firebase/utils'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUser } from '../context/Context'
import Link from 'next/link'
import Button from '../components/Button'
import style from '../styles/Layout.module.css'

export default function Layout(props) {
    const { user, userDB, } = useUser()

    const router = useRouter()

    function logout() {
        handleSignOut()
    }
    function redirect() {
        router.push("/Admin")
    }
    return (
        <>
            {userDB &&
                <> <header className={style.header}>
                    <p>Bienvenido {userDB.admins && userDB.admins[user.uid] && userDB.admins[user.uid].name}</p>
                    <div className={style.containerButtons}>
                        {router.pathname !== "/Admin" &&
                            <>
                                <Button style='buttonSecondary' click={redirect}>
                                    Home
                                </Button>
                                <div className={style.home}>
                                    <Image src="/home.svg" width="30" height="30" alt="home" onClick={redirect} />
                                </div>
                            </>
                        }
                        <Button style='buttonSecondary' click={logout}>
                            Cerrar Sesion
                        </Button>
                        <div className={style.power}>
                            <Image src="/power.svg" width="26" height="26" alt="power" onClick={logout} />
                        </div>
                    </div>

                </header>
                    <main className={style.main}>{props.children}</main>  </>}
        </>

    )
}
