let transactions = JSON.parse(localStorage.getItem("data")) || [];
let chart;

render();

function addTransaction() {
  let type = document.getElementById("type").value;
  let amount = parseInt(document.getElementById("amount").value);
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  if (!type || !amount || !date) {
    alert("Nhập đầy đủ!");
    return;
  }

  let data = { type, amount, category, date };
  transactions.push(data);

  localStorage.setItem("data", JSON.stringify(transactions));
  render();
}

function deleteItem(index) {
  transactions.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(transactions));
  render();
}

function formatDateVN(dateStr) {
  let d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function render() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0, totalThu = 0, totalChi = 0;

  transactions.forEach((t, index) => {
    let li = document.createElement("li");
    let color = t.type === "thu" ? "green" : "red";

    li.innerHTML = `
      <span style="color:${color}">
        ${formatDateVN(t.date)} | ${t.type.toUpperCase()} - ${t.category}: ${t.amount}
      </span>
      <button class="delete-btn" onclick="deleteItem(${index})">Xoá</button>
    `;

    list.appendChild(li);

    if (t.type === "thu") {
      total += t.amount;
      totalThu += t.amount;
    } else {
      total -= t.amount;
      totalChi += t.amount;
    }
  });

  document.getElementById("total").textContent = "Tổng: " + total;
  drawChart(totalThu, totalChi);
}

function drawChart(totalThu, totalChi) {
  let ctx = document.getElementById("myChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Thu", "Chi"],
      datasets: [{
        data: [totalThu, totalChi],
        backgroundColor: ["#00c853", "#ff5252"]
      }]
    }
  });
}

// 🔍 LỌC THEO NGÀY
function filterData() {
  let date = document.getElementById("filterDate").value;

  let filtered = transactions.filter(t => t.date === date);

  renderFiltered(filtered, "Ngày");
}

// 📅 LỌC THEO THÁNG
function filterByMonth() {
  let month = document.getElementById("filterMonth").value;

  if (!month) {
    alert("Chọn tháng!");
    return;
  }

  let filtered = transactions.filter(t => t.date.startsWith(month));

  renderFiltered(filtered, "Tháng " + month);
}

// 📊 HIỂN THỊ KẾT QUẢ CHUNG
function renderFiltered(data, label) {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let totalThu = 0;
  let totalChi = 0;

  data.forEach(t => {
    let li = document.createElement("li");

    li.textContent = `${formatDateVN(t.date)} | ${t.type} - ${t.category}: ${t.amount}`;
    list.appendChild(li);

    if (t.type === "thu") totalThu += t.amount;
    else totalChi += t.amount;
  });

  let loiNhuan = totalThu - totalChi;

  document.getElementById("total").innerHTML = `
    📊 ${label} <br>
    💰 Thu: ${totalThu} <br>
    💸 Chi: ${totalChi} <br>
    📈 Lợi nhuận: ${loiNhuan}
  `;

  drawChart(totalThu, totalChi);
}

// 💾 EXPORT CSV
function exportExcel() {
  let csv = "Ngày,Loại,Số tiền,Loại chi\n";

  transactions.forEach(t => {
    csv += `${t.date},${t.type},${t.amount},${t.category}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();
}

// 🌙 DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}