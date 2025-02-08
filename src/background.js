chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logPDFClick") {
    console.log("用户点击了保存为 PDF 按钮");
  }
});
