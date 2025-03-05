import { Navbbar } from "./Navbar"
import { Outlet } from "react-router-dom"

export function Layout() {
    return (
        <>
            <Navbbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}