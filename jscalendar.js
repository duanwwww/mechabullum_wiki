const events = [
  {
    type: "single", // 单日事件
    date: "2025-07-04",
    title: "🚩 黑萝卜 v.s. Grubby",
    notice: "黑萝卜将于今晚10点对战Grubby！",
    color: "#ffcccb"
  },
  {
    type: "range", // 多日事件
    start: "2025-07-03",
    end: "2025-09-01",
    title: "第四赛季",
    colorStart: "#b3e5fc",
    colorEnd: "#0288d1"
  },
  {
    type: "range", // 多日事件
    start: "2025-05-01",
    end: "2025-07-03",
    title: "第三赛季",
    colorStart: "#b3e5fc",
    colorEnd: "#0288d1"
  }
];


function f() {
  const toc = document.querySelector(".md-sidebar--secondary");
  if (!toc) return;

  const calendarWrapper = document.createElement("div");
  calendarWrapper.id = "calendar-container";
  calendarWrapper.style = `
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1em;
    font-family: sans-serif;
  `;
  toc.insertBefore(calendarWrapper, toc.firstChild);

  const noticeWrapper = document.createElement("div");
  noticeWrapper.id = "sidebar-notice";
  noticeWrapper.style = `
    padding: 0.8em;
    background-color: #f4f4f4;
    border-left: 4px solid #2196f3;
    font-size: 1.2em;
    line-height: 1.4em;
    margin-bottom: 1em;
  `;
  toc.insertBefore(noticeWrapper, calendarWrapper.nextSibling);

  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  function formatDate(date) {
    return date.getFullYear().toString().padStart(4, '0') + '-' +
         (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
         date.getDate().toString().padStart(2, '0');
  }

  function renderCalendar() {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const noticesToday = [];

    let html = `<div style="text-align:center; margin-bottom: 5px;">
      <button onclick="prevMonth()" style="float:left;">←</button>
      <strong>${year}年${month + 1}月</strong>
      <button onclick="nextMonth()" style="float:right;">→</button>
    </div>
    <table style="border-collapse: collapse; margin: auto;">
      <tr>${days.map(d => `<th style="width: 28px; height: 28px; font-size: 12px; color: #666;">${d}</th>`).join("")}</tr><tr>`;

    for (let i = 0; i < firstDay; i++) {
      html += '<td style="width: 28px; height: 28px;"></td>';
    }

    for (let d = 1; d <= lastDate; d++) {
      const current = new Date(year, month, d);
      const currentStr = formatDate(current);
      let tooltip = "";
      let style = `
        width: 28px;
        height: 28px;
        text-align: center;
        font-size: 12px;
      `;

      // 标记事件
      const cellEvents = events.filter(e => {
        if (e.type === "single") return e.date === currentStr;
        if (e.type === "range") {
          return currentStr >= e.start && currentStr <= e.end;
        }
        return false;
      });

      for (const e of cellEvents) {
        if (e.type === "single") {
          style += `background: ${e.color};`;
          tooltip += `• ${e.title}\n`;
          if (currentStr === formatDate(today)) {
            noticesToday.push(e.notice);
          }
        } else if (e.type === "range") {
          if (currentStr === e.start) {
            style += `background: ${e.colorStart};`;
            tooltip += `🟢 ${e.title} 开始\n`;
          } else if (currentStr === e.end) {
            style += `background: ${e.colorEnd};`;
            tooltip += `🔴 ${e.title} 结束\n`;
          } else {
            const end = new Date(e.end);
            const remaining = Math.ceil((end - current) / (1000 * 60 * 60 * 24));
            tooltip += `📆 ${e.title} 进行中（剩余${remaining}天）\n`;
            if (formatDate(today) === currentStr) {
              noticesToday.push(`${e.title} 进行中，剩余 ${remaining} 天`);
            }
          }
        }
      }

      const isToday = currentStr === formatDate(today);
      if (isToday) style += "border: 2px solid #555;";

      html += `<td title="${tooltip.trim()}" style="${style}">${d}</td>`;
      if ((firstDay + d) % 7 === 0) html += "</tr><tr>";
    }

    html += "</tr></table>";
    calendarWrapper.innerHTML = html;

    // 渲染公告栏
    if (noticesToday.length > 0) {
      noticeWrapper.innerHTML = `
        <strong>📢 今日公告</strong><br>
        ${noticesToday.map(n => `- ${n}`).join("<br>")}
      `;
    } else {
      noticeWrapper.innerHTML = "";
    }
  }

  window.prevMonth = function () {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    renderCalendar();
  };

  window.nextMonth = function () {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    renderCalendar();
  };

  renderCalendar();
}

f();