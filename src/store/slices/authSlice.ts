import { loginService, signupService,  userService,  type LoginPayload, type SignupPayload, type UserResponse } from "@/services/authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const loginThunk = createAsyncThunk<void,LoginPayload,{rejectValue:string}>(
   "auth/login", async(payload,{rejectWithValue})=>{
    try{
        const res = await loginService(payload);
        localStorage.setItem("token",res.token)
    }
    catch(err){
        return rejectWithValue((err as Error).message)
    }
   }
)

export const signupThunk = createAsyncThunk<void,SignupPayload,{rejectValue:string}>(
    'auth/signup',async(payload,{rejectWithValue})=>{
      try{
          await signupService(payload);
      }
      catch(err){
        return rejectWithValue((err as Error).message)
      }
    }
)

export const userThunk = createAsyncThunk<UserResponse,void,{rejectValue:string}>(
  "auth/user",async(_,{rejectWithValue})=>{
    try{
         const res= await userService();
         return res;
    }catch(err){
      return rejectWithValue((err as Error).message)
    }
  }
)


type AuthState = {
    loading:boolean;
    error:string|null;
    isAuthenticated:boolean;
    userDetails:UserResponse | null
}

const initialState :AuthState ={
    loading:false,
    error:null,
    isAuthenticated: !!localStorage.getItem("token"),
    userDetails:null,
}


const authLoginSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout(state){
            localStorage.removeItem("token");
            state.isAuthenticated=false;
            state.error = null;
            state.userDetails = null;
        }
    },
    extraReducers:(builder)=>{
        builder
          .addCase(loginThunk.pending,(state)=>{
            state.loading= true;
            state.error = null;
          })
          .addCase(loginThunk.fulfilled,(state)=>{
            state.loading = false;
            state.isAuthenticated=true;
          })
          .addCase(loginThunk.rejected,(state,action)=>{
            state.loading=false;
            state.error = action.payload ?? "login failed"
          })
          .addCase(signupThunk.pending,(state)=>{
            state.loading=true;
            state.error = null;
          })
          .addCase(signupThunk.fulfilled,(state)=>{
            state.loading = false;
          })
          .addCase(signupThunk.rejected,(state,action)=>{
            state.loading=false;
            state.error = action.payload ?? "signup failed"
          })
          .addCase(userThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
          })
          .addCase(userThunk.fulfilled,(state,action)=>{
            state.loading = false;
            state.userDetails = action.payload;
          })
          .addCase(userThunk.rejected,(state,action)=>{
            state.loading=false;
            state.error = action.payload ?? "failed to fetch user details";
          })

    }
});



export const {logout} = authLoginSlice.actions;
export default authLoginSlice.reducer;