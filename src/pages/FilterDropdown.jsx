import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import React from 'react';

const FilterDropdown = ({ label, options, selected, setSelected }) => {
  return (
    <div className="relative w-36 text-sm">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300">
            <span className="block truncate">{selected || label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                  }`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default FilterDropdown;
