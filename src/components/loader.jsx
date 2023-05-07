import React, { useContext } from "react";
import { LoaderContext } from "@/contexts/loader";


function Loader() {
  const { showLoader } = useContext(LoaderContext);

  return (
    <>
      {showLoader === true ? (
        <div className="flex justify-center items-center fixed h-full w-full bg-black opacity-70 z-[999999]">
          <span className="loader"></span>
        </div>

      ) : null}
    </>
  );
}

export default Loader;