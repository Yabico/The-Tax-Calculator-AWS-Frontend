// src/components/FilterSidebar.tsx
import React from 'react';
import { DATE_RANGES, type DateRangeKey, type FilterState } from "../types.ts";

interface FilterSidebarProps {
    filters: FilterState;
    categories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, categories }) => {
    // Destructure for cleaner code below
    const {
        searchTerm, setSearchTerm,
        activeCategory, setActiveCategory,
        dateRange, setDateRange
    } = filters;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Filters</h3>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Merchant name..."
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                    <select
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer text-sm appearance-none"
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Time Period</label>
                    <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-100">
                        {(Object.keys(DATE_RANGES) as DateRangeKey[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                    dateRange === range
                                        ? 'bg-white text-blue-600 shadow-sm scale-[1.02]'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;