// === DATA ===
const assets = {
    miharuIdle: "https://i.postimg.cc/7PTStzS5/Miharu-Sena-Kanaka-102.webp",
    miharuPanic: "https://i.postimg.cc/XNFykb0G/dkue4ms-e6745b82-c5c5-4ff7-8b51-661ac520dab6.png"
};

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

// === APP STATE ===
let state = { bananas: 0, tasks: [], inventory: [], panicMode: false };
if(localStorage.getItem('seirenState')) {
    state = JSON.parse(localStorage.getItem('seirenState'));
}

// === DOM HELPERS ===
const el = (id) => document.getElementById(id);

function save() {
    localStorage.setItem('seirenState', JSON.stringify(state));
    updateUI();
}

function updateUI() {
    el('banana-count').innerText = state.bananas;
    el('pending-count').innerText = state.tasks.filter(t => !t.completed).length;
    
    // Panic Logic
    if(state.panicMode) {
        document.body.classList.add('panic-active');
        el('app-background').className = 'bg-panic';
        el('assistant-img').src = assets.miharuPanic;
        el('assistant-dialogue').innerText = "Why are you late...? I'm scared.";
    } else {
        document.body.classList.remove('panic-active');
        el('app-background').className = 'bg-safe';
        el('assistant-img').src = assets.miharuIdle;
    }
}

// === TASKS ===
function addTask() {
    const txt = el('task-input').value;
    if(!txt) return;
    
    state.tasks.push({
        id: Date.now(),
        text: txt,
        due: el('task-date').value,
        type: el('task-type').value,
        completed: false
    });
    
    el('task-input').value = '';
    save();
    renderTasks();
    checkOverdue();
    el('assistant-dialogue').innerText = "New mission accepted.";
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if(task) {
        task.completed = !task.completed;
        if(task.completed) {
            state.bananas += 10;
            el('assistant-dialogue').innerText = "Good job! +10 Bananas";
        }
        save();
        renderTasks();
        checkOverdue();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    save();
    renderTasks();
    checkOverdue();
}

function renderTasks() {
    el('task-list').innerHTML = '';
    state.tasks.forEach(t => {
        const isOverdue = t.due && new Date(t.due) < new Date() && !t.completed;
        const li = document.createElement('li');
        li.className = `task-item task-${t.type} ${isOverdue ? 'task-overdue' : ''}`;
        li.style.opacity = t.completed ? '0.5' : '1';
        li.innerHTML = `
            <span>${isOverdue ? '⚠️ ' : ''}${t.text}</span>
            <div>
                <button onclick="toggleTask(${t.id})">${t.completed ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${t.id})">X</button>
            </div>
        `;
        el('task-list').appendChild(li);
    });
}

function checkOverdue() {
    const now = new Date();
    let panic = false;
    state.tasks.forEach(t => {
        if(t.due && new Date(t.due) < now && !t.completed) panic = true;
    });
    if(state.panicMode !== panic) {
        state.panicMode = panic;
        save();
    }
}

// === GACHA ===
function pullGacha() {
    if(state.bananas < 50) { alert("Need 50 Bananas!"); return; }
    state.bananas -= 50;
    
    const r = Math.random();
    let tier = 'C';
    if(r > 0.6) tier = 'R';
    if(r > 0.9) tier = 'SSR';
    
    const pool = gachaPool.filter(c => c.rarity === tier);
    const win = pool[Math.floor(Math.random() * pool.length)];
    
    if(!state.inventory.includes(win.id)) state.inventory.push(win.id);
    save();
    
    // Show Overlay
    el('gacha-overlay').classList.remove('hidden');
    el('reveal-container').innerHTML = `
        <div class="card-display rarity-${win.rarity}" style="width: 200px; transform: scale(1.2);">
            <img src="${win.img}">
            <div class="card-info">${win.name}</div>
        </div>
        <h2 style="color:white; margin-top:20px;">${win.rarity} GET!</h2>
    `;
}

function closeGacha() {
    el('gacha-overlay').classList.add('hidden');
    renderGallery();
}

function renderGallery() {
    el('gallery-grid').innerHTML = '';
    state.inventory.forEach(id => {
        const item = gachaPool.find(c => c.id === id);
        if(item) {
            el('gallery-grid').innerHTML += `
                <div class="card-display rarity-${item.rarity}">
                    <img src="${item.img}">
                    <div class="card-info">${item.name}</div>
                </div>
            `;
        }
    });
}

// === SYSTEM ===
function switchView(id) {
    ['view-dashboard','view-missions','view-gacha','view-gallery'].forEach(v => {
        el(v).classList.add('hidden-view');
        el(v).classList.remove('active-view');
    });
    el(id).classList.remove('hidden-view');
    el(id).classList.add('active-view');
}

function feedAssistant() {
    if(state.bananas >= 5) {
        state.bananas -= 5;
        el('assistant-dialogue').innerText = "Delicious... More please?";
        save();
    } else { alert("Not enough bananas!"); }
}

// Init
setInterval(checkOverdue, 5000);
updateUI();
renderTasks();
renderGallery();

