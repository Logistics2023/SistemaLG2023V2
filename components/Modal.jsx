import Button from '../components/Button'
import style from '../styles/Modal.module.css'

export default function Modal (props) {
    return (
        <>
            {props.mode && <div className={style.modalContainer}>
                <div className={style.contBlue}>
                    <span onClick={props.click} className={style.x}>X</span>
                    <span className={style.textModal}>{props.text}<br /></span>
                    <div className={'style.textModal'}>{props.children}</div>
                    <Button style='buttonConfirm' click={props.confirm}>Confirmar</Button>
                </div>
            </div>}
        </>
    )
}