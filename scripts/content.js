(async () => {
  const isActive = await chrome.storage.local.get().then((item) => item.isActive);
  if (!isActive) return;
  function isEmpty(obj) {
    for (var x in obj) {
      return false;
    }
    return true;
  }
  const blackList = await chrome.storage.sync.get().then((store) => {
    if (!isEmpty(store.blackList)) {
      return store.blackList;
    }
    return [];
  });
  if (blackList.length < 1) return;

  chrome.runtime.sendMessage({ block: true });
})();
