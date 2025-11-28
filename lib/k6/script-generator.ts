import { TestConfig, TestType, Stage } from '@/types';
import { executorConfigs } from './executor-configs';

export function generateK6Script(config: TestConfig): string {
    const { testType, executor, endpoint, method, headers, body, checks, thinkTime } = config;

    // Get test type specific options
    const testOptions = getTestTypeOptions(testType, config);

    // Get executor specific config
    const executorConfig = executorConfigs[executor].k6Config(config);

    // Build options object
    const options = testType === 'custom' ? {} : {
        ...testOptions,
        ...executorConfig,
    };

    // Generate script
    let script = `import http from 'k6/http';\n`;
    script += `import { check, sleep } from 'k6';\n\n`;

    // Add options
    script += `export const options = ${JSON.stringify(options, null, 2)};\n\n`;

    // Add default function
    script += `export default function () {\n`;

    // Build headers
    const headersObj = headers || {};
    const headersStr = Object.keys(headersObj).length > 0
        ? JSON.stringify(headersObj, null, 2)
        : '{}';

    // Build request
    if (method === 'GET' || method === 'DELETE') {
        script += `  const res = http.${method.toLowerCase()}('${endpoint}', {\n`;
        script += `    headers: ${headersStr},\n`;
        script += `  });\n\n`;
    } else {
        const bodyStr = body || '{}';
        script += `  const payload = ${bodyStr};\n\n`;
        script += `  const res = http.${method.toLowerCase()}('${endpoint}', JSON.stringify(payload), {\n`;
        script += `    headers: ${headersStr},\n`;
        script += `  });\n\n`;
    }

    // Add checks if specified
    if (checks && checks.length > 0) {
        script += `  check(res, {\n`;
        checks.forEach((checkStr, idx) => {
            script += `    '${checkStr}': (r) => r.status === 200,\n`;
        });
        script += `  });\n\n`;
    } else {
        // Default check
        script += `  check(res, {\n`;
        script += `    'status is 200': (r) => r.status === 200,\n`;
        script += `  });\n\n`;
    }

    // Add think time/sleep
    if (thinkTime && thinkTime > 0) {
        script += `  sleep(${thinkTime});\n`;
    } else if (!executor.includes('arrival-rate')) {
        script += `  sleep(1);\n`;
    }

    script += `}\n`;

    return script;
}

function getTestTypeOptions(testType: TestType, config: TestConfig): any {
    switch (testType) {
        case 'smoke':
            return {
                vus: 3,
                duration: '1m',
            };

        case 'average-load':
            return {
                stages: [
                    { duration: '5m', target: 100 },
                    { duration: '30m', target: 100 },
                    { duration: '5m', target: 0 },
                ],
            };

        case 'stress':
            return {
                stages: [
                    { duration: '10m', target: 200 },
                    { duration: '30m', target: 200 },
                    { duration: '5m', target: 0 },
                ],
            };

        case 'soak':
            return {
                stages: [
                    { duration: '5m', target: 100 },
                    { duration: '8h', target: 100 },
                    { duration: '5m', target: 0 },
                ],
            };

        case 'spike':
            return {
                stages: [
                    { duration: '2m', target: 2000 },
                    { duration: '1m', target: 0 },
                ],
            };

        case 'breakpoint':
            return {
                executor: 'ramping-arrival-rate',
                startRate: 0,
                timeUnit: '1s',
                preAllocatedVUs: 500,
                maxVUs: 1000,
                stages: [
                    { duration: '2h', target: 20000 },
                ],
            };

        case 'custom':
            return {};

        default:
            return {};
    }
}
