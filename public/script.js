console.log("SCRIPT LOADED");

const BASE_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

// --- 1. PROTECTION & REDIRECT LOGIC ---
// This runs as soon as the page loads to ensure the user is where they should be.
window.onload = () => {
    const path = window.location.pathname;

    if (path.includes("index.html") || path === "/") {
        if (!token) {
            window.location.href = "login.html";
        } else {
            loadTask();
        }
    } 
    else if (path.includes("login.html") || path.includes("signup.html")) {
        if (token) {
            window.location.href = "index.html";
        }
    }
};

// --- 2. AUTHENTICATION FUNCTIONS ---

async function signup(e) {
    if (e) e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Fill all fields!");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.message || "Signup failed");
            return;
        }

        alert("Signup successful!");
        window.location.href = "login.html";
    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
}

async function login(e) {
    if (e) e.preventDefault(); // ✅ Properly stop page reload

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Fill all fields!");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok || !data) {
            alert("Login failed. Check credentials.");
            return;
        }

        // ✅ SAFE TOKEN STORAGE: 
        // Handles both string responses and { token: "..." } object responses.
        const tokenToStore = data.token ? data.token : data;
        
        localStorage.setItem("token", tokenToStore);
        window.location.href = "index.html";

    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Is your backend running?");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// --- 3. TODO FUNCTIONS ---

async function addTask() {
    const taskInput = document.getElementById("task");
    const taskValue = taskInput.value.trim();
    
    if (!taskValue) {
        alert("Enter a task!");
        return;
    }
    
    await fetch(`${BASE_URL}/todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ task: taskValue })
    });

    taskInput.value = ""; // Clear input
    loadTask();
}

async function loadTask() {
    const list = document.getElementById("taskList");
    if (!list) return; // Prevent error if element doesn't exist on page

    try {
        const res = await fetch(`${BASE_URL}/todo`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });

        const tasks = await res.json();
        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.task;

            const deletebtn = document.createElement("button");
            const editbtn = document.createElement("button");

            deletebtn.className = "deletebtn";
            editbtn.className = "editbtn";
            deletebtn.textContent = "Delete";
            editbtn.textContent = "Edit";

            deletebtn.onclick = () => deleteTask(task._id);
            editbtn.onclick = () => setupEditMode(li, task);

            li.append(editbtn, deletebtn);
            list.append(li);
        });
    } catch (err) {
        console.error("Load Task Error:", err);
    }
}

async function deleteTask(id) {
    await fetch(`${BASE_URL}/todo/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    loadTask();
}

function setupEditMode(li, task) {
    li.innerHTML = "";
    const input = document.createElement("input");
    input.value = task.task;
    
    const donebtn = document.createElement("button");
    const cancelbtn = document.createElement("button");
    
    donebtn.textContent = "Done";
    cancelbtn.textContent = "Cancel";

    donebtn.onclick = async () => {
        const newData = input.value.trim();
        if (!newData) return;

        await fetch(`${BASE_URL}/todo/${task._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ task: newData })
        });
        loadTask();
    };

    cancelbtn.onclick = () => loadTask();
    li.append(input, donebtn, cancelbtn);
}