// はじまりの お金（1000円もっていることにするよ）
let currentDate = new Date();
let currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
let monthlyBalances = {};
let balance = 1000;
let currentPrice = 0;
let currentItem = "";
let transactions = [];
let currentUser = localStorage.getItem('selectedUser') || '';
let userSettings = null;

const userProfiles = {
    karin: { name: 'かりん', icon: '👧' },
    ao: { name: 'あお', icon: '👦' }
};

const defaultSettings = {
    initialBudget: 1000,
    spendItems: [
        { icon: '🏷️', name: 'シール', price: 100 },
        { icon: '🎮', name: 'ポケモン', price: 200 },
        { icon: '🎯', name: 'UFOキャッチャー', price: 100 }
    ]
};

const balanceDisplay = document.getElementById('balance');
const quizArea = document.getElementById('quiz-area');

function getUserStorageKey(baseKey) {
    return `${baseKey}_${currentUser}`;
}

function getDefaultSettingsCopy() {
    return JSON.parse(JSON.stringify(defaultSettings));
}

function loadUserSettings() {
    const saved = JSON.parse(localStorage.getItem(getUserStorageKey('settings')));
    if (!saved || !Array.isArray(saved.spendItems) || saved.spendItems.length !== 3) {
        userSettings = getDefaultSettingsCopy();
        saveUserSettings();
        return;
    }

    userSettings = {
        initialBudget: Number(saved.initialBudget) > 0 ? Number(saved.initialBudget) : 1000,
        spendItems: saved.spendItems.map((item, idx) => ({
            icon: item.icon || defaultSettings.spendItems[idx].icon,
            name: item.name || defaultSettings.spendItems[idx].name,
            price: Number(item.price) > 0 ? Number(item.price) : defaultSettings.spendItems[idx].price
        }))
    };
}

function saveUserSettings() {
    localStorage.setItem(getUserStorageKey('settings'), JSON.stringify(userSettings));
}

function getInitialBudget() {
    return userSettings && Number(userSettings.initialBudget) > 0 ? Number(userSettings.initialBudget) : 1000;
}

function renderSpendButtons() {
    const container = document.getElementById('spend-buttons');
    container.innerHTML = '';

    userSettings.spendItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'image-button';
        button.onclick = () => askQuiz(item.name, item.price);
        button.innerHTML = `
            <div class="button-content">
                <div class="button-emoji">${item.icon}</div>
                <div class="button-name">${item.name}</div>
                <div class="button-price">${item.price}円</div>
            </div>
        `;
        container.appendChild(button);
    });
}

function loadUserData() {
    monthlyBalances = JSON.parse(localStorage.getItem(getUserStorageKey('monthlyBalances'))) || {};
    transactions = JSON.parse(localStorage.getItem(getUserStorageKey('transactions'))) || [];
    balance = monthlyBalances[currentMonth] || getInitialBudget();
}

function updateCurrentUserDisplay() {
    const display = document.getElementById('current-user-display');
    if (!userProfiles[currentUser]) {
        display.innerText = '';
        return;
    }
    display.innerText = `${userProfiles[currentUser].icon} ${userProfiles[currentUser].name}`;
}

function applyUserTheme() {
    document.body.classList.remove('user-karin', 'user-ao');
    if (currentUser === 'karin') {
        document.body.classList.add('user-karin');
    }
    if (currentUser === 'ao') {
        document.body.classList.add('user-ao');
    }
}

function selectUser(userId) {
    currentUser = userId;
    localStorage.setItem('selectedUser', currentUser);
    applyUserTheme();
    loadUserSettings();
    renderSpendButtons();
    document.getElementById('user-select-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    updateCurrentUserDisplay();
    loadUserData();
    updateDisplay();
    renderHistoryList();
}

function switchUser() {
    closeBonusModal();
    closeSettingsModal();
    closeQuiz();
    document.getElementById('history-area').classList.add('hidden');
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('user-select-screen').classList.remove('hidden');
}

function showSettingsModal() {
    document.getElementById('initial-budget').value = userSettings.initialBudget;
    userSettings.spendItems.forEach((item, idx) => {
        document.getElementById(`setting-icon-${idx}`).value = item.icon;
        document.getElementById(`setting-name-${idx}`).value = item.name;
        document.getElementById(`setting-price-${idx}`).value = item.price;
    });
    document.getElementById('settings-area').classList.remove('hidden');
}

function closeSettingsModal() {
    const settingsArea = document.getElementById('settings-area');
    if (settingsArea) {
        settingsArea.classList.add('hidden');
    }
}

function saveSettings() {
    const initialBudget = parseInt(document.getElementById('initial-budget').value);
    if (isNaN(initialBudget) || initialBudget <= 0) {
        alert('初期予算は1円以上で入力してください。');
        return;
    }

    const nextItems = [];
    for (let i = 0; i < 3; i++) {
        const icon = document.getElementById(`setting-icon-${i}`).value.trim();
        const name = document.getElementById(`setting-name-${i}`).value.trim();
        const price = parseInt(document.getElementById(`setting-price-${i}`).value);

        if (!name) {
            alert(`つかうボタン ${i + 1} の なまえを入力してください。`);
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert(`つかうボタン ${i + 1} の ねだんは1円以上で入力してください。`);
            return;
        }

        nextItems.push({
            icon: icon || defaultSettings.spendItems[i].icon,
            name,
            price
        });
    }

    userSettings = {
        initialBudget,
        spendItems: nextItems
    };

    saveUserSettings();
    renderSpendButtons();

    if (!monthlyBalances[currentMonth]) {
        balance = getInitialBudget();
        updateDisplay();
    }

    closeSettingsModal();
    alert('せっていを保存しました！');
}

// 画面を更新する
function updateDisplay() {
    balanceDisplay.innerText = balance;
    monthlyBalances[currentMonth] = balance;
    localStorage.setItem(getUserStorageKey('monthlyBalances'), JSON.stringify(monthlyBalances));
    updateDateDisplay();
}

// 日付を表示する
function updateDateDisplay() {
    const dateDisplay = document.getElementById('date-display');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayName = dayNames[currentDate.getDay()];
    dateDisplay.innerText = year + '年 ' + month + '月 ' + day + '日（' + dayName + '）';
}

// 買い物ボタンを押したとき
function askQuiz(item, price) {
    if (balance < price) {
        alert("お金がたりないよ！");
        return;
    }
    currentItem = item;
    currentPrice = price;
    
    const question = `${balance}円 もっています。\n${price}円の ${item} をかうと、\nのこりは いくら？`;
    document.getElementById('quiz-question').innerText = question;
    quizArea.classList.remove('hidden'); // クイズを表示
}

// 答え合わせボタンを押したとき
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('quiz-answer').value);
    const correctAnswer = balance - currentPrice;

    if (userAnswer === correctAnswer) {
        alert("せいかい！かしこいね！🎉");
        balance = correctAnswer;
        addHistory(`${currentItem} (-${currentPrice}円)`);
        quizArea.classList.add('hidden'); // クイズを隠す
        document.getElementById('quiz-answer').value = "";
        updateDisplay();
    } else {
        alert("ざんねん！もういちど 計算してみてね！🤔");
    }
}

// お手伝いボーナス
function addBonus() {
    balance += 50;
    addHistory("お手伝いボーナス (+50円) ✨");
    updateDisplay();
}

let bonusQuizAnswer = 0;

// ボーナスモーダルを表示（先にクイズ）
function showBonusModal() {
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    const op = Math.random() < 0.5 ? '+' : '-';
    bonusQuizAnswer = op === '+' ? a + b : a - b;
    document.getElementById('bonus-quiz-question').innerText = `${a} ${op} ${b} = ?`;
    document.getElementById('bonus-quiz-answer').value = '';

    document.getElementById('bonus-area').classList.add('hidden');
    document.getElementById('bonus-quiz-area').classList.remove('hidden');
}

// ボーナスクイズ回答確認
function checkBonusQuiz() {
    const answer = parseInt(document.getElementById('bonus-quiz-answer').value);
    if (isNaN(answer)) {
        alert('こたえは すうじで いれてね。');
        return;
    }
    if (answer === bonusQuizAnswer) {
        document.getElementById('bonus-quiz-area').classList.add('hidden');
        document.getElementById('bonus-area').classList.remove('hidden');
    } else {
        alert('ざんねん！もういちど かんがえてみよう。');
    }
}

// ボーナスモーダルを閉じる
function closeBonusModal() {
    document.getElementById('bonus-area').classList.add('hidden');
    document.getElementById('bonus-quiz-area').classList.add('hidden');
    document.getElementById('bonus-amount').value = '';
    document.getElementById('bonus-reason').value = '';
    document.getElementById('bonus-quiz-answer').value = '';
}

// ボーナスを確認して追加
function confirmBonus() {
    const amount = parseInt(document.getElementById('bonus-amount').value);
    const reason = document.getElementById('bonus-reason').value.trim();
    
    if (isNaN(amount) || amount <= 0) {
        alert('正しい金額を入力してください！');
        return;
    }
    
    if (!reason) {
        alert('お手伝いの内容を入力してください！');
        return;
    }
    
    balance += amount;
    addHistory(`お手伝いボーナス (+${amount}円): ${reason} ✨`);
    updateDisplay();
    closeBonusModal();
}

// クイズをとじる
function closeQuiz() {
    quizArea.classList.add('hidden');
    document.getElementById('quiz-answer').value = "";
}

// きろくを表示/隠す
function toggleHistory() {
    const historyArea = document.getElementById('history-area');
    historyArea.classList.toggle('hidden');
}

// きろくをつける（タイムスタンプ付き）
function addHistory(text) {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    const dateString = (now.getMonth() + 1) + '月' + now.getDate() + '日';
    const monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    const transaction = {
        text: text,
        timestamp: now.getTime(),
        date: dateString,
        time: timeString,
        month: monthKey
    };
    
    transactions.unshift(transaction);
    localStorage.setItem(getUserStorageKey('transactions'), JSON.stringify(transactions));
    
    renderHistoryList();
}

// 月を変更する
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    currentMonth = year + '-' + month;
    balance = monthlyBalances[currentMonth] || getInitialBudget();
    
    updateDisplay();
    renderHistoryList();
}

// きろく一覧を表示する
function renderHistoryList() {
    const historyList = document.getElementById('history-list');
    const monthDisplay = document.getElementById('history-month-display');
    historyList.innerHTML = '';
    
    const [year, month] = currentMonth.split('-');
    monthDisplay.innerText = year + '年 ' + parseInt(month) + '月のきろく';
    
    const filteredTransactions = transactions.filter(t => t.month === currentMonth);
    
    if (filteredTransactions.length === 0) {
        historyList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">この月の取引はありません</li>';
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="transaction-time">${transaction.date} ${transaction.time}</span><span class="transaction-text">${transaction.text}</span>`;
        historyList.appendChild(li);
    });
}

// さいしょに画面を表示する
if (currentUser && userProfiles[currentUser]) {
    document.getElementById('user-select-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    applyUserTheme();
    loadUserSettings();
    renderSpendButtons();
    updateCurrentUserDisplay();
    loadUserData();
    updateDisplay();
    renderHistoryList();
}