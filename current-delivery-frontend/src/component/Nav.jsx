
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav({ admin = false }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
      <Logo />

      {/* Hamburger for mobile */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex gap-4 font-bold">
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About Us</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/blog">Blog</Link>
         <LanguageSwitcher />
        {!admin && (
          <Link
            to="/track"
            className="text-white rounded-2xl bg-blue-700 p-2 font-bold"
          >
            Track
          </Link>
        )}
      </div>

      {/* Right side: Login/Admin */}
      <div className="hidden md:flex gap-2 items-center">
        {localStorage.getItem('token') ? (
          <button onClick={logout} className="text-red-500 font-bold">
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        )}
        <Link to="/signup" className="text-amber-600 font-bold">
          Admin
        </Link>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-20  left-0 w-full bg-white shadow-md flex flex-col gap-2 p-4 md:hidden">
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link to="/faq" onClick={() => setIsOpen(false)}>
            FAQ
          </Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>
            Blog 
          </Link>
          {!admin && (
            <Link
              to="/track"
              onClick={() => setIsOpen(false)}
              className="text-white bg-blue-700 rounded-2xl p-2 font-bold text-center"
            >
              Track
            </Link>
          )}
          {localStorage.getItem('token') ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="text-red-500 font-bold"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 font-bold"
            >
              Login
            </Link>
          )}
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="text-amber-600 font-bold"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
 