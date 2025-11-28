import { K6Metrics } from '@/types';

export interface TimeSeriesData {
    http_req_duration: ChartDataPoint[];
    http_reqs: ChartDataPoint[];
    vus: ChartDataPoint[];
}

export interface ChartDataPoint {
    time: number; // timestamp in ms
    value: number;
    label?: string;
}

export function parseK6Json(jsonOutput: string): TimeSeriesData {
    const data: TimeSeriesData = {
        http_req_duration: [],
        http_reqs: [],
        vus: [],
    };

    if (!jsonOutput) return data;

    const lines = jsonOutput.split('\n');
    const startTime = lines.length > 0 ? JSON.parse(lines[0]).time : null;

    // Helper to normalize time to relative ms from start
    const getRelativeTime = (isoTime: string) => {
        const t = new Date(isoTime).getTime();
        return startTime ? t - new Date(startTime).getTime() : 0;
    };

    // We need to aggregate data points because k6 outputs a lot of data
    // For simplicity, we'll just push all points first and maybe downsample later if needed
    // Or better, we bucket them by second.

    const buckets: Record<number, {
        durationSum: number;
        durationCount: number;
        reqsCount: number;
        vusMax: number;
    }> = {};

    lines.forEach(line => {
        if (!line.trim()) return;
        try {
            const entry = JSON.parse(line);
            if (entry.type === 'Point') {
                const time = new Date(entry.time).getTime();
                const relativeTime = startTime ? time - new Date(startTime).getTime() : 0;
                const bucketTime = Math.floor(relativeTime / 1000) * 1000; // Bucket by second

                if (!buckets[bucketTime]) {
                    buckets[bucketTime] = { durationSum: 0, durationCount: 0, reqsCount: 0, vusMax: 0 };
                }

                if (entry.metric === 'http_req_duration') {
                    buckets[bucketTime].durationSum += entry.data.value;
                    buckets[bucketTime].durationCount++;
                } else if (entry.metric === 'http_reqs') {
                    buckets[bucketTime].reqsCount += entry.data.value;
                } else if (entry.metric === 'vus') {
                    buckets[bucketTime].vusMax = Math.max(buckets[bucketTime].vusMax, entry.data.value);
                }
            }
        } catch (e) {
            // Ignore malformed lines
        }
    });

    // Convert buckets to arrays
    Object.entries(buckets).forEach(([timeStr, bucket]) => {
        const time = parseInt(timeStr);

        if (bucket.durationCount > 0) {
            data.http_req_duration.push({
                time,
                value: bucket.durationSum / bucket.durationCount, // Average
            });
        }

        if (bucket.reqsCount > 0) {
            data.http_reqs.push({
                time,
                value: bucket.reqsCount, // RPS (since bucket is 1s)
            });
        }

        if (bucket.vusMax > 0) {
            data.vus.push({
                time,
                value: bucket.vusMax,
            });
        }
    });

    // Sort by time
    data.http_req_duration.sort((a, b) => a.time - b.time);
    data.http_reqs.sort((a, b) => a.time - b.time);
    data.vus.sort((a, b) => a.time - b.time);

    return data;
}

