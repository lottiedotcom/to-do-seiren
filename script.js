// === USER DATA & ASSETS ===

// 1. MIHARU ASSETS
const assistantAssets = {
    idle: "https://i.postimg.cc/7PTStzS5/Miharu-Sena-Kanaka-102.webp",
    panic: "https://i.postimg.cc/XNFykb0G/dkue4ms-e6745b82-c5c5-4ff7-8b51-661ac520dab6.png"
};

// 2. GACHA POOL (Your 21 Cards)
const gachaPool = [
    { id: 1, name: "Senpai No!", rarity: "R", img: "https://i.postimg.cc/T2CvSyxB/08ab55e72055d80ed0c3763bb45469ef.jpg" },
    { id: 2, name: "Oops!", rarity: "C", img: "https://i.postimg.cc/mZ8Wqc40/28b5885bdec16466708559c40533333a.jpg" },
    { id: 3, name: "Lace ♡", rarity: "C", img: "https://i.postimg.cc/kMfPZV97/291ca55aad2e438c98270a34eeac5454.jpg" },
    { id: 4, name: "Bottom view...", rarity: "SSR", img: "https://i.postimg.cc/L4NF7qSc/462057dedebf05c417259418122a0653.jpg" },
    { id: 5, name: "Excited!", rarity: "R", img: "https://i.postimg.cc/c1XGjKW9/80945de6033d6e1c04de3bbd1bdea46d.png" },
    { id: 6, name: "Beach Day", rarity: "C", img: "https://i.postimg.cc/dQ4cX7vv/girls_bravo_stitch_miharu_sena_kanaka_08_by_anime4799_dgo3xdo_pre.jpg" },
    { id: 7, name: "Group Selfie", rarity: "SSR", img: "https://i.postimg.cc/BZMfy8s9/91f5b3e61adbcc2ced3b138164189ff6.webp" },
    { id: 8, name: "Stuck..", rarity: "C", img: "https://i.postimg.cc/xjtV7kY0/c6da0485d3f3da4e6db898805d0978da.png" },
    { id: 9, name: "Pool Nerves", rarity: "C", img: "https://i.postimg.cc/XNFykb0G/dkue4ms_e6745b82_c5c5_4ff7_8b51_661ac520dab6.png" },
    { id: 10, name: "Shy,,", rarity: "R", img: "https://i.postimg.cc/pr8GP17F/9110_aedc0.jpg" },
    { id: 11, name: "Kirie", rarity: "C", img: "https://i.postimg.cc/ZRXsthfF/Kirie_Kojima_full_cha.webp" },
    { id: 12, name: "Kirie Xmas", rarity: "C", img: "https://i.postimg.cc/RVLdGfzJ/69801_1521809594.jpg" },
    { id: 13, name: "Kirie Beach", rarity: "R", img: "https://i.postimg.cc/RVLdGfzQ/ddrq1w2_bf666828_8e67_44c1_9d8c_1efb8a9e5b92.jpg" },
    { id: 14, name: "Kirie Upset", rarity: "R", img: "https://i.postimg.cc/vHthX9dn/dgnw7kr_ce09ec78_e47c_45a4_a5cc_2f110edc0678.jpg" },
    { id: 15, name: "Peak !!", rarity: "SSR", img: "https://i.postimg.cc/DyP65sKQ/dgnwzak_55a3d116_c368_43bc_9602_58df0c53f53d.png" },
    { id: 16, name: "Maharu..!", rarity: "C", img: "https://i.postimg.cc/3N7pDSND/Girls_Bravo_07_25.jpg" },
    { id: 17, name: "Oops..", rarity: "R", img: "https://i.postimg.cc/6qwRGjqR/images_(2).jpg" },
    { id: 18, name: "Cute Redhead", rarity: "C", img: "https://i.postimg.cc/zv5WRtvK/Maharu.webp" },
    { id: 19, name: "Oh...", rarity: "SSR", img: "https://i.postimg.cc/Y9QY0Krx/tumblr_24b12cc03d9a94b0d608068b51831fe0_226443e3_540.jpg" },
    { id: 20, name: "Sleepi", rarity: "C", img: "https://i.postimg.cc/g0V26YhY/864015593_jpg.webp" },
    { id: 21, name: "Bath...", rarity: "SSR", img: "https://i.postimg.cc/rp1wt84w/images_(3).jpg" }
];

// === STATE MANAGEMENT ===
let state = {
    bananas: 0,
    tasks: [],
    inventory: [], // IDs of collected cards
    panicMode: false
};

// Load from LocalStorage
if(localStorage.getItem('bravoState')) {
    state = JSON.parse(localStorage.getItem('bravoState'));
}

// === DOM ELEMENTS ===
const els = {
    bananaCount: document.getElementById('banana-count'),
    pendingCount: document.getElementById('pending-count'),
    taskList: document.getElementById('task-list'),
    assistantImg: document.getElementById('assistant-img'),
    assistantBubble: document.getElementById('assistant-dialogue'),
    appBg: document.getElementById('app-background'),
    galleryGrid: document.getElementById('gallery-grid')
};

// === INITIALIZATION ===
function init() {
    updateUI();
    renderTasks();
    renderGallery();
    setInterval(checkOverdue, 10000); // Check for panic mode every 10 sec
    checkOverdue();
}

