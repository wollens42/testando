class QuizApp {
    constructor() {
        this.questions = [
            {
                question: "Qual é a capital do Brasil?",
                options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
                correct: 2
            },
            {
                question: "Quantos planetas existem no Sistema Solar?",
                options: ["7", "8", "9", "10"],
                correct: 1
            },
            {
                question: "Quem pintou a Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2
            },
            {
                question: "Qual é o maior oceano do mundo?",
                options: ["Atlântico", "Índico", "Ártico", "Pacífico"],
                correct: 3
            },
            {
                question: "Em que ano o homem pisou na Lua pela primeira vez?",
                options: ["1967", "1969", "1971", "1973"],
                correct: 1
            },
            {
                question: "Qual é o elemento químico representado pelo símbolo 'O'?",
                options: ["Ouro", "Oxigênio", "Ósmio", "Ozônio"],
                correct: 1
            },
            {
                question: "Quantos continentes existem?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "Qual é a língua mais falada no mundo?",
                options: ["Inglês", "Espanhol", "Mandarim", "Hindi"],
                correct: 2
            },
            {
                question: "Quem escreveu 'Dom Casmurro'?",
                options: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Guimarães Rosa"],
                correct: 1
            },
            {
                question: "Qual é a fórmula química da água?",
                options: ["CO2", "H2O", "NaCl", "CH4"],
                correct: 1
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.startTime = null;
        this.selectedAnswer = null;
        this.isAnswered = false;

        this.initializeElements();
        this.bindEvents();
        this.showScreen('start');
    }

    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');

        // Start screen elements
        this.startBtn = document.getElementById('start-btn');

        // Quiz screen elements
        this.progressFill = document.getElementById('progress-fill');
        this.questionCounter = document.getElementById('question-counter');
        this.timerDisplay = document.getElementById('timer');
        this.timerCircle = document.getElementById('timer-circle');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.nextBtn = document.getElementById('next-btn');

        // Results screen elements
        this.resultsIcon = document.getElementById('results-icon');
        this.resultsTitle = document.getElementById('results-title');
        this.finalScore = document.getElementById('final-score');
        this.performanceMessage = document.getElementById('performance-message');
        this.correctAnswers = document.getElementById('correct-answers');
        this.wrongAnswers = document.getElementById('wrong-answers');
        this.totalTime = document.getElementById('total-time');
        this.restartBtn = document.getElementById('restart-btn');

        // Feedback overlay
        this.feedbackOverlay = document.getElementById('feedback-overlay');
        this.feedbackIcon = document.getElementById('feedback-icon');
        this.feedbackText = document.getElementById('feedback-text');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.quizScreen.classList.contains('active')) {
                if (e.key >= '1' && e.key <= '4') {
                    const optionIndex = parseInt(e.key) - 1;
                    this.selectAnswer(optionIndex);
                } else if (e.key === 'Enter' && !this.nextBtn.disabled) {
                    this.nextQuestion();
                }
            }
        });
    }

    showScreen(screenName) {
        const screens = [this.startScreen, this.quizScreen, this.resultsScreen];
        screens.forEach(screen => screen.classList.remove('active'));

        setTimeout(() => {
            switch (screenName) {
                case 'start':
                    this.startScreen.classList.add('active');
                    break;
                case 'quiz':
                    this.quizScreen.classList.add('active');
                    break;
                case 'results':
                    this.resultsScreen.classList.add('active');
                    break;
            }
        }, 100);
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.showScreen('quiz');
        this.loadQuestion();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        this.selectedAnswer = null;
        this.isAnswered = false;

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.questionCounter.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;

        // Load question
        this.questionText.textContent = question.question;

        // Load answers with animation
        this.answersContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = option;
            answerElement.style.animationDelay = `${index * 0.1}s`;
            answerElement.addEventListener('click', () => this.selectAnswer(index));
            
            // Add keyboard hint
            const keyHint = document.createElement('span');
            keyHint.style.opacity = '0.5';
            keyHint.style.fontSize = '0.8em';
            keyHint.style.float = 'right';
            keyHint.textContent = `${index + 1}`;
            answerElement.appendChild(keyHint);
            
            this.answersContainer.appendChild(answerElement);
        });

        // Reset and start timer
        this.timeLeft = 30;
        this.startTimer();
        this.nextBtn.disabled = true;
    }

    selectAnswer(index) {
        if (this.isAnswered) return;

        const answerOptions = this.answersContainer.querySelectorAll('.answer-option');
        
        // Remove previous selection
        answerOptions.forEach(option => option.classList.remove('selected'));
        
        // Select new answer
        answerOptions[index].classList.add('selected');
        this.selectedAnswer = index;
        this.nextBtn.disabled = false;

        // Auto-advance after selection (for speed)
        setTimeout(() => {
            if (!this.isAnswered) {
                this.submitAnswer();
            }
        }, 500);
    }

    submitAnswer() {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        this.stopTimer();

        const question = this.questions[this.currentQuestion];
        const answerOptions = this.answersContainer.querySelectorAll('.answer-option');
        const isCorrect = this.selectedAnswer === question.correct;

        // Show correct/incorrect feedback
        answerOptions.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
            this.showFeedback('✅', 'Correto!', true);
        } else {
            this.showFeedback('❌', 'Incorreto!', false);
        }

        // Enable next button
        this.nextBtn.disabled = false;

        // Auto-advance to next question
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    showFeedback(icon, text, isCorrect) {
        this.feedbackIcon.textContent = icon;
        this.feedbackText.textContent = text;
        this.feedbackOverlay.classList.add('show');

        setTimeout(() => {
            this.feedbackOverlay.classList.remove('show');
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    startTimer() {
        this.timerDisplay.textContent = this.timeLeft;
        this.updateTimerCircle();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            this.updateTimerCircle();

            // Warning state
            if (this.timeLeft <= 10) {
                this.timerCircle.classList.add('warning');
                this.timerDisplay.style.color = '#f56565';
            }

            if (this.timeLeft <= 0) {
                this.timeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timerCircle.classList.remove('warning');
        this.timerDisplay.style.color = '#2d3748';
    }

    updateTimerCircle() {
        const circumference = 283;
        const progress = (30 - this.timeLeft) / 30;
        const offset = circumference * progress;
        this.timerCircle.style.strokeDashoffset = offset;
    }

    timeOut() {
        if (this.isAnswered) return;
        
        this.showFeedback('⏰', 'Tempo esgotado!', false);
        
        // Show correct answer
        const question = this.questions[this.currentQuestion];
        const answerOptions = this.answersContainer.querySelectorAll('.answer-option');
        answerOptions[question.correct].classList.add('correct');
        answerOptions.forEach(option => option.classList.add('disabled'));
        
        this.isAnswered = true;
        this.stopTimer();
        this.nextBtn.disabled = false;

        // Auto-advance
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showResults() {
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        this.showScreen('results');

        // Animate score
        this.animateScore();

        // Set results data
        this.finalScore.textContent = this.score;
        this.correctAnswers.textContent = this.score;
        this.wrongAnswers.textContent = this.questions.length - this.score;
        this.totalTime.textContent = `${totalTime}s`;

        // Performance message and icon
        if (percentage >= 80) {
            this.resultsIcon.textContent = '🏆';
            this.resultsTitle.textContent = 'Excelente!';
            this.performanceMessage.textContent = 'Você é um verdadeiro expert!';
        } else if (percentage >= 60) {
            this.resultsIcon.textContent = '🎉';
            this.resultsTitle.textContent = 'Muito bem!';
            this.performanceMessage.textContent = 'Bom desempenho, continue assim!';
        } else if (percentage >= 40) {
            this.resultsIcon.textContent = '👍';
            this.resultsTitle.textContent = 'Não foi mal!';
            this.performanceMessage.textContent = 'Você pode melhorar, tente novamente!';
        } else {
            this.resultsIcon.textContent = '📚';
            this.resultsTitle.textContent = 'Continue estudando!';
            this.performanceMessage.textContent = 'Pratique mais e você vai melhorar!';
        }
    }

    animateScore() {
        let currentScore = 0;
        const targetScore = this.score;
        const duration = 1000;
        const increment = targetScore / (duration / 50);

        const scoreAnimation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(scoreAnimation);
            }
            this.finalScore.textContent = Math.floor(currentScore);
        }, 50);
    }

    restartQuiz() {
        this.showScreen('start');
        this.stopTimer();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add particle effect for celebrations
    function createParticles() {
        const colors = ['#667eea', '#764ba2', '#48bb78', '#f56565', '#ed8936'];
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            
            document.body.appendChild(particle);
            
            const animation = particle.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            animation.onfinish = () => particle.remove();
        }
    }

    // Trigger particles on high scores
    window.addEventListener('quiz-complete', (e) => {
        if (e.detail.percentage >= 80) {
            createParticles();
        }
    });
});