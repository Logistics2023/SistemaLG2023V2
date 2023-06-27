import { useRouter } from 'next/router'
import Image from 'next/image'
import { useUser} from '../context/Context'
import { useState, useEffect } from 'react'

import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'

import style from '../styles/Admin.module.css'

function Admin() {
    const { user,  setUserPdfData } = useUser()
    const router = useRouter()

    function redirection (url) {
        router.push(url)
    }


    useEffect(() => {
        setUserPdfData({})       
    }, []);

    return (
        <Layout> 

            <div className={style.container}>
                <div className={style.imgContainer}>
                    <Image src="/logo-horizontal.png" width="600" height="200" alt="User" />
                </div>

                <div className={style.grid}>
                    <Card img="/clipboard.svg" buttonText={"Administrar Clientes"} click={(e) => redirection("AdministrarClientes")} />
                    <Card img="/cargo-ship.svg" buttonText={"Cotizacion Maritima"} click={(e) => redirection("CotizacionMaritima")} />
                    <Card img="/delivery-truck.svg" buttonText={"Cotizacion Terrestre"} click={(e) => redirection("CotizacionTerrestre")} />
                    <Card img="/airplane.svg" buttonText={"Cotizacion Aerea"} click={(e) => redirection("CotizacionAerea")} />
                    <Card img="/agreement.svg" buttonText={"Manifiesto De Carga"} click={(e) => redirection("ManifiestoDeCarga")} />
                    <Card img="/015-invoice-1.svg" buttonText={"Nota de Cobranza"} click={(e) => redirection("CotizacionLCL")} />

                </div>
            </div>
        </Layout> 

    )
}

export default WithAuth(Admin)
