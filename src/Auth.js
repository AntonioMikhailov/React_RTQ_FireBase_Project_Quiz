import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { app, db } from './dataFirebase';
import { useDispatch, useSelector } from 'react-redux';
import { authUserData,   loginUserStatus, toggleAuth,   } from './AuthSlice';
import {   doc,  setDoc,  } from 'firebase/firestore';
import { getAdditionalUserInfo } from "firebase/auth";

export default function Auth() {
  const auth = getAuth(app);
 const dispatch = useDispatch()
 const { loadingStatus } = useSelector(state => state.QuizSlice)
    // Модалка авторизации
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Регистрация Почта + Пароль
  function handleAuth(e) { 
    e.preventDefault() 
    setShowAuthModal(true) 
    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value
    
 createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
     dispatch(toggleAuth(true))
      // добавляем в Store данные  через вызов ф.
      addUsertoDB( name, user.photoURL, user.email  )
     setErrorMessage('') // очищаем warning  
    }).then(()=> {
      // без Гугл надо вручную добавлять в FB имя + фото
      updateProfile(auth.currentUser, {
        displayName: e.target.name.value  
      })}).catch((error) => {
      const errorCode = error.code;
    if(errorCode.includes('already-in-use') ) {
        setErrorMessage('Этот адрес уже используется')
      } 
     else if(errorCode.includes('weak-password')) {
        setErrorMessage('Пароль не менее 6 символов')
      }  
     else if(errorCode.includes('invalid-email')) {
        setErrorMessage('Некорректный адрес почты')
      }  
    });  
  }
// Вход (LogIn) почта + пароль
  function handleSignIn(e) { 
    e.preventDefault() 
    setShowSignInModal(true) 
    // const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value
   signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      dispatch(toggleAuth(true))
      setErrorMessage('') // очищаем warning
    
    }).catch((error) => {
      const errorCode = error.code;
    if(errorCode.includes('wrong-password') ) {
        setErrorMessage('Неверный пароль')
      }
      else if(errorCode.includes('user-not-found')) {
        setErrorMessage('Пользователь не найден')
      }
   });
  }

  // Вход через Гугл аккаунт
  function handleGoogleAuth() { 
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
  //  const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;
      const user = result.user;
      // проверяем - первый раз  или уже зарегистрирован был
      const isFirstLogin = getAdditionalUserInfo(result).isNewUser
      //console.log(isFirstLogin); // true если первый раз
     if(isFirstLogin) {
      // если первый раз то отправляем данные на сервер
      addUsertoDB( user.displayName, user.photoURL, user.email,  )
     }
    dispatch(toggleAuth(true))
           
    }).catch((error) => {
      //  // The email of the user's account used.
      // const email = error.customData.email;
      // console.log(email);
           });
 }
 
// сохраняем показ авторизации в Header  при перезагрузке страницы
  useEffect(()=> {  
     onAuthStateChanged(auth, (user) => {
       if (user) {
        // снова показывам начало теста без страницы авторизации
       dispatch(toggleAuth(true))
        dispatch(loginUserStatus(true))
 // заново отправляем в store Имя и аватар чтобы отобразить в Header  
dispatch(authUserData({name: user.displayName, photo:user.photoURL, email:user.email }  ))
 } else {
  // console.log('Вы вышли');
 dispatch(loginUserStatus(false))
}
});
},[dispatch, auth])
  
// отправляем данные авторизации на сервер  
 function addUsertoDB(  name, photoURL, email) { 
 const userInfo = {
    userRegDate: Date.now(),
    name: name,
    email: email,
    photo: photoURL,
    quizTryCount: 0,
    averagePercentage: 0,
    averageQuizTime: 0,
    totalUserPercent: 0,
    totalQuizTime: 0
  }
  dispatch(authUserData( userInfo ))
  setDoc(doc(db, "users", name),userInfo );
}
  return (
 <> 
  <div className="signInWrapper">
    {/* При перезагрузке страницы сохраняем авторизацию  */}
  {loadingStatus ?  <div>...Loading</div> : <>
    <button onClick={()=> setShowAuthModal(true)}>Зарегистрироваться</button>
  <button onClick={()=> setShowSignInModal(true)}>Войти</button>
  <button onClick={()=> dispatch(toggleAuth(true))}>Продолжить без регистрации</button>
  <div className='userWithNoReg' >Без регистрации вы не сможете сохранять личную статистику</div>
  </> }
 
<div className={showAuthModal ? 'authModal activeStatModal': ' authModal ' }>
  <div className="authModalWrapper">
  <button onClick={handleGoogleAuth}>Регистрация с аккаунтом Google </button>
  <h4>Регистрация с эл.почтой и паролем </h4>
  <form   onSubmit={handleAuth} >
  <div>Name:</div><input   type="text" name='name'     />
    <div>Email:</div>    <input  type="text" name='email' />
    <div>Password:</div>    <input  type="text" name='password' />
     <button>Регистрация</button>
     <div className='errorMessage'>{errorMessage}</div>   
      </form>
      <button onClick={()=> setShowAuthModal(false)}>Выйти из меню</button>

  </div>
</div>  

 
<div className={showSignInModal ? 'authModal activeStatModal': ' authModal ' }>
  <div className="authModalWrapper">
  <button onClick={handleGoogleAuth}>Вход с аккаунтом Google </button>
  <h4>Войти через почту и пароль </h4>
 
  <form   onSubmit={handleSignIn} >
  <div>Email:</div>  
    <input  type="text" name='email' />
    <div>Password:</div>    <input  type="text" name='password' />
     <button>Войти</button> 
     <div className='errorMessage'>{errorMessage}</div>    
      </form>
      <button onClick={()=> setShowSignInModal(false)}>Выйти из меню</button>

  </div>
</div>  
  </div>
 </>
  )
}
