'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ScriptPreviewProps {
    script: string;
}

export function ScriptPreview({ script }: ScriptPreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Generated K6 Script</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-sm">
                    <code>{script}</code>
                </pre>
            </CardContent>
        </Card>
    );
}
