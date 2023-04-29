

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/nav";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { useRouter } from "next/router";
import * as tus from 'tus-js-client'


import CartContext from "@/contexts/cart";
import prisma from "../../../../prisma/db"
import { FiEdit, FiFilePlus } from "react-icons/fi";

import { MdAdd} from "react-icons/md";
import { BsArrowBarLeft } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";



export const getServerSideProps=async (context)=>{

    const result=await prisma.user.findFirst({
        where:{
            id:context.params.id
        },
        select:{
            createdCourses:{
              include:{
                author:true,
                lessons:true
              }
            }
        }
    })
    console.log(result);
    return {
        props: {courses:result.createdCourses.length!==0?JSON.parse(JSON.stringify(result?.createCourses)):[]},
    }
}

function Course({courses}) {

  
    const [duration,setDuration]=useState()
    const [courseModal,setCourseModal]=useState(false)
    const [createModal,setCreateModal]=useState(false)
    const [loaded,setLoaded]=useState(0)
    const [currentCourse,setCurrentCourse]=useState()
    const [courseImage,setCourseImage]=useState()
    const [courseImageC,setCourseImageC]=useState()
    const {setShowLoader}=useContext(LoaderContext)
    const {addToCart}=useContext(CartContext)
    const {setToast}=useContext(ToastContext)
    const router=useRouter()
    const { data: session } = useSession();
    useEffect(()=>{
        setShowLoader(false)
    })
    const handleChange = (e) => {

        const file = e.target.files[0]
        console.log(file);
        if (file) {
            const parent = document.querySelector('.preview-box2')
            parent.innerHTML = `<p class="text-[13px]">${file.name}</p>`
        }

        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            setDuration(video.duration);
            return null;
        }
        video.src = URL.createObjectURL(e.target.files[0]);
          
      }

      const createLesson=async (e)=>{
        e.preventDefault()
        
        try {
            setShowLoader(true)
            const options = {
                method: 'POST',
                url: 'https://video.bunnycdn.com/library/117505/videos',
                headers: {accept: 'application/json', 'content-type': 'application/*+json',AccessKey:'5b6c78c4-8b53-4ec7-9f3cb38760f3-090b-4ea1'},
                data:{title:e.target.lesson_title.value}
          
              };
          
              const resp=await axios.request(options)
              console.log(resp.data);

                localStorage.setItem('vid_id',resp.data.guid)
             
             

  
              var expiration_time= new Date(new Date().getTime() + 5*60000).getTime();
              console.log(expiration_time);
              var input=117505+'5b6c78c4-8b53-4ec7-9f3cb38760f3-090b-4ea1'+expiration_time+   localStorage.getItem('vid_id')
              const signature = async () => {
                const textAsBuffer = new TextEncoder().encode(input);
                const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hash = hashArray
                  .map((item) => item.toString(16).padStart(2, "0"))
                  .join("");
                return hash;
              };
          
                var upload = new tus.Upload(e.target.video.files[0], {
                endpoint: "https://video.bunnycdn.com/tusupload",
                retryDelays: [0, 1000000000000],
                headers: {
                    AuthorizationSignature: await signature(), 
                    AuthorizationExpire: expiration_time, 
                    VideoId: localStorage.getItem('vid_id'), 
                    LibraryId: 117505,
                },
                metadata: {
                    filetype: e.target.video.files[0].type,
                    title: e.target.title.value,
                  
                },
                onError: function (error) {
                    console.log(error);
                 },
                onProgress: function (bytesUploaded, bytesTotal) {
                    setShowLoader(false)
                    const perc=Math.round((bytesUploaded/bytesTotal)*100)
                    setLoaded(perc)
                 },
                onSuccess:async function () {
                    setShowLoader(true)
                    function fancyTimeFormat(duration) {
                        const hrs = ~~(duration / 3600);
                        const mins = ~~((duration % 3600) / 60);
                        const secs = ~~duration % 60;
                        let ret = "";
                        if (hrs > 0) {
                          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                        }
                        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                        ret += "" + secs;
                        return ret;
                      }

                    const resp=await axios.post("/api/app/lesson/create-lesson",{title:e.target.lesson_title.value,course_id:currentCourse.id,duration:fancyTimeFormat(duration),video_url:`https://iframe.mediadelivery.net/embed/117505/${localStorage.getItem("vid_id")}`})
                    if (resp.data.success) {
                        localStorage.removeItem("vid_id")
                        setShowLoader(false)
                        setCourseModal(false)
                       
                        setToast("Lesson created",'success')
                        router.replace(router.asPath);
                        
                    }else{
                        setShowLoader(false)
                        localStorage.removeItem("vid_id")
                        setToast("Lesson not created",'info')
                    }
                 }
            })

            upload.findPreviousUploads().then(function (previousUploads) {
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0])
                }
                upload.start()
            })

           
        } catch (e) {
            console.log(e);
            setShowLoader(false)
        }
      }
      const courseUpdate=async(e)=>{
             
        e.preventDefault();
        const {title,description,price}=e.target
        console.log(e.target.title);
        try {
            setShowLoader(true)
            const formData=new FormData()
            formData.set("courseImage", courseImage?courseImage:"");
            formData.append("title",title.value)
            formData.append("course_id",currentCourse.id)
            formData.append("description",description.value)
            formData.append("host",window.location.origin)
            formData.append("price",price.value)
      
            const res= await axios.post(`/api/app/courses/update-course`, formData)
            console.log(res.data);
            if (res.data.success) {
                console.log(res.data);
                setShowLoader(false)
                setToast('Course Updated','success')
                router.replace(router.asPath);
    
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
      }
      const editCourse=(data)=>{
        setCourseModal(true)
        setCurrentCourse(data)
      }
      const handleImage = (e,c) => {

        const file = e.target.files[0]
        console.log(file);
        if (file) {
        if (c) {

            setCourseImageC(file)
            const reader = new FileReader()
            reader.onload = () => {
              const parent = document.querySelector('.preview-box3')
              parent.innerHTML = `<Image class="h-[150px] w-full object-cover rounded-lg" src=${reader.result} />`
            }
      
            reader.readAsDataURL(file)
        }else{
        
            setCourseImage(file)
            const reader = new FileReader()
            reader.onload = () => {
              const parent = document.querySelector('.preview-box')
              parent.innerHTML = `<Image class="w-full object-cover rounded-lg" src=${reader.result} />`
            }
            reader.readAsDataURL(file)
      
        }
         
        }
      }
      const createCourse = async (event) => {
        
        event.preventDefault();
        const {title_c,description_c,price_c}=event.target
        console.log(event.target);
        try {
            setShowLoader(true)
            const formData=new FormData()
            formData.set("courseImage", courseImageC);
            formData.append("title",title_c.value)
            formData.append("user_id",session?.id)
            formData.append("description",description_c.value)
            formData.append("host",window.location.origin)
            formData.append("price",price_c.value)
      
            const res= await axios.post(`/api/app/courses/create-course`, formData)
            console.log(res.data);
            if (res.data.success) {
                console.log(res.data);
                setShowLoader(false)
                setToast('Course created','success')
                setCreateModal(false)
                router.replace(router.asPath);
    
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
    
  return (
    <>
        <Nav/>
        <>
            {
                !courseModal &&
                <div className="border-t border-gray-200">
                    <div className="custom-container ">
                        <h3 className="text-4xl text-center mt-10 mb-4">My courses</h3>
                        <div className="flex justify-end mb-7">
                            <button className="ml-auto bg-secondary text-white p-2 rounded-lg inline-flex gap-1 items-center duration-300 hover:opacity-90" onClick={(e)=>{e.preventDefault();setCreateModal(true)}}><MdAdd size={25}/> Create New Course</button>
                        </div>
                    
             
                        {
                            courses.length!==0?
                            <>
                            <div className="grid grid-cols-4 gap-5">
                            {
                                courses.map((data)=>{
                                    return (
                                    <div  className="shadow-lg border border-solid border-gray-500" key={data.id}>
                                        <Image src={data.featuredImage} alt="course-Image" className="w-full object-cover h-[150px]" width={200} height={200} />
                                        <div className="p-3">
                                            <h3 className="text-black text-sm font-semibold">{data.title.length>50?data.title.slice(0,50)+'...':data.title}</h3>
                                        
                                            <h3 className="text-sm mt-2 mb-1"><span className="font-bold">{data.lessons.length}</span> {data.lessons.length===1?"Lesson":"Lessons"}</h3>
                                            <h3 className="font-bold text-lg flex items-center pb-3 z-50 mt-3">
                                            <span>{new Intl.NumberFormat("en-US",{ style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0,}).format(parseFloat(data.price).toFixed(3))}</span>
                            
                                            <button className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 py-0 px-2 text-[11px] rounded-md ml-auto" onClick={()=>editCourse(data)}> <FiEdit size={15} /> Edit</button>
                                            </h3>
                                
                                    
                        
                                        
                                        </div>
                                        
                                    </div>
                                    )
                                })
                                }
                            </div>
                            </>
                            :
                            <p className="text-center my-7 w-full">You don&apos;t have any course yet</p>

                        }
                    
                
                    </div>
                </div>
            }
        </>
        <>
            {
                courseModal &&
                <div className="border-t border-gray-200">
                    <div className="custom-container">
                        <div className=" bg-white rounded-md p-6 relative">
                            <span className="absolute top-2 right-3 text-lg hover:text-gray-500 cursor-pointer duration-300 inline-flex gap-2 items-center text-secondary font-semibold" onClick={()=>{setCourseModal(false);setLoaded(0)}}><BsArrowBarLeft/> Back</span>
                            <div className="">
                                <form onSubmit={courseUpdate} method="POST" className="w-full">
                                    <h2 className="text-black font-medium mb-3 text-2xl">
                                        Edit Course
                                    </h2>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-3/5">
                                            <div className="mb-3">
                                            <label htmlFor="title" className="text-sm">Title</label>
                                            <input type="text" name="title" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Title" defaultValue={currentCourse.title} id="title"/>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="text-sm">Title</label>
                                                <textarea name="description" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm outline-none shadow-none resize-none" placeholder="Course Description" defaultValue={currentCourse.description.slice(0,200)+'...'} id="description" rows={6}/>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="text-sm" >Price</label>
                                                <input type="number" name="price" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Price" defaultValue={currentCourse.price} id="ptitle" step=".01"/>
                                            </div>
                                        </div>
                                        <div className="w-2/5">
                                            <div className="mb-3">
                                                <p>Course Image</p>
                                                <div onClick={()=>{document.getElementById("image").click()}} className="p-2 bg-gray-200 rounded cursor-pointer inline-block w-fit">
                                                    Upload image
                                                </div>
                                                <input type="file"
                                                name="image" hidden onChange={(e)=>{handleImage(e,false)}} id="image" placeholder="Price in $(USD)" className="p-4 px-6 rounded-lg bg-slate-100"/>
                                                <div className="preview-box mt-9">
                                                    <Image src={currentCourse.featuredImage} alt="course-img" className="rounded-lg" width={200} height={200}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    
                                    
                                
                                
                                
                                <button type="submit" className=" w-fit py-3 px-6 bg-secondary text-white rounded-lg mt-3">Save Changes</button>
                                    
                                

                                        
                                </form>
                            </div>
                            <h3 className="text-xl font-medium mb-1 mt-5">Course Lessons</h3>
                            <div className="flex gap-9 mt-7 ">
                                <div className="w-3/5">
                                
                                    {
                                        currentCourse.lessons.length!==0? <>
                                        {
                                                currentCourse.lessons.map((data,i)=>
                                                <div className="flex gap-2 border-b border-t py-2 border-gray-100" key={data.id}>
                                                    <p>{i+1})</p>
                                                    <h1>{data.title?.length>30? data.title.slice(0,30)+'...':data.title}</h1>
                                                    <p className="ml-auto text-sm font-bold">{data.duration}</p>
                                                </div>
                                                )
                                        }
                                            
                                        </>:<p className="text-sm">No lessons for this course</p>
                                    }
                                </div>
                                <div className="w-2/5">
                                
                                    <form onSubmit={createLesson} method="POST" className="w-full">
                                        <h2 className="text-black font-medium mb-3 text-md">Add New Lesson</h2>
                                        <input type="text" name="lesson_title" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Lesson Title"/>
                                        {
                                            loaded!==0 &&

                                            <div className="flex items-center gap-2 mt-3 ">
                                                <div className="bg-slate-100 p-1 rounded-lg w-full duration-300">
                                                    <div style={{width:loaded+"%"}} className='rounded-lg bg-secondary p-1.5'>

                                                    </div>
                                                </div>
                                                <div>
                                                    {loaded}%
                                                </div>
                                            </div>
                                        }
                                        <div onClick={()=>{document.getElementById("vid").click()}} className="p-2 bg-gray-100 rounded cursor-pointer inline-flex w-fit text-sm mb-3  items-center gap-2 mt-3">
                                        <FiFilePlus size={25}/> Upload Video
                                        </div>
                                        <input type="file" name="video" hidden onChange={handleChange} required id="vid" />
                                        <div className="preview-box2">
                                            
                                        </div>
                                    
                
                                    <button type="submit" className=" w-full py-3 bg-secondary text-white rounded-lg mt-3">Save</button>
                                    </form>
                                
                                </div>
                            </div>
                        
                            
                        </div>
                    </div>
                </div>
               
                
            }
        
        </>
        <>
            {
                createModal && <>
                    <div className="fixed top-0 bg-[rgb(0,0,0,0.3)] w-full h-screen flex items-center justify-center">
                    <div className=" bg-white rounded-md p-6 relative w-[600px]">
                            <span className="absolute top-2 right-3 text-lg hover:text-gray-500 cursor-pointer duration-300 inline-flex gap-2 items-center text-secondary font-semibold" onClick={(e)=>{e.preventDefault();setCreateModal(false)}}><FaTimes/></span>
                            <div className="">
                                <form onSubmit={createCourse} method="POST" className="w-full">
                                    <h2 className="text-black font-medium mb-3 text-2xl">
                                        Create Course
                                    </h2>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-3/5">
                                            <div className="mb-3">
                                   
                                            <input type="text" name="title_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Title"  id="title_c"/>

                                            </div>
                                            <div className="mb-3">
                                          
                                                <textarea name="description_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm outline-none shadow-none resize-none" placeholder="Course Description"  id="description_c" rows={6}/>

                                            </div>
                                            <div className="mb-3">
                                         
                                                <input type="number" name="price_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Price" id="price_c" step=".01"/>

                                            </div>
                                        </div>
                                        <div className="w-2/5">
                                            <div className="mb-3">
                                                <p>Course Image</p>
                                                <div onClick={()=>{document.getElementById("image_c").click()}} className="p-2 bg-gray-200 rounded cursor-pointer inline-block w-fit">
                                                    Upload image
                                                </div>
                                                <input type="file"
                                                name="image_c" hidden onChange={(e)=>handleImage(e,true)} id="image_c" placeholder="Price in $(USD)" className="p-4 px-6 rounded-lg bg-slate-100"/>
                                                <div className="preview-box3 mt-9">
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    
                                    
                                
                                
                                
                                <button type="submit" className=" w-fit py-3 px-6 bg-secondary text-white rounded-lg mt-3">Create</button>
                                    
                                

                                        
                                </form>
                            </div>
                        
                        
                            
                        </div>
                    </div>
                </>
            }
        
        </>
    </>
   
  );
}

export default Course;
