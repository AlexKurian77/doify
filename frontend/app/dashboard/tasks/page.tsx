'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Plus, ClipboardCheck, Pencil, Trash2, Calendar } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
}

interface TaskFormData {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
}

const initialFormData: TaskFormData = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
};

export default function TasksPage() {
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState<TaskFormData>(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Update search when URL params change
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token, search, statusFilter, priorityFilter]);

    const fetchTasks = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (priorityFilter) params.append('priority', priorityFilter);

            const res = await fetch(`${API_URL}/tasks?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setFormData(initialFormData);
        setEditingTask(null);
        setFormError('');
        setModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
        setEditingTask(task);
        setFormError('');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTask(null);
        setFormData(initialFormData);
        setFormError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.title.trim()) {
            setFormError('Title is required');
            return;
        }

        setFormLoading(true);

        try {
            const url = editingTask
                ? `${API_URL}/tasks/${editingTask._id}`
                : `${API_URL}/tasks`;

            const method = editingTask ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    dueDate: formData.dueDate || undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                closeModal();
                fetchTasks();
            } else {
                setFormError(data.message || 'Failed to save task');
            }
        } catch (error) {
            console.error('Save error:', error);
            setFormError('Network error. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setDeleteId(null);
                fetchTasks();
            }
        } catch (error) {
            console.error('Delete error:', error);
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
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Tasks</h1>
                    <p className="text-foreground-secondary">
                        Manage and organize your tasks
                    </p>
                </div>
                <button onClick={openCreateModal} className="btn btn-primary">
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="🔍︎ Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input flex-1 lg:w-40"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="input flex-1 lg:w-40"
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    {/* Clear Filters */}
                    {(search || statusFilter || priorityFilter) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('');
                                setPriorityFilter('');
                            }}
                            className="btn btn-ghost text-foreground-secondary"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Tasks List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-24 w-full rounded-xl"></div>
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="card p-12 text-center">
                    <ClipboardCheck className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                    <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                    <p className="text-foreground-secondary mb-6">
                        {search || statusFilter || priorityFilter
                            ? 'Try adjusting your filters'
                            : 'Get started by creating your first task'}
                    </p>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        Create Task
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="card p-6 card-hover"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold truncate">{task.title}</h3>
                                            {task.description && (
                                                <p className="text-foreground-secondary mt-1 line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                {getStatusBadge(task.status)}
                                                {getPriorityBadge(task.priority)}
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-1 text-sm text-foreground-secondary">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-6">
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(task._id)}
                                        className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h2>

                        {formError && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="label">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input"
                                    placeholder="Enter task title"
                                    disabled={formLoading}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="label">Description</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input min-h-[100px] resize-none"
                                    placeholder="Enter task description"
                                    disabled={formLoading}
                                />
                            </div>

                            {/* Status & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="label">Status</label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="input"
                                        disabled={formLoading}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="priority" className="label">Priority</label>
                                    <select
                                        id="priority"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                        className="input"
                                        disabled={formLoading}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label htmlFor="dueDate" className="label">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="input"
                                    disabled={formLoading}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                    {formLoading ? (
                                        <>
                                            <div className="spinner spinner-sm"></div>
                                            Saving...
                                        </>
                                    ) : editingTask ? (
                                        'Update Task'
                                    ) : (
                                        'Create Task'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                    <div className="relative card p-8 w-full max-w-sm animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">Delete Task?</h2>
                        <p className="text-foreground-secondary mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
