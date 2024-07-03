"use client"

import { Fragment,useEffect,useState } from "react";
import HomePage from "./component/HomePage/page"
import Loading from "./loading"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <HomePage/>
    </Fragment>
  );
}
