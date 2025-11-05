"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

type Todo = {
  id: number;
  text: string;
  done: boolean;
  createdAt: number;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // ✅ Load todos safely from localStorage (no React warning)
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // ✅ wrap in microtask to avoid sync state update warning
          queueMicrotask(() => setTodos(parsed));
        }
      } catch {
        console.warn("Invalid todos data in localStorage");
      }
    }
  }, []);

  // ✅ Save todos to localStorage on every change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const value = input.trim();
    if (!value) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: value,
      done: false,
      createdAt: Date.now(),
    };
    setTodos((s) => [newTodo, ...s]);
    setInput("");
  };

  const toggleDone = (id: number) =>
    setTodos((s) =>
      s.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const removeTodo = (id: number) =>
    setTodos((s) => s.filter((t) => t.id !== id));

  const startEdit = (t: Todo) => {
    setEditingId(t.id);
    setEditText(t.text);
  };

  const saveEdit = (id: number) => {
    const value = editText.trim();
    if (!value) return;
    setTodos((s) =>
      s.map((t) => (t.id === id ? { ...t, text: value } : t))
    );
    setEditingId(null);
    setEditText("");
  };

  return (
    <section className="w-full max-w-5xl mx-auto p-6">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
          Tasks
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add new task and press Enter"
            className="flex-1 md:flex-none border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="New task"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            aria-label="Add task"
          >
            Add
          </button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm text-gray-500">#</th>
              <th className="text-left px-4 py-3 text-sm text-gray-500">Task</th>
              <th className="text-left px-4 py-3 text-sm text-gray-500">Created</th>
              <th className="text-center px-4 py-3 text-sm text-gray-500">Status</th>
              <th className="text-center px-4 py-3 text-sm text-gray-500">Actions</th>
            </tr>
          </thead>

          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No tasks yet — add your first task!
                </td>
              </tr>
            ) : (
              todos.map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>

                  <td className="px-4 py-3 w-1/2">
                    {editingId === t.id ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(t.id)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label={`Edit task ${idx + 1}`}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm ${
                            t.done
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {t.text}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format
                      ? format(new Date(t.createdAt), "MMM d, HH:mm")
                      : new Date(t.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleDone(t.id)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        t.done
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-50 text-yellow-800"
                      }`}
                      aria-pressed={t.done}
                      aria-label={
                        t.done ? "Mark as not done" : "Mark as done"
                      }
                    >
                      {t.done ? "Done" : "Pending"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === t.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(t.id)}
                            className="text-sm px-3 py-1 rounded bg-indigo-600 text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditText("");
                            }}
                            className="text-sm px-3 py-1 rounded border"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(t)}
                            className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                            aria-label={`Edit task ${idx + 1}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeTodo(t.id)}
                            className="text-sm px-3 py-1 rounded bg-red-100 text-red-700"
                            aria-label={`Delete task ${idx + 1}`}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
