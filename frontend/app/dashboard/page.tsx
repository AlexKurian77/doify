'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Clock, Zap, CheckCircle, Plus, User, Clipboard } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
}

interface Stats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/tasks?sortBy=createdAt&order=desc`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
                setTasks(data.tasks.slice(0, 5)); // Get latest 5 tasks

                // Calculate stats
                const allTasks = data.tasks;
                setStats({
                    total: allTasks.length,
                    pending: allTasks.filter((t: Task) => t.status === 'pending').length,
                    inProgress: allTasks.filter((t: Task) => t.status === 'in-progress').length,
                    completed: allTasks.filter((t: Task) => t.status === 'completed').length,
                });
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="badge badge-warning">Pending</span>;
            case 'in-progress':
                return <span className="badge badge-info">In Progress</span>;
            case 'completed':
                return <span className="badge badge-success">Completed</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <span className="badge badge-error">High</span>;
            case 'medium':
                return <span className="badge badge-warning">Medium</span>;
            case 'low':
                return <span className="badge badge-success">Low</span>;
            default:
                return <span className="badge">{priority}</span>;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!
                </h1>
                <p className="text-foreground-secondary">
                    Here's an overview of your tasks and productivity.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{loading ? '-' : stats.total}</p>
                    <p className="text-sm text-foreground-secondary">Total Tasks</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{loading ? '-' : stats.pending}</p>
                    <p className="text-sm text-foreground-secondary">Pending</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{loading ? '-' : stats.inProgress}</p>
                    <p className="text-sm text-foreground-secondary">In Progress</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{loading ? '-' : stats.completed}</p>
                    <p className="text-sm text-foreground-secondary">Completed</p>
                </div>
            </div>

            {/* Quick Actions & Recent Tasks */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/tasks"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium">Create New Task</p>
                                <p className="text-sm text-foreground-secondary">Add a new task to your list</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium">Update Profile</p>
                                <p className="text-sm text-foreground-secondary">Manage your account settings</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Tasks</h2>
                        <Link href="/dashboard/tasks" className="text-sm text-primary-500 hover:text-primary-600">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton h-16 w-full"></div>
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-8">
                            <Clipboard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-foreground-secondary mb-4">No tasks yet</p>
                            <Link href="/dashboard/tasks" className="btn btn-primary btn-sm">
                                Create your first task
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-background-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{task.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getStatusBadge(task.status)}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                    </div>
                                    {task.dueDate && (
                                        <p className="text-sm text-foreground-secondary ml-4">
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
