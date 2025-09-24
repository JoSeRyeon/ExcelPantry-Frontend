import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/Navbar.css";
import iceCream from "../assets/iceCream.png";

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <img src={iceCream} alt="ExcelPantry" />
                    </Link>

                    <nav className="nav-menu">

                        <Link 
                        to="/search" 
                        className={path.startsWith("/search") ? "active" : ""}>
                            SEARCH
                        </Link>

                        <Link
                            to="/check"
                            className={path.startsWith("/check")  ? "active" : ""}
                        >
                            CHECK
                        </Link>
                        
                    </nav>
                </div>

                <div className="nav-right">

                </div>
            </div>
        </header>
    );
}
