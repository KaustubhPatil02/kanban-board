import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import { auth, db } from "./firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const tasksRef = collection(db, "tasks");
      const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
        const userTasks = snapshot.docs
          .filter((doc) => doc.data().createdBy === user.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(userTasks);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const addTask = async () => {
    if (!taskText) return;
    const tasksRef = collection(db, "tasks");
    await addDoc(tasksRef, {
      text: taskText,
      status: "Todo",
      createdBy: user.uid,
      timestamp: Date.now(),
    });
    setTaskText("");
  };

  const updateTask = async (id, status) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { status });
  };

  const deleteTask = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="p-4">
      {/* User Profile */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <p>{user.displayName || "User"}</p>
        </div>
        <button
        className="px-4 py-2 mb-4 font-bold text-white bg-red-500 rounded hover:bg-red-700"
        onClick={() => signOut(auth)}
      >
        Sign Out
      </button>
        </div>
      

      <div className="flex gap-4">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder="Add a new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {["Todo", "In Progress", "Done"].map((status) => (
          <div key={status} className="p-4 border rounded">
            <h3 className="mb-4 font-bold">{status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="p-2 mb-2 bg-gray-100 rounded shadow"
                >
                  <p>{task.text}</p>
                  {status !== "Done" && (
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        updateTask(
                          task.id,
                          status === "Todo" ? "In Progress" : "Done"
                        )
                      }
                    >
                      Move to {status === "Todo" ? "In Progress" : "Done"}
                    </button>
                  )}
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
