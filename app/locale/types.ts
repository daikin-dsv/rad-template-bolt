export type AppRoutesText = Record<string, string>;
type FooterText = {
    copyright: string;
};

export type UserText = {
    email: string;
    english: string;
    japanese: string;
    language: string;
    manageAccount: string;
    name: string;
    profile: string;
    settings: string;
    signedIn: string;
    signOut: string;
};

export type TextBundle = {
    appRoutes: AppRoutesText;
    footer: FooterText;
    user: UserText;
};

export type SupportedLocale = 'en' | 'ja';
