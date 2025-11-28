'use client';

import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { TestConfiguration } from '@/components/test-config/test-configuration';
import { TestResults } from '@/components/results/test-results';
import { useTestStore } from '@/lib/store/test-store';

export default function Home() {
    const { currentResult } = useTestStore();

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {currentResult ? (
                        <TestResults result={currentResult} />
                    ) : (
                        <TestConfiguration />
                    )}
                </main>
            </div>
        </div>
    );
}
