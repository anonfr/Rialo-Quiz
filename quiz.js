const questions = [
    {
        question: "What tagline does Rialo use to emphasise its approach?",
        options: [
            { text: "The fastest layer one chain", correct: false },
            { text: "Rialo isn't a Layer One", correct: true },
            { text: "Blockchain for tokenisation only", correct: false },
            { text: "The decentralized oracle network", correct: false }
        ]
    },
    {
        question: "Which of the following technologies is Rialo built to support?",
        options: [
            { text: "RISC-V architecture and Solana VM compatibility", correct: true },
            { text: "Only EVM (Ethereum Virtual Machine) compatibility", correct: false },
            { text: "Bitcoin scripting only", correct: false },
            { text: "Hyperledger Fabric chaincode", correct: false }
        ]
    },
    {
        question: "What core problem is Rialo designed to solve?",
        options: [
            { text: "Lack of token liquidity", correct: false },
            { text: "Slow transaction throughput only", correct: false },
            { text: "The disconnect between blockchain apps and real-world data and services", correct: true },
            { text: "Only supporting NFTs", correct: false }
        ]
    },
    {
        question: "Which of these features is emphasised in Rialo's design?",
        options: [
            { text: "Native web connectivity and event-driven triggers", correct: true },
            { text: "High gas costs to secure the network", correct: false },
            { text: "Mandatory wallet sign-in for all users", correct: false },
            { text: "Centralised control of smart contracts", correct: false }
        ]
    },
    {
        question: "Who led the seed funding round of Subzero Labs / Rialo?",
        options: [
            { text: "Only angel investors", correct: false },
            { text: "A consortium led by Pantera Capital", correct: true },
            { text: "A government grant", correct: false },
            { text: "A public token sale", correct: false }
        ]
    },
    {
        question: "Which of the following use-cases does Rialo explicitly support?",
        options: [
            { text: "Only simple token transfers", correct: false },
            { text: "Real-world assets (RWAs), payments, web-hooks, IoT triggers", correct: true },
            { text: "Only decentralized exchanges (DEXes)", correct: false },
            { text: "Mining of proof-of-work blocks", correct: false }
        ]
    },
    {
        question: "In what way does Rialo aim to improve the user experience compared to many existing blockchains?",
        options: [
            { text: "By increasing the number of wallets users must operate", correct: false },
            { text: "By making blockchain feel like familiar Web2 apps (e.g., login with email/SMS)", correct: true },
            { text: "By removing all off-chain data access", correct: false },
            { text: "By forcing users to always use command-line interfaces", correct: false }
        ]
    },
    {
        question: "Which statement best describes Rialo's approach to oracles and external data?",
        options: [
            { text: "Rialo avoids needing external oracles by providing native access to web APIs and event-driven triggers.", correct: true },
            { text: "Rialo uses only centralized oracles for data feeds.", correct: false },
            { text: "Rialo disallows any off-chain data.", correct: false },
            { text: "Rialo depends exclusively on legacy bridges for data.", correct: false }
        ]
    },
    {
        question: "What status had Rialo reached at time of the sources (mid-2025)?",
        options: [
            { text: "Mainnet fully live with thousands of dApps", correct: false },
            { text: "Private devnet live, with early access/waitlist for builders", correct: true },
            { text: "Only a whitepaper and no code yet", correct: false },
            { text: "Abandoned project", correct: false }
        ]
    },
    {
        question: "Which of the following is not emphasised as a feature of Rialo?",
        options: [
            { text: "Real-world identity (email/SMS/social login)", correct: false },
            { text: "Sub-second latency/reactivity", correct: false },
            { text: "Built-in bridges to legacy chains as central security anchor", correct: true },
            { text: "Privacy and confidential compute by default", correct: false }
        ]
    }
];

// Quiz logic implementation
let currentQuestion = 0;
let score = 0;
let timer = null;
let timeLeft = 15;

const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress-bar');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const timerDisplay = document.getElementById('timer-display');
const resultsModal = document.getElementById('results-modal');
const resultsContent = document.getElementById('results-content');
const finalScore = document.getElementById('final-score');
const totalScore = document.getElementById('total-score');
const scoreMessage = document.getElementById('score-message');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');

function shuffleQuestions(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function startQuiz() {
    shuffleQuestions(questions);
    currentQuestion = 0;
    score = 0;
    totalQuestionsSpan.textContent = questions.length;
    showQuestion();
}

function showQuestion() {
    resetState();
    const q = questions[currentQuestion];
    questionText.textContent = q.question;
    q.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-150 option-btn flex items-center justify-between';
        btn.innerHTML = `<span>${option.text}</span><span class="icon-container"></span>`;
        btn.onclick = () => selectAnswer(btn, option.correct, idx);
        answerOptions.appendChild(btn);
    });
    currentQuestionSpan.textContent = currentQuestion + 1;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    timeLeft = 15;
    timerDisplay.textContent = timeLeft;
    startTimer();
    nextBtn.disabled = true;
    submitBtn.disabled = true;
    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    if (currentQuestion === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.textContent = 'Submit';
    } else {
        submitBtn.textContent = 'See Results';
    }
}


