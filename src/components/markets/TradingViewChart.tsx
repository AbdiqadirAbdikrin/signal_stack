"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TradingViewRange = "1D" | "1W" | "1M" | "1Y";
type TradingViewMarketType = "stocks" | "crypto" | "forex";

interface TradingViewChartProps {
    symbols: string[];
    marketType: TradingViewMarketType;
    title?: string;
    defaultSymbol?: string;
}

export function TradingViewChart({
    symbols,
    marketType,
    title = "Market overview",
    defaultSymbol,
}: TradingViewChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol ?? symbols[0] ?? "NASDAQ:AAPL");
    const [selectedRange, setSelectedRange] = useState<TradingViewRange>("1M");

    const rangeOptions = useMemo<TradingViewRange[]>(() => ["1D", "1W", "1M", "1Y"], []);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const container = containerRef.current;
        container.innerHTML = "";

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetContainer.style.height = "600px";
        widgetContainer.style.width = "100%";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: false,
            width: "100%",
            height: 600,
            symbol: selectedSymbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_top_toolbar: false,
            allow_symbol_change: true,
            calendar: false,
            support_host: "https://www.tradingview.com",
        });

        container.appendChild(widgetContainer);
        container.appendChild(script);

        return () => {
            container.innerHTML = "";
        };
    }, [marketType, selectedRange, selectedSymbol]);

    return (
        <div className="my-6 w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-2xl">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">{title}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{selectedSymbol}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        aria-label="Select market symbol"
                        value={selectedSymbol}
                        onChange={(event) => setSelectedSymbol(event.target.value)}
                        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
                    >
                        {symbols.map((symbol) => (
                            <option key={symbol} value={symbol}>
                                {symbol}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-wrap gap-2">
                        {rangeOptions.map((range) => (
                            <button
                                key={range}
                                type="button"
                                onClick={() => setSelectedRange(range)}
                                className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${selectedRange === range
                                    ? "bg-sky-500 text-slate-950"
                                    : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div
                ref={containerRef}
                className="tradingview-widget-container w-full min-h-[600px]"
                style={{ height: "600px", minHeight: "600px", width: "100%" }}
            />
        </div>
    );
}
