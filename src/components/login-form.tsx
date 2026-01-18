import { cn } from "@/lib/utils";
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
import { Link } from "react-router-dom";
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "@/store/hooks";
import { loginThunk, signupThunk } from "@/store/slices/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const {loading,error,isAuthenticated} = useAppSelector((s)=>s.auth)

  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginThunk(userInfo))
   
  };
 
  
  const handleGuestLogin = async()=>{
    const guestEmail = 'guest'+Math.floor(Math.random()*1000000).toString()+'@gmail.com';
    const guestPass = 'Guest@'+Math.floor(Math.random()*10000).toString();
    await dispatch(signupThunk({name:"Guest",email:guestEmail,password:guestPass})).unwrap()
    dispatch(loginThunk({email:guestEmail,password:guestPass}))
  }

  useEffect(()=>{
    if(isAuthenticated){
      navigate("/");
    }
  },[isAuthenticated]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      **The server may take a few minutes to warm up.**
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  name="password"
                  id="password"
                  value={userInfo.password}
                  onChange={handleChange}
                  type="password"
                  required
                />
                <div className=" text-sm pl-4 text-black dark:text-white">
                  {error}
                </div>
              </Field>
              <Field>
                <Button type="submit">
                  {loading ? "Loging In..." : "Login"}
                </Button>
                <Button variant={"outline"} onClick={handleGuestLogin}>
                  Guest Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