function resetState() {
    while (answerOptions.firstChild) {
        answerOptions.removeChild(answerOptions.firstChild);
    }
    clearInterval(timer);
}

function selectAnswer(btn, isCorrect, selectedIdx) {
    Array.from(answerOptions.children).forEach((child, idx) => {
        child.disabled = true;
        child.classList.remove('bg-blue-50', 'border-blue-400', 'bg-green-200', 'bg-red-200', 'selected-answer', 'correct-answer', 'wrong-answer', 'opacity-60');
        // Remove any previous icon
        let icon = child.querySelector('.icon-container');
        if (icon) icon.innerHTML = '';
        child.classList.add('opacity-60');
    });
    if (isCorrect) {
        btn.classList.add('selected-answer');
        let icon = btn.querySelector('.icon-container');
        if (icon) icon.innerHTML = '<svg class="inline ml-2" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b6f2d7"/><path d="M8 12.5l3 3 5-5.5" stroke="#1C7C54" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        score++;
    } else {
        btn.classList.add('wrong-answer');
        let icon = btn.querySelector('.icon-container');
        if (icon) icon.innerHTML = '<svg class="inline ml-2" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M8 8l8 8M16 8l-8 8" stroke="#e57373" stroke-width="2.2" stroke-linecap="round"/></svg>';
        // Highlight the correct answer
        Array.from(answerOptions.children).forEach((child, idx) => {
            if (questions[currentQuestion].options[idx].correct) {
                child.classList.add('correct-answer');
                let icon = child.querySelector('.icon-container');
                if (icon) icon.innerHTML = '<svg class="inline ml-2" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1C7C54"/><path d="M8 12.5l3 3 5-5.5" stroke="#E8F5E9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            }
        });
    }
    nextBtn.disabled = false;
    submitBtn.disabled = false;
    clearInterval(timer);
    // No auto-advance. User must click Next or Submit to proceed.
}

function startTimer() {
    timerDisplay.classList.remove('timer-blink', 'timer-critical');
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        // Blinking and red logic
        timerDisplay.classList.remove('timer-blink');
        if (timeLeft <= 8) {
            timerDisplay.classList.add('timer-blink');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerDisplay.classList.remove('timer-blink', 'timer-critical');
            selectAnswer(answerOptions.children[0], false); // auto-select first option
        }
    }, 1000);
}

nextBtn.onclick = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
};

submitBtn.onclick = () => {
    showResults();
};

shareBtn.onclick = () => {
    const score = finalScore.textContent;
    const total = totalScore.textContent;
    const tweetText = encodeURIComponent(`I scored ${score}/${total} on the Rialo Quiz created by @AnonfrXBT for @RialoHQ, Test your knowledge: https://rialo.vercel.app/  `);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank');
};

function showResults() {
    finalScore.textContent = score;
    totalScore.textContent = questions.length;
    let message = '';
    const percent = (score / questions.length) * 100;
    if (percent === 100) message = 'Perfect Score! Raiku Pro!';
    else if (percent >= 80) message = 'Excellent!';
    else if (percent >= 60) message = 'Good Job!';
    else if (percent >= 40) message = 'Keep Practicing!';
    else message = 'Try Again!';
    scoreMessage.textContent = message;
    resultsModal.classList.remove('hidden');
    setTimeout(() => {
        resultsContent.classList.remove('scale-95', 'opacity-0');
        resultsContent.classList.add('scale-100', 'opacity-100');
    }, 50);
}

restartBtn.onclick = () => {
    resultsModal.classList.add('hidden');
    resultsContent.classList.remove('scale-100', 'opacity-100');
    resultsContent.classList.add('scale-95', 'opacity-0');
    startQuiz();
};

document.addEventListener('DOMContentLoaded', function() {
    var startModal = document.getElementById('start-modal');
    var quizContainer = document.getElementById('quiz-container');
    var startBtn = document.getElementById('start-quiz-btn');
    if (startModal && quizContainer && startBtn) {
        quizContainer.style.display = 'none';
        startModal.style.display = 'flex';
        startBtn.onclick = function() {
            startModal.style.display = 'none';
            quizContainer.style.display = '';
            startQuiz();
        };
    } else {
        // fallback: if modal not present, just start quiz
        startQuiz();
    }
});
