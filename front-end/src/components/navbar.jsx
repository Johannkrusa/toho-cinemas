import { CgProfile } from "react-icons/cg";

export default function Navbar() {
    return (
        <nav className="sticky top-0 flex items-center justify-between shadow-lg w-full bg-gray-200 h-20 px-4">
            <div className="flex items-center">
                <img 
                    className="h-10" 
                    src="https://www.tohotheater.jp/responsive/images/module/logo-tohocinemas-01.png" 
                    alt="Toho Cinemas Logo" 
                />
            </div>
            <div className="flex space-x-4">
                <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Movies</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Transaction</a>
            </div>
            <div className="flex items-center space-x-2">
                <CgProfile className="text-gray-700" />
                <span className="text-gray-700">Login</span>
            </div>
        </nav>
    );
}
