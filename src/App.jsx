import {  useState } from 'react'
import {Square} from './components/Square'
import {TURNS,WINNER_COMBOS} from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js' 
import {WinnerModal} from './components/WinnerModal.jsx'

import './App.css'


function App() { 
  const[board, setBoard] = useState(()=>{   
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
      return Array(9).fill(null)
  })

  const[turn, setTurn]=useState(()=>{
    const turnFromStorage= window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const updateBoard = (index)=>{

    if(board[index] || winner)return ;

    const newBoard = [...board]
    newBoard[index] = turn   
    setBoard(newBoard) 

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)    

    // guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    // ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      setWinner(newWinner)
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }

  }

  const resetGame=()=>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <>
    <main className='board'>
      <button onClick={resetGame}>Resetear</button>
      <h1>Tic-tac-toe</h1>

      <section className='game'>
        {
          board.map((_,index)=>{
            return (
              <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {_}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square
          isSelect={turn === TURNS.X}
        >
          {TURNS.X}
        </Square>

        <Square
          isSelect={turn===TURNS.O}
        >
          {TURNS.O}
        </Square>

      </section>

      <WinnerModal resetGame={resetGame} winner={winner} ></WinnerModal>
      
    </main>
    </>
  )
}

export default App
