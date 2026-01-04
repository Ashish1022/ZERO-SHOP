"use client";

interface SizeSliderProps {
    value: number;
    onChange: (value: number) => void;
}

export default function SizeSlider({ value, onChange }: SizeSliderProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Size</h3>
                <span className="text-2xl font-bold">{value}"</span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>2"</span>
                    <span>10"</span>
                </div>
            </div>
        </div>
    );
}
