'use client';

import { useEffect, useState } from 'react';
import { supabase, type SalesData } from '@/lib/supabase';

export default function Home() {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSalesData() {
            const { data, error } = await supabase
                .from('sales_data')
                .select('*')
                .order('sales_channel', { ascending: true })
                .order('fiscal_year', { ascending: false })
                .order('category', { ascending: true });

            if (error) {
                console.error('Error fetching sales data:', error);
            } else {
                setSalesData(data || []);
            }
            setLoading(false);
        }

        fetchSalesData();
    }, []);

    const formatCell = (value: number | null, isPercent: boolean = false) => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400">(--)</span>;
        }
        if (value === 0 && !isPercent) {
            return <span className="text-gray-400">0</span>;
        }
        if (isPercent) {
            return <span className="text-gray-700">{value.toFixed(1)}%</span>;
        }
        return <span>{value}</span>;
    };

    const getCategoryRowStyle = (category: string) => {
        if (category === 'Total') {
            return 'bg-white';
        }
        return 'bg-gray-50';
    };

    const quarters = [
        { label: '4', key: 'q4', percentKey: 'q4_percent' },
        { label: '5', key: 'q5', percentKey: 'q5_percent' },
        { label: '6', key: 'q6', percentKey: 'q6_percent' },
        { label: '7', key: 'q7', percentKey: 'q7_percent' },
        { label: '8', key: 'q8', percentKey: 'q8_percent' },
        { label: '9', key: 'q9', percentKey: 'q9_percent' },
        { label: '10', key: 'q10', percentKey: 'q10_percent' },
        { label: '11', key: 'q11', percentKey: 'q11_percent' },
        { label: '12', key: 'q12', percentKey: 'q12_percent' },
        { label: '1', key: 'q1', percentKey: 'q1_percent' },
        { label: '2', key: 'q2', percentKey: 'q2_percent' },
        { label: '3', key: 'q3', percentKey: 'q3_percent' },
    ];

    const groupedData = salesData.reduce((acc, row) => {
        if (!acc[row.sales_channel]) {
            acc[row.sales_channel] = [];
        }
        acc[row.sales_channel].push(row);
        return acc;
    }, {} as Record<string, SalesData[]>);

    if (loading) {
        return (
            <div className="flex grow items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Sales Report</h1>
                <div className="flex gap-4">
                    <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
                        Save Changes
                    </button>
                    <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
                        Export/Edit/Template
                    </button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Planning</label>
                    <input
                        type="text"
                        defaultValue="Reference"
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Summary</label>
                    <input
                        type="text"
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="text-sm font-medium">Sales Result</label>
                <input
                    type="text"
                    placeholder="Search by model"
                    className="ml-4 rounded border border-gray-300 px-3 py-1 text-sm"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                                Sales Channel
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                                Fiscal Year
                            </th>
                            {quarters.map((quarter) => (
                                <th
                                    key={quarter.key}
                                    className="border border-gray-300 px-4 py-2 text-center font-medium"
                                >
                                    {quarter.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedData).map(([channel, rows]) => (
                            <>
                                <tr key={`${channel}-header`} className="bg-gray-200">
                                    <td
                                        colSpan={14}
                                        className="border border-gray-300 px-4 py-2 font-semibold"
                                    >
                                        {channel}
                                    </td>
                                </tr>
                                {rows.map((row, idx) => (
                                    <>
                                        <tr
                                            key={`${row.id}-values`}
                                            className={getCategoryRowStyle(row.category)}
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {idx === 0 || rows[idx - 1].fiscal_year !== row.fiscal_year
                                                    ? row.category
                                                    : ''}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {row.fiscal_year}
                                            </td>
                                            {quarters.map((quarter) => (
                                                <td
                                                    key={`${row.id}-${quarter.key}`}
                                                    className="border border-gray-300 px-3 py-2 text-right"
                                                >
                                                    {formatCell(
                                                        row[quarter.key as keyof SalesData] as number
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr
                                            key={`${row.id}-percent`}
                                            className={getCategoryRowStyle(row.category)}
                                        >
                                            <td className="border border-gray-300 px-4 py-2"></td>
                                            <td className="border border-gray-300 px-4 py-2"></td>
                                            {quarters.map((quarter) => (
                                                <td
                                                    key={`${row.id}-${quarter.percentKey}`}
                                                    className="border border-gray-300 px-3 py-1 text-right text-xs"
                                                >
                                                    {formatCell(
                                                        row[
                                                            quarter.percentKey as keyof SalesData
                                                        ] as number,
                                                        true
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
