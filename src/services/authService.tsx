import  api  from "./axios"
import axios from "axios"

export type ApiErrorResponse = {
  message: string;
};

export type LoginPayload = {
    email:string,
    password:string
}
export type LoginResponse = {
    token:string
}

export const loginService= async(payload:LoginPayload) : Promise<LoginResponse> =>{    
    try{
        const {data} = await api.post<LoginResponse>("/user/signin",payload);
        return data;
    } 
    catch(err){
        if(axios.isAxiosError<ApiErrorResponse>(err)){
            throw new Error(err.response?.data.message || "Login failed")
        }
        throw new Error ("Unexpected error")
    }   
};

export type SignupPayload = {
    name:string,
    email:string,
    password:string
};

export type SignupResponse = ApiErrorResponse;

export const signupService = async(payload:SignupPayload):Promise<SignupResponse>=>{
    try{ 
        const {data} = await api.post<SignupResponse>("/user/signup",payload);
        return data;
    }
    catch(err){
        if( axios.isAxiosError<ApiErrorResponse>(err)){
            throw new Error(err.response?.data.message || "signup failed")
        }
        throw new Error ("Unexpected error")
    }
}


export type UserResponse = {
     _id:string,
     name:string,
     email:string,
}


export const userService = async():Promise<UserResponse>=>{
    try{
        const {data} = await api.get<UserResponse>("/user/me");
        return data;
    }
    catch(err){
        if(axios.isAxiosError<ApiErrorResponse>(err)){
            throw new Error(err.response?.data.message || "Failed to load userdata")
        }
        else{
            throw new Error("Unexpected error")
        }
    }
}