import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { parseK6Output } from '@/lib/utils/k6-parser';
import { TestResult } from '@/types';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
    try {
        const { script, config } = await request.json();

        if (!script) {
            return NextResponse.json(
                { success: false, error: 'No script provided' },
                { status: 400 }
            );
        }

        // Create k6-scripts directory if it doesn't exist
        const scriptsDir = path.join(process.cwd(), 'k6-scripts');
        await mkdir(scriptsDir, { recursive: true });

        // Generate unique filenames
        const timestamp = Date.now();
        const scriptPath = path.join(scriptsDir, `test-${timestamp}.js`);

        // Write script to file
        await writeFile(scriptPath, script, 'utf-8');

        // Execute k6
        const startTime = Date.now();
        let output = '';
        let success = true;

        try {
            // Run k6 (no JSON output needed anymore)
            const { stdout, stderr } = await execAsync(`k6 run "${scriptPath}"`, {
                timeout: 3600000, // 1 hour timeout
            });
            output = stdout + (stderr ? `\n${stderr}` : '');
        } catch (error: any) {
            success = false;
            output = error.stdout || error.stderr || error.message;
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Parse k6 output (summary)
        const metrics = parseK6Output(output);

        // Create test result
        const result: TestResult = {
            id: timestamp.toString(),
            timestamp,
            config,
            metrics,
            rawOutput: output,
            duration,
            status: success ? 'success' : 'failed',
        };

        return NextResponse.json({
            success: true,
            output,
            result,
        });
    } catch (error) {
        console.error('K6 execution error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
