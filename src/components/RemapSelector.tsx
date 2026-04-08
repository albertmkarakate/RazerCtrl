import React, { useState } from 'react';
import functionsData from '../data/functions.json';

interface Props {
  hotspotId: string;
}

export function RemapSelector({ hotspotId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(functionsData[0].category);
  const [selectedFunction, setSelectedFunction] = useState('Default');

  const activeCategory = functionsData.find(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Function Category</label>
        <select 
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#00FF41] transition-colors"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {functionsData.map(cat => (
            <option key={cat.category} value={cat.category}>{cat.category}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Assign Action</label>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => setSelectedFunction('Default')}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              selectedFunction === 'Default' 
                ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/50' 
                : 'text-gray-400 hover:bg-white/5 border border-transparent'
            }`}
          >
            Default
          </button>
          
          {activeCategory?.items.map(item => (
            <button
              key={item}
              onClick={() => setSelectedFunction(item)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                selectedFunction === item 
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/50' 
                  : 'text-gray-400 hover:bg-white/5 border border-transparent'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {selectedFunction !== 'Default' && (
        <div className="pt-4 border-t border-[#2A2A2A]">
          <button className="w-full bg-[#00FF41] text-black font-bold py-2 rounded hover:bg-[#00cc33] transition-colors">
            SAVE MAPPING
          </button>
        </div>
      )}
    </div>
  );
}
