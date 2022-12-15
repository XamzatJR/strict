chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get().then((items) => {
    if (!items.blackList) {
      chrome.storage.sync.set({ blackList: [] });
    }
  });
});

chrome.tabs.onActivated.addListener(() => {
  setTimeout(() => {
    blocker();
  }, 100);
});

chrome.storage.onChanged.addListener(({ isActive }) => {
  if (isActive) {
    blocker();
  }
});

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.block) {
    const blackList = await chrome.storage.sync.get().then((store) => store.blackList);
    blockPages(blackList);
  }
});

async function blocker() {
  const isActive = await chrome.storage.local.get().then((item) => item.isActive);

  if (isActive) {
    const blackList = await chrome.storage.sync.get().then((store) => {
      if (!isEmpty(store.blackList)) {
        return store.blackList;
      }
      return [];
    });
    blockPages(blackList);
  }
}
async function blockPages(blackList) {
  const POMO = 'https://khamzat-pomodoro.netlify.app/';
  let url = await getCurrentUrl();
  if (url) {
    url = new URL(url).host;
    blackList.forEach((el) => {
      if (url.match(el)) {
        chrome.tabs.update(null, { url: POMO });
      }
    });
  }
}
function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}
async function getCurrentUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}
