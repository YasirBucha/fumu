'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface QueueStatus {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    total: number;
}

export default function VideoQueuePage() {
    const { user, isLoaded } = useUser();
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchQueueStatus();
            // Poll for updates every 5 seconds
            const interval = setInterval(fetchQueueStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [isLoaded, user]);

    const fetchQueueStatus = async () => {
        try {
            const response = await fetch('/api/video/queue/status');

            if (response.ok) {
                const data = await response.json();
                setQueueStatus(data.data);
            } else {
                setError('Failed to fetch queue status');
            }
        } catch (err) {
            setError('Failed to fetch queue status');
            console.error('Error fetching queue status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePauseQueue = async () => {
        try {
            const response = await fetch('/api/video/queue/pause', { method: 'POST' });

            if (response.ok) {
                await fetchQueueStatus();
            } else {
                setError('Failed to pause queue');
            }
        } catch (err) {
            setError('Failed to pause queue');
            console.error('Error pausing queue:', err);
        }
    };

    const handleResumeQueue = async () => {
        try {
            const response = await fetch('/api/video/queue/resume', { method: 'POST' });

            if (response.ok) {
                await fetchQueueStatus();
            } else {
                setError('Failed to resume queue');
            }
        } catch (err) {
            setError('Failed to resume queue');
            console.error('Error resuming queue:', err);
        }
    };

    const handleCleanQueue = async () => {
        try {
            const response = await fetch('/api/video/queue/clean', { method: 'POST' });

            if (response.ok) {
                await fetchQueueStatus();
            } else {
                setError('Failed to clean queue');
            }
        } catch (err) {
            setError('Failed to clean queue');
            console.error('Error cleaning queue:', err);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Access denied</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Video Processing Queue</h1>
                                <p className="mt-2 text-gray-600">
                                    Monitor and manage video processing jobs
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handlePauseQueue}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                                >
                                    Pause Queue
                                </button>
                                <button
                                    onClick={handleResumeQueue}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Resume Queue
                                </button>
                                <button
                                    onClick={handleCleanQueue}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Clean Queue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Queue Status Cards */}
                {queueStatus && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Waiting</p>
                                    <p className="text-2xl font-bold text-gray-900">{queueStatus.waiting}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active</p>
                                    <p className="text-2xl font-bold text-gray-900">{queueStatus.active}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{queueStatus.completed}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Failed</p>
                                    <p className="text-2xl font-bold text-gray-900">{queueStatus.failed}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{queueStatus.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Queue Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Information</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading queue status...</p>
                        </div>
                    ) : queueStatus ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Queue Statistics</h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Waiting Jobs:</span>
                                            <span className="font-medium">{queueStatus.waiting}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Active Jobs:</span>
                                            <span className="font-medium">{queueStatus.active}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Completed Jobs:</span>
                                            <span className="font-medium">{queueStatus.completed}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Failed Jobs:</span>
                                            <span className="font-medium">{queueStatus.failed}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Total Jobs:</span>
                                            <span className="font-medium">{queueStatus.total}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Queue Management</h3>
                                    <p className="text-gray-600 mb-4">
                                        Use the controls above to manage the video processing queue.
                                        The queue automatically processes jobs in order, with a maximum
                                        concurrency of 2 jobs.
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            • <strong>Pause Queue:</strong> Temporarily stop processing new jobs
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            • <strong>Resume Queue:</strong> Resume processing paused jobs
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            • <strong>Clean Queue:</strong> Remove old completed and failed jobs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Failed to load queue status</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
