import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';




const Index = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState();
  
  const fetchBoards = async () => {
    const result = await axios.get('/api/boards', {
      withCredentials: true
    });
    setBoards(result.data);
    setSelectedBoard(result.data[0].id);
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
        boards.map(board => 
          <option key={board.id} value={board.id} >
            {board.name}
          </option>)
      }
    </select>

    {
      selectedBoard ? <Link href={'/board?id=' + selectedBoard}><a>Generate!</a></Link> : null
    }
  </div>
)}

export default Index
