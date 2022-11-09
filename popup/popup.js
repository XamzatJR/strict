document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#switcher').addEventListener('change', (event) => {
    if (event.target.checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { isActive: true });
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { isActive: false });
      });
    }
  });
});
