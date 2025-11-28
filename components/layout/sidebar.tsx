'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestStore } from '@/lib/store/test-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { savedConfigs, loadConfiguration, setCurrentResult } = useTestStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const { toast } = useToast(); // Assuming we have a toast hook, if not we'll skip for now

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/k6/import', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setCurrentResult(data.result);
                // toast({ title: "Success", description: "Results imported successfully" });
            } else {
                console.error('Import failed:', data.error);
                // toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (error) {
            console.error('Import error:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <aside
            className={cn(
                'relative border-r bg-background transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.txt"
                onChange={handleFileChange}
            />
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            <div className="space-y-4 py-4">
                {!isCollapsed && (
                    <>
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                                Quick Actions
                            </h2>
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    size="sm"
                                    onClick={handleImportClick}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Results
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" size="sm">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Configuration
                                </Button>
                            </div>
                        </div>

                        {savedConfigs.length > 0 && (
                            <div className="px-3 py-2">
                                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                                    Saved Configurations
                                </h2>
                                <div className="space-y-1">
                                    {savedConfigs.map((config) => (
                                        <div
                                            key={config.id}
                                            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-accent rounded-md cursor-pointer"
                                            onClick={() => loadConfiguration(config.id)}
                                        >
                                            <span className="truncate">{config.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
}
