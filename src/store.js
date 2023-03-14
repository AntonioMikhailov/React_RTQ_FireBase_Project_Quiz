import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import QuizSlice from "./QuizSlice";

export const store = configureStore({
reducer: {
  QuizSlice: QuizSlice,
  AuthSlice: AuthSlice
  
}
})
 
