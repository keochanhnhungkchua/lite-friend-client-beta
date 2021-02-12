import React,{Suspense} from "react";
import Header from "../Layout/Header"
import Footer from "../Layout/Footer"
export default function Home () {
  return (
    <Suspense fallback={<h3>loading data...</h3>}>
        <Header />
        <Footer />
    </Suspense>
  )
}
