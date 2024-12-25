import React, { useState } from "react";
import "./App.css";

const initialData = [
  {
    id: "1",
    title: "To Do",
    tasks: [
      { id: "1", content: "Task 1" },
      { id: "2", content: "Task 2" },
    ],
  },
  {
    id: "2",
    title: "In Progress",
    tasks: [
      { id: "3", content: "Task 3" },
    ],
  },
  {
    id: "3",
    title: "Done",
    tasks: [
      { id: "4", content: "Task 4" },
    ],
  },
];

export default function App() {
  const [columns, setColumns] = useState(initialData);

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, columnId) => {
    const taskId = e.dataTransfer.getData("taskId");

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === taskId)
    );
    const task = sourceColumn.tasks.find((t) => t.id === taskId);

    const updatedSourceTasks = sourceColumn.tasks.filter((t) => t.id !== taskId);
    const updatedSourceColumn = { ...sourceColumn, tasks: updatedSourceTasks };

    const targetColumn = columns.find((col) => col.id === columnId);
    const updatedTargetTasks = [...targetColumn.tasks, task];
    const updatedTargetColumn = { ...targetColumn, tasks: updatedTargetTasks };

    setColumns(
      columns.map((col) => {
        if (col.id === sourceColumn.id) return updatedSourceColumn;
        if (col.id === targetColumn.id) return updatedTargetColumn;
        return col;
      })
    );
  };

  return (
    <div className="flex w-screen h-screen p-4 space-x-4 bg-gray-100">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col w-1/3 p-4 space-y-4 bg-white rounded shadow"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <h2 className="text-xl font-semibold text-center text-gray-700">
            {column.title}
          </h2>
          {column.tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="p-4 text-sm text-gray-800 bg-gray-200 rounded shadow cursor-pointer hover:bg-gray-300"
            >
              {task.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
