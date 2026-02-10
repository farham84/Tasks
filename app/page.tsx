'use client';

import { motion } from "framer-motion";
import Link from "next/link";

const tasks = [
  {
    title: "داشبورد مدیریت (Admin Dashboard)",
    desc: "پیاده‌سازی یک پنل مدیریت شامل احراز هویت، مدیریت کاربران و محصولات با استفاده از DummyJSON API. تمرکز این بخش بر ساختاردهی کامپوننت‌ها، مدیریت state، و ارتباط با API بوده است.",
    href: "/dashboard",
  },
  {
    title: "مرورگر بازی‌ها (Games Explorer)",
    desc: "یک اپلیکیشن کامل برای نمایش لیست بازی‌ها با قابلیت جستجو، فیلتر، صفحه‌بندی و صفحه جزئیات هر بازی. داده‌ها از RAWG API دریافت شده و تمرکز اصلی روی UX، Performance و طراحی مدرن مشابه Steam بوده است.",
    href: "/games",
  },
  {
    title: "کامپوننت Select پیشرفته",
    desc: "طراحی و پیاده‌سازی یک Select کاملاً قابل استفاده مجدد با پشتیبانی از جستجو، انتخاب چندگانه (Multi-select) و کنترل کامل UI به صورت Headless با تمرکز بر دسترسی‌پذیری (Accessibility).",
    href: "/select",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">

      {/* NAME */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
      >
        فرهام طیبی
      </motion.h1>

      {/* INTRO */}
      <p className="text-gray-600 mb-14 text-center max-w-2xl leading-relaxed">
        این پروژه شامل <span className="font-semibold text-gray-800">۳ تسک فنی مستقل</span> است که به عنوان بخشی از فرآیند ارزیابی فنی پیاده‌سازی شده‌اند.
        هر تسک روی یک جنبه مشخص از توسعه Front-End تمرکز دارد؛ از کار با API و مدیریت داده‌ها گرفته تا طراحی کامپوننت‌های قابل استفاده مجدد و تجربه کاربری.
        <br />
        لطفاً برای بررسی، یکی از تسک‌ها را انتخاب کنید.
        <br />
        <span className="text-2xl text-red-700">توجه داشته باشید که تمامی این تسک ها در دو روز انجام شده و مشاهده شدن باگ های جزیی میتواند عادی باشید</span>
        <br />
        <br />
        <span className="text-2xl text-red-700">(از هیچ قالب اماده ای در تسک ها استفاده نشده است)</span>
      </p>

      {/* TASKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-white rounded-2xl shadow-md p-7 hover:shadow-xl transition flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              {task.title}
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
              {task.desc}
            </p>

            <Link
              href={task.href}
              className="inline-block self-start bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              مشاهده تسک →
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
