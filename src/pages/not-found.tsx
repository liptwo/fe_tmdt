import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist or updated yet.</p>
            <Link to="/" className="bg-[#df523b] text-white px-4 py-2 rounded-md">Go to Home</Link>
        </div>
    )
}
