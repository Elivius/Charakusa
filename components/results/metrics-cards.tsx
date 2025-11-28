'use client';

import { K6Metrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    TrendingUp,
    Network,
    Users
} from 'lucide-react';

interface MetricsCardsProps {
    metrics: K6Metrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
    return (
        <div className="space-y-6">
            {/* Checks Section */}
            {metrics.checks_total && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Checks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Checks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.checks_total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Succeeded
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {metrics.checks_succeeded?.toFixed(2)}%
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Failed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {metrics.checks_failed?.toFixed(2)}%
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Individual Checks */}
                    {metrics.individual_checks && metrics.individual_checks.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="text-sm font-semibold">Individual Checks</h3>
                            {metrics.individual_checks.map((check, idx) => (
                                <Card key={idx}>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{check.name}</span>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={check.percentage >= 95 ? 'success' : 'warning'}>
                                                    {check.percentage.toFixed(2)}%
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    ✓ {check.passes} / ✗ {check.fails}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* HTTP Metrics */}
            {metrics.http_req_duration && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        HTTP Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Avg Response Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {metrics.http_req_duration.avg.toFixed(2)}ms
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Min: {metrics.http_req_duration.min.toFixed(2)}ms |
                                    Max: {metrics.http_req_duration.max.toFixed(2)}ms
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    P90 Latency
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {metrics.http_req_duration.p90.toFixed(2)}ms
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    P95 Latency
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {metrics.http_req_duration.p95.toFixed(2)}ms
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {metrics.http_reqs && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        Total Requests
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.http_reqs.total}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {metrics.http_reqs.rate.toFixed(2)} req/s
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        {metrics.http_req_failed && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Failed Requests
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {metrics.http_req_failed.percentage.toFixed(2)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {metrics.http_req_failed.count} of {metrics.http_req_failed.total}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* Execution Metrics */}
            {metrics.iterations && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Execution Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Iterations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.iterations.total}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {metrics.iterations.rate.toFixed(2)} iter/s
                                </p>
                            </CardContent>
                        </Card>
                        {metrics.iteration_duration && (
                            <>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Avg Iteration Duration
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {metrics.iteration_duration.avg.toFixed(2)}ms
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        {metrics.vus && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Virtual Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.vus.current}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Min: {metrics.vus.min} | Max: {metrics.vus.max}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        {metrics.vus_max && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Max VUs Configured
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.vus_max.value}</div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* Network Metrics */}
            {(metrics.data_received || metrics.data_sent) && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Network Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {metrics.data_received && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Data Received
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.data_received.total}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {metrics.data_received.rate}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        {metrics.data_sent && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Data Sent
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.data_sent.total}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {metrics.data_sent.rate}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