// === LOGIC ===

function saveState() {
    localStorage.setItem('bravoState', JSON.stringify(state));
    updateUI();
}

function updateUI() {
    els.bananaCount.innerText = state.bananas;
    // Panic Visuals
    if (state.panicMode) {
        document.body.classList.add('panic-active');
        els.appBg.classList.remove('bg-safe');
        els.appBg.classList.add('bg-panic');
        els.assistantImg.src = assistantAssets.panic;
        els.assistantBubble.innerText = "Why is it late...? Are you leaving me?";
    } else {
        document.body.classList.remove('panic-active');
        els.appBg.classList.add('bg-safe');
        els.appBg.classList.remove('bg-panic');
        els.assistantImg.src = assistantAssets.idle;
    }
}

// --- TASK SYSTEM ---
function addTask() {
    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const type = document.getElementById('task-type');

    if (!input.value) return;

    const newTask = {
        id: Date.now(),
        text: input.value,
        due: date.value, // ISO string
        type: type.value,
        completed: false
    };

    state.tasks.push(newTask);
    input.value = '';
    saveState();
    renderTasks();
    checkOverdue();
    
    // Miharu Reaction
    els.assistantBubble.innerText = "New mission? Don't disappoint me.";
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            state.bananas += 10;
            els.assistantBubble.innerText = "Good girl! Here is a banana.";
        }
        saveState();
        renderTasks();
        checkOverdue();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState();
    renderTasks();
    checkOverdue();
}

function renderTasks() {
    els.taskList.innerHTML = '';
    let pending = 0;

    state.tasks.forEach(task => {
        if (!task.completed) pending++;
        
        const isOverdue = task.due && new Date(task.due) < new Date() && !task.completed;
        
        const li = document.createElement('li');
        li.className = `task-item task-${task.type} ${isOverdue ? 'task-overdue' : ''}`;
        
        li.innerHTML = `
            <span>
                ${isOverdue ? '⚠️ ' : ''} 
                <span style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.text}</span>
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${task.id})">X</button>
            </div>
        `;
        els.taskList.appendChild(li);
    });

    els.pendingCount.innerText = pending;
}

// --- PANIC SYSTEM ---
function checkOverdue() {
    const now = new Date();
    let hasOverdue = false;
    
    state.tasks.forEach(task => {
        if (task.due && new Date(task.due) < now && !task.completed) {
            hasOverdue = true;
        }
    });

    if (hasOverdue !== state.panicMode) {
        state.panicMode = hasOverdue;
        saveState();
    }
}

// --- GACHA SYSTEM ---
function pullGacha() {
    if (state.bananas < 50) {
        alert("Not enough Bananas! (Need 50)");
        return;
    }

    state.bananas -= 50;
    
    // Probability Logic
    const rand = Math.random();
    let rarity = 'C';
    if (rand > 0.6) rarity = 'R'; // 30%
    if (rand > 0.9) rarity = 'SSR'; // 10%

    // Filter Pool
    const pool = gachaPool.filter(c => c.rarity === rarity);
    const result = pool[Math.floor(Math.random() * pool.length)];

    // Add to Inventory if not exists (or allow duplicates? Let's unique for now)
    if (!state.inventory.includes(result.id)) {
        state.inventory.push(result.id);
    }

    saveState();
    
    // Show Result
    const resDiv = document.getElementById('gacha-result');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `
        <div class="card-display rarity-${result.rarity}" style="transform: scale(1.5);">
            <img src="${result.img}">
            <div class="card-info">${result.name}</div>
        </div>
        <p style="margin-top:20px; text-align:center;">You got a ${result.rarity}!</p>
        <button onclick="document.getElementById('gacha-result').classList.add('hidden'); renderGallery()">OK</button>
    `;
}

function renderGallery() {
    els.galleryGrid.innerHTML = '';
    state.inventory.forEach(id => {
        const item = gachaPool.find(c => c.id === id);
        if (item) {
            els.galleryGrid.innerHTML += `
                <div class="card-display rarity-${item.rarity}">
                    <img src="${item.img}">
                    <div class="card-info">${item.name}</div>
                </div>
            `;
        }
    });
}

// --- EXTRAS ---
function feedAssistant() {
    if (state.bananas >= 5) {
        state.bananas -= 5;
        saveState();
        els.assistantBubble.innerText = "Nom nom... You're sweet today.";
        // Simple shake animation
        els.assistantImg.style.transform = "rotate(10deg)";
        setTimeout(() => els.assistantImg.style.transform = "rotate(0deg)", 200);
    } else {
        alert("Need 5 Bananas!");
    }
}

function switchView(viewId) {
    document.querySelectorAll('section').forEach(el => el.classList.remove('active-view'));
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden-view'));
    document.getElementById(viewId).classList.add('active-view');
    document.getElementById(viewId).classList.remove('hidden-view');
}

// Boss Key (Double click Logo)
document.getElementById('boss-trigger').addEventListener('dblclick', () => {
    document.getElementById('boss-screen').classList.remove('hidden');
});

document.getElementById('boss-screen').addEventListener('dblclick', () => {
    document.getElementById('boss-screen').classList.add('hidden');
});

// Start
init();

