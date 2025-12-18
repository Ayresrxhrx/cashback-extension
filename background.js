chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'statusUpdate') {
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: msg.active ? "ON" : "OFF"
    });
    chrome.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: msg.active ? "#28a745" : "#dc3545"
    });
  }
});
