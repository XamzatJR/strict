const switcher = document.querySelector('#switcher');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const list = document.querySelector('.list');

document.addEventListener('DOMContentLoaded', async () => {
  toggleSwitcher(switcher);
});

function toggleSwitcher(switcher) {
  switcher.addEventListener('change', (event) => {
    if (event.target.checked) {
      chrome.storage.local.set({ isActive: true });
    } else {
      chrome.storage.local.set({ isActive: false });
    }
  });
}
