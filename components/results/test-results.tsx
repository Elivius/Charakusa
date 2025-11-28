'use client';

import { TestResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play } from 'lucide-react';
import { MetricsCards } from './metrics-cards';
import { useTestStore } from '@/lib/store/test-store';

interface TestResultsProps {
    result: TestResult;
}

export function TestResults({ result }: TestResultsProps) {
    const { resetTest } = useTestStore();

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `k6-result-${result.id}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Test Results</h2>
                    <p className="text-muted-foreground">
                        Test ID: {result.id} • Duration: {(result.duration / 1000).toFixed(2)}s
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Results
                    </Button>
                    <Button onClick={resetTest}>
                        <Play className="mr-2 h-4 w-4" />
                        New Test
                    </Button>
                </div>
            </div>

            <MetricsCards metrics={result.metrics} />

            <Card>
                <CardHeader>
                    <CardTitle>Console Output</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-black text-green-400 p-4 rounded-md font-mono text-xs overflow-auto max-h-[400px]">
                        {result.rawOutput}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
