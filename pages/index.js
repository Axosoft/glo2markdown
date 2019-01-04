import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';




const Index = () => {
  // Array destructuring might be breaking now.sh?
  // const [boards, setBoards] = useState([]);
  const boardsHooks = useState([]);
  const boards = boardsHooks[0];
  const setBoards = boardsHooks[1];

  // const [selectedBoard, setSelectedBoard] = useState();
  const selectedBoardHooks = useState();
  const selectedBoard = selectedBoardHooks[0];
  const setSelectedBoard = selectedBoardHooks[1];
  
  const fetchBoards = async () => {
    axios.get('/api/boards', {
      withCredentials: true
    }).then(result => {
      setBoards(result.data);
      setSelectedBoard(result.data[0].id);
    }).catch(err => {
      Router.push('/auth/login');
    });
  }

  useEffect(() => {
    fetchBoards()
  }, []);
  return (
  <div>
    <p>Boards:</p>
    <select onChange={(e) => {
        setSelectedBoard(e.target.value);
    }}>
      {
        boards.length ? boards.map(board => 
          <option key={board.id} value={board.id} >
            {board.name}
          </option>) : null
      }
    </select>

    {
      selectedBoard ? <Link href={'/board?id=' + selectedBoard}><a>Generate!</a></Link> : null
    }
  </div>
)}

export default Index
