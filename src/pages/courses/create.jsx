import {  useSession } from "next-auth/react";
import Link from "next/link";
import {redirect} from "next/navigation"
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/nav";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { useRouter } from "next/router";
function Create() {
    const router=useRouter()
    const [courseImage,setCourseImage]=useState()
    const {setShowLoader}=useContext(LoaderContext)
    const {setToast}=useContext(ToastContext)
    const { data: session } = useSession();
    const createCourse = async (event) => {
        
        event.preventDefault();
        const {title,description,price}=event.target
        console.log(event.target);
        try {
            setShowLoader(true)
            const formData=new FormData()
            formData.set("courseImage", courseImage);
            formData.append("title",title.value)
            formData.append("user_id",session?.id)
            formData.append("description",description.value)
            formData.append("host",window.location.origin)
            formData.append("price",price.value)
      
            const res= await axios.post(`/api/app/courses/create-course`, formData)
            console.log(res.data);
            if (res.data.success) {
                console.log(res.data);
                setShowLoader(false)
                setToast('Course created','success')
                router.push("/")
    
            }else{
                setToast('Something is wrong with your input please try again','warning')
            }
     
        } catch (err) {
            console.log(err);
            setShowLoader(false)
            if (err.response) {
                setToast(err.response.data.message,'error')
            }
        }
    };
    useEffect(()=>{
        console.log(session);
    },[session])
    const handleChange = (e) => {

        const file = e.target.files[0]
        console.log(file);
        if (file) {
          setCourseImage(file)
          const reader = new FileReader()
          reader.onload = () => {
            const parent = document.querySelector('.preview-box')
            parent.innerHTML = `<img class="h-92 w-92 object-cover" src=${reader.result} />`
          }
    
          reader.readAsDataURL(file)
        }
      }
    
    
  return (
    <>
        <Nav/>
        <div className="md:grid grid-cols-[1fr] h-screen">
     
        <div className="flex justify-center pt-10">
        <div className="max-w-[400px] w-full p-5 mx-auto pt-2">
            <form onSubmit={createCourse}>
            <div>
                <h2 className="text-xl font-semibold text-center">Hi there welome to partytime</h2>
                <p className="text-gray-600 text-lg mt-9">
                Create Course
                </p>
            </div>

            <div className="grid gap-3 py-5">
                <input
                type="text"
                name="title"
                id="title"
                placeholder="Course title"
                className="p-4 px-6 rounded-lg bg-slate-100"
                required
                />
                
                <textarea
                
                name="description"
                id="password"
                placeholder="What is your course about"
                className="p-4 px-6 rounded-lg  bg-slate-100"
                required
                />
                <input
                type="number"
                name="price"
                id="price"
                placeholder="Price in $(USD)"
                className="p-4 px-6 rounded-lg bg-slate-100"
                step=".01"
                required
                />

                <p>Course Image</p>
                <div onClick={()=>{document.getElementById("image").click()}} className="p-2 bg-gray-400 rounded cursor-pointer inline-block w-fit">
                Upload image
                </div>
                <input
                type="file"
                name="image"
                hidden
                onChange={handleChange}
                required
                id="image"
                placeholder="Price in $(USD)"
                className="p-4 px-6 rounded-lg bg-slate-100"
                
                />
                <div className="preview-box"></div>
                <button
                type="submit"
                className=" m-auto  shadow-lg bg-red-900 inline-block w-28 text-white p-2 rounded-3xl"
                >
                Create
                </button>
            </div>
            
            </form>

            <Link href={"/auth/forgot-password"} className=" text-slate-500 inline-block ms-auto  hover:text-red-700 mb-4">
                    View other courses
                </Link>
            
        </div>
        </div>
   </div>
    </>
   
  );
}

export default Create;
