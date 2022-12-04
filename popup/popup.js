const switcher = document.querySelector('#switcher');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const list = document.querySelector('.list');

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
