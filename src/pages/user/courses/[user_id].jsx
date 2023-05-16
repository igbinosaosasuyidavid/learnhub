

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/nav";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { useRouter } from "next/router";
import * as tus from 'tus-js-client'



import prisma from "../../../../prisma/db"
import { FiEdit, FiFilePlus } from "react-icons/fi";


import { BsArrowBarLeft } from "react-icons/bs";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Footer from "@/components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";
import { BiTrash } from "react-icons/bi";



export const getServerSideProps=async ({ req, res ,params})=>{
    const session= await getServerSession(req, res, authOptions)
    if (!session) {
        
        res.setHeader("location", "/auth/login");
        res.statusCode = 302;
        res.end();
        return {
            props:{}
        };
    }
  
    const categories = await prisma.category.findMany({
        where: {},
      })
      var type;
    if ( session?.user?.admin) {
        type={
            createdCourses:{
              include:{
                author:true,
                lessons:true,
                categories:true,
                students:true,
              }
            }
        }
   
    }else{
        type={
            enrolledCourses:{
              include:{
                author:true,
                lessons:true,
                categories:true,
                students:true,
              }
            }
        }
   
    }
    const result=await prisma.user.findFirst({
        where:{
            id:params.user_id
        },
        select:type
    })

    var carr=result.enrolledCourses || result.createdCourses
    return {
        props: {categories: JSON.parse(JSON.stringify(categories)),courses:carr.length!==0?JSON.parse(JSON.stringify(carr)):[],isAdmin:session?.user?.admin || null},
    }
}

