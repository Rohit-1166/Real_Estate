import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 p-4">
      <div className="glass-panel flex items-center justify-between px-6 py-3 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold dark:text-white text-slate-900 tracking-wider">
          <Home className="w-8 h-8 text-primary-500" />
          <span>Real<span className="font-light">Estate</span></span>
        </Link>
        <div className="hidden md:flex gap-6 items-center font-medium text-slate-700 dark:text-slate-300">
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <Link to="/properties" className="hover:text-primary-500 transition-colors">Properties</Link>
          <Link to="/agents" className="hover:text-primary-500 transition-colors">Agents</Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <button className="p-2 bg-slate-900/5 dark:bg-white/5 rounded-full hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10 hidden md:block">
            <Search className="w-5 h-5 dark:text-white text-slate-900" />
          </button>
          <Link to="/login" className="glass-button flex items-center gap-2 !px-4 !py-2">
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
