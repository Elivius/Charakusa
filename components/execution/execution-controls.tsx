'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Loader2 } from 'lucide-react';
import { useTestStore } from '@/lib/store/test-store';

interface ExecutionControlsProps {
    script: string;
}

export function ExecutionControls({ script }: ExecutionControlsProps) {
    const { isRunning, setIsRunning, setCurrentResult, currentConfig } = useTestStore();
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('Starting k6 test...\n');
        setError('');

        try {
            const response = await fetch('/api/k6/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script, config: currentConfig }),
            });

            const data = await response.json();

            if (data.success) {
                setOutput(data.output);
                setCurrentResult(data.result);
            } else {
                setError(data.error || 'Test execution failed');
                setOutput(data.output || '');
            }
        } catch (err) {
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsRunning(false);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        setOutput((prev) => prev + '\n\nTest stopped by user.');
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Execution Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button onClick={handleRun} disabled={isRunning || !script}>
                            {isRunning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Test
                                </>
                            )}
                        </Button>
                        {isRunning && (
                            <Button variant="destructive" onClick={handleStop}>
                                <Square className="mr-2 h-4 w-4" />
                                Stop
                            </Button>
                        )}
                    </div>

                    {(output || error) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Console Output</h3>
                            <div className="p-4 rounded-lg bg-black text-green-400 font-mono text-sm max-h-96 overflow-y-auto terminal-output">
                                {error && <div className="text-red-400">{error}</div>}
                                {output}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
