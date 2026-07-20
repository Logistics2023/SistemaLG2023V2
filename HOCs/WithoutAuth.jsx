import Loader from '../components/Loader'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../context/Context.js'

export function WithoutAuth(Component) {
    return function WithoutAuthComponent(props) {
        const { user } = useUser()
        const router = useRouter()

        useEffect(() => {
          if (user) router.replace('/Admin')
        }, [router, user]);

        return (
            <>
                {user === undefined && <Loader />}
                {user === null && <Component {...props} />}
            </>
        )
    }
}
