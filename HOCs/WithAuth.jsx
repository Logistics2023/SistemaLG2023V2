import Loader from '../components/Loader'   
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../context/Context.js'


export function WithAuth(Component) {
    return function WithAuthComponent(props) {
        const { user, userDB } = useUser()
        const router = useRouter()
        const isLoading = user === undefined || (user && userDB === '')

        useEffect(() => {
            if(user === null) router.replace('/')
        }, [router, user])

        return (
            <>
                {isLoading && <Loader />}
                {user && userDB !== '' && <Component {...props} />} 
            </>
        ) 
    }
}