export function parseK6Output(rawOutput: string): K6Metrics {
    const metrics: K6Metrics = {};

    // Parse checks
    const checksMatch = rawOutput.match(/checks_total[.:\s]+(\d+)\s+([\d.]+)\/s/);
    if (checksMatch) {
        metrics.checks_total = parseInt(checksMatch[1]);
    }

    const checksSucceededMatch = rawOutput.match(/checks_succeeded[.:\s]+([\d.]+)%\s+(\d+)\s+out of\s+(\d+)/);
    if (checksSucceededMatch) {
        metrics.checks_succeeded = parseFloat(checksSucceededMatch[1]);
        metrics.checks_failed = 100 - metrics.checks_succeeded;
    }

    // Parse individual checks
    const individualChecks: Array<{ name: string; passes: number; fails: number; percentage: number }> = [];
    const checkRegex = /[✓✗]\s+(.+?)\n\s+↳\s+([\d.]+)%\s+—\s+✓\s+(\d+)\s+\/\s+✗\s+(\d+)/g;
    let checkMatch;
    while ((checkMatch = checkRegex.exec(rawOutput)) !== null) {
        individualChecks.push({
            name: checkMatch[1].trim(),
            percentage: parseFloat(checkMatch[2]),
            passes: parseInt(checkMatch[3]),
            fails: parseInt(checkMatch[4]),
        });
    }
    if (individualChecks.length > 0) {
        metrics.individual_checks = individualChecks;
    }

    // Parse HTTP request duration
    const httpDurationMatch = rawOutput.match(/http_req_duration[.:\s]+avg=([\d.]+(?:ms|s))\s+min=([\d.]+(?:ms|s))\s+med=([\d.]+(?:ms|s))\s+max=([\d.]+(?:ms|s))\s+p\(90\)=([\d.]+(?:ms|s))\s+p\(95\)=([\d.]+(?:ms|s))/);
    if (httpDurationMatch) {
        metrics.http_req_duration = {
            avg: parseTimeValue(httpDurationMatch[1]),
            min: parseTimeValue(httpDurationMatch[2]),
            med: parseTimeValue(httpDurationMatch[3]),
            max: parseTimeValue(httpDurationMatch[4]),
            p90: parseTimeValue(httpDurationMatch[5]),
            p95: parseTimeValue(httpDurationMatch[6]),
        };
    }

    // Parse HTTP request failed
    const httpFailedMatch = rawOutput.match(/http_req_failed[.:\s]+([\d.]+)%\s+(\d+)\s+out of\s+(\d+)/);
    if (httpFailedMatch) {
        metrics.http_req_failed = {
            percentage: parseFloat(httpFailedMatch[1]),
            count: parseInt(httpFailedMatch[2]),
            total: parseInt(httpFailedMatch[3]),
        };
    }

    // Parse HTTP requests
    const httpReqsMatch = rawOutput.match(/http_reqs[.:\s]+(\d+)\s+([\d.]+)\/s/);
    if (httpReqsMatch) {
        metrics.http_reqs = {
            total: parseInt(httpReqsMatch[1]),
            rate: parseFloat(httpReqsMatch[2]),
        };
    }

    // Parse iteration duration
    const iterDurationMatch = rawOutput.match(/iteration_duration[.:\s]+avg=([\d.]+(?:ms|s))\s+min=([\d.]+(?:ms|s))\s+med=([\d.]+(?:ms|s))\s+max=([\d.]+(?:ms|s))\s+p\(90\)=([\d.]+(?:ms|s))\s+p\(95\)=([\d.]+(?:ms|s))/);
    if (iterDurationMatch) {
        metrics.iteration_duration = {
            avg: parseTimeValue(iterDurationMatch[1]),
            min: parseTimeValue(iterDurationMatch[2]),
            med: parseTimeValue(iterDurationMatch[3]),
            max: parseTimeValue(iterDurationMatch[4]),
            p90: parseTimeValue(iterDurationMatch[5]),
            p95: parseTimeValue(iterDurationMatch[6]),
        };
    }

    // Parse iterations
    const iterationsMatch = rawOutput.match(/iterations[.:\s]+(\d+)\s+([\d.]+)\/s/);
    if (iterationsMatch) {
        metrics.iterations = {
            total: parseInt(iterationsMatch[1]),
            rate: parseFloat(iterationsMatch[2]),
        };
    }

    // Parse VUs
    const vusMatch = rawOutput.match(/vus[.:\s]+(\d+)\s+min=(\d+)\s+max=(\d+)/);
    if (vusMatch) {
        metrics.vus = {
            current: parseInt(vusMatch[1]),
            min: parseInt(vusMatch[2]),
            max: parseInt(vusMatch[3]),
        };
    }

    // Parse VUs max
    const vusMaxMatch = rawOutput.match(/vus_max[.:\s]+(\d+)\s+min=(\d+)\s+max=(\d+)/);
    if (vusMaxMatch) {
        metrics.vus_max = {
            value: parseInt(vusMaxMatch[1]),
            min: parseInt(vusMaxMatch[2]),
            max: parseInt(vusMaxMatch[3]),
        };
    }

    // Parse data received
    const dataReceivedMatch = rawOutput.match(/data_received[.:\s]+([\d.]+\s+[KMG]?B)\s+([\d.]+\s+[KMG]?B\/s)/);
    if (dataReceivedMatch) {
        metrics.data_received = {
            total: dataReceivedMatch[1],
            rate: dataReceivedMatch[2],
        };
    }

    // Parse data sent
    const dataSentMatch = rawOutput.match(/data_sent[.:\s]+([\d.]+\s+[KMG]?B)\s+([\d.]+\s+[KMG]?B\/s)/);
    if (dataSentMatch) {
        metrics.data_sent = {
            total: dataSentMatch[1],
            rate: dataSentMatch[2],
        };
    }

    return metrics;
}

function parseTimeValue(value: string): number {
    const match = value.match(/([\d.]+)(ms|s)/);
    if (!match) return 0;

    const num = parseFloat(match[1]);
    const unit = match[2];

    return unit === 's' ? num * 1000 : num; // Convert to milliseconds
}
