"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type MarketChartRange = "1D" | "7D" | "1M" | "1Y";

export interface MarketChartPoint {
    timestamp: string;
    price: number;
}

interface MarketChartProps {
    data: MarketChartPoint[];
    symbol?: string;
    name?: string;
    currency?: string;
    height?: number;
}

const rangeOptions: MarketChartRange[] = ["1D", "7D", "1M", "1Y"];

function formatCurrency(value: number, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 1000 ? 0 : 4,
    }).format(value);
}

function formatShortDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

type MarketChartTooltipProps = {
    active?: boolean;
    payload?: Array<{ value?: number | string | Array<number | string> }>;
    label?: string | number;
};

function TooltipContent({ active, payload, label }: MarketChartTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const rawValue = payload[0]?.value;
    const value = Number(Array.isArray(rawValue) ? rawValue[0] ?? 0 : rawValue ?? 0);

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-950/95 p-3 text-left text-sm text-slate-100 shadow-lg backdrop-blur-sm">
            <p className="font-medium text-slate-200">{formatShortDate(String(label ?? ""))}</p>
            <p className="mt-1 text-base font-semibold text-white">{formatCurrency(value, "USD")}</p>
        </div>
    );
}

export function MarketChart({ data, symbol = "", name = "Market", currency = "USD", height = 220 }: MarketChartProps) {
    const [range, setRange] = useState<MarketChartRange>("1M");

    const visibleData = useMemo(() => {
        if (data.length <= 12) {
            return data;
        }

        const take = range === "1D" ? 8 : range === "7D" ? 12 : range === "1M" ? 20 : 36;
        return data.slice(-take);
    }, [data, range]);

    if (!visibleData.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Market chart</p>
                <p className="mt-3 text-base text-slate-700">Market chart unavailable</p>
            </div>
        );
    }

    const firstPrice = Number(visibleData[0]?.price ?? 0);
    const lastPrice = Number(visibleData[visibleData.length - 1]?.price ?? 0);
    const percentDelta = firstPrice === 0 ? 0 : ((lastPrice - firstPrice) / firstPrice) * 100;

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Market chart</p>
                    <p className="mt-1 text-sm text-slate-600">{name}{symbol ? ` · ${symbol}` : ""}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {rangeOptions.map((rangeOption) => (
                        <button
                            key={rangeOption}
                            type="button"
                            onClick={() => setRange(rangeOption)}
                            className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${range === rangeOption
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            {rangeOption}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(lastPrice, currency)}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${percentDelta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {percentDelta >= 0 ? "+" : ""}{percentDelta.toFixed(2)}%
                </span>
            </div>

            <div className="w-full" style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visibleData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                        <defs>
                            <linearGradient id="marketFill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickFormatter={formatShortDate} minTickGap={30} tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis domain={([min, max]) => [Math.min(min, max) * 0.99, Math.max(min, max) * 1.01]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} width={54} />
                        <Tooltip content={<TooltipContent />} />
                        <Area type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#marketFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
