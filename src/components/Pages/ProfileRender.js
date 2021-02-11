import React,{Suspense} from "react";
import Profile from "./Profile"
export default function Home () {
  return (
    <Suspense fallback={<h3>loading data...</h3>}>
       <Profile/>
    </Suspense>
  )
}
