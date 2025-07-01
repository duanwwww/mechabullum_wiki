async function renderCSVTable(url, containerId) {
  const res = await fetch(url);
  const csv = await res.text();
  const lines = csv.trim().split("\n").map(row => row.split(","));

  // ✅ 从第一列第一行提取基础血量
  const baseHPMatch = lines[0][0].match(/(\d+)/);
  const baseHP = baseHPMatch ? parseInt(baseHPMatch[1]) : 4500;

  const numRows = lines.length;
  const numCols = lines[0].length;

  // ✅ 提取兵种补正（第0行，从第2列开始）
  const colOffsets = lines[1].slice(2).map(r => parseFloat(r));

  // ✅ 提取专家补正（第1列，从第1行开始）
  const rowOffsets = lines.slice(2).map(r => parseFloat(r[1]));

  // ✅ 计算实际血量矩阵（不含表头标题，只用于染色计算）
  console.log(colOffsets);
  console.log(rowOffsets);
  let allValues = [];

  for (let i = 2; i < numRows; i++) {
    for (let j = 2; j < numCols; j++) {
      const rowOffset = rowOffsets[i - 2];
      const colOffset = colOffsets[j - 2];
      const hp = baseHP + rowOffset + colOffset;
      if (!isNaN(hp)) allValues.push(hp);
    }
  }
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // ✅ 色彩映射函数（蓝色为主）
  function getHeatColor(value) {
    const percent = (value - minValue) / (maxValue - minValue);
    const r = Math.round(255 - 100 * percent);
    const g = Math.round(255 - 200 * percent);
    const b = 255;
    return `rgb(${r},${g},${b})`;
  }

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.margin = "1em auto";
  table.style.border = "1px solid #ccc";
  table.style.fontSize = "14px";

  for (let i = 0; i < numRows; i++) {
    const tr = document.createElement("tr");

    for (let j = 0; j < numCols; j++) {
      const tag = i === 0 || j === 0 || j === 1 ? "th" : "td";
      const el = document.createElement(tag);
      el.textContent = lines[i][j];
      el.style.padding = "8px 12px";
      el.style.border = "1px solid #eee";
      el.style.whiteSpace = "nowrap";
      if (tag === "th") el.style.backgroundColor = "#f7f7f7";

      // ✅ 固定专家名列（第0列）
      if (j === 0 ) {
        el.style.position = "sticky";
        el.style.left = "0";
        el.style.background = "#fff";
        el.style.zIndex = "2";
        el.style.fontWeight = "bold";
      }

      // ✅ 自动染色逻辑
      if (i > 1 && j > 1) {
        // 正常数据格：base + 专家 + 兵种
        const rowOffset = rowOffsets[i - 2];
        const colOffset = colOffsets[j - 2];
        const hp = baseHP + rowOffset + colOffset;
        el.style.backgroundColor = getHeatColor(hp);
        el.title = `${hp}`;
      } else if (i <= 1 && j > 1) {
        // 第一行兵种补正
        const colOffset = colOffsets[j - 2];
        const hp = baseHP + colOffset;
        el.style.backgroundColor = getHeatColor(hp);
        el.title = `兵种补正后: ${hp}`;
      } else if (j <= 1 && i > 1) {
        // 第一列专家补正
        const rowOffset = rowOffsets[i - 2];
        const hp = baseHP + rowOffset;
        el.style.backgroundColor = getHeatColor(hp);
        el.title = `专家补正后: ${hp}`;
      } else{
        el.style.backgroundColor = getHeatColor(baseHP);
      }

      tr.appendChild(el);
    }

    table.appendChild(tr);
  }

  document.getElementById(containerId).appendChild(table);
}

// ✅ 页面加载时调用
window.addEventListener("load", () => {
  renderCSVTable("/assets/beginning.csv", "csv-table-container");
});
