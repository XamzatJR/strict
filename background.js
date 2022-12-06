chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get().then((items) => {
    if (!items.blackList) {
      chrome.storage.sync.set({ blackList: [] });
    }
  });
});