function Course({courses,categories,isAdmin}) {
    const [duration,setDuration]=useState()
    const [courseModal,setCourseModal]=useState(false)
    const [loaded,setLoaded]=useState(0)
    const [currentCourse,setCurrentCourse]=useState()
    const [courseImage,setCourseImage]=useState()
    const {setShowLoader}=useContext(LoaderContext)
   
    const [courseCategoriesUp,setCourseCatgoriesUp]=useState([])
    const {setToast}=useContext(ToastContext)
    const router=useRouter()
    const { data: session } = useSession();
    useEffect(()=>{
        setShowLoader(false)
        console.log(session);
    },[session])
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
                url: 'https://video.bunnycdn.com/library/122582/videos',
                headers: {accept: 'application/json', 'content-type': 'application/*+json',AccessKey:'0e3c1abe-28a4-43dd-934af83b4486-65b2-4ef6'},
                data:{title:e.target.lesson_title.value}
          
              };
          
              const resp=await axios.request(options)
              console.log(resp.data);

                localStorage.setItem('vid_id',resp.data.guid)
             
             

  
              var expiration_time= new Date(new Date().getTime() + 5*60000).getTime();
              console.log(expiration_time);
              var input=122582+'0e3c1abe-28a4-43dd-934af83b4486-65b2-4ef6'+expiration_time+   localStorage.getItem('vid_id')
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
                    LibraryId: 122582,
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

                    const resp=await axios.post("/api/app/lesson/create-lesson",{title:e.target.lesson_title.value,course_id:currentCourse.id,duration:fancyTimeFormat(duration),video_url:`https://iframe.mediadelivery.net/embed/122582/${localStorage.getItem("vid_id")}`})
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
        if(session?.id !== currentCourse.authorId) {
            router.push('/')
           
            return null
        
        }
        
        const {title,description,price}=e.target

        try {
            setShowLoader(true)
            const formData=new FormData()
            if(courseImage) {
                formData.set("courseImage", courseImage);
            }
         
            formData.append("title",title.value)
            formData.append("course_id",currentCourse.id)
            formData.append("description",description.value)
            formData.append("host",window.location.origin)
            formData.append("price",price.value)
            formData.append("courseCats",JSON.stringify(courseCategoriesUp))
      
            const res= await axios.post(`/api/app/courses/update-course`, formData)
            console.log(res.data);
            if (res.data.success) {
    
               
                setCurrentCourse(res.data.course)
                setShowLoader(false)
                setToast('Course Updated','success')
         
             
             
          
             
    
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
        setCourseCatgoriesUp(data?.categoryIds || [])
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
    
    const removeStudent=async (student_id)=>{
        setShowLoader(true)
        try {
            const res= await axios.post(`/api/app/courses/remove-students`, {student_id,course_id:currentCourse.id})
            setCurrentCourse(res.data.course)
            setShowLoader(false)
            setToast('Student removed','success')
        } catch (e) {
            console.log(e);
        }
    }
    
  return (
    <>
        <Nav/>
        <>
            {
                !courseModal &&
                <div className="border-t border-gray-200 xs:px-6 lg:px-0">
                    <div className="custom-container ">
                        <h3 className="md:text-4xl xs:text-2xl text-center mt-10 mb-4"> {isAdmin ? "My" :"Enrolled"} courses</h3>

                  
                        
                    
                
                        {
                            courses.length!==0?
                            <>
                         
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 xs:grid-cols-2 xs:mb-14">
           
                                {
                                    courses.map((data)=>{
                                    return (
                                        <div  className="shadow-lg border border-solid border-gray-500 cursor-pointer" key={data.id}>
                                            <Image src={data.featuredImage} alt="course-Image" className="w-full object-cover sm:h-[150px] xs:h-[100px]" width={300} height={300} onClick={()=>{
                                        setShowLoader(true)
                                            router.push(
                                            { pathname: `/courses/${data.id}`},
                                            "/courses/"+data.id
                                            );
                                        }}/>
                                            <div className="p-3">
                                            <h3 className="text-black sm:text-sm xs:text-[10px] font-semibold" onClick={()=>{
                                        setShowLoader(true)
                                            router.push(
                                            { pathname: `/courses/${data.id}`},
                                            "/courses/"+data.id
                                            );
                                        }}>{data.title.length>50?data.title.slice(0,50)+'...':data.title}</h3>
                                            {
                                                isAdmin ?
                                            <h3 className="font-bold sm:text-lg xs:text-[13px] flex items-center pb-3 z-50 mt-2">
                                                <span>{new Intl.NumberFormat("en-US",{ style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2,}).format(parseFloat(data.price).toFixed(3))}</span>
                                                <button className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 sm:py-1 sm:px-2 xs:py-1 xs:px-1 text-[11px] rounded-md ml-auto" onClick={()=>editCourse(data)}> <FiEdit size={15} /> <span className="xs:hidden md:inline">Edit</span></button>
                                             
                                            </h3>
                                            :    <button className="border bg-secondary text-white hover:opacity-90 duration-300 sm:py-1 sm:px-2 xs:py-1 xs:px-1 text-[11px] rounded-md ml-auto mt-7" onClick={()=>{setShowLoader(true);router.push(
                                                { pathname: `/courses/${data.id}`},
                                                "/courses/"+data.id
                                                )}}>Continue Course</button> 
                                            }
                                    
                            
                            
                                            
                                            </div>
                                        
                                        </div>
                                    )
                                    })
                                }
                            </div>
                      
                          
                            </>
                            :
                            <div className="text-center !min-h-screen">
                                <p className="my-7 w-full xs:text-xs md:text-sm mt-14">You don&apos;t have any course yet</p>
                                { !session?.user?.admin &&
                                      <Link href="/courses" onClick={()=>{setShowLoader(true)}} className="bg-secondary py-2 px-4 rounded-lg text-white  hover:opacity-90 duration-300">Browse Courses</Link>
                                }
                              
                            </div>
                          

                        }
                    
                
                    </div>
                </div>
            }
        </>
        <>
            {
                courseModal &&
                <div className="border-t border-gray-200  xs:px-6 lg:px-0">
                    <div className="custom-container">
                        <div className=" bg-white rounded-md relative pt-14">
                            <span className="absolute top-2 right-3 md:text-sm xs:text-xs hover:text-gray-500 cursor-pointer duration-300 inline-flex gap-2 items-center text-secondary font-semibold" onClick={()=>{setCourseModal(false);setLoaded(0)}}><BsArrowBarLeft/> Back</span>
                            <div className="">
                                <form onSubmit={courseUpdate} method="POST" className="w-full">
                                    <h2 className="text-black mb-3 md:text-2xl xs:text-xl font-semibold">
                                        Edit Course
                                    </h2>
                                    <div className="md:flex gap-6 items-center">
                                        <div className="md:w-3/5">
                                            <div className="mb-3">
                                            <label htmlFor="title" className="text-sm text-gray-400">Title</label>
                                            <input type="text" name="title" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Title" defaultValue={currentCourse.title} id="title"/>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="text-sm text-gray-400">Description</label>
                                                <textarea name="description" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm outline-none shadow-none resize-none" placeholder="Course Description" defaultValue={currentCourse.description.slice(0,200)+'...'} id="description" rows={6}/>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="text-sm text-gray-400" >Price</label>
                                                <input type="number" name="price" className="bg-slate-100 w-full p-2 px-3 rounded-lg text-sm" placeholder="Course Price" defaultValue={currentCourse.price} id="ptitle" step=".01"/>
                                            </div>
                                        </div>
                                        <div className="md:w-2/5">
                                            <div className="mb-3">
                                                <p className="mb-2 text-gray-400 xs:mt-8 md:mt-0">Course Image</p>
                                                <div onClick={()=>{document.getElementById("image").click()}} className="p-2 bg-gray-200 rounded cursor-pointer inline-block w-fit">
                                                    Upload image
                                                </div>
                                                <input type="file"
                                                name="image" hidden onChange={(e)=>{handleImage(e,false)}} id="image" placeholder="Price in $(USD)" className="p-4 px-6 rounded-lg bg-slate-100" accept=".jpg,.jpeg,.png,.svg,.webp" />
                                                <div className="preview-box mt-9">
                                                    <Image src={currentCourse.featuredImage} alt="course-img" className="rounded-lg w-full xs:h-[200px] object-cover" width={300} height={300}/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="md:text-sm xs:text-xs my-2 mb-0">Course Category</p>

                                                <div className="mb-2">
                                                {currentCourse?.categories?.map(data=><span onClick={()=>{
                                                    setCourseCatgoriesUp(prev=>prev.filter((datai)=>datai!==data.id));
                                                    setToast("Category removed save your change","info")
                                                }} className="capitalize mr-1 text-xs text-slate-400 cursor-pointer" key={data.id}>{data.name},</span>)}
                                                </div>
                                                {
                                                    categories.map((c)=><span key={c.id}><input type="checkbox" className="mr-0.5"  value={c.id} onChange={(e)=>{
                                                        if (e.target.checked) {
                                                            setCourseCatgoriesUp(prev=>[...prev,e.target.value])
                                                        }else{
                                                            setCourseCatgoriesUp(prev=>prev.filter((data)=>data!==e.target.value))
                                                        }
                                                      
                                                    }}/><span className="capitalize mr-3 text-xs">{c.name}</span></span>)
                                                }
                                            </div>
                                        </div>
                                     
                                    </div>
                                    

                                    
                                    
                                
                                
                                
                                <button type="submit" className=" w-fit py-3 px-6 bg-secondary text-white rounded-lg mt-3 md:text-sm xs:text-xs">Save Changes</button>
                                    
                                

                                        
                                </form>
                            </div>
                            <h3 className="text-xl font-medium mb-1 mt-14">Course Lessons</h3>
                            <div className="md:flex gap-9 md:mt-7">
                                <div className="md:w-3/5 xs:mb-14">
                                
                                    {
                                        currentCourse.lessons.length!==0? <>
                                        {
                                                currentCourse.lessons.map((data,i)=>
                                                <div className="flex gap-2 border-b border-t py-2 border-gray-100" key={data.id}>
                                                    <p className="xs:text-xs md:text-xs">{i+1})</p>
                                                    <h1 className="xs:text-xs md:text-xs">{data.title?.length>30? data.title.slice(0,30)+'...':data.title}</h1>
                                                    <p className="ml-auto xs:text-xs md:text-xs font-bold">{data.duration}</p>
                                                </div>
                                                )
                                        }
                                            
                                        </>:<p className="!min-h-fit text-sm">No lessons for this course</p>
                                    }
                                </div>
                                <div className="md:w-2/5  mb-7">
                                
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
                                        <input type="file" name="video" hidden onChange={handleChange} required id="vid" accept=".mp4,.mkv" />
                                        <div className="preview-box2">
                                            
                                        </div>
                                    
                
                                    <button type="submit" className=" w-full py-3 bg-secondary text-white rounded-lg mt-3 text-sm">Save</button>
                                    </form>
                                
                                </div>
                            </div>
                            <h3 className="text-xl font-medium mb-1 mt-14">Course Students</h3>
                            <div className="md:flex gap-9 md:mt-7">
                                <div className="md:w-3/5 xs:mb-14">
                                
                                    {
                                        currentCourse.students.length!==0? <>
                                        {
                                                currentCourse.students.map((data,i)=>
                                                <div className="flex gap-2 border-b border-t py-2 border-gray-100" key={data.id}>
                                                    <p className="xs:text-xs md:text-xs">{i+1})</p>
                                                    <h1 className="xs:text-xs md:text-xs">{data.fullName}</h1>
                                                    <p className="ml-auto hover:text-red-500 duration-300 cursor-pointer" onClick={()=>removeStudent(data.id)}><BiTrash/></p>
                                                   
                                                </div>
                                                )
                                        }
                                            
                                        </>:<p className="!min-h-fit text-sm">No Students for this course</p>
                                    }
                                </div>
                            
                            </div>
                            
                        </div>
                    </div>
                </div>
               
                
            }
        
        </>
 
        <Footer/>
    </>
   
  );
}

export default Course;
