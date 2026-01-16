import { useRef } from 'react';
import { Landmark, CreditCard, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Account } from '../types';
import {Link} from "react-router";

interface Props {
    accounts: Account[];
    totalBalance: number;
}

export const DashboardStats = ({ accounts, totalBalance }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-6 mb-8">
            {/* BULLET 1: COMPACT PREMIUM HEADER */}
            <div className="relative overflow-hidden bg-gray-900 rounded-3xl px-8 py-6 text-white shadow-xl">
                {/* Subtle Glow Effect */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Liquidity</p>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">
                            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>

                    {/* Mini Stats inside the dark card */}
                    <div className="flex gap-6 border-l border-white/10 pl-6 h-full items-center">
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Active Banks</p>
                            <p className="text-lg font-bold">{[...new Set(accounts.map(a => a.institutionName))].filter(Boolean).length}</p>
                        </div>
                        <Link to="/accounts" className= "bg-white/10 p-3 rounded-2xl">
                            <Wallet size={20} className="text-blue-400" />
                            {/*<Wallet size={20} className="text-blue-400" />*/}
                        </Link>
                    </div>
                </div>
            </div>

            {/* BULLET 2: SLICK CAROUSEL */}
            <div className="relative group">
                {/* Improved Navigation Arrows */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 shadow-xl rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-gray-700"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 shadow-xl rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-gray-700"
                >
                    <ChevronRight size={18} />
                </button>

                {/* The Carousel */}
                <div
                    ref={scrollRef}
                    className="flex flex-nowrap gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide snap-x snap-mandatory"
                >
                    {accounts.map((acc) => (
                        <div
                            key={acc.accountId}
                            className="flex-none w-72 snap-start bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-blue-100 transition-all"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                        {acc.subtype.includes('credit') ? (
                                            <CreditCard className="text-gray-400 group-hover:text-blue-500" size={14} />
                                        ) : (
                                            <Landmark className="text-gray-400 group-hover:text-blue-500" size={14} />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {acc.institutionName || 'Bank'}
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono text-gray-300 tracking-tighter">•• {acc.mask}</span>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700 text-sm truncate">{acc.name}</h4>
                                <p className="text-xl font-black text-gray-900 mt-0.5">
                                    ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* End padding spacer */}
                    <div className="flex-none w-8" />
                </div>
            </div>
        </div>
    );
};