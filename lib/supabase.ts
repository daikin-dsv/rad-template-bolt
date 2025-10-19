import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SalesData = {
    id: string;
    sales_channel: string;
    category: string;
    fiscal_year: number;
    q4: number;
    q5: number;
    q6: number;
    q7: number;
    q8: number;
    q9: number;
    q10: number;
    q11: number;
    q12: number;
    q1: number;
    q2: number;
    q3: number;
    q4_percent: number | null;
    q5_percent: number | null;
    q6_percent: number | null;
    q7_percent: number | null;
    q8_percent: number | null;
    q9_percent: number | null;
    q10_percent: number | null;
    q11_percent: number | null;
    q12_percent: number | null;
    q1_percent: number | null;
    q2_percent: number | null;
    q3_percent: number | null;
    created_at: string;
};
