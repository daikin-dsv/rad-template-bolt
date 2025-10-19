import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            id: string;
            locale?: string;
            given_name?: string;
            family_name?: string;
            preferred_username?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        locale?: string;
        given_name?: string;
        family_name?: string;
        preferred_username?: string;
    }
}
