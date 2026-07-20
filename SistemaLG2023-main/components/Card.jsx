import Button from '../components/Button'
import Image from 'next/image'

import style from '../styles/Card.module.css'

export default function Card(props) {
    return (
        <div className={style.container}>
            <div className={style.imgContainer}>
                <Image src={props.img} width="120" height="120" alt="User" />
            </div>
            <Button
                style={"buttonPrimary"}
                click={props.click}>
                {props.buttonText} 
            </Button> 
        </div>
    )
}
