import { ExecutorType } from '@/types';

export interface ExecutorConfig {
    name: string;
    description: string;
    category: 'iteration' | 'vu' | 'arrival-rate';
    k6Config: (params: any) => any;
}

export const executorConfigs: Record<ExecutorType, ExecutorConfig> = {
    'shared-iterations': {
        name: 'Shared Iterations',
        description: 'Fixed total iterations shared among VUs',
        category: 'iteration',
        k6Config: (params: { vus: number; iterations: number }) => ({
            executor: 'shared-iterations',
            vus: params.vus || 10,
            iterations: params.iterations || 100,
        }),
    },
    'per-vu-iterations': {
        name: 'Per VU Iterations',
        description: 'Each VU runs a fixed number of iterations',
        category: 'iteration',
        k6Config: (params: { vus: number; iterations: number }) => ({
            executor: 'per-vu-iterations',
            vus: params.vus || 10,
            iterations: params.iterations || 10,
        }),
    },
    'constant-vus': {
        name: 'Constant VUs',
        description: 'Fixed number of VUs throughout the test',
        category: 'vu',
        k6Config: (params: { vus: number; duration: string }) => ({
            executor: 'constant-vus',
            vus: params.vus || 10,
            duration: params.duration || '30s',
        }),
    },
    'ramping-vus': {
        name: 'Ramping VUs',
        description: 'VU count increases/decreases per schedule',
        category: 'vu',
        k6Config: (params: { stages: Array<{ duration: string; target: number }> }) => ({
            executor: 'ramping-vus',
            startVUs: 0,
            stages: params.stages || [
                { duration: '30s', target: 10 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 },
            ],
        }),
    },
    'constant-arrival-rate': {
        name: 'Constant Arrival Rate',
        description: 'Fixed iterations per time period (precise RPS control)',
        category: 'arrival-rate',
        k6Config: (params: { rate: number; timeUnit: string; duration: string; preAllocatedVUs: number }) => ({
            executor: 'constant-arrival-rate',
            rate: params.rate || 30,
            timeUnit: params.timeUnit || '1s',
            duration: params.duration || '1m',
            preAllocatedVUs: params.preAllocatedVUs || 10,
            maxVUs: params.preAllocatedVUs ? params.preAllocatedVUs * 2 : 20,
        }),
    },
    'ramping-arrival-rate': {
        name: 'Ramping Arrival Rate',
        description: 'Variable iteration rate over time',
        category: 'arrival-rate',
        k6Config: (params: { stages: Array<{ duration: string; target: number }>; preAllocatedVUs: number }) => ({
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1s',
            preAllocatedVUs: params.preAllocatedVUs || 10,
            maxVUs: params.preAllocatedVUs ? params.preAllocatedVUs * 2 : 50,
            stages: params.stages || [
                { duration: '30s', target: 10 },
                { duration: '1m', target: 50 },
                { duration: '30s', target: 0 },
            ],
        }),
    },
};
