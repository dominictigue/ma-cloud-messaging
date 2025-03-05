import { Link } from "react-router-dom"

export function Navbbar() {
    return (
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
            <button id="menu-btn" class="text-white hover:text-gray-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
                </svg>
            </button>
            <Link to="/" className ="navItem">
                <span class="text-xl font-bold tracking-wide">Warehouse Order Manager</span>
            </Link>
            <div></div>
        </div>
    )
}