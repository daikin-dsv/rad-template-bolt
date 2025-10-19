import NextAuth, { type Session } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

const { handlers, signIn, signOut, auth } = NextAuth({
    debug: process.env.NODE_ENV === 'development',
    providers: [Keycloak],
    callbacks: {
        jwt({ token, user, profile }) {
            if (user) {
                token.id = user.id;
            }
            if (profile) {
                token.locale = profile.locale;
                token.given_name = profile.given_name;
                token.family_name = profile.family_name;
                token.preferred_username = profile.preferred_username;
            }
            return token;
        },
        session({ session, token }) {
            const tokenId = token.id;

            if (typeof tokenId !== 'string') {
                throw new Error('Missing user ID on token');
            }

            session.user.id = tokenId;
            session.user.locale =
                typeof token.locale === 'string' ? token.locale : undefined;
            session.user.given_name =
                typeof token.given_name === 'string' ? token.given_name : undefined;
            session.user.family_name =
                typeof token.family_name === 'string' ? token.family_name : undefined;
            session.user.preferred_username =
                typeof token.preferred_username === 'string'
                    ? token.preferred_username
                    : undefined;

            return session;
        }
    }
});

const BYPASS_AUTH_FLAG =
    typeof process.env.BYPASS_AUTH === 'string' &&
    process.env.BYPASS_AUTH.toLowerCase() === 'true';

const isAuthBypassEnabled = BYPASS_AUTH_FLAG;

const createBypassedSession = (): Session => ({
    user: {
        id: 'developer',
        name: 'Developer Mode',
        email: 'dev@example.com',
        locale: 'en',
        given_name: 'Developer',
        family_name: 'User',
        preferred_username: 'developer'
    },
    // Keep the session valid for 30 days while bypassing.
    expires: '12345'
});

async function getAppSession(): Promise<Session | null> {
    if (isAuthBypassEnabled) {
        return createBypassedSession();
    }
    return auth();
}

export { handlers, signIn, signOut, auth, isAuthBypassEnabled, getAppSession };
