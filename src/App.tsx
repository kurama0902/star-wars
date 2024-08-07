import { useState } from 'react'
import { CharactersModal } from './CharactersModal'


import s from './App.module.css'

function App() {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className={s.mainWrap}>
      <video className={s.bg} playsInline autoPlay muted loop>
        <source src="/mainBG.mp4" type="video/mp4" />
          Your browser does not support the video tag.
      </video>
      <h1 className={s.guidebookText}>Star Wars. Guidebook</h1>
      <img className={s.dart} src="/darth-vader.gif" alt="Dart Vader" />
      <button onClick={() => setIsOpen(!isOpen)} className={s.leanMore}>Learn about characters</button>
      { isOpen && <CharactersModal setIsOpen={setIsOpen}/> }
    </div>
  )
}

export default App
