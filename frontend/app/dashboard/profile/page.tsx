'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProfilePage() {
    const { user, token, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await res.json();

            if (res.ok) {
                updateUser(data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-foreground-secondary">
                    Manage your account information and preferences.
                </p>
            </div>

            {/* Profile Card */}
            <div className="card p-8">
                {/* Avatar */}
                <div className="flex items-center gap-6 pb-8 mb-8 border-b border-border">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-foreground-secondary">{user?.email}</p>
                        <p className="text-sm text-foreground-secondary mt-1">
                            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Message */}
                    {message && (
                        <div
                            className={`p-4 rounded-lg animate-fade-in ${message.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="Your name"
                            disabled={loading}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner spinner-sm"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="card p-8 border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-foreground-secondary text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="btn btn-danger btn-sm" disabled>
                    Delete Account
                </button>
            </div>
        </div>
    );
}
