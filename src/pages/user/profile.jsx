import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BiSave, BiStar } from "react-icons/bi";
import prisma from '../../../prisma/db'
import { BsStarFill } from "react-icons/bs";
import LoaderContext from "@/contexts/loader";
import { useSession } from "next-auth/react";
import axios from "axios";
import ToastContext from "@/contexts/toast";
import { useRouter } from "next/router";
export const getServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.setHeader("location", "/auth/login");
        res.statusCode = 302;
        res.end();
        return {
            props: {}
        };
    }

    const user = await prisma.user.findFirst({
        where: {
            id: session?.id
        },
        include: {
            orders: true,
            createdCourses: true
        }

    })




    return {
        props: { user: JSON.parse(JSON.stringify(user)) }
    }
}

export default function Profile(props) {
    const [userImg, setUserImg] = useState()
    const [user,setUser]=useState()
    const [sort,setSort]=useState()
    const [bank,setBank]=useState('')
    const [accName,setAccName]=useState('')
    const [accNo,setAccNo]=useState('')
    const {setShowLoader} = useContext(LoaderContext)
    const {setToast} = useContext(ToastContext)
    const {data:session,update}=useSession()
    const [accountInfoRequired,setAccountInfoRequired]=useState(false)


    useEffect(()=>{
        setShowLoader(false)
        setUser(props.user)
        setSort(props.user.sortCode || '')
    },[])
    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0]
        console.log(file);
        if (file) {
            setUserImg(file)

            const reader = new FileReader()

            reader.onload = () => {

                const userPic = document.getElementById('userpic')
                userPic.setAttribute("src", `${reader.result}`)
                userPic.setAttribute("srcset", `${reader.result}`)

            }
            reader.readAsDataURL(file)
        }

    }
    const handleSort=(e)=>{
        
        e.preventDefault()
        makeRequired()
        if (sort.length>e.target.value.length) {
            if (e.target.value.length===3 || e.target.value.length==6) {
                setSort(e.target.value.slice(0,e.target.value.length-1))
            }else{
                setSort(e.target.value)
            }
           
        }else{
            if (e.target.value.length<=8) {
                if (e.target.value.length===2 || e.target.value.length==5) {
                    setSort(e.target.value+"-")
                }else{
                    setSort(e.target.value)
                }
            }
           
           
        }
      
    
    }
    
    const updateUser = async (e) => {
        e.preventDefault();
     
        const {fullName,email,bio,sortCode,accountName,accountNo,bankName}=e.target
     
        try {
            setShowLoader(true)
            const formData=new FormData()
            if(userImg) {
                formData.set("userPic", userImg);
            }
         
            formData.append("fullName",fullName.value)
            formData.append("id",session?.id)
            formData.append("email",email.value)
            formData.append("bio",bio.value)
            formData.append("sortCode",sortCode.value)
            formData.append("accountName",accountName.value)
            formData.append("accountNo",accountNo.value)
            formData.append("bankName",bankName.value)
         
            
      
            const res= await axios.post(`/api/app/user/update-user`, formData)
            console.log(res.data);
            if (res.data.success) {
    
               console.log(res.data);
                setUser(res.data.user)
               
                setShowLoader(false)
                update({
                    pic:res.data.user.pic
                })
                setToast('Changes Saved','success')
        
         
             
             
          
             
    
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
    const makeRequired=()=>{
        if (bank.length===0 && sort?.length===0 && accName.length===0 && accNo.length===0) {
            setAccountInfoRequired(false)
        }else {
            setAccountInfoRequired(true)
        }
    }
  
    return (
        <>
            <Nav />
            <section className="bg-[url('/group.jpeg')] bg- h-[140px] overlay"></section>
            <section className="-mt-[80px] py-4 xs:px-6 lg:px-0 ">
                <div className="custom-container">
                    <div className="md:flex items-end gap-3 p-3">
                        <div className="cam-hov md:w-1/6 h-32 relative cursor-pointer">
                            <input type="file" id="image-inp" className="hidden" name="userpic" hidden onChange={handleProfileImageUpload} />
                            <div className="  flex flex-col items-center justify-center absolute w-32 h-32 bg-[rgb(0,0,0,0.3)] rounded-full md:invisible xs:opacity-80 md:opacity-100" onClick={() => document.getElementById("image-inp").click()}>

                                <Image src={'/camera2.png'} className="w-12 h-12 object-contain " width={200} height={200} />
                                <p className="text-[11px] text-white ">Change</p>


                            </div>
                            <Image src={user?.pic || '/avatar.jpeg'} id="userpic" className="w-32 h-32 object-cover rounded-full" width={200} height={200} />
                        </div>

                        <div className="w-full ">
                            <div className="flex items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{user?.fullName}</h2>

                                    <h2 className="text-sm"><Link href={`/user/courses/${user?.id}`}> {user?.admin ? user?.createdCourses.length : user?.courseIds.length}</Link> {user?.admin ? user?.createdCourses.length === 1 ? "Course" : "Courses" : user?.courseIds.length === 1 ? "Course" : "Courses"} {user?.admin ? "Created" : "Enrolled"}</h2>
                                    <h2 className="text-xs inline-flex items-center gap-2 "><BsStarFill className="text-secondary text-xs" /> {user?.admin ? "Creator" : "Student"}</h2>
                                </div>
                                <div className="ml-auto inline-block">
                                    <button className="bg-secondary rounded-lg p-2 px-5 text-white inline-flex items-center text-sm gap-1" type="submit" form="update-form"><BiSave size={20} /> Save</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mt-8 mb-3">About Me</h2>
                    <p className="italic">{user?.bio || "Your bio is here"}</p>

                </div>
            </section>
            <section className="py-4 xs:px-6 lg:px-0">
                <div className="custom-container">
                    <form action="" method="POST" onSubmit={updateUser} id="update-form">
                        <h1 className="text-xl font-semibold mb-8 mt-9">Edit your profile</h1>

                        <div className="md:flex gap-7">
                            <div className="md:w-1/2">
                                <div className="mb-4">
                                    <label htmlFor="fullName" className="block text-gray-500 text-sm mb-2">Full Name</label>
                                    <input className=" border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="text" id="fullName" name="fullName" defaultValue={user?.fullName} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-500 text-sm mb-2">Email</label>
                                    <input className="border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="email" id="email" name="email" defaultValue={user?.email} />
                                </div>

                            </div>
                            <div className="md:w-1/2">
                            <div className="mb-4">
                                    <label htmlFor="bio" className="block text-gray-500 text-sm">Bio</label>
                                    <textarea  className="border border-secondary focus:border-secondary outline-none shadow-none  resize-none bg-gray-100 px-4 py-3 w-full rounded-lg" id="bio" name="bio" defaultValue={user?.bio} rows={6}/>
                                </div>
                            </div>
                        </div>
                        {
                            session?.user?.admin &&
                            <>
                              <h1 className="text-xl font-semibold mb-8 mt-9">Account info</h1>
                                      <div className="md:flex gap-7">
                            <div className="md:w-1/2">
                                <div className="mb-4">
                                    <label htmlFor="fullName" className="block text-gray-500 text-sm mb-2">Account Number</label>
                                    <input className=" border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="text" id="accountNo" name="accountNo" defaultValue={user?.accountNo} minLength={8} maxLength={8} required={accountInfoRequired} onChange={(e)=>{
                                       
                                        setAccNo(e.target.value)
                                        makeRequired()
                                        }}/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="fullName" className="block text-gray-500 text-sm mb-2">Sort Code</label>
                                    <input className=" border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="text" id="sortCode" name="sortCode" defaultValue={user?.sortCode} value={sort} placeholder="00-00-00" onChange={handleSort} required={accountInfoRequired}/>
                                </div>
                              
                            </div>
                            <div className="md:w-1/2">
                            <div className="mb-4">
                                    <label htmlFor="fullName" className="block text-gray-500 text-sm mb-2">Bank Name</label>
                                    <input className=" border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="text" id="bankName" name="bankName" defaultValue={user?.bankName} placeholder="e.g Standard Chartered." required={accountInfoRequired} onChange={(e)=>{
                                        setBank(e.target.value);
                                        makeRequired()
                                    }}/>
                                </div>
                            <div className="mb-4">
                                    <label htmlFor="fullName" className="block text-gray-500 text-sm mb-2">Account Name</label>
                                    <input className=" border border-secondary  bg-gray-100 px-4 py-3 w-full rounded-lg" type="text" id="accountName" name="accountName" defaultValue={user?.accountName} placeholder="e.g John Ben Doe" required={accountInfoRequired} onChange={(e)=>{
                                        setAccName(e.target.value)
                                        makeRequired()
                                        }}/>
                                </div>
                            </div>
                        </div>
                            </>
                          
                        }
                       

                    </form>
                </div>
            </section>
            <Footer />
        </>

    )
}