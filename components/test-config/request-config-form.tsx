'use client';

import { useState } from 'react';
import { useTestStore } from '@/lib/store/test-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { HttpMethod, ExecutorType } from '@/types';
import { executorConfigs } from '@/lib/k6/executor-configs';

export function RequestConfigForm() {
    const { currentConfig, setCurrentConfig } = useTestStore();
    const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);

    const handleAddHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const handleRemoveHeader = (index: number) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
        updateHeaders(newHeaders);
    };

    const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
        updateHeaders(newHeaders);
    };

    const updateHeaders = (headersList: Array<{ key: string; value: string }>) => {
        const headersObj: Record<string, string> = {};
        headersList.forEach((h) => {
            if (h.key) headersObj[h.key] = h.value;
        });
        setCurrentConfig({ headers: headersObj });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Executor Selection */}
                <div className="space-y-2">
                    <Label htmlFor="executor">Executor Type</Label>
                    <Select
                        id="executor"
                        value={currentConfig.executor}
                        onChange={(e) => setCurrentConfig({ executor: e.target.value as ExecutorType })}
                    >
                        {Object.entries(executorConfigs).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.name} - {config.description}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Endpoint URL */}
                <div className="space-y-2">
                    <Label htmlFor="endpoint">Endpoint URL</Label>
                    <Input
                        id="endpoint"
                        type="url"
                        placeholder="https://api.example.com/endpoint"
                        value={currentConfig.endpoint}
                        onChange={(e) => setCurrentConfig({ endpoint: e.target.value })}
                    />
                </div>

                {/* HTTP Method */}
                <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select
                        id="method"
                        value={currentConfig.method}
                        onChange={(e) => setCurrentConfig({ method: e.target.value as HttpMethod })}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </Select>
                </div>

                {/* Headers */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Headers</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddHeader}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Header
                        </Button>
                    </div>
                    {headers.map((header, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                placeholder="Key"
                                value={header.key}
                                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                            />
                            <Input
                                placeholder="Value"
                                value={header.value}
                                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveHeader(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Request Body (for POST/PUT/PATCH) */}
                {(currentConfig.method === 'POST' ||
                    currentConfig.method === 'PUT' ||
                    currentConfig.method === 'PATCH') && (
                        <div className="space-y-2">
                            <Label htmlFor="body">Request Body (JSON)</Label>
                            <Textarea
                                id="body"
                                placeholder='{"key": "value"}'
                                rows={6}
                                value={currentConfig.body || ''}
                                onChange={(e) => setCurrentConfig({ body: e.target.value })}
                            />
                        </div>
                    )}

                {/* Test Parameters */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="vus">Virtual Users (VUs)</Label>
                        <Input
                            id="vus"
                            type="number"
                            min="1"
                            value={currentConfig.vus || 10}
                            onChange={(e) => setCurrentConfig({ vus: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                            id="duration"
                            placeholder="30s, 5m, 1h"
                            value={currentConfig.duration || '30s'}
                            onChange={(e) => setCurrentConfig({ duration: e.target.value })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
