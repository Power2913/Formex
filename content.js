// This script is injected into web pages to interact with form fields.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    chrome.storage.local.get("userDetails", ({ userDetails }) => {
      if (userDetails) {
        document.querySelectorAll("input, textarea").forEach((field) => {
          if (field.name && userDetails[field.name]) {
            field.value = userDetails[field.name];
          }
        });
        sendResponse({ success: true });
      }
    });
  }
  return true; // Required for async responses.
});
