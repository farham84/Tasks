'use client';

import { motion } from "framer-motion";
import Link from "next/link";

const tasks = [
  {
    title: "Admin Dashboard",
    desc: "Login, Users & Products using DummyJSON API",
    href: "/dashboard",
  },
  {
    title: "Games Explorer",
    desc: "Games list, filters & single game page (RAWG API)",
    href: "/games",
  },
  {
    title: "Advanced Select Component",
    desc: "Headless UI Select with search & multi-select",
    href: "/select",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4 text-gray-900"
      >
        فرهام طیبی
      </motion.h1>

      <p className="text-gray-600 mb-12 text-center max-w-xl">
        این پروژه شامل ۳ تسک فنی است که با استفاده از React و Next.js پیاده‌سازی شده‌اند.
        لطفاً یک تسک را برای بررسی انتخاب کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
            <p className="text-gray-600 mb-6">{task.desc}</p>

            <Link
              href={task.href}
              className="inline-block bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              View Task →
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
