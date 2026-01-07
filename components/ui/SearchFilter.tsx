
import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  placeholder = 'Search...',
  className = '',
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterToggle = (filterValue: string) => {
    const newFilters = activeFilters.includes(filterValue)
      ? activeFilters.filter(f => f !== filterValue)
      : [...activeFilters, filterValue];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const activeFilterLabels = useMemo(() => {
    return filters
      .filter(filter => activeFilters.includes(filter.value))
      .map(filter => filter.label);
  }, [filters, activeFilters]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 bg-bg-light border border-border/30 rounded-lg text-text placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder={placeholder}
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 border-border/30 text-text hover:bg-bg-light hover:text-primary bg-transparent"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>

          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 border-red-400/30 hover:bg-red-400/10 bg-transparent"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-bg-light border border-border/30 rounded-lg shadow-xl shadow-black/50 z-20 backdrop-blur-xl">
            <div className="p-4 space-y-3">
              <h4 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">Filter by Category</h4>
              {filters.map((filter) => (
                <label key={filter.value} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(filter.value)}
                    onChange={() => handleFilterToggle(filter.value)}
                    className="w-4 h-4 text-primary bg-bg-dark border-border rounded focus:ring-primary focus:ring-2 accent-primary"
                  />
                  <span className="text-sm text-text group-hover:text-primary transition-colors">{filter.label}</span>
                  {filter.count !== undefined && (
                    <span className="text-xs text-text-muted">({filter.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterLabels.map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30"
            >
              {label}
              <button
                onClick={() => handleFilterToggle(filters.find(f => f.label === label)?.value || '')}
                className="ml-2 hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for search and filter logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSearchFilter = <T extends Record<string, any>>(
  data: T[],
  searchFields: (keyof T)[],
  filterField?: keyof T
) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    if (filterField && activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        const value = item[filterField];
        return value && activeFilters.includes(value.toString());
      });
    }

    return filtered;
  }, [data, searchValue, activeFilters, searchFields, filterField]);

  const filterOptions = useMemo(() => {
    if (!filterField) return [];

    const options = new Map<string, number>();
    data.forEach(item => {
      const value = item[filterField];
      if (value) {
        const key = value.toString();
        options.set(key, (options.get(key) || 0) + 1);
      }
    });

    return Array.from(options.entries()).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));
  }, [data, filterField]);

  return {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    filteredData,
    filterOptions,
  };
};
