'use client';

import { useState, useEffect } from 'react';
import { TestTypeSelector } from './test-type-selector';
import { RequestConfigForm } from './request-config-form';
import { ScriptPreview } from './script-preview';
import { ExecutionControls } from '../execution/execution-controls';
import { useTestStore } from '@/lib/store/test-store';
import { generateK6Script } from '@/lib/k6/script-generator';

export function TestConfiguration() {
    const { currentConfig } = useTestStore();
    const [script, setScript] = useState('');

    // Generate script whenever config changes
    useEffect(() => {
        if (currentConfig.endpoint) {
            const generatedScript = generateK6Script(currentConfig);
            setScript(generatedScript);
        }
    }, [currentConfig]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Load Test Configuration</h1>
                <p className="text-muted-foreground">
                    Configure and run k6 load tests with an intuitive interface
                </p>
            </div>

            <TestTypeSelector />
            <RequestConfigForm />

            {script && (
                <>
                    <ScriptPreview script={script} />
                    <ExecutionControls script={script} />
                </>
            )}
        </div>
    );
}
