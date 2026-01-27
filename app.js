const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const calendarEl = document.getElementById("calendar");
const totalEl = document.getElementById("total");
const monthTitle = document.getElementById("monthTitle");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Save
function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add expense
addBtn.onclick = () => {
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!title || amount <= 0 || !date) {
        alert("Fill all fields");
        return;
    }

    expenses.push({ title, amount, date });
    save();
    render();
};

// Calendar
function renderCalendar() {
    calendarEl.innerHTML = "";
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    monthTitle.textContent = new Date(currentYear, currentMonth)
        .toLocaleString("default", { month: "long", year: "numeric" });

    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement("div");
        div.className = "day";

        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const hasExpense = expenses.some(e => e.date === dateStr);

        if (hasExpense) div.classList.add("hasExpense");

        div.textContent = day;
        calendarEl.appendChild(div);
    }
}

// Chart
function drawChart() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const monthly = Array(12).fill(0);

    expenses.forEach(e => {
        const d = new Date(e.date);
        monthly[d.getMonth()] += e.amount;
    });

    const max = Math.max(...monthly, 1);
    const barWidth = 50;

    monthly.forEach((val, i) => {
        const height = (val / max) * 180;
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(20 + i * 70, 220 - height, barWidth, height);
        ctx.fillStyle = "white";
        ctx.fillText(i+1, 35 + i * 70, 240);
    });
}

// Total
function updateTotal() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalEl.textContent = total;
}

// Render all
function render() {
    renderCalendar();
    drawChart();
    updateTotal();
}

render();
