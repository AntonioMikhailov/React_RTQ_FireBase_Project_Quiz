import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./dataFirebase";
  
// получаем БД с сервера и отдаем в extraReducers
export const fetchAsyncUsers = createAsyncThunk(
  "data/fetchAsyncUsers",
   function test() {
    const dataRes = getDoc(doc(db, "qiuzData", "questions")).then((res) => {
    return res.data().dataFB;  
    });

    return dataRes;
  }
);
// получает через getState данные второго Редюсера
export const getFromAuthSlice = createAsyncThunk(
  "getFromAurhSlice",
  async ( getState) => {
     return getState().AuthSlice;
  }
);

const initialState = {
  data: [],
  totalRightAns: 0,
  percentAns: 0,
  startQuiz: false,
  showNumofQuestions: 4,
  ButtonStartDisabled: false,
  showStat: false,
  warningMessage: "",
  deadlineTime: 5,
  showLimit: false,
  extraTime: 0,
  totalTimeValue: 0,
  loadingStatus: true // показываем при обновлении страницы когда авторизован чтобы не мелькали кнопки авторизации
};

const quizSlice = createSlice({
  name: "quizSlice",
  initialState: initialState,
  reducers: {
   // тоглим показ Вопросов
    toggleStartQuiz: (state) => {
      state.startQuiz = !state.startQuiz;
    },
    // получаем ответы юзера
    handleUserAnswer: (state, { payload }) => {
      const { id, itemOption } = payload;
      state.data = state.data.map((item) => {
        if (item.id === id) {
          return { ...item, userAnswer: itemOption };
        }
        return item;
      });
    },
   // добавляем правильный ответ
    addTotalRightAns: (state, action) => {
      state.totalRightAns += action.payload;
      //или так return { ...state, totalRightAns: state.totalRightAns + action.payload }
    },
    // вычитаем правильый ответ
    subTotalRightAns: (state) => {
      state.totalRightAns = state.totalRightAns - 1;
    },
    // тоглим isRightAnswer в каждом вопросе для подсчета в статистике
    setIsRightAnswer: (state, { type, payload }) => {
      const { id, itemOption } = payload;
      state.data = state.data.map((item) => {
        if (item.id === id) {
          return { ...item, userAnswer: itemOption, isRightAnswer: true };
        }
        return item;
      });
    },
    // тоглим показ Статистики
    setShowStat: (state) => {
      state.showStat = !state.showStat;
    },
    // показ Warning если не все вопросы отмечены ответами
    setWarningMessage: (state, { payload }) => {
      state.warningMessage = payload;
    },
    // тоглим активность кнопки Начать тест
    setButtonStartDisabled: (state) => {
      state.ButtonStartDisabled = !state.ButtonStartDisabled;
    },
    // показываем Warning что время истекло
    setShowLimit: (state, { payload }) => {
      state.showLimit = payload;
    },
    // меняем счетчик DeadLineTime
    setDeadlineTime: (state, { payload }) => {
      state.deadlineTime += payload;
    },
    // счетчик  ExtraTime
    setExtraTime: (state, { payload }) => {
      state.extraTime += payload;
    },
    // Общее время теста
    setTotalTimeValue: (state, { payload }) => {
      state.totalTimeValue += payload;
    },
    // получаем процент правильных ответов
    setPercentAns: (state, { payload }) => {
     return {
        ...state, percentAns: parseInt((state.totalRightAns * 100) / state.showNumofQuestions),
      };
      //или так  state.percentAns = parseInt((state.totalRightAns * 100) / state.showNumofQuestions) + "%";
    },
    // сортируем массив при повторном тесте
    sortQuizData: (state) => {
      state.data.sort(() => {
        return Math.random() - 0.5;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncUsers.pending, (state, action) => {
      // console.log("Pending");
      state.loadingStatus = true;
    }); 
    builder.addCase(fetchAsyncUsers.fulfilled, (state, { type, payload }) => {
     state.data = payload; 
      state.loadingStatus = false;
    });
    builder.addCase(fetchAsyncUsers.rejected, (state, action) => {
      state.loadingStatus = false;
   
    });
   
  },
});
export const {
  getFirebaseData,
  toggleStartQuiz,
  handleUserAnswer,
  toggleIsRight,
  addTotalRightAns,
  subTotalRightAns,
  setIsRightAnswer,
  setShowStat,
  setWarningMessage,
  setButtonStartDisabled,
  setShowLimit,
  setDeadlineTime,
  setExtraTime,
  setTotalTimeValue,
  setPercentAns,
  sortQuizData,
} = quizSlice.actions;
export default quizSlice.reducer;  
