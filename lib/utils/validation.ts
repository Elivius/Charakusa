export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidJson(str: string): boolean {
    if (!str || str.trim() === '') return true; // Empty is valid
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export function isValidDuration(duration: string): boolean {
    return /^\d+(?:\.\d+)?(ms|s|m|h)$/.test(duration);
}

export function isValidNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function validateHeaders(headers: Record<string, string>): string | null {
    for (const [key, value] of Object.entries(headers)) {
        if (!key || key.trim() === '') {
            return 'Header key cannot be empty';
        }
        if (typeof value !== 'string') {
            return `Header value for "${key}" must be a string`;
        }
    }
    return null;
}
