import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestConfig, TestResult, SavedConfiguration } from '@/types';

interface TestStore {
    // Current test configuration
    currentConfig: TestConfig;
    setCurrentConfig: (config: Partial<TestConfig>) => void;
    resetConfig: () => void;

    // Test execution state
    isRunning: boolean;
    setIsRunning: (running: boolean) => void;

    // Current test result
    currentResult: TestResult | null;
    setCurrentResult: (result: TestResult | null) => void;
    resetTest: () => void;

    // Saved configurations
    savedConfigs: SavedConfiguration[];
    saveConfiguration: (name: string, config: TestConfig) => void;
    deleteConfiguration: (id: string) => void;
    loadConfiguration: (id: string) => void;
}

const defaultConfig: TestConfig = {
    testType: 'smoke',
    executor: 'constant-vus',
    endpoint: '',
    method: 'GET',
    headers: {},
    body: '',
    vus: 10,
    duration: '30s',
    stages: [],
};

export const useTestStore = create<TestStore>()(
    persist(
        (set, get) => ({
            currentConfig: defaultConfig,
            setCurrentConfig: (config) =>
                set((state) => ({
                    currentConfig: { ...state.currentConfig, ...config },
                })),
            resetConfig: () => set({ currentConfig: defaultConfig }),

            isRunning: false,
            setIsRunning: (running) => set({ isRunning: running }),

            currentResult: null,
            setCurrentResult: (result) => set({ currentResult: result }),
            resetTest: () => set({ currentResult: null, isRunning: false }),

            savedConfigs: [],
            saveConfiguration: (name, config) =>
                set((state) => ({
                    savedConfigs: [
                        ...state.savedConfigs,
                        {
                            id: Date.now().toString(),
                            name,
                            config,
                            createdAt: Date.now(),
                        },
                    ],
                })),
            deleteConfiguration: (id) =>
                set((state) => ({
                    savedConfigs: state.savedConfigs.filter((c) => c.id !== id),
                })),
            loadConfiguration: (id) => {
                const config = get().savedConfigs.find((c) => c.id === id);
                if (config) {
                    set({ currentConfig: config.config });
                }
            },
        }),
        {
            name: 'k6-test-store',
            partialize: (state) => ({
                savedConfigs: state.savedConfigs,
            }),
        }
    )
);
