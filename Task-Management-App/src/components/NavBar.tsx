import { Link, useLocation } from "react-router";

const routerLinks: { label: string, path: string }[] = [
    { label: "Task List", path: "/" },
    { label: "Add New Task", path: "/add" }
];

const NavBar = ({ appTitle }: { appTitle: string }) => {

    const loc = useLocation();
    
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">  {appTitle} </Link>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                        routerLinks && routerLinks.length > 0 && (
                            routerLinks.map(rl => (
                                <li className="nav-item" key={rl.label}>
                                    <Link className={`nav-link ${loc.pathname===rl.path && "active"}`} to={rl.path}> {rl.label} </Link>
                                </li>
                            ))
                        )
                    }
                </ul>
            </div>
        </nav>
    )
};

export default NavBar;