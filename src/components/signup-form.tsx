import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {  useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "@/store/hooks";
import { signupThunk } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userInfo,setUserInfo] = useState({name:"",email:"",password:""})
  const [confirmPassword,setConfirmPassword] = useState("")
  const dispatch = useAppDispatch()
  const {loading,error} = useAppSelector((s)=>s.auth)
  const navigate = useNavigate()

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setUserInfo((data)=>({
      ...data,
      [name] : value,
    }))
  }

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try{
       await dispatch(signupThunk(userInfo)).unwrap()
       navigate('/signin')
    }
    catch(err){
      console.log(err);
    }
    
    
  }



  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex flex-col gap-6  ">
        <Card {...props} >
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input  onChange={handleChange} name="password" value={userInfo.password} id="password" type="password" required />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input  onChange={(e)=>setConfirmPassword(e.target.value)} name="confirm-password" value={confirmPassword}  id="confirm-password" type="password" required />
                  <FieldDescription>
                    {userInfo.password !==confirmPassword && "Password does not Match"}
                  </FieldDescription>
                   <FieldDescription>
                    {error}
                  </FieldDescription>
                </Field>
                <FieldGroup>
                  <Field>
                    <Button  disabled={!userInfo.email ||!userInfo.password || userInfo.password !==confirmPassword}  type="submit">{loading ? "Creating Account...":"Create Account"}</Button>
                    {/* <Button variant="outline" type="button">
                      Sign up with Google
                    </Button> */}
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link to="/signin">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
