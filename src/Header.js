import React from 'react'
import {   getAuth, signOut } from "firebase/auth";
import { app } from './dataFirebase';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAuth } from './AuthSlice';

export default function Header() {
  const auth = getAuth(app);
  const dispatch = useDispatch()
  const {isLogin,name, photo, email, startQuiz} = useSelector((state)=> state.AuthSlice )
 
  function handleSignOut() { 
 signOut(auth).then(() => {
   dispatch(toggleAuth(false))
    
    }).catch((error) => {
      console.log(error);
    });
    // перезагружаем страницу и начинаем тест снова
    window.location.reload();
  }
  
  return (
    <div className='header'>
 <div className="container">
    
 <div className="headerWrapper">
    <div > {isLogin ? <div className="headerName"><span>{name}</span>, {email} {photo ? <img src={photo} alt="" /> : ''}
     </div>: ''}</div>
    {startQuiz && <button  onClick={handleSignOut}>Выйти</button> 
    
    }
  </div>
 </div>
  </div>
  )
}
