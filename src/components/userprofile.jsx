import React, { useContext } from 'react'
import {RiUserSettingsLine} from "react-icons/ri"
import {CiLogout} from "react-icons/ci"

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import { BsBookmarkStar,BsBook } from 'react-icons/bs'
import { useRouter } from 'next/router'
import Image from 'next/image'
import LoaderContext from '@/contexts/loader'

export default  function UserProfile(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const  router=useRouter()
    const {setShowLoader}=useContext(LoaderContext)
  
    return (
      <>
        <a className='cursor-pointer' ref={btnRef}  onClick={onOpen}>
            {
               props.session?.user?.profile?.Image ? <Image src={props.session?.user?.profile?.Image} alt="profile-pic" width={200} height={200}/> : <div className="flex justify-center items-center xs:h-9 xs:w-9 xs:text-sm md:w-12 md:h-12 rounded-full  bg-gray-500 text-white font-semibold cursor-pointer uppercase lg:text-xl">{props.session?.user?.name.match(/\b(\w)/g).join('')}</div>
            }
        </a>
    
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton color={'white'}/>
            <div className=' bg-draw'>
            <DrawerHeader>
                
                <div className=''>
                    {
                    props.session?.user?.profile?.Image ? <Image src={props.session?.user?.profile?.Image} alt="profile-pic" width={200} height={200}/> : <div className="flex justify-center items-center w-16 h-16 rounded-full  bg-[rgb(225,225,225,0.4)] text-white font-semibold uppercase text-3xl ">{props.session?.user?.name.match(/\b(\w)/g).join('')}</div>
                    }
                    <div>
                        <p className='text-md capitalize text-white'>{props.session?.user.name}</p>
                        <p className='text-xs mb-0.5 text-white'>{props.session?.user.email}</p>
                        {/* <p className='text-xs '><a className='cursor-pointer bg-secondary px-1 rounded-sm inline-block text-white'>2</a> courses ongoing</p> */}
                    </div>
                </div>
            </DrawerHeader>
            </div>
           

            <DrawerBody>
                <div className='mt-7'>
                    <div className='flex items-center gap-3 cursor-pointer custom-hover p-3 py-4 rounded-md duration-300'>
                        <RiUserSettingsLine size={20} className='text-gray-700'/>
                        <h2 className='text-black font-semibold text-[14px]'>Edit profile</h2>
                    </div>
                    <div className='flex items-center gap-3 cursor-pointer custom-hover p-3 py-4 rounded-md duration-300' onClick={(e)=>{setShowLoader(true);e.preventDefault();router.push(`/user/courses/${props.session?.id}`)}}>
                        <BsBookmarkStar size={20} className='text-gray-700'/>
                        <h2 className='text-black font-semibold text-[14px]'>My Courses</h2>
                    </div>
                    <div className='flex items-center gap-3 cursor-pointer custom-hover p-3 py-4 rounded-md duration-300'>
                        <BsBook size={20} className='text-gray-700'/>
                        <h2 className='text-black font-semibold text-[14px]'>Create Course</h2>
                    </div>
                </div>
            </DrawerBody>

            <DrawerFooter>
                <div className='flex items-center gap-3 cursor-pointer custom-hover p-3 py-4 rounded-md duration-300' onClick={(e)=>{e.preventDefault() ;signOut({ callbackUrl: '/auth/login' })}}>
                    <CiLogout size={20} className='text-gray-700'/>
                    <h2 className='text-black font-semibold text-[14px]'>Sign out</h2>
                </div>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
      </>
    )
  }