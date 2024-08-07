import { useEffect } from 'react'
import s from './preloader.module.css'

export const Preloader = () => {

    return (
        <div className={s.preloader}>
            <img className={s.danceGif} src="/darth-vader-dance.gif" alt="loading.." />
            <p className={s.loadingText}>Loading..</p>
        </div>
    )
}