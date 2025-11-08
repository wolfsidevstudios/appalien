import React, { useState } from 'react';
import { searchDribbble } from '../services/dribbbleService';
import type { DribbbleShot } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SearchPanelProps {
    onSelectImage: (url: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ onSelectImage }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DribbbleShot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const data = await searchDribbble(query);
            setResults(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Dribbble for UI inspiration..."
                    className="flex-grow bg-gray-800 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-700"
                />
                <button type="submit" className="bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-cyan-600 transition-colors" disabled={isLoading}>
                    {isLoading ? <SpinnerIcon /> : 'Search'}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <SpinnerIcon />
                        <span className="ml-2 text-gray-400">Searching...</span>
                    </div>
                )}
                {error && <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">{error}</div>}
                {!isLoading && !error && results.length === 0 && (
                     <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <p>Search for UI designs to use as visual context for the AI.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {results.map(shot => (
                        <div key={shot.id} className="cursor-pointer group relative" onClick={() => onSelectImage(shot.images.hidpi || shot.images.normal)}>
                            <img src={shot.images.normal} alt={shot.title} className="rounded-lg w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 rounded-lg">
                                <p className="text-white text-center text-sm font-bold">Click to use as context</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
