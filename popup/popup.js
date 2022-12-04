const switcher = document.querySelector('#switcher');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const list = document.querySelector('.list');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const blackList = await chrome.storage.sync.get().then((store) => {
    if (!isEmpty(store.blackList)) {
      return store.blackList;
    }
    return [];
  });
  if (!validateInput(input)) return;
  if (!blackList.includes(input.value)) {
    addItem(list, handleURL(input.value));
    chrome.storage.sync.set({ blackList: [...blackList, input.value] }, () => {
      input.value = '';
    });
  } else {
    alert('This site has already been added');
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  const isActive = await chrome.storage.local.get().then((item) => item.isActive);
  if (isActive) {
    switcher.checked = true;
  }
  toggleSwitcher(switcher);
});
function addItem(list, val) {
  let item = document.createElement('li');
  item.classList.add('list__item');
  item.onclick = deleteItem;
  item.textContent = val;
  list.append(item);
}
async function deleteItem(e) {
  const blackList = await chrome.storage.sync.get().then((store) => store.blackList);
  const newList = blackList.filter((item) => item !== e.target.innerText);
  chrome.storage.sync.set({ blackList: newList });
  e.target.remove();
}
function toggleSwitcher(switcher) {
  switcher.addEventListener('change', (event) => {
    if (event.target.checked) {
      chrome.storage.local.set({ isActive: true });
    } else {
      chrome.storage.local.set({ isActive: false });
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
