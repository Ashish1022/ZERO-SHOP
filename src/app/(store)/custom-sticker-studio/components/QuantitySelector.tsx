"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export default function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quantity</h3>
                {value >= 5 && (
                    <span className="text-xs text-foreground font-medium px-2 py-1 bg-gray-100 rounded-full">
                        {value >= 10 ? "10% OFF" : "5% OFF"}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onChange(Math.max(1, value - 1))}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value <= 1}
                >
                    <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 text-center">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={value}
                        onChange={(e) => onChange(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center text-2xl font-bold bg-transparent border-none outline-none"
                    />
                </div>
                <button
                    onClick={() => onChange(Math.min(100, value + 1))}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value >= 100}
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
                {[5, 10, 25, 50].map((qty) => (
                    <button
                        key={qty}
                        onClick={() => onChange(qty)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${value === qty
                            ? "bg-foreground text-white"
                            : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                            }`}
                    >
                        {qty}
                    </button>
                ))}
            </div>
        </div>
    );
}
