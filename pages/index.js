import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';

const Index = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState();
  
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
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
    <style jsx global>{`
      body { 
        background: #1b2126;
        font: 10px Arial;
        color: #fff;
      }
    `}</style>
    <h1 style={
      {
        fontSize:'2.5rem'
      }
    }>Select a Board</h1>
    <h2 style={
      {
        fontSize:'1.5rem'
      }
    }>We'll render it to markdown</h2>
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

export default Index;
