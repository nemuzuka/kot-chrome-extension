const clockIn = () => {
    chrome.runtime.sendMessage({ type: "clockIn" });
};

const clockOut = () => {
    chrome.runtime.sendMessage({ type: "clockOut" });
};

// 初期処理
const initApplication = () => {
    const divs = document.querySelectorAll('ul#buttons > li > div');
    if (divs.length < 2) {
        return;
    }
    clearInterval(intervalId);

    // イベント登録
    divs[0].addEventListener('click', (e) => {
        clockIn();
    }, false);

    divs[1].addEventListener('click', (e) => {
        clockOut();
    }, false);
}

const intervalId = setInterval(() => {
    initApplication();
}, 1000);
