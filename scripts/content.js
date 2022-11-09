const POMO = 'https://khamzat-pomodoro.netlify.app/';
const url = window.location.href;

function blockPage(blackList) {
  blackList.forEach((el) => {
    if (url.match(el)) {
      window.location.href = POMO;
    }
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.isActive) {
    blockPage();
  }
});
