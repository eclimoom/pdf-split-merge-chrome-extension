// 创建按钮
function createSavePDFButton() {
  const button = document.createElement("button");
  button.innerText = "保存为PDF";
  button.className = "save-pdf-button";
  // button.style.position = "fixed";
  // button.style.bottom = "20px";
  // button.style.right = "20px";
  button.style.padding = "2px 4px";
  button.style.backgroundColor = "#f44336";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "2px";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";
  button.style.fontSize = "12px";

  button.onclick = () => {
    console.log("保存为 PDF 按钮被点击");
  };

  document.body.appendChild(button);
}

// 修改网页样式（字体大小、行间距等）
function modifyPageStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
        body {
            // font-size: 12px !important;
            // line-height: 1.8 !important;
        }
        p {
            font-size: 12px !important;
            margin: 2px 0 !important;
            line-height: 18px !important;
        }
        .ds-markdown li::marker {
            line-height: 13px !important;
            font-size: 12px;
        }
        h3{
            font-size: calc(var(--ds-md-zoom)* 11px) !important;
            line-height: 1 !important;
            margin: 2px 0 !important;
        }
        .ds-markdown ol {
          margin: 2px 0 !important;
        }
        .ds-markdown hr{
          margin: 1px 0 !important;
        }
        :root {
          --message-list-max-width: 1000px;
        }
    `;
  document.head.appendChild(style);
}

console.log("content.js 被执行");
// 执行函数
createSavePDFButton();
modifyPageStyle();
