console.log("SCRIPT LOADED");

const BASE_URL = "http://localhost:3000/api"
// const userId = localStorage.getItem("userId")
// if (!userId && window.location.pathname.includes("index.html")) {
//     window.location.href = "login.html"
// }

const token = localStorage.getItem("token");

// Only redirect to login if we are trying to access the main app (index.html)
if (!token && window.location.pathname.includes("index.html")) {
    window.location.href = "login.html";
}

// Optional: If we ALREADY have a token, don't let user see login.html
if (token && window.location.pathname.includes("login.html")) {
    window.location.href = "index.html";
}
// //****                                                           Sign UP 
// async function signup() {
//     const email = document.getElementById("email").value.trim()
//     const password = document.getElementById("password").value.trim()
//     if (!email || !password) {
//         alert("Fill all Fields")
//         return
//     }
//     const res = await fetch(`${BASE_URL}/signup`, {
//         method:"POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//     alert("Signup Successful")
//     window.location.href = "login.html"

// }


// //********                                                      LOGIN  

// async function login() {
//     const email = document.getElementById("email").value.trim()
//     const password = document.getElementById("password").value.trim()
//     if (!email || !password) {
//         alert("Fill all fields!")
//         return
//     }
//     const res = await fetch(`${BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })

//     const token = await res.json()
//     if (!token) {
//         alert("Login failed")
//         return
//     }
//     localStorage.setItem("token", token)
//     window.location.href = "index.html"
// }


// SIGNUP
async function signup() {
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
        console.log(err);
        alert("Error connecting to server");
    }
}


// LOGIN


async function login(e) {
    e.preventDefault(); // ❗ stop page reload

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Fill all fields!");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const token = await res.json();

        console.log("TOKEN:", token); // debug

        if (!res.ok || !token) {
            alert("Login failed");
            return;
        }

        // ✅ store token
        localStorage.setItem("token", token);

        // ✅ redirect
        window.location.href = "index.html";

    } catch (error) {
        console.log(error);
        alert("Server error");
    }
}
//add Task
async function addTask() {
    const task = document.getElementById("task").value.trim()
    if (!task) {
        alert("Fill  all fields")
        return
    }
    const res = await fetch(`${BASE_URL}/todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ task })
    })

    loadTask()
}

//load Task
async function loadTask() {
    const res = await fetch(`${BASE_URL}/todo`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })

    const tasks = await res.json()
    const list = document.getElementById("taskList")
    list.innerHTML = ""



    //loop 
    tasks.forEach(task => {
        const li = document.createElement("li")
        li.textContent = task.task
        //delete and edit 
        const deletebtn = document.createElement("button")
        const editbtn = document.createElement("button")

        deletebtn.className = "deletebtn"
        editbtn.className = "editbtn"
        deletebtn.textContent = "Delete"
        editbtn.textContent = "Edit"

        //delete btn
        deletebtn.addEventListener("click", async () => {
            try {
                const dataId = task._id
                const res = await fetch(`${BASE_URL}/todo/${dataId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
                )
                if (!res.ok) {
                    throw new Error("Token is invalid!")
                }
                loadTask()
            }
            catch (error) {
                console.log(error)
            }
        })
        //edit btn
        editbtn.addEventListener("click",  () => {
            try {
                
                const cancelbtn = document.createElement("button")
                const donebtn = document.createElement("button")
                const input = document.createElement("input")
                donebtn.textContent = "Done"
                cancelbtn.textContent = "Cancel"
                donebtn.className = "donebtn"
                cancelbtn.className = "cancelbtn"
                li.innerHTML = ""
                input.value = task.task
                const dataId = task._id
                li.append(input, donebtn, cancelbtn)
                
                // done btn
                donebtn.addEventListener("click", async () => {
                    try {
                        const newData = input.value.trim()
                        if (!newData) {
                            return
                        }
                        const res = await fetch(`${BASE_URL}/todo/${dataId}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("token")
                            },
                            body: JSON.stringify({ task: newData })
                        })

                        if (!res.ok) {
                            throw new Error("Something went Wrong")
                        }
                        loadTask()
                    }
                    catch (error) {
                        console.log(error)
                    }
                })

                // cancel btn
                cancelbtn.addEventListener("click", () => {
                    loadTask()
                })
            }
            catch (error) {
                console.log(error)
            }
        })


        li.append(editbtn, deletebtn)
        list.append(li)
    });

}


// auto load
// auto load
window.onload = () => {
    if (window.location.pathname.includes("index.html")) {
        if (!localStorage.getItem("token")) {
            window.location.href = "login.html";
        } else {
            loadTask();
        }
    }
};

// logout

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html"; 
}