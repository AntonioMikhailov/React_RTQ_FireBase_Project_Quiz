 
import { initializeApp } from "firebase/app";
import {  getFirestore,} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcH5ERl1olya9AbSl_wsC5V9HH0b0bqLk",
  authDomain: "qiuzmy-05-03-2023.firebaseapp.com",
  projectId: "qiuzmy-05-03-2023",
  storageBucket: "qiuzmy-05-03-2023.appspot.com",
  messagingSenderId: "699795685777",
  appId: "1:699795685777:web:6eb9fd1e025aa97eff5a30",

};
 export const  app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);

// Исходник БД для сервера
// export const dataFirebase = {
//   dataFB: [
//     {id: 1, question: 'В каком году был создан язык JavaScript', answer: 1995, options: [1991,1995,2002,2005], isRightAnswer: false, userAnswer: null },
//    {id: 2, question: 'В каком году был создан ReactJS', answer: 2013, options: [2013, 2009, 2011, 2018 ], isRightAnswer: false, userAnswer: null },
//    {id: 3, question: 'Укажите год Октябрьской революции', answer: 1917, options: [ 1914, 1924, 1905, 1917 ], isRightAnswer: false, userAnswer: null },
//    {id: 4, question: 'Укажите создателя языка JavaScript', answer: 'Брендан Эйх', options: ['Пол Маккартни', 'Брендан Эйх', 'Джеймс Камерон', 'Дэн Абрамов'], isRightAnswer: false, userAnswer: null },
//    {id: 5, question: 'Год начала Второй мировой войны', answer: 1939, options: [1941, 1939, 1918,1914], isRightAnswer: false, userAnswer: null },
//    {id:6, question: 'Что не является типом данных в JavaScript', answer: 'NaN', options: ['string', 'number', 'NaN', 'undefined'], isRightAnswer: false, userAnswer: null },
//    {id:7, question: 'Год начала Первой мировой войны', answer: 1914, options: [1915, 1920,1914,1905], isRightAnswer: false, userAnswer: null },
//   ]
// }

 // загружаем БД на сервер- один раз.
//  setDoc(doc(db, "qiuzData", "questions"), dataFirebase );