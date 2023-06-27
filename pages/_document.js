import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head>   
                    <link rel="icon" href="/favicon.ico" />
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='apple-touch-icon' href='/favicon.ico' />
                    <meta name="theme-color" content="#294B98" />
                    <meta name="msapplication-navbutton-color" content="#294B98" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#294B98" />
                    <meta name="description" content="Sistema de Administracion de Clientes y Formularios" />
                    <meta name="keywords" content="Logistics Gear" />
                    <meta name="author" content="Logistics Gear" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
