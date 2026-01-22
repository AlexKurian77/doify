'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/icon.png" alt="Doify" width={32} height={32} />
                        </div>
                        <span className="text-xl font-bold text-white">Doify</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/tasks" className="text-gray-300 hover:text-white transition-colors">
                                    Tasks
                                </Link>
                                <Link href="/dashboard/profile" className="text-gray-300 hover:text-white transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="btn btn-sm btn-outline border-white/30 text-white hover:bg-white hover:text-gray-900"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="btn btn-sm btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link href="/dashboard" className="text-gray-300 hover:text-white py-2">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/tasks" className="text-gray-300 hover:text-white py-2">
                                    Tasks
                                </Link>
                                <Link href="/dashboard/profile" className="text-gray-300 hover:text-white py-2">
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="btn btn-outline border-white/30 text-white w-full mt-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link href="/login" className="text-gray-300 hover:text-white py-2">
                                    Login
                                </Link>
                                <Link href="/signup" className="btn btn-primary w-full">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
