browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get().then((items) => {
    if (!items.blackList) {
      browser.storage.sync.set({ blackList: [] });
    }
  });
});

browser.tabs.onActivated.addListener(() => {
  setTimeout(() => {
    blocker();
  }, 100);
});

browser.storage.onChanged.addListener(({ isActive }) => {
  if (isActive) {
    blocker();
  }
});

async function blocker() {
  const isActive = await browser.storage.local.get().then((item) => item.isActive);
  const blackList = await browser.storage.sync.get().then((store) => {
    if (!isEmpty(store.blackList)) {
      return store.blackList;
    }
    return [];
  });
  if (isActive) {
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
        browser.tabs.update(null, { url: POMO });
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
  let [tab] = await browser.tabs.query(queryOptions);
  return tab.url;
}
