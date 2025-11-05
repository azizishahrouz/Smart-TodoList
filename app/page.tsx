"use client";

import TodoList from "./components/todolist/todolist";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Todo App</h1>
        <p className="text-gray-500">Simple • Clean • Fast</p>
      </section>

      <section className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6">
        <TodoList />
      </section>

      <footer className="text-gray-400 text-sm mt-10 mb-4">
        © {new Date().getFullYear()} — Shahrouz Azizi
      </footer>
    </main>
  );
}
