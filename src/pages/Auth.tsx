import { SignupForm } from "@/components/signup-form"
import { LoginForm } from "@/components/login-form"
import { BrainCircuit } from "lucide-react"
import { Link } from "react-router-dom"



const SignUp=()=> {
  return (
    <div className="flex min-h-svh  w-full items-center justify-center ">
      <div className="flex w-full max-w-sm flex-col gap-4 ">
        <Link to="/" className="flex items-center gap-2 justify-center font-medium">
          <div className=" flex size-6 items-center justify-center rounded-md">
            <BrainCircuit  color="#7876e5"/>
          </div>
          Revive
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}



const SignIn=()=> {
  return (
    <div className="flex min-h-svh  w-full items-center justify-center ">
      <div className="flex w-full max-w-sm flex-col gap-4 ">
        <Link to="/" className="flex items-center gap-2 justify-center font-medium">
          <div className=" flex size-6 items-center justify-center rounded-md">
            <BrainCircuit  color="#7876e5"/>
          </div>
          Revive
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}

export {SignIn,SignUp}