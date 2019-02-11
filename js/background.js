/**
 * 出勤時処理.
 * 
 * - Chrome上の日付を取得
 * - 日付に対して出勤済みと設定し、LocalStorage に保存
 * - リフレッシュアイコン
 */
const clockIn = () => {
    const key = getCurrentDateString() + "_CLOCK_IN";
    localStorage.setItem(key, true);
    refreshIcon();
};

/**
 * 退勤時処理.
 * 
 * - Chrome上の日付を取得
 * - 日付に対して退勤済みと設定し、LocalStorage に保存
 * - リフレッシュアイコン
 */
const clockOut = () => {
    const key = getCurrentDateString() + "_CLOCK_OUT";
    localStorage.setItem(key, true);
    refreshIcon();
};

/**
 * リフレッシュアイコン.
 * 
 * - 対象アイコンを取得
 * - 対象アイコンに変更
 * - 日付より前のLocalStorage上のデータを削除
 */
const refreshIcon = () => {
    const currentDateString = getCurrentDateString();
    const clockInKey = currentDateString + "_CLOCK_IN";
    const clockOutKey = currentDateString + "_CLOCK_OUT";

    const isClockIn = localStorage.getItem(clockInKey) ? true : false
    const isClockOut = localStorage.getItem(clockOutKey) ? true : false

    chrome.browserAction.setIcon({ path: "icons/" + getTargetIcon() });

    cleanLocalStrage(currentDateString);
};

/**
 * localStrage 上のデータ削除.
 * 
 * 対象日付より前のデータを削除します。
 */
const cleanLocalStrage = (currentDateString) => {
    const keys = Object.keys(localStorage);
    const deleteKeys = [];
    keys.forEach((key) => {
        const targetDateString = key.substring(0, 8);
        if (currentDateString > targetDateString) {
            deleteKeys.push(key);
        }
    });
    deleteKeys.forEach((key) => {
        localStorage.removeItem(key);
    })
}

/**
 * 対象アイコン取得.
 * 
 * - Chrome上の日付を取得
 * - 日付に対する出勤、退勤状況を元にアイコンを取得
 */
const getTargetIcon = () => {
    const currentDateString = getCurrentDateString();
    const clockInKey = currentDateString + "_CLOCK_IN";
    const clockOutKey = currentDateString + "_CLOCK_OUT";

    const isClockIn = localStorage.getItem(clockInKey) ? true : false
    const isClockOut = localStorage.getItem(clockOutKey) ? true : false

    return (isClockIn && isClockOut) ? "clock-out-icon38.png"
        : (isClockIn && !isClockOut) ? "clock-in-icon38.png"
            : "default-icon38.png"
}

/**
 * 日付取得.
 * 
 * システム日付より、yyyyMMdd 形式の文字列を取得します。
 */
const getCurrentDateString = () => {
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const dd = ("0" + currentDate.getDate()).slice(-2);
    return yyyy + mm + dd;
}

// アイコンクリック時
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: "https://s2.kingtime.jp/independent/recorder/personal/" });
});

// content からのイベントリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'clockIn':
            clockIn();
            break;
        case 'clockOut':
            clockOut();
            break;
        default:
            console.log('Invalid type.');
            console.log(request);
            break;
    }
    sendResponse({});
    return true;
});


refreshIcon();
chrome.alarms.create("refreshIcon", { "periodInMinutes": 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
        case 'refreshIcon':
            refreshIcon();
            break;
        default:
            console.log('Invalid alarm.name.');
            console.log(alarm);
            break;
    }
});
