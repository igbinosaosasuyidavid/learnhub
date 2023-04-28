import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FaLock, FaUser } from "react-icons/fa";

function Login() {
  const router = useRouter();
  const { data:session } = useSession();
  const {setShowLoader}=useContext(LoaderContext)
  const {setToast}=useContext(ToastContext)
  const loginUser = async (event) => {
    event.preventDefault();

    try {
      setShowLoader(true)
      const form = event.target;
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
      });

      if (result?.ok){ 
        router.push("/");
        setShowLoader(false) 
      }
      else {
        setShowLoader(false)
        setToast("Incorrect credentials","error");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        setShowLoader(false)
        setToast(err.response.data.message,'error');
      }
    }
  };

  if (session?.user) {
    router.push("/");
  }
  return (
    <div className="bg-[url('/login4.png')] min-h-screen bg-fixed  bg-cover bg-center bg-no-repeat overlay">
      <div className="h-fit m-auto max-w-screen-lg ">
        <div className="flex m-auto items-center justify-center h-full w-[370px]">
          <div className="text-center w-full">
            <img src="/logo.svg" alt="" className='text-center !inline mb-3 mt-8' width={80} height={80}/>
            
            <h1 className="text-left text-white text-2xl mb-3  mt-7">Welcome back!</h1>
            <form onSubmit={loginUser}>
              <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                <FaUser color={'white'} className="w-1/6"/>
                <input type="email" name="email" placeholder="Email Address" id="email" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300" required/>
              </div>
              <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                <FaLock color={'white'} className="w-1/6"/>
                <input type="password" name="password" placeholder="Password" id="password" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300" required/>
              </div>
              <div className="flex mb-5 mt-3">
                  <button type="submit" className="w-full bg-secondary text-white rounded-[50px] py-4 p-4 tracking-[0.4rem] font-semibold hover:opacity-90 duration-300">LOGIN</button>
              </div>
              <div className="flex items-center">
                <div>
                  <input type="checkbox" name="remember" id="remember" className="inline-block rounded-3xl" />
                  <span className="text-gray-300 ml-2 inline-block text-sm">Remember Me</span>
                </div>
                <div className="ml-auto">
                  <a href="/auth/forgot-password" className="text-gray-300 text-sm hover:text-white duration-300">Forgot password?</a>
                </div>
               
              </div>
              <div className="flex">
                <a href="/auth/register" className="text-gray-100 font-semibold mt-5 hover:text-primary cursor-pointer"  onClick={(e)=>{ e.preventDefault(); router.push('/auth/register')}}>CREATE ACCOUNT</a>

              </div>
             
            </form>
          </div>

        </div>
        <div className="flex m-auto items-center justify-center bg-transparent mt-14">
          <div className="w-1/2">
            <div>
              <a href="/privacy" className="mr-2 text-gray-300 text-sm hover:text-white duration-300">Privacy Policy</a>
              <a href="/privacy" className="mr-2 text-gray-300 text-sm hover:text-white duration-300" >Terms and Conditions</a>
            </div>
          </div>
          <div className="w-1/2 text-right">
            <span className="ml-auto text-gray-300 text-sm">&copy; Copyright The Valley. All right reserved</span>
          </div>
        </div>
      </div>
  
    </div>
  
  );
}

export default Login;
