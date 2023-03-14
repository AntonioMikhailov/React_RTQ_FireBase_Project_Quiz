import React, { useEffect } from "react";
import {   useDispatch, useSelector } from "react-redux";
import Quiz from './Quiz'
 
import { fetchAsyncUsers  } from "./QuizSlice";
import Auth from "./Auth";
import Header from "./Header";
 
function App() {
  const dispatch = useDispatch()
  // получаем  БД с вопросами с FB  
  useEffect(()=> { 
    dispatch(fetchAsyncUsers()) 
      },[dispatch])
const {startQuiz} = useSelector((state)=> state.AuthSlice)
   return (
    <>
       <Header/>
       <div className="mainWrapper">
       <div className="container">
      {startQuiz ?  <Quiz/> : <Auth/>  }
     </div>
       </div>
    </>
  );
}
export default App;
