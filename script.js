const tasks = new Array (
    "Complete Blog on Throttling + Debouncing",
    "Make a list of 2025 Resolutions",
);
let fuse = undefined;
let debounceTimer;
let throttleTimer;


const onSubmit = (event) => {
    //Prevent default
    event.preventDefault();
    
    const text = document.getElementById("input").value.trim();
    document.getElementById("input").value = "";
    tasks.push(text);
    updateList();
}

const updateList = () => {
    const lists = document.getElementById("taskList");
    lists.innerHTML = "";

    //Loop through all elements in tasks
    tasks.forEach(task => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("flex", "items-center", "space-x-2");

        //Add Bullet Point Element
        const bullet = document.createElement("span");
        bullet.classList.add("h-2", "w-2", "bg-blue-500", "rounded-full");

        //Add Span Tag
        const taskText = document.createElement("span");
        taskText.textContent = task;

        taskElement.appendChild(bullet);
        taskElement.appendChild(taskText);
        lists.appendChild(taskElement);
    })
}

//Utility function to search within already entered values
const searchTasks = (query) => {
    const result = fuse.search(query);
    const filteredTasks = result.map(result => result.item)
    updateDropdown(filteredTasks);
}

const updateDropdown = (tasks) => {
    const dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = "";

    if(tasks.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = task;
        listItem.addEventListener("click", () => {
            document.getElementById("input").value = task;
            dropdown.style.display = "none";
        })
        dropdown.appendChild(listItem);
    });
    
    dropdown.style.display = "block";
}

const init = () => {
    console.log("Initializing...");
    //Update and render the list
    updateList();

    //Initialize Fuse with the updated array
    try{
        fuse = new Fuse(tasks, {
            includeScore: true,
            threshold: 0.3 //For sensitivity
        })
    } catch(e) {
        console.log("Error initializing Fuse:"+ fuse);
    }

    console.log("fuse:"+ fuse);
}

//An approach to showing Dropdown using Debouncing Logic
// document.getElementById("input").addEventListener("input", (event) => {
//     //Implement Debouncing - wait for 1 second of no input
//     clearTimeout(debounceTimer);
//     console.log("Input Detected, starting timeout")
//     debounceTimer = setTimeout(() => {
//         console.log("Timeout over now calling function");
//         const query = event.target.value;
//         searchTasks(query); // Call search function with the input value
//     }, 1000);
// });


//Similar approach to showing Dropdown Suggestions, but using Throttling
let lastCall = 0;  // To track the last time searchTasks was called
document.getElementById("input").addEventListener("input", (event) => {
    const now = Date.now();
    const delay = 1000; // Throttle delay (1 second)

    // If enough time has passed since the last call, run the search
    if (now - lastCall >= delay) {
        const query = event.target.value.trim();
        searchTasks(query); // Call search function with the input value
        lastCall = now; // Update last call time
    }
});

document.getElementById("submitButton").addEventListener("click", onSubmit);
document.addEventListener("DOMContentLoaded", init);