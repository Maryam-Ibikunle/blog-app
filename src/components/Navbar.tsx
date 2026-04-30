import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold">Blog App</div>
          <div className="hidden md:flex space-x-6">
            <Link to="/home" className="hover:text-gray-300">
              Home
            </Link>

            {token && (
              <Link to="/my-posts" className="hover:text-gray-300">
                My Posts
              </Link>
            )}

            <Link to="#" className="hover:text-gray-300">
              About
            </Link>

            {token ? (
              <button onClick={handleLogout} className="hover:text-gray-300">
                Log Out
              </button>
            ) : (
              <Link to="/" className="hover:text-gray-300">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} color="red" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/home" className="block">
            Home
          </Link>

          {token && (
            <Link to="/my-posts" className="block">
              Posts
            </Link>
          )}

          <Link to="#" className="block">
            About
          </Link>

          {token ? (
            <button onClick={handleLogout} className="block">
              Log Out
            </button>
          ) : (
            <Link to="/" className="block">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
