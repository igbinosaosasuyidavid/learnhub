import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FaLock, FaUser } from "react-icons/fa";

function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setShowLoader } = useContext(LoaderContext)
  const { setToast } = useContext(ToastContext)
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

      if (result?.ok) {
        router.push("/");
        setShowLoader(false)
      }
      else {
        setShowLoader(false)
        setToast("Incorrect credentials", "error");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        setShowLoader(false)
        setToast(err.response.data.message, 'error');
      }
    }
  };

  if (session?.user) {
    router.push("/");
  }
  return (
    <div className="flex items-center bg-[url('/login4.png')] min-h-screen bg-fixed  bg-cover xs:bg-center md:bg-center bg-no-repeat overlay xs:px-6  lg:px-0">
      <div className="h-full m-auto w-full">
        <div className="flex m-auto items-center justify-center h-full md:w-[400px] xs:w-full">
          <div className="text-center w-full">
            <Image src="/logo.svg" alt="" className='text-center !inline mb-3 mt-8 md:h-28 md:w-28 xs:h-24 xs:w-24 cursor-pointer' width={200} height={200} onClick={() => { router.push('/') }} />

            <h1 className="text-left text-white md:text-2xl xs:text-xl mb-3  mt-7">Welcome back!</h1>
            <form onSubmit={loginUser}>
              <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                <FaUser color={'white'} className="w-1/6" />
                <input type="email" name="email" placeholder="Email Address" id="email" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required />
              </div>
              <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                <FaLock color={'white'} className="w-1/6" />
                <input type="password" name="password" placeholder="Password" id="password" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required />
              </div>
              <div className="flex mb-5 mt-3">
                <button type="submit" className="w-full bg-secondary text-white rounded-[50px] md:py-4 p-4 xs:py-3 md:text-[16px] xs:text-[12px] tracking-[0.4rem] font-semibold hover:opacity-90 duration-300">LOGIN</button>
              </div>
              <div className="flex items-center">
                <div>
                  <input type="checkbox" name="remember" id="remember" className="inline-block rounded-3xl " />
                  <span className="text-gray-300 ml-2 inline-block text-sm md:text-[16px] xs:text-[13px]">Remember Me</span>
                </div>
                <div className="ml-auto">
                  <Link href="/auth/forgot-password" className="text-gray-300 hover:text-white duration-300 md:text-[16px] xs:text-[12px]">Forgot password?</Link>
                </div>

              </div>
              <div className="flex">
                <Link href="/auth/register" className="text-gray-100 font-semibold mt-5 hover:text-primary cursor-pointer md:text-[16px] xs:text-[13px]" onClick={(e) => { e.preventDefault(); router.push('/auth/register') }}>CREATE ACCOUNT</Link>

              </div>

            </form>
          </div>

        </div>
        <div className="md:flex items-center justify-center bg-transparent mt-7 w-[70%] m-auto">
          <div className="md:w-1/2 xs:text-center md:text-left">
            <div>
              <Link href="/privacy-policy" className="mr-2 text-gray-300 md:text-xs xs:text-[11px] hover:text-white duration-300">Privacy Policy</Link>
              <Link href="/terms" className="mr-2 text-gray-300 md:text-xs xs:text-[11px] hover:text-white duration-300" >Terms and Conditions</Link>
            </div>
          </div>
          <div className="md:w-1/2 xs:text-center md:text-right">
            <span className="ml-auto text-gray-300 md:text-xs xs:text-[11px]">&copy; Copyright The Valley. All right reserved</span>
          </div>
        </div>
      </div>

    </div>

  );
}

export default Login;
