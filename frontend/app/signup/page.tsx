'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    // Validation state
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const nameError = touched.name && name.length < 2 ? 'Name must be at least 2 characters' : '';
    const emailError = touched.email && !validateEmail(email) ? 'Please enter a valid email' : '';
    const passwordError = touched.password && password.length < 6 ? 'Password must be at least 6 characters' : '';
    const confirmError = touched.confirmPassword && password !== confirmPassword ? 'Passwords do not match' : '';

    // Password strength
    const getPasswordStrength = () => {
        if (password.length === 0) return { level: 0, text: '', color: '' };
        if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
        if (password.length < 8) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { level: 4, text: 'Strong', color: 'bg-green-500' };
        return { level: 3, text: 'Good', color: 'bg-blue-500' };
    };

    const passwordStrength = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate
        if (name.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await signup(name, email, password);
        setLoading(false);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Signup failed');
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
                    <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
                    <p className="text-foreground-secondary text-center mb-8">
                        Start managing your tasks today
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                                className={`input ${nameError ? 'input-error' : ''}`}
                                placeholder="John Doe"
                                disabled={loading}
                            />
                            {nameError && <p className="error-text">{nameError}</p>}
                        </div>

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

                            {/* Password Strength */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-foreground-secondary mt-1">
                                        Password strength: {passwordStrength.text}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
                                className={`input ${confirmError ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            {confirmError && <p className="error-text">{confirmError}</p>}
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-foreground-secondary mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                            Sign in
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
