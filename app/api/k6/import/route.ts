import { NextRequest, NextResponse } from 'next/server';
import { parseK6Output } from '@/lib/utils/k6-parser';
import { TestResult } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        const content = await file.text();
        const isJson = file.name.endsWith('.json');

        let metrics;
        let rawOutput = '';
        let result: TestResult;

        if (isJson) {
            try {
                // Try to parse as the full TestResult object first (our export format)
                const parsed = JSON.parse(content);
                if (parsed.metrics && parsed.rawOutput) {
                    result = parsed as TestResult;
                } else {
                    // Fallback: treat as raw text if it's not our format
                    throw new Error('Not a valid result file');
                }
            } catch (e) {
                return NextResponse.json(
                    { success: false, error: 'Invalid JSON file' },
                    { status: 400 }
                );
            }
        } else {
            // It's a text file (raw CLI output)
            rawOutput = content;
            metrics = parseK6Output(rawOutput);

            result = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                config: {
                    testType: 'custom',
                    executor: 'shared-iterations',
                    endpoint: 'imported',
                    method: 'GET'
                }, // Placeholder
                metrics,
                rawOutput,
                duration: 0,
                status: 'success',
            };
        }

        return NextResponse.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
