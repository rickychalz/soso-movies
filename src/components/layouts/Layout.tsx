import { Footer } from "./Footer"
import { Header } from "./Header"
import { Outlet } from "react-router-dom";



export const GuestLayout = () => {
  return (
    <>
    <div className="flex flex-col h-screen">
        <Header/>
        <main className="flex-grow">
            <Outlet/>
        </main>
        <Footer/>
    </div>

    </>
  )
}
