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
import { motion, AnimatePresence } from 'framer-motion';
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

const GROUP_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'front end': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500' },
  'back end': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'devops': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
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

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 pt-16 font-sans selection:bg-indigo-100" dir="rtl">
      <Listbox value={selected} onChange={setSelected} multiple>
        <div className="relative w-full max-w-[720px] px-4 z-[100]">
          {/* Trigger Button */}
          <Listbox.Button className="group flex w-full items-center justify-between rounded-2xl border-2 border-white bg-white/80 px-6 py-4 text-right shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:border-indigo-300 hover:shadow-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">مهارت‌های مورد نظر</span>
              <span className="text-base font-semibold text-slate-700">
                {selected.length === 0 ? 'یک یا چند مورد انتخاب کنید' : `${selected.length} مهارت انتخاب شده`}
              </span>
            </div>
            <ChevronUpDownIcon className="h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <Listbox.Options className="absolute mt-4 w-[calc(100%-32px)] overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
              
              {/* Header: Search & Actions */}
              <div className="bg-white/50 p-6 space-y-4">
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute right-4 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="جستجو در بین صدها مهارت..."
                    className="w-full rounded-xl bg-slate-100/50 py-3 pr-12 pl-4 text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                
                <div className="flex items-center justify-between px-1">
                  <div className="flex gap-4">
                    <button type="button" onClick={handleToggleAll} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      {selected.length === allFiltered.length ? 'لغو انتخاب همه' : 'انتخاب همه نتایج'}
                    </button>
                    {selected.length > 0 && (
                      <button type="button" onClick={() => setSelected([])} className="text-xs font-bold text-rose-500">پاکسازی</button>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{allFiltered.length} مورد یافت شد</span>
                </div>
              </div>

              {/* Grid Columns */}
              <div className="flex h-[400px] gap-2 p-4 pt-0">
                {Object.entries(filtered).map(([group, items]) => (
                  <div key={group} className="flex flex-1 flex-col rounded-2xl bg-slate-50/50 border border-slate-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className="flex items-center justify-between p-3 transition-colors hover:bg-white"
                    >
                      <div className="flex items-center gap-2">
                         <span className={clsx("h-2 w-2 rounded-full", GROUP_CONFIG[group]?.dot)} />
                         <span className="text-xs font-black uppercase tracking-tight text-slate-600">{group}</span>
                      </div>
                      <motion.div {...({ animate: { rotate: collapsedGroups[group] ? 0 : 180 } } as any)}>
                        <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                      </motion.div>
                    </button>

                    <div className="flex-1 relative">
                      {!collapsedGroups[group] && (
                        <VirtualGroup items={items} isChecked={isChecked} groupConfig={GROUP_CONFIG[group]} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              
              {/* Footer: Selected Tags */}
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div 
                  {...({ 
                    initial: { height: 0, opacity: 0 }, 
                    animate: { height: 'auto', opacity: 1 }, 
                    exit: { height: 0, opacity: 0 } 
                  } as any)}
                  className="border-t border-slate-100 bg-slate-50/80 p-5 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {/* رندر کردن فقط ۱۰ مورد اول */}
                    {selected.slice(0, 10).map((item, idx) => (
                      <motion.span
                        key={item.id}
                        {...({
                          initial: { opacity: 0, scale: 0.8 },
                          animate: { opacity: 1, scale: 1 },
                          transition: { delay: idx * 0.02 }
                        } as any)}
                        className={clsx(
                          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ring-1 ring-inset ring-black/5',
                          GROUP_CONFIG[item.group]?.bg,
                          GROUP_CONFIG[item.group]?.text
                        )}
                      >
                        {item.label}
                        <button 
                          type="button"
                          onClick={(e) => handleRemoveItem(e, item.id)} 
                          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </motion.span>
                    ))}

                    {/* نمایش تعداد باقی‌مانده */}
                    {selected.length > 10 && (
                      <motion.div
                        {...({ initial: { opacity: 0 }, animate: { opacity: 1 } } as any)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm"
                      >
                        <span className="text-[11px] font-black text-slate-500">
                          +{selected.length - 10} مورد دیگر
                        </span>
                        <button 
                          type="button"
                          onClick={() => setSelected([])}
                          className="text-[10px] font-bold text-rose-500 hover:underline border-r border-slate-200 pr-2 mr-1"
                        >
                          لغو همه
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function VirtualGroup({ items, isChecked, groupConfig }: { items: Option[]; isChecked: (id: number) => boolean; groupConfig: any }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="absolute inset-0 overflow-auto scrollbar-hide">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
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
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                  } as any)}
                  className={clsx(
                    'absolute top-0 right-0 flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm transition-all duration-200',
                    active ? 'bg-white shadow-sm z-10' : 'bg-transparent',
                    checked ? 'text-indigo-600' : 'text-slate-500'
                  )}
                  style={{
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`,
                  }}
                >
                  <span className="flex items-center gap-3 truncate font-medium">
                    <div className={clsx(
                      "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all",
                      checked ? "border-indigo-500 bg-indigo-500 shadow-lg shadow-indigo-200" : "border-slate-200"
                    )}>
                      {checked && <CheckIcon className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                    </div>
                    {item.label}
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