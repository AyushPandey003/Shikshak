'use client';

import React, { useState } from 'react';

interface IngestResult {
    job_id: string;
    status: string;
    message: string;
    blob_name?: string;
}

interface QueryResult {
    answer: string;
    sources: Array<{
        chunk_id: string;
        score: number;
        source_uri: string;
        source_type: string;
        text_preview: string;
    }>;
    debug: {
        search_latency_ms: number;
        llm_latency_ms: number;
        total_latency_ms: number;
        chunks_retrieved: number;
    };
}

interface HealthResult {
    status: string;
    ragService: any;
    proxyService: string;
    queueService?: string;
}

const RAG_BASE_URL = 'http://localhost:4005/api/rag';

export default function TestUploadPage() {
    // States for Ingest
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [courseId, setCourseId] = useState('15');
    const [moduleId, setModuleId] = useState('7');
    const [sourceType, setSourceType] = useState<'pdf' | 'docx' | 'txt' | 'video' | 'notes'>('pdf');
    const [videoId, setVideoId] = useState('');
    const [notesId, setNotesId] = useState('');
    const [ingestLoading, setIngestLoading] = useState(false);
    const [ingestResult, setIngestResult] = useState<IngestResult | null>(null);
    const [ingestError, setIngestError] = useState<string | null>(null);

    // States for Query
    const [queryText, setQueryText] = useState('');
    const [queryLoading, setQueryLoading] = useState(false);
    const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
    const [queryError, setQueryError] = useState<string | null>(null);

    // States for Health
    const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
    const [healthLoading, setHealthLoading] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState<'ingest' | 'query' | 'health'>('ingest');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleIngest = async () => {
        if (!selectedFile) {
            setIngestError('Please select a file');
            return;
        }

        setIngestLoading(true);
        setIngestError(null);
        setIngestResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('course_id', courseId);
            formData.append('module_id', moduleId);
            formData.append('source_type', sourceType);

            if (sourceType === 'video' && videoId) {
                formData.append('video_id', videoId);
            }
            if (sourceType === 'notes' && notesId) {
                formData.append('notes_id', notesId);
            }

            const response = await fetch(`${RAG_BASE_URL}/ingest`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Ingestion failed');
            }

            setIngestResult(data);
        } catch (err: any) {
            setIngestError(err.message || 'Failed to ingest document');
        } finally {
            setIngestLoading(false);
        }
    };

    const handleQuery = async () => {
        if (!queryText.trim()) {
            setQueryError('Please enter a question');
            return;
        }

        setQueryLoading(true);
        setQueryError(null);
        setQueryResult(null);

        try {
            const response = await fetch(`${RAG_BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: queryText,
                    course_id: courseId,
                    module_id: moduleId,
                    top_k: 5,
                    include_sources: true,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Query failed');
            }

            setQueryResult(data);
        } catch (err: any) {
            setQueryError(err.message || 'Failed to query RAG');
        } finally {
            setQueryLoading(false);
        }
    };

    const handleHealthCheck = async () => {
        setHealthLoading(true);
        try {
            const response = await fetch(`${RAG_BASE_URL}/health`);
            const data = await response.json();
            setHealthResult(data);
        } catch (err: any) {
            setHealthResult({ status: 'error', ragService: err.message, proxyService: 'unknown' });
        } finally {
            setHealthLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        RAG Service <span className="text-blue-400">Test Console</span>
                    </h1>
                    <p className="text-gray-400">Test ingest, query, and health endpoints</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 bg-gray-800/50 p-1 rounded-xl">
                    {['ingest', 'query', 'health'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Ingest Tab */}
                {activeTab === 'ingest' && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6">📤 Ingest Document</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Course ID *</label>
                                <input
                                    type="text"
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 15"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Module ID *</label>
                                <input
                                    type="text"
                                    value={moduleId}
                                    onChange={(e) => setModuleId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 7"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Source Type *</label>
                            <select
                                value={sourceType}
                                onChange={(e) => setSourceType(e.target.value as any)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="pdf">PDF</option>
                                <option value="docx">DOCX</option>
                                <option value="txt">TXT</option>
                                <option value="video">Video</option>
                                <option value="notes">Notes</option>
                            </select>
                        </div>

                        {sourceType === 'video' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Video ID *</label>
                                <input
                                    type="text"
                                    value={videoId}
                                    onChange={(e) => setVideoId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., vid_12345"
                                />
                            </div>
                        )}

                        {sourceType === 'notes' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Notes ID *</label>
                                <input
                                    type="text"
                                    value={notesId}
                                    onChange={(e) => setNotesId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., notes_456"
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">File *</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-gray-400">
                                            {selectedFile ? (
                                                <span className="text-blue-400 font-medium">{selectedFile.name}</span>
                                            ) : (
                                                <>Click to upload or drag and drop</>
                                            )}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt,.mp4,.mov,.avi,.webm" />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleIngest}
                            disabled={ingestLoading || !selectedFile}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg"
                        >
                            {ingestLoading ? 'Uploading...' : 'Ingest Document'}
                        </button>

                        {ingestError && (
                            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                                ❌ {ingestError}
                            </div>
                        )}

                        {ingestResult && (
                            <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
                                <h3 className="text-green-400 font-bold mb-2">✅ Ingestion Queued!</h3>
                                <pre className="text-sm text-gray-300 overflow-auto">
                                    {JSON.stringify(ingestResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Query Tab */}
                {activeTab === 'query' && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6">🔍 Query RAG</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Course ID (filter)</label>
                                <input
                                    type="text"
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Module ID (filter)</label>
                                <input
                                    type="text"
                                    value={moduleId}
                                    onChange={(e) => setModuleId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Question *</label>
                            <textarea
                                value={queryText}
                                onChange={(e) => setQueryText(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Ask a question about the ingested documents..."
                            />
                        </div>

                        <button
                            onClick={handleQuery}
                            disabled={queryLoading || !queryText.trim()}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg"
                        >
                            {queryLoading ? 'Querying...' : 'Ask Question'}
                        </button>

                        {queryError && (
                            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                                ❌ {queryError}
                            </div>
                        )}

                        {queryResult && (
                            <div className="mt-6 space-y-4">
                                <div className="p-6 bg-blue-900/30 border border-blue-700/50 rounded-xl">
                                    <h3 className="text-blue-400 font-bold mb-3">💡 Answer</h3>
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{queryResult.answer}</p>
                                </div>

                                {queryResult.sources.length > 0 && (
                                    <div className="p-6 bg-gray-700/30 border border-gray-600/50 rounded-xl">
                                        <h3 className="text-gray-300 font-bold mb-3">📚 Sources ({queryResult.sources.length})</h3>
                                        <div className="space-y-3">
                                            {queryResult.sources.map((source, idx) => (
                                                <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs text-blue-400">{source.source_type.toUpperCase()}</span>
                                                        <span className="text-xs text-green-400">Score: {(source.score * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 line-clamp-2">{source.text_preview}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-gray-700/30 border border-gray-600/50 rounded-xl">
                                    <h3 className="text-gray-300 font-bold mb-2">⏱️ Performance</h3>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span>Search: {queryResult.debug.search_latency_ms.toFixed(0)}ms</span>
                                        <span>LLM: {queryResult.debug.llm_latency_ms.toFixed(0)}ms</span>
                                        <span>Total: {queryResult.debug.total_latency_ms.toFixed(0)}ms</span>
                                        <span>Chunks: {queryResult.debug.chunks_retrieved}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Health Tab */}
                {activeTab === 'health' && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6">🏥 Health Check</h2>

                        <button
                            onClick={handleHealthCheck}
                            disabled={healthLoading}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-xl transition-all shadow-lg mb-6"
                        >
                            {healthLoading ? 'Checking...' : 'Check Health'}
                        </button>

                        {healthResult && (
                            <div className={`p-6 rounded-xl border ${healthResult.status === 'healthy'
                                    ? 'bg-green-900/30 border-green-700/50'
                                    : 'bg-yellow-900/30 border-yellow-700/50'
                                }`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`w-4 h-4 rounded-full ${healthResult.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`} />
                                    <span className="text-xl font-bold text-white capitalize">{healthResult.status}</span>
                                </div>
                                <pre className="text-sm text-gray-300 overflow-auto">
                                    {JSON.stringify(healthResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>RAG Service Test Console v1.0</p>
                    <p className="mt-1">Endpoint: <code className="text-blue-400">{RAG_BASE_URL}</code></p>
                </div>
            </div>
        </div>
    );
}
