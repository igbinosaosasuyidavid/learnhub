import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Login() {
  const router = useRouter();
  const { data:session } = useSession();
  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const form = event.target;
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
      });

      if (result?.ok) return router.push("/");
      else {
        alert("Incorrect credentials");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        alert(err.response.data.message);
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
          <form onSubmit={loginUser}>
            <div>
              <h2 className="text-xl font-semibold text-center">Hi there welome to partytime</h2>
              <p className="text-gray-600 text-lg mt-9">
               Sign in
              </p>
            </div>

            <div className="grid gap-3 py-5">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Email Address"
                className="p-4 px-6 rounded-lg bg-slate-100"
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                required
              />
              <div className="flex justify-between">
                <label className="flex gap-1 items-center">
                  <input type="checkbox" name="remember" id="remember" />
                  <span>Remember Me</span>
                </label>
              
              </div>
              <button
                type="submit"
                className=" m-auto  shadow-lg bg-red-900 inline-block w-28 text-white p-2 rounded-3xl"
              >
               Sign in
              </button>
            </div>
         
          </form>

          <Link href={"/auth/forgot-password"} className=" text-slate-500 inline-block ms-auto  hover:text-red-700 mb-4">
                  Forgot password?
                </Link>
          <p className="text-center">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="font-semibold">
             Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
