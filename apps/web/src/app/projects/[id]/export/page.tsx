'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';

interface Project {
    id: string;
    title: string;
    description: string;
    scenes: Scene[];
}

interface Scene {
    id: string;
    prompt: string;
    imageUrl: string | null;
    videoUrl: string | null;
    status: string;
    order: number;
}

interface ExportOptions {
    resolution: string;
    quality: string;
    format: string;
    includeAudio: boolean;
    backgroundMusic?: {
        url: string;
        volume: number;
    };
    transitions: string;
    transitionDuration: number;
}

interface ExportJob {
    id: string;
    status: string;
    videoUrl?: string;
    error?: string;
}

export default function VideoExportPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [exportJob, setExportJob] = useState<ExportJob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        resolution: '1920x1080',
        quality: 'high',
        format: 'mp4',
        includeAudio: true,
        transitions: 'fade',
        transitionDuration: 0.5,
    });

    useEffect(() => {
        if (isLoaded && user && projectId) {
            fetchProject();
        }
    }, [isLoaded, user, projectId]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectId}`);

            if (response.ok) {
                const data = await response.json();
                setProject(data.data);
            } else {
                setError('Failed to fetch project');
            }
        } catch (err) {
            setError('Failed to fetch project');
            console.error('Error fetching project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            setError(null);

            const response = await fetch('/api/video/compose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    options: exportOptions,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setExportJob(data.data);

                // Start polling for status
                pollExportStatus(data.data.jobId);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to start export');
            }
        } catch (err) {
            setError('Failed to start export');
            console.error('Export error:', err);
        } finally {
            setExporting(false);
        }
    };

    const pollExportStatus = async (jobId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/video/status/${jobId}`);

                if (response.ok) {
                    const data = await response.json();
                    const status = data.data;

                    setExportJob(prev => prev ? {
                        ...prev,
                        status: status.status,
                        videoUrl: status.videoUrl,
                        error: status.error,
                    } : null);

                    if (status.status === 'completed' || status.status === 'failed') {
                        clearInterval(pollInterval);
                    }
                }
            } catch (err) {
                console.error('Error polling export status:', err);
                clearInterval(pollInterval);
            }
        }, 2000);

        // Clear interval after 5 minutes
        setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            case 'processing':
                return 'text-blue-600 bg-blue-100';
            case 'queued':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
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
        router.push('/');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Project not found</p>
                    <button
                        onClick={() => router.push('/projects')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const completedScenes = project.scenes.filter(scene => scene.status === 'completed');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Export Video</h1>
                                <p className="mt-2 text-gray-600">
                                    Export your project "{project.title}" as a complete video
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/projects/${projectId}`)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Project Summary */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Scenes</p>
                            <p className="text-2xl font-bold text-gray-900">{project.scenes.length}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Scenes</p>
                            <p className="text-2xl font-bold text-gray-900">{completedScenes.length}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ready for Export</p>
                            <p className={`text-2xl font-bold ${completedScenes.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {completedScenes.length > 0 ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resolution */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resolution
                            </label>
                            <select
                                value={exportOptions.resolution}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, resolution: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="1280x720">HD (720p)</option>
                                <option value="1920x1080">Full HD (1080p)</option>
                                <option value="2560x1440">2K (1440p)</option>
                                <option value="3840x2160">4K (2160p)</option>
                            </select>
                        </div>

                        {/* Quality */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quality
                            </label>
                            <select
                                value={exportOptions.quality}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, quality: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low (Smaller file size)</option>
                                <option value="medium">Medium (Balanced)</option>
                                <option value="high">High (Better quality)</option>
                                <option value="ultra">Ultra (Best quality)</option>
                            </select>
                        </div>

                        {/* Format */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Format
                            </label>
                            <select
                                value={exportOptions.format}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="mp4">MP4 (Recommended)</option>
                                <option value="mov">MOV (Apple devices)</option>
                                <option value="webm">WebM (Web optimized)</option>
                            </select>
                        </div>

                        {/* Transitions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transitions
                            </label>
                            <select
                                value={exportOptions.transitions}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, transitions: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="none">No transitions</option>
                                <option value="fade">Fade</option>
                                <option value="slide">Slide</option>
                                <option value="dissolve">Dissolve</option>
                            </select>
                        </div>
                    </div>

                    {/* Audio Options */}
                    <div className="mt-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.includeAudio}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, includeAudio: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                Include audio (if available)
                            </span>
                        </label>
                    </div>
                </div>

                {/* Export Status */}
                {exportJob && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Status</h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(exportJob.status)}`}>
                                    {exportJob.status}
                                </span>
                                {exportJob.status === 'processing' && (
                                    <div className="ml-4 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}
                            </div>
                            {exportJob.status === 'completed' && exportJob.videoUrl && (
                                <a
                                    href={exportJob.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Download Video
                                </a>
                            )}
                        </div>
                        {exportJob.error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{exportJob.error}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Export Button */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        {completedScenes.length === 0 ? (
                            <div>
                                <p className="text-gray-600 mb-4">
                                    No completed scenes found. Please complete some scenes before exporting.
                                </p>
                                <button
                                    onClick={() => router.push(`/projects/${projectId}`)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Back to Project
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleExport}
                                disabled={exporting || (exportJob?.status === 'processing')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting || (exportJob?.status === 'processing') ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    'Export Video'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
