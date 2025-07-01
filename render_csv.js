async function renderCSVTable(url, containerId) {
    const res = await fetch(url);
    const csv = await res.text();
    const lines = csv.trim().split("\n").map(row => row.split(","));
    console.log(lines);
    const table = document.createElement("table");
  
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "1em";
    table.style.width = "100%";
    table.style.textAlign = "center";
    table.style.fontSize = "14px";
  
    lines.forEach((row, i) => {
      const tr = document.createElement("tr");
      row.forEach((cell, j) => {
        const tag = i === 0 ? "th" : "td";
        const el = document.createElement(tag);
        el.textContent = cell;
        el.style.border = "1px solid #ccc";
        el.style.padding = "6px 10px";
        el.style.whiteSpace = "nowrap";
        if (tag === "th") el.style.backgroundColor = "#f7f7f7";
    
        // ✅ 固定第一列
        if (j === 0) {
          el.style.position = "sticky";
          el.style.left = "0";
          el.style.background = "#fff";
          el.style.zIndex = "2"; // 确保它浮在上面
        }
    
        tr.appendChild(el);
      });
      table.appendChild(tr);
    });
  
    document.getElementById(containerId).appendChild(table);
  }
  
  window.addEventListener("load", () => {
    renderCSVTable("/assets/beginning.csv", "csv-table-container");
  });
  