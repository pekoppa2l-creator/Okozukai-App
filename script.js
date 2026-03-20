// はじまりの お金（1000円もっていることにするよ）
let currentDate = new Date();
let currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
let monthlyBalances = JSON.parse(localStorage.getItem('monthlyBalances')) || {};
let balance = monthlyBalances[currentMonth] || 1000;
let currentPrice = 0;
let currentItem = "";
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const balanceDisplay = document.getElementById('balance');
const quizArea = document.getElementById('quiz-area');

// 画面を更新する
function updateDisplay() {
    balanceDisplay.innerText = balance;
    monthlyBalances[currentMonth] = balance;
    localStorage.setItem('monthlyBalances', JSON.stringify(monthlyBalances));
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
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    renderHistoryList();
}

// 月を変更する
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    currentMonth = year + '-' + month;
    balance = monthlyBalances[currentMonth] || 1000;
    
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
updateDisplay();
renderHistoryList();