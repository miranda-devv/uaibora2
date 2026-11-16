export function requestHost(request: Request) { try {
    return new URL(new URL(request.url).protocol + '//' + (request.headers.get('host') || new URL(request.url).host)).host;
}
catch {
    return '';
} }
export function isSameOrigin(request: Request) { const origin = request.headers.get('origin'); if (!origin)
    return false; try {
    const parsed = new URL(origin);
    return parsed.host === requestHost(request) && parsed.protocol === new URL(request.url).protocol;
}
catch {
    return false;
} }
export function isLoopback(request: Request) { try {
    return ['localhost', '127.0.0.1', '[::1]'].includes(new URL('http://' + requestHost(request)).hostname);
}
catch {
    return false;
} }
