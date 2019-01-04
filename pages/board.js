import Router, { withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default withRouter((props) => {

  // Array destructuring might be breaking now.sh?
  // const [board, setBoard] = useState('');
  const boardHooks = useState('');
  const board = boardHooks[0];
  const setBoard = boardHooks[1];
  
  
  const fetchBoard = async () => {
    axios.get(`/api/boards/${props.router.query.id}`, {
      withCredentials: true
    }).then(result => {
      setBoard(result.data);
    }).catch(err => {
      Router.push('/auth/login');
    })
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
