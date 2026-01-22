'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, User } from 'lucide-react';

const navItems = [
    {
        name: 'Overview',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'Tasks',
        href: '/dashboard/tasks',
        icon: ClipboardCheck,
    },
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: User,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card-bg border-r border-border">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src="/icon.png" alt="Doify" width={32} height={32} />
                    </div>
                    <span className="text-xl font-bold text-foreground">Doify</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-foreground-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <div className="card p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
                    <p className="text-sm text-foreground-secondary">
                        Need help? Check our{' '}
                        <a href="#" className="text-primary-500 hover:underline">
                            documentation
                        </a>
                    </p>
                </div>
            </div>
        </aside>
    );
}
