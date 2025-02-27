import { Link } from "react-router-dom"

export function Navbbar() {
    return (
        <div className="navbar">
            <Link to="/" className ="navItem">
                <button>
                    Home
                </button>
            </Link>
        </div>
    )
}