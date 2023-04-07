import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Register() {
  const router = useRouter();
  const { data: session } = useSession();
  const registerUser = async (event) => {
    event.preventDefault();
    // use custom register endpoint
    try {
      const form = event.target;
      const res = await axios.post("/api/auth/custom_register", {
        password: form.password.value,
        email: form.email.value,
        fullName: form.fname.value + " " + form.lname.value,
      });
      if (res.data.success) {
        alert("Signup successful");
        router.push("/auth/login");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        alert(err.response);
        console.log(err,err.response);
      }
    }
  };
  if (session?.user) {
    router.push("/");
  }
  return (
    <div className="md:grid grid-cols-[1fr] h-screen">
   
      <div className="flex justify-center pt-10">
        <div className="max-w-[400px] w-full p-5 mx-auto pt-2">
          <form onSubmit={registerUser}>
            <div>
              <h2 className="text-xl font-semibold text-center">Join Us Now</h2>
              <p className="text-gray-600 text-lg mt-3">
               Sign up
              </p>
            </div>

            <div className="grid gap-3 py-5">
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="First Name"
                className="p-4 px-6 rounded-lg  bg-slate-100"
              />
              <input
                type="text"
                name="lname"
                id="lname"
                placeholder="Last Name"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Choose Password"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                required
              />
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="Repeat Password"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                required
              />
              <button
                type="submit"
                className="m-auto  shadow-lg bg-red-900 inline-block w-60 text-white p-2 rounded-3xl"
              >
                Create Account
              </button>
            </div>
         
          </form>

         
          <p className="text-center">
            Already have an account?{" "}
            <Link href={"/auth/login"} className="font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
