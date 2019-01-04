import { withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default withRouter((props) => {

  const [board, setBoard] = useState('');
  
  const fetchBoard = async () => {
    const result = await axios.get(`/api/boards/${props.router.query.id}`, {
      withCredentials: true
    });
    console.log("Result", result);
    setBoard(result.data);
  }

  useEffect(() => {
    fetchBoard()
  }, []);

  return (
    <div>
      <ReactMarkdown source={board} />
    </div>
  )
});
