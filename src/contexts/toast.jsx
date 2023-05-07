import React, { useEffect, useState } from "react";

export const ToastContext = React.createContext();



export const ToastProvider = (props) => {
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('success')

  const setToast = (message, status) => {
    setMessage(message)
    setStatus(status)
    setShowToast(true)
  }
  return (
    <ToastContext.Provider
      value={{ message, status, showToast, setShowToast, setToast }}
    >
      {props.children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
