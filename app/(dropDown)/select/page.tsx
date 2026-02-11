'use client';

import { Fragment, useMemo, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// --- Types ---
type Option = {
  id: number;
  label: string;
  group: string;
};

// --- Data ---
const OPTIONS: Option[] = Array.from({ length: 600 }).map((_, i) => ({
  id: i,
  label: `مهارت ${i + 1}`,
  group: i < 200 ? 'front end' : i < 400 ? 'back end' : 'devops',
}));

const GROUP_COLORS: Record<string, string> = {
  'front end': 'bg-fuchsia-100 text-fuchsia-700',
  'back end': 'bg-emerald-100 text-emerald-700',
  'devops': 'bg-sky-100 text-sky-700',
};

export default function AdvancedDropdown() {
  const [selected, setSelected] = useState<Option[]>([]);
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map: Record<string, Option[]> = {};
    OPTIONS.forEach(o => {
      map[o.group] ??= [];
      map[o.group].push(o);
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    const res: Record<string, Option[]> = {};
    Object.entries(grouped).forEach(([group, items]) => {
      const f = items.filter(i =>
        i.label.toLowerCase().includes(search.toLowerCase())
      );
      if (f.length) res[group] = f;
    });
    return res;
  }, [grouped, search]);

  const allFiltered = Object.values(filtered).flat();

  const handleToggleAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(selected.length === allFiltered.length ? [] : allFiltered);
  };

  const handleRemoveItem = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(prev => prev.filter(i => i.id !== id));
  };

  const isChecked = (id: number) => selected.some(s => s.id === id);
  const toggleGroup = (group: string) => setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));

  const triggerText = useMemo(() => {
    if (!selected.length) return 'مهارت‌ها را انتخاب کنید';
    if (selected.length === 1) return selected[0].label;
    return `${selected.length} مهارت انتخاب شده است`;
  }, [selected]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-16 font-sans" dir="rtl">
      <Listbox value={selected} onChange={setSelected} multiple>
        <div className="relative w-[640px] z-[100]">
          <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-5 py-3 text-base text-gray-800 shadow-lg transition-all duration-200 hover:shadow-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 active:scale-[0.99]">
            <span className="truncate">{triggerText}</span>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <Listbox.Options className="fixed top-[120px] z-50 w-[640px] origin-top overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-sm p-4">
              
              <div className="flex items-center gap-3 border-b border-gray-100 px-2 py-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو در مهارت‌ها..."
                  className="w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-gray-400 hover:text-red-500 transition">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="flex justify-between px-2 py-2 text-sm text-gray-500 border-b border-gray-100">
                <button type="button" onClick={handleToggleAll} className="font-semibold text-indigo-600 hover:text-indigo-800 transition">
                  {selected.length === allFiltered.length ? 'پاک کردن همه' : 'انتخاب همه'}
                </button>
                <span className="text-xs font-medium">{allFiltered.length} مورد قابل مشاهده</span>
              </div>

              <div className="flex gap-3 mt-3 max-h-[320px]">
                {Object.entries(filtered).map(([group, items]) => (
                  <div key={group} className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div
                      onClick={() => toggleGroup(group)}
                      className="sticky top-0 z-10 cursor-pointer bg-white/95 backdrop-blur-sm px-3 py-2 text-sm font-bold text-gray-700 flex justify-between items-center border-b hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className={clsx('px-2 py-1 rounded-lg text-xs font-semibold', GROUP_COLORS[group])}>
                          {group}
                        </span>
                        <span className="text-gray-500 text-xs">({items.length})</span>
                      </span>
                      {/* آیکون چرخشی با استفاده از آبجکت اسپرداشده as any */}
                      <motion.div 
                        {...({
                          animate: { rotate: collapsedGroups[group] ? 0 : 180 },
                          transition: { duration: 0.2 }
                        } as any)}
                      >
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </div>

                    {!collapsedGroups[group] && (
                      <VirtualGroup items={items} isChecked={isChecked} />
                    )}
                  </div>
                ))}
              </div>

              {selected.length > 0 && (
                <div className="border-t border-gray-200 p-4 mt-3 max-h-[120px] overflow-y-auto">
                  <p className="mb-2 text-sm font-bold text-gray-600">انتخاب شده ({selected.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.slice(0, 15).map((item, idx) => (
                      <motion.span
                        key={item.id}
                        {...({
                          initial: { opacity: 0, scale: 0.9 },
                          animate: { opacity: 1, scale: 1 },
                          transition: { delay: idx * 0.05 }
                        } as any)}
                        className={clsx(
                          'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all border',
                          GROUP_COLORS[item.group]
                        )}
                      >
                        {item.label}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveItem(e, item.id)}
                          className="p-0.5 -mr-1 rounded-full hover:bg-black/10"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function VirtualGroup({ items, isChecked }: { items: Option[]; isChecked: (id: number) => boolean }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-auto bg-white">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index];
          const checked = isChecked(item.id);
          
          return (
            <Listbox.Option
              key={item.id}
              value={item}
              as={Fragment}
            >
              {({ active }) => (
                <motion.div
                  {...({
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.15 }
                  } as any)}
                  className={clsx(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm border-b border-gray-100 transition-colors',
                    active ? 'bg-indigo-50' : 'bg-white',
                    checked ? 'text-indigo-700 font-semibold' : 'text-gray-700'
                  )}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`,
                  }}
                >
                  <span className="flex items-center gap-2 truncate">
                    {checked && <CheckIcon className="h-4 w-4 text-indigo-500 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                  </span>
                </motion.div>
              )}
            </Listbox.Option>
          );
        })}
      </div>
    </div>
  );
}