import {
    test as baseTest,
    expect,
    type Page,
    type BrowserContext
} from '@playwright/test';

import { USERS } from './constants';

const { RAD_URL, BYPASS_AUTH } = process.env;

type Credentials = {
    username: string;
    password: string;
};

type LoginContext = {
    page: Page;
    user: string;
    cookies: boolean;
    context: BrowserContext;
};

type LoggedInPageOptions = {
    // eslint-disable-next-line no-unused-vars
    beforeLogin?: (page: Page) => Promise<void> | void;
};

// eslint-disable-next-line no-unused-vars
type ApplyPageFn = (page: Page) => Promise<void> | void;

/**
 * Get User's credentials
 *
 * @param {string} user - Username
 */
async function getUserCredentials(user: string): Promise<string> {
    switch (user) {
        case USERS.ADMIN.username:
            if (!process.env.AUTHINFO) {
                throw new Error(`Credentials for user ${user} are not defined`);
            }
            return process.env.AUTHINFO;
        default:
            throw new Error(`Requested user does not exist: ${user}`);
    }
}

const loggedInPage = async (
    { page, user, cookies, context }: LoginContext,
    url: string,
    applyPage: ApplyPageFn,
    options: LoggedInPageOptions = {}
): Promise<void> => {
    try {
        await page.goto(url);

        const { beforeLogin } = options;
        if (typeof beforeLogin === 'function') {
            await beforeLogin(page);
        }

        const credentials = await getUserCredentials(user);
        const parsedCredentials: Credentials = JSON.parse(credentials);
        const { username, password } = parsedCredentials;
        await expect(
            page.getByRole('textbox', { name: 'Username or email' }),
            'Username should be visible'
        ).toBeVisible();
        await expect(
            page.getByRole('textbox', { name: 'Password' }),
            'Password should be visible'
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Sign in' }),
            'Sign in button should be visible'
        ).toBeVisible();
        await page.getByRole('textbox', { name: 'Username or email' }).fill(username);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForLoadState('domcontentloaded');

        expect(page.url(), `Should contain ${url} in page url`).toContain(url);

        await applyPage(page);

        if (cookies) {
            await context.clearCookies();
        }
    } catch (error) {
        console.error('An error occurred while logging in:', error);
        throw error;
    }
};

// Extend basic test by providing fixtures and options that can be used in the tests
const test = baseTest.extend<{
    user: string;
    cookies: boolean;
    radPage: Page;
}>({
    // Define `user` option with a default value
    user: [USERS.ADMIN.username, { option: true }],
    cookies: [false, { option: true }],
    radPage: async (
        { page, user, cookies, context }: LoginContext,
        applyPage: ApplyPageFn
    ): Promise<void> => {
        console.log('RAD_URL', RAD_URL);
        if (!RAD_URL) {
            throw new Error('RAD_URL environment variable is not defined');
        }
        try {
            if (BYPASS_AUTH && BYPASS_AUTH === 'true') {
                console.log('BYPASS_AUTH', BYPASS_AUTH);
                await page.goto(RAD_URL);
                await applyPage(page);
                if (cookies) {
                    await context.clearCookies();
                }
                return;
            }

            await loggedInPage({ page, user, cookies, context }, RAD_URL, applyPage, {
                beforeLogin: async (currentPage) => {
                    const keycloakButton = currentPage.getByRole('button', {
                        name: 'Sign in with Keycloak'
                    });
                    await expect(
                        keycloakButton,
                        'Keycloak sign-in button should be visible'
                    ).toBeVisible();
                    await keycloakButton.click();
                    await currentPage.waitForLoadState('domcontentloaded');
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
});

export { test, expect };
