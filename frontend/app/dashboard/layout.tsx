'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, LogOut, Home, ClipboardCheck, User } from 'lucide-react';

const mobileNavItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardCheck },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-secondary flex">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <header className="h-16 bg-card-bg border-b border-border flex items-center justify-between px-4 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 -ml-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{scale:1.5}}>
                                <img src="/icon.png" alt="Doify" width={32} height={32} />
                            </div>
                        </Link>

                        {/* Spacer for centering user menu */}
                        <div className="hidden lg:flex flex-1"></div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-foreground-secondary">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={logout}
                                className="hidden sm:flex btn btn-sm btn-ghost text-foreground-secondary hover:text-foreground"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden bg-card-bg border-b border-border p-4 animate-slide-in">
                            <nav className="space-y-2">
                                {mobileNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === item.href
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                                : 'text-foreground-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </nav>
                        </div>
                    )}

                    {/* Page Content */}
                    <main className="flex-1 p-4 lg:p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
