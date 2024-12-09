// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log("SEO Form Autofill Extension Installed!");
  });
  
  // Listener for messages if needed for additional functionality
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "log") {
      console.log(request.message);
    }
    sendResponse({ success: true });
});
  