import { useState } from 'react';
import { CATEGORIES, SAMPLE_TEMPLATES } from '../data';
import { Search, Filter, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { HarnessCard } from '../components/HarnessCard';

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = SAMPLE_TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory ? t.categoryId === selectedCategory : true;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Harness Catalog</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Discover, license, and deploy battle-tested agent packages.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="bg-white border border-[#E5E7EB] text-slate-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 flex-grow md:flex-grow-0">
            <Filter size={16} />
            Filters
          </button>
          <button className="btn-primary flex items-center justify-center gap-2 flex-grow md:flex-grow-0">
            <Plus size={18} />
            Request Custom
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between card p-4 w-full">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search harnesses..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar flex-grow md:justify-end">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-[#E5E7EB]'}`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-[#E5E7EB]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="h-full"
          >
            <HarnessCard template={template} />
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="card py-20 flex flex-col items-center justify-center text-center">
           <Search size={32} className="text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-900">No Harnesses Found</h3>
           <p className="text-sm text-slate-500 font-medium">Try adjusting your category or search filters.</p>
        </div>
      )}
    </div>
  );
}
