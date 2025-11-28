'use client';

import { TestType } from '@/types';
import { useTestStore } from '@/lib/store/test-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Zap, Clock, BarChart3, AlertTriangle, Code } from 'lucide-react';

const testTypes: Array<{
    type: TestType;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}> = [
        {
            type: 'smoke',
            name: 'Smoke Test',
            description: 'Minimal load sanity check (2-5 VUs, 1-2 min)',
            icon: <Activity className="h-5 w-5" />,
            color: 'bg-blue-500',
        },
        {
            type: 'average-load',
            name: 'Average Load',
            description: 'Typical real-world load with gradual ramp-up',
            icon: <TrendingUp className="h-5 w-5" />,
            color: 'bg-green-500',
        },
        {
            type: 'stress',
            name: 'Stress Test',
            description: 'Beyond normal capacity (200+ VUs)',
            icon: <Zap className="h-5 w-5" />,
            color: 'bg-orange-500',
        },
        {
            type: 'soak',
            name: 'Soak Test',
            description: 'Extended duration to detect memory leaks',
            icon: <Clock className="h-5 w-5" />,
            color: 'bg-purple-500',
        },
        {
            type: 'spike',
            name: 'Spike Test',
            description: 'Sudden sharp load increases',
            icon: <BarChart3 className="h-5 w-5" />,
            color: 'bg-red-500',
        },
        {
            type: 'breakpoint',
            name: 'Breakpoint Test',
            description: 'Find maximum throughput limits',
            icon: <AlertTriangle className="h-5 w-5" />,
            color: 'bg-yellow-500',
        },
        {
            type: 'custom',
            name: 'Custom Test',
            description: 'Fully customizable configuration',
            icon: <Code className="h-5 w-5" />,
            color: 'bg-gray-500',
        },
    ];

export function TestTypeSelector() {
    const { currentConfig, setCurrentConfig } = useTestStore();

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select Test Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {testTypes.map((test) => (
                    <Card
                        key={test.type}
                        className={`cursor-pointer transition-all hover:shadow-lg ${currentConfig.testType === test.type ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => setCurrentConfig({ testType: test.type })}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${test.color} text-white`}>
                                    {test.icon}
                                </div>
                                {currentConfig.testType === test.type && (
                                    <Badge variant="default">Selected</Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg mt-2">{test.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{test.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
