
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Nav({ admin = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between relative">
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
        <Link to="/">{t('Home')}</Link>
        <Link to="/contact">{t('Contact')}</Link>
        <Link to="/about">{t('About Us')}</Link>
        <Link to="/faq">{t('FAQ')}</Link>
        <Link to="/blog">{t('Blog')}</Link>
        <LanguageSwitcher />
        {!admin && (
          <Link
            to="/track"
            className="text-white rounded-2xl bg-blue-700 p-2 font-bold"
          >
            {t('Track')}
          </Link>
        )}
      </div>

      {/* Right side: Login/Admin */}
      <div className="hidden md:flex gap-2 items-center">
        {isLoggedIn ? (
          <button onClick={logout} className="text-red-500 font-bold">
            {t('Logout')}
          </button>
        ) : (
          <Link to="/login" className="text-blue-600 font-bold">
            {t('Login')}
          </Link>
        )}
        <Link to="/signup" className="text-amber-600 font-bold">
          {t('Admin')}
        </Link>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-2 p-4 md:hidden z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>
            {t('Home')}
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            {t('Contact')}
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            {t('About Us')}
          </Link>
          <Link to="/faq" onClick={() => setIsOpen(false)}>
            {t('FAQ')}
          </Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>
            {t('Blog')}
          </Link>
          {!admin && (
            <Link
              to="/track"
              onClick={() => setIsOpen(false)}
              className="text-white bg-blue-700 rounded-2xl p-2 font-bold text-center"
            >
              {t('Track')}
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="text-red-500 font-bold"
            >
              {t('Logout')}
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 font-bold"
            >
              {t('Login')}
            </Link>
          )}
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="text-amber-600 font-bold"
          >
            {t('Admin')}
          </Link>
        </div>
      )}
    </nav>
  );
}
