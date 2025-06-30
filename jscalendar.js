const events = [
  {
    type: "single", // 单日事件
    date: "2025-07-01",
    title: "版本更新上线",
    notice: "🎉 今日《钢铁指挥官》更新上线，欢迎体验新单位！",
    color: "#ffcccb"
  },
  {
    type: "range", // 多日事件
    start: "2025-07-03",
    end: "2025-07-07",
    title: "夏日战役活动",
    colorStart: "#b3e5fc",
    colorEnd: "#0288d1"
  }
];


function f() {
  const toc = document.querySelector(".md-sidebar--secondary"); // 右侧栏容器
  if (!toc) return;

  //
  // 🗓 创建日历容器
  //
  const calendarWrapper = document.createElement("div");
  calendarWrapper.id = "calendar-container";
  calendarWrapper.style = `
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1.5em; /* ✅ 添加下边距 */
    font-family: sans-serif;
  `;
  toc.insertBefore(calendarWrapper, toc.firstChild);

  //
  // 📢 创建公告栏容器
  //
  const noticeWrapper = document.createElement("div");
  noticeWrapper.id = "sidebar-notice";
  noticeWrapper.style = `
    padding: 0.8em;
    background-color: #f4f4f4;
    border-left: 4px solid #2196f3;
    font-size: 14px;
    line-height: 1.4em;
    margin-bottom: 1em;
  `;
  noticeWrapper.innerHTML = `
    <strong>📢 公告</strong><br>
    1. 本赛季剩余：2天
  `;
  toc.insertBefore(noticeWrapper, calendarWrapper.nextSibling);

  //
  // 🔄 渲染日历函数（与你原来一样）
  //
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  function renderCalendar() {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

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
      const isToday = current.toDateString() === today.toDateString();
      html += `<td style="
        width: 28px;
        height: 28px;
        text-align: center;
        font-size: 12px;
        ${isToday ? 'background: #ffd;' : ''}
      ">${d}</td>`;
      if ((firstDay + d) % 7 === 0) html += "</tr><tr>";
    }

    html += "</tr></table>";
    calendarWrapper.innerHTML = html;
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
