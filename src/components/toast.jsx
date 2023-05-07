import { Wrap, WrapItem, useToast, Button } from '@chakra-ui/react'
import ToastContext from '@/contexts/toast'
import { useContext, useEffect } from 'react'

export default function Toast() {
    const toast = useToast()
    const { showToast, message, status, setShowToast } = useContext(ToastContext)

    useEffect(() => {
        if (showToast) {
            document.getElementById('toaster').click()
            setShowToast(false)
        }


    }, [showToast, setShowToast])
    return (
        <Button
            id='toaster'
            className='!hidden !z-index-[99999999999999999999999]'
            onClick={() =>
                toast({
                    title: message,
                    status: status,
                    variant: 'subtle',
                    position: 'bottom-right',
                    isClosable: true,
                    containerStyle: {
                        width: '300px',
                        maxWidth: '100%',
                    },
                })
            }
        >

        </Button>



    )
}