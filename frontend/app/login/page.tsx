'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    // Validation state
    const [touched, setTouched] = useState({ email: false, password: false });

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const emailError = touched.email && !validateEmail(email) ? 'Please enter a valid email' : '';
    const passwordError = touched.password && password.length < 6 ? 'Password must be at least 6 characters' : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate
        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">Doify</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="card p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
                    <p className="text-foreground-secondary text-center mb-8">
                        Sign in to your account to continue
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="label">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                className={`input ${emailError ? 'input-error' : ''}`}
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                            {emailError && <p className="error-text">{emailError}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                className={`input ${passwordError ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            {passwordError && <p className="error-text">{passwordError}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner spinner-sm"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-foreground-secondary mt-6">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-primary-500 hover:text-primary-600 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <p className="text-center mt-6">
                    <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </div>
    );
}
