import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FaEnvelope, FaLock, FaPencilAlt, FaUser } from "react-icons/fa";

function Register() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setShowLoader } = useContext(LoaderContext)
  const { setToast } = useContext(ToastContext)
  const registerUser = async (event) => {
    event.preventDefault();
    // use custom register endpoint

  
      try {
        const form = event.target
        function ValidateEmail(inputText) {
          var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (inputText.match(mailformat)) {
            return false;
          }else{
            return true
          }
        }
        if (ValidateEmail(form.email.value)) {
          setToast("Invalid Email", "error")
          return null;
        }
        if (form.password.value !== form.cpassword.value) {

          setToast("Password do not match", "error")
          return null
        }
        setShowLoader(true)

        const res = await axios.post("/api/auth/custom_register", {
          password: form.password.value,
          email: form.email.value,
          fullName: form.fname.value + " " + form.lname.value,
          creator: form.creator.value
        });
        if (res.data.success) {
          setShowLoader(false)
          setToast("Sign up successful", "success")
          router.push("/auth/login");
        } else {
          setShowLoader(false)
          setToast(res.data.message, "error")
        }
      } catch (err) {
        console.log(err);
        if (err.response) {
          setShowLoader(false)
          setToast(err.response.data.message, "error")
        }
      }
    };
    if (session?.user) {
      router.push("/");
    }
    return (
      // <div className="md:grid grid-cols-[1fr] h-screen">

      //   <div className="flex justify-center pt-10">
      //     <div className="max-w-[400px] w-full p-5 mx-auto pt-2">
      //       <form onSubmit={registerUser}>
      //         <div>
      //           <h2 className="text-xl font-semibold text-center">Join Us Now</h2>
      //           <p className="text-gray-600 text-lg mt-3">
      //            Sign up
      //           </p>
      //         </div>

      //         <div className="grid gap-3 py-5">
      //           <input
      //             type="text"
      //             name="fname"
      //             id="fname"
      //             placeholder="First Name"
      //             className="p-4 px-6 rounded-lg  bg-slate-100"
      //           />
      //           <input
      //             type="text"
      //             name="lname"
      //             id="lname"
      //             placeholder="Last Name"
      //             className="p-4 px-6 rounded-lg  bg-slate-100"

      //           />
      //           <input
      //             type="email"
      //             name="email"
      //             id="email"
      //             placeholder="Email Address"
      //             className="p-4 px-6 rounded-lg  bg-slate-100"
      //             required
      //           />
      //           <input
      //             type="password"
      //             name="password"
      //             id="password"
      //             placeholder="Choose Password"
      //             className="p-4 px-6 rounded-lg  bg-slate-100"
      //             required
      //           />
      //           <input
      //             type="password"
      //             name="cpassword"
      //             id="cpassword"
      //             placeholder="Repeat Password"
      //             className="p-4 px-6 rounded-lg  bg-slate-100"
      //             required
      //           />
      //           <button
      //             type="submit"
      //             className="m-auto  shadow-lg bg-red-900 inline-block w-60 text-white p-2 rounded-3xl"
      //           >
      //             Create Account
      //           </button>
      //         </div>

      //       </form>


      //       <p className="text-center">
      //         Already have an account?{" "}
      //         <Link href={"/auth/login"} className="font-semibold">
      //           Log in
      //         </Link>
      //       </p>
      //     </div>
      //   </div>
      // </div>
      <div className="flex items-center bg-[url('/login4.png')] min-h-screen bg-fixed  bg-cover xs:bg-center md:bg-center bg-no-repeat overlay xs:px-6  lg:px-0">
        <div className="h-full m-auto w-full">
          <div className="flex m-auto items-center justify-center h-full md:w-[400px] xs:w-full">
            <div className="text-center w-full">
              <Image src="/logo.svg" alt="" className='text-center !inline mb-3 mt-8 md:h-28 md:w-28 xs:h-24 xs:w-24 cursor-pointer' width={200} height={200} onClick={() => { router.push('/') }} />


              <h1 className="text-left text-white md:text-2xl xs:text-xl mb-3  mt-7">Start your journey now</h1>
              <form onSubmit={registerUser}>
                <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                  <FaUser color={'white'} className="w-1/6" />
                  <input type="text" name="fname" placeholder="First Name" id="fname" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required />
                </div>
                <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                  <FaUser color={'white'} className="w-1/6" />
                  <input type="text" name="lname" placeholder="Last Name" id="lname" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required />
                </div>
                <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                  <FaEnvelope color={'white'} className="w-1/6" />
                  <input type="email" name="email" placeholder="Email Address" id="email" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required />
                </div>
                <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                  <FaLock color={'white'} className="w-1/6" />
                  <input type="password" name="password" placeholder="Password" id="password" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required minLength={6} />
                </div>


                <div className=" mb-5 flex items-center rounded-[50px] bg-[rgba(173,173,173,0.4)] px-5 p-4">
                  <FaLock color={'white'} className="w-1/6" />
                  <input type="password" name="cpassword" placeholder="Confirm Password" id="cpassword" className="rounded-[50px] bg-transparent w-5/6 !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" required minLength={6} />
                </div>

                <div className=" mb-5 px-5 p-4">
                  <div className="flex gap-2 items-center">
                    <h3 className="text-white text-lg">Are you a course creator?</h3>
                    <FaPencilAlt color={'white'} />
                  </div>
                  <div className="flex">
                    <input type="radio" name="creator" id="yes" className="rounded-[50px] bg-transparent cursor-pointer  !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" value={"true"} />
                    <label htmlFor="yes" className="text-gray-300 mr-3 ml-1">Yes</label>
                    <input type="radio" name="creator" id="no" className="rounded-[50px] bg-transparentcursor-pointer !text-white placeholder:text-gray-300 md:text-sm xs:text-[12px]" value={"false"} defaultChecked />
                    <label htmlFor="no" className="text-gray-300 ml-1">No</label>
                  </div>





                </div>
                <div className="flex mb-5 mt-3">
                  <button type="submit" className="w-full bg-secondary text-white rounded-[50px] py-4 p-4 xs:py-4 md:text-[16px] xs:text-[12px] tracking-[0.4rem] font-semibold hover:opacity-90 duration-300">REGISTER</button>
                </div>
                <div className="flex items-center">
                  <div>
                    <input type="checkbox" name="remember" id="remember" className="inline-block rounded-3xl" />
                    <span className="text-gray-300 ml-2 inline-block text-sm">Remember Me</span>
                  </div>

                </div>
                <div className="flex">
                  <Link href="/auth/login" className="text-gray-100 font-semibold mt-5 hover:text-primary cursor-pointer  md:text-[16px] xs:text-[13px]" onClick={(e) => { e.preventDefault(); router.push('/auth/login') }}>LOGIN</Link>

                </div>

              </form>
            </div>

          </div>
          <div className="md:flex items-center mb-4 justify-center bg-transparent mt-7 w-[70%] m-auto">
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

  export default Register;
