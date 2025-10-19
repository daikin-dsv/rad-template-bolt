import { auth as nextAuthMiddleware, isAuthBypassEnabled } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export function middleware(request: NextApiRequest, response: NextApiResponse) {
    if (isAuthBypassEnabled) {
        return NextResponse.next();
    }

    return nextAuthMiddleware(request, response);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|static/).*)']
};
