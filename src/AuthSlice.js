import {   createSlice } from "@reduxjs/toolkit";
const initialState = {
  startQuiz: false,
  isLogin: false,
  userRegDate: '',
  name: '',
  email: null,
  password: null,
  photo: '',
  quizTryCount: 0,
  averagePercentage: 0,
  averageQuizTime: 0,
  totalUserPercent: 0,
  totalQuizTime: 0
 
}
const authSlice = createSlice({
  name: "AuthSlice",
  initialState: initialState,
  reducers: {
    // получаем БД с сервера - вариант без createAsyncThunk
      getUserData: (state, {payload}) => {
      state.name = payload.name  
      state.email = payload.email  
      state.photo = payload.photo  
     state.averagePercentage = payload.averagePercentage  
      state.quizTryCount = payload.quizTryCount  
      state.averageQuizTime = payload.averageQuizTime  
      state.totalUserPercent = payload.totalUserPercent  
      state.totalQuizTime = payload.totalQuizTime  
      
    },
    authUserData: (state, {payload})=> {
      state.name = payload.name  
      state.email = payload.email  
      state.photo = payload.photo 
      state.userRegDate = payload.userRegDate  
    },
    // тоглим показ Вопросов
    toggleAuth: (state, {type, payload}) => {
      // console.log( payload);
      state.startQuiz = payload;
    },
    // статус авторизации
    loginUserStatus: (state, {type, payload}) => {
      state.isLogin = payload;
    },
  }
    })
    export const {authUserData,toggleAuth, getUserData, loginUserStatus} = authSlice.actions
    export default authSlice.reducer;