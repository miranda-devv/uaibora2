import { isLoopback, isSameOrigin } from "@/lib/request-origin";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const NAME = "uaibora_admin";
export function localDemo(request: Request) { return process.env.UAIBORA_DEMO_ADMIN_ENABLED === 'true' && isLoopback(request); }
export function sameOrigin(request: Request) { return isSameOrigin(request); }
export function checkCredentials(login: string, password: string) { const stored = process.env.UAIBORA_DEMO_ADMIN_PASSWORD_HASH; if (!stored || login !== process.env.UAIBORA_DEMO_ADMIN_USER || password.length > 128)
    return false; const [salt, hash] = stored.split(':'); const actual = scryptSync(password, salt, 64); const expected = Buffer.from(hash, 'hex'); return expected.length === actual.length && timingSafeEqual(actual, expected); }
export async function createAdminSession() { const secret = process.env.UAIBORA_ADMIN_SESSION_SECRET; if (!secret)
    throw Error('Admin not configured'); const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000, nonce: randomBytes(16).toString('hex') })).toString('base64url'); const signature = createHmac('sha256', secret).update(payload).digest('base64url'); (await cookies()).set(NAME, payload + '.' + signature, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 8 * 60 * 60 }); }
export async function isAdmin() { const secret = process.env.UAIBORA_ADMIN_SESSION_SECRET; const value = (await cookies()).get(NAME)?.value; if (!secret || !value)
    return false; try {
    const [payload, sig] = value.split('.');
    const expected = createHmac('sha256', secret).update(payload).digest();
    const provided = Buffer.from(sig, 'base64url');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected))
        return false;
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
}
catch {
    return false;
} }
export async function clearAdminSession() { (await cookies()).delete(NAME); }
