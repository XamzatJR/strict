const switcher = document.querySelector('#switcher');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const list = document.querySelector('.list');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const blackList = await browser.storage.sync.get().then((store) => {
    if (!isEmpty(store.blackList)) {
      return store.blackList;
    }
    return [];
  });
  if (!validateInput(input)) return;
  if (!blackList.includes(input.value)) {
    addItem(list, handleURL(input.value));
    browser.storage.sync.set({ blackList: [...blackList, handleURL(input.value)] }, () => {
      input.value = '';
    });
  } else {
    alert('This site has already been added');
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  const isActive = await browser.storage.local.get().then((item) => item.isActive);
  const blackList = await browser.storage.sync.get().then((store) => {
    if (!isEmpty(store.blackList)) {
      return store.blackList;
    }
    return [];
  });
  for (let i = 0; i < blackList.length; ++i) {
    addItem(list, blackList[i]);
  }
  if (isActive) {
    switcher.checked = true;
  }
  toggleSwitcher(switcher);
});
function addItem(list, val) {
  let item = document.createElement('li');
  let text = document.createElement('div');
  let icon = document.createElement('img');
  item.classList.add('list__item');
  icon.classList.add('list__item-icon');
  text.classList.add('list__item-text');
  icon.src = '../images/delete.png';
  text.textContent = val;
  icon.onclick = deleteItem;
  item.append(text, icon);
  list.append(item);
}
async function deleteItem(e) {
  const blackList = await browser.storage.sync.get().then((store) => store.blackList);
  const newList = blackList.filter((item) => item !== e.target.parentNode.firstChild.textContent);
  browser.storage.sync.set({ blackList: newList });
  e.target.parentNode.remove();
  console.log(e.target.parentNode, e);
}
function toggleSwitcher(switcher) {
  switcher.addEventListener('change', (event) => {
    if (event.target.checked) {
      browser.storage.local.set({ isActive: true });
    } else {
      browser.storage.local.set({ isActive: false });
    }
  });
}
function validateInput(input) {
  const domain = new RegExp(
    '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]',
    'g'
  );
  if (!domain.test(input.value)) {
    alert('not valid URL');
    return false;
  }
  return true;
}
function handleURL(url) {
  let newURL;
  if (url.startsWith('https://') || url.startsWith('http://')) {
    newURL = new URL(url);
  } else {
    newURL = new URL('https://' + url);
  }
  return newURL.host;
}

function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}
