import { Link, Route, Routes } from "react-router";
import AIPage from "./pages/ai";
import BloodSugarPage from "./pages/bloodsugar";
import HomePage from "./pages/home";

const ROUTES = [
    { path: "/", element: <HomePage /> },
    { path: "/ai/", element: <AIPage /> },
    { path: "/ai/:question", element: <AIPage /> },
    { path: "/bloodsugar", element: <BloodSugarPage /> },
];

export default function Layout() {

    return (
        <div className="min-h-screen flex flex-col">

            <div className="flex-grow">

                <Routes>
                    {ROUTES.map((r) => (
                        <Route
                            key={r.path}
                            path={r.path}
                            element={r.element}
                        />
                    ))}
                </Routes>

            </div>

            <div className="p-5 bg-base-300">

                <Link to="/">
                    <button className="btn btn-ghost">
                        Home
                    </button>
                </Link>

                <Link to="/ai">
                    <button className="btn btn-ghost">
                        AI
                    </button>
                </Link>



                <Link to="/bloodsugar">
                    <button className="btn btn-ghost">
                        Detail
                    </button>
                </Link>

            </div>

        </div>
    );
}