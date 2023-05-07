import React, { useEffect, useState } from "react";

export const LoaderContext = React.createContext();



export const LoaderProvider = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  return (
    <LoaderContext.Provider
      value={{ showLoader, setShowLoader }}
    >
      {props.children}
    </LoaderContext.Provider>
  );
}

export default LoaderContext;
