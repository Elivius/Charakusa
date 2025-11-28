export type TestType = 'smoke' | 'average-load' | 'stress' | 'soak' | 'spike' | 'breakpoint' | 'custom';

export type ExecutorType =
    | 'shared-iterations'
    | 'per-vu-iterations'
    | 'constant-vus'
    | 'ramping-vus'
    | 'constant-arrival-rate'
    | 'ramping-arrival-rate';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Stage {
    duration: string;
    target: number;
}

export interface TestConfig {
    testType: TestType;
    executor: ExecutorType;
    endpoint: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    vus?: number;
    duration?: string;
    stages?: Stage[];
    iterations?: number;
    rate?: number;
    timeUnit?: string;
    preAllocatedVUs?: number;
    maxVUs?: number;
    checks?: string[];
    thinkTime?: number;
}

export interface K6Metrics {
    checks_total?: number;
    checks_succeeded?: number;
    checks_failed?: number;
    individual_checks?: Array<{
        name: string;
        passes: number;
        fails: number;
        percentage: number;
    }>;
    http_req_duration?: {
        avg: number;
        min: number;
        med: number;
        max: number;
        p90: number;
        p95: number;
    };
    http_req_failed?: {
        percentage: number;
        count: number;
        total: number;
    };
    http_reqs?: {
        total: number;
        rate: number;
    };
    iteration_duration?: {
        avg: number;
        min: number;
        med: number;
        max: number;
        p90: number;
        p95: number;
    };
    iterations?: {
        total: number;
        rate: number;
    };
    vus?: {
        current: number;
        min: number;
        max: number;
    };
    vus_max?: {
        value: number;
        min: number;
        max: number;
    };
    data_received?: {
        total: string;
        rate: string;
    };
    data_sent?: {
        total: string;
        rate: string;
    };
}

export interface TestResult {
    id: string;
    timestamp: number;
    config: TestConfig;
    metrics: K6Metrics;
    rawOutput: string;
    duration: number;
    status: 'success' | 'failed';
}

export interface SavedConfiguration {
    id: string;
    name: string;
    config: TestConfig;
    createdAt: number;
}
