import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authUserData, getUserData } from "./AuthSlice";
import { db } from "./dataFirebase";
import QuizAnswers from "./QuizAnswers";
import {  setButtonStartDisabled, setDeadlineTime, setExtraTime,   setShowLimit, setShowStat, setTotalTimeValue, setWarningMessage, sortQuizData, toggleStartQuiz } from "./QuizSlice";
import { store } from "./store";
 export default function Quiz() {
    const dispatch = useDispatch()
  const {data,showNumofQuestions,ButtonStartDisabled, startQuiz, deadlineTime, showLimit, extraTime, warningMessage, showStat, totalRightAns, percentAns, totalTimeValue } = useSelector((state)=> state.QuizSlice )
  const {isLogin, userRegDate,name, email, photo, quizTryCount,averagePercentage, averageQuizTime, totalUserPercent, totalQuizTime} = useSelector(state => state.AuthSlice)
 const [showStatModal, setShowStatModal] = useState(false)
 const [showResult, setshowResult] = useState(false)
  const extraCount = useRef(); // нужен для clearInterval
  useEffect(()=> {   // при перезагрузке страницы
  name && getDoc(doc(db, "users", name)).then((res) => {
    const userData = res.data()
 dispatch(authUserData(userData )) // отдельно получаем и передаем в Store Данные юзера
dispatch(getUserData(userData ))
     });
     },[])
  // Показываем результаты Теста
  function showRightAnswers() {
    const sumUserAns = data.filter((item) => item.userAnswer).length;
    if (sumUserAns === showNumofQuestions) {
  // деактивируем кнопку - показать результат чтобы не было повторных кликов
    setshowResult(true)
      // по клику на кнопке также останавливаем счетчик
      clearInterval(extraCount.current);  
      dispatch(setShowStat( ));  
      dispatch(setWarningMessage(""));  // очищаем warning
    // Вариант через переменную totalTime  или Getter
    //  const totalPer = totalUserPercent + percentAns
     const totalTime = totalQuizTime + totalTimeValue
  const userInfo = {
   name: name,
    email: email,
    photo: photo,
    quizTryCount: quizTryCount + 1,
    totalUserPercent: totalUserPercent + percentAns,
    totalQuizTime: totalQuizTime + totalTimeValue,
    // через Getter + сразу округляем
    get averagePercentage() {
      return Math.floor( this.totalUserPercent /(quizTryCount + 1))
    },
    // без Getter через переменную
   averageQuizTime: Math.floor(totalTime/(quizTryCount+1)) ,
 }
if(name) { // проверяем что зарегин и тогда отправляем в store
  dispatch(getUserData(userInfo ))
  updateDoc(doc(db, 'users', name), userInfo);
 }
 } else {
      dispatch(setWarningMessage("Вы не ответили на все вопросы!"));
   }
  }
 // Форматируем время
 const formatter  = new Intl.DateTimeFormat("ru", {
  year: "numeric", month: "long", day: "numeric", hour:"numeric", minute:"numeric"
  });
 // Счетчик
  function handleQuiz() {
  // при начале каждого нового теста будем рандомно сортировать массив
    dispatch(sortQuizData())
   // показываем вопросы при начале теста
      dispatch(toggleStartQuiz())
     dispatch( setButtonStartDisabled(true))
   // здесь нужен именно ref чтобы отменить setInterval -  extraCount.current
    extraCount.current = setInterval(() => {
     let currDeadlineTime = store.getState().QuizSlice.deadlineTime 
    if (currDeadlineTime === 0) {
     dispatch(setShowLimit(true)) // показываем extraTime
      dispatch(setDeadlineTime(0)) // останавливаем счетчик основной
      dispatch(setExtraTime(1)) // счетчик доп. времени
    } else {
      dispatch(setDeadlineTime(-1)) // счетчик основного времени
    }
      // общее кол-времени на тест покажем в статистике
    dispatch(setTotalTimeValue(1))
  }, 1000);
    };
 return (
    <>
<div className="container">
<h3>Проверь себя за 10 секунд!</h3>
<div className="startQuizWapper">
  <button className='startQuizBtn'  disabled={ButtonStartDisabled} onClick={()=> handleQuiz()}>Начать тест</button>
  {isLogin &&   <button onClick={()=> setShowStatModal(true)}>Статистика юзера</button>
  }
</div>
  <div  className={showStatModal ? 'statModal activeStatModal': ' authModal ' }>
  <div className="authModalWrapper">
    <h4>Статистика Юзера</h4>
    <hr/>
    {photo &&  <div ><img style={{maxWidth: '60px'}} src={photo} alt=""/></div> }
    <div><span>Имя:</span> {name}</div>
    <div><span>Email:</span> {email}</div>
     <div><span>Дата регистрации:</span> {formatter.format(userRegDate)}</div>
    <div><span>Пройдено тестов:</span> {quizTryCount}</div>
    <div><span>Процент верных ответов:</span> {averagePercentage} %</div>
    <div><span>Среднее время прохождения:</span> {averageQuizTime} сек.</div>
    <button onClick={()=> setShowStatModal(false)}>Закрыть</button>
  </div>
</div>
 { startQuiz && (
<div className="quizWrapper">
<div className="quizWrapper__timelimit">
<div>До конца теста осталось: {deadlineTime} </div>
{showLimit && (
  <div className="limitTime">
    Вы превысили лимит времени на: {extraTime} сек.
  </div>
)}
</div>
<div className="questionWrapper">
  {/*показываем только 4 первых вопроса */}
{data.filter((_, i) => i <= showNumofQuestions - 1).map((item, i) => {
return (
 
 <div className="questionItem" key={i}>
  <h4>№{item.id}: {item.question}</h4>
  <QuizAnswers item={item}/>
</div>
  // </div>
); })
}
</div>
<button disabled={showResult} onClick={() => showRightAnswers()}>Показать результаты</button>
  <hr />
  {showStat && (
  <div className="statisticWrapper">
    <div className="statAnswerWrapper">
      {
        // показываем только по 4 вопроса за один тест
        data.filter((_, i) => i <= showNumofQuestions - 1).map((item, i) => {
    return (
      <div key={i}
        className={
          item.answer === item.userAnswer ? "statRightAnswers" : "statNoRightAnswer"
        }
      >
        <h4>Вопрос №{item.id} </h4>
        <hr />
        <div>
          Верный ответ: <span>{item.answer}</span>
        </div>
        <div>Ваш ответ: <span>{item.userAnswer}</span>
        </div>
      </div>
    );
}
  )
      }
    </div>
    <h3>Статистика:</h3>
    <hr />
    <ul className="staitc-items">
      <li>
        Всего вопросов в базе: <span>{data.length}</span>
      </li>
      <li>
        Правильных ответов: <span>{totalRightAns}</span> из{" "}
        <span>{showNumofQuestions}</span>{" "}
      </li>
      <li>
        Процент правильных ответов: <span>{percentAns}</span>
      </li>
      <li>
        Тест пройден за: <span>{totalTimeValue}</span> сек.
      </li>
    </ul>
  <button onClick={() => { window.location.reload(); }} > Повторить Тест</button>
  </div>
)
}
 
</div>
      )  
     }
<h4 style={{ color: "red" }}>{warningMessage}</h4>
</div>
    </>
  );
}
