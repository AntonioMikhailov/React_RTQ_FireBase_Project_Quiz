import React, {  useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTotalRightAns,  handleUserAnswer, setIsRightAnswer, setPercentAns, subTotalRightAns,   } from './QuizSlice'

export default function QuizAnswers({item}) {
 
  const [isRight, setIsRight] = useState(false) // тоглим
  const dispatch = useDispatch()
 
   const {id, options, answer, } = item
   function  handleAnswer(itemOption, i) { 
 //сначала передаем вариант ответа юзера 
    dispatch(handleUserAnswer({id, itemOption }))
  
   // затем проверяем на условие  - прав. неправ. ответ
    if(itemOption === answer&&isRight!==true ) {
  
      setIsRight(true)  
      dispatch(addTotalRightAns(1))
      dispatch(setIsRightAnswer({id, itemOption}))
     dispatch(setPercentAns())
  } 
    //  если неправильный
    if(itemOption !== answer&&isRight===true ) {
       setIsRight(false)
      dispatch(subTotalRightAns(1))
     } 
    }
  return (
    <>
    <ul className='answer-item' > 
        {options.map((itemOption, i)=> { 
     return (  <li  key={i} 
   onClick={()=> handleAnswer(itemOption, i)} 
 className={item.userAnswer === itemOption ? 'quiz-item  active': 'quiz-item '} >{itemOption}</li>
      )})  
    }
     </ul>
   </>
  )
}
