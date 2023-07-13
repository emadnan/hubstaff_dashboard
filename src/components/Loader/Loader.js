import React from 'react'
import style from './loader.module.css'

export default function LoadingSpinner() {
  return (
    <div className={style.spinner_container}>
      <div className={style.loading_spinner}></div>
    </div>
  )
}
