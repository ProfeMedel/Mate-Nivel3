// --- Web Audio API para Efectos de Sonido ---
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) audioCtx = new AudioContext();
        }

        function playSuccessSound() {
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'triangle';
            // Arpegio de victoria
            osc1.frequency.setValueAtTime(523.25, now);
            osc1.frequency.setValueAtTime(659.25, now + 0.08);
            osc1.frequency.setValueAtTime(783.99, now + 0.16);
            osc1.frequency.setValueAtTime(1046.50, now + 0.24);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc1.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(now);
            osc1.stop(now + 0.5);
        }

        function playErrorSound() {
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        }

        // --- Banco de Preguntas Predefinidas (Estructuradas 3° Básico) ---
        const fixedQuestions = [
            {
                category: "place",
                topic: "Valor Posicional",
                question: "¿Qué número representa esta representación en bloques base 10?",
                type: "blocks",
                hundreds: 3, tens: 4, units: 2,
                correct: 342,
                options: [342, 243, 432, 324, 340]
            },
            {
                category: "place",
                topic: "Valor Posicional",
                question: "¿Cuántas CENTENAS tiene el número 758?",
                type: "math-desc",
                textDesc: "Centenas = 100",
                correct: 7,
                options: [7, 5, 8, 70, 700]
            },
            {
                category: "place",
                topic: "Conteo y Grupos",
                question: "¿Cuántas manzanas de 10 unidades hay en total?",
                type: "icons",
                icon: "fa-apple-whole text-red-500",
                count: 15,
                correct: 15,
                options: [12, 14, 15, 16, 20]
            },
            {
                category: "addsub",
                topic: "Suma hasta 1.000",
                question: "¿Cuánto es 350 + 240?",
                type: "calc",
                correct: 590,
                options: [590, 580, 600, 570, 490]
            },
            {
                category: "addsub",
                topic: "Resta hasta 1.000",
                question: "Si tienes 600 lápices y regalas 250, ¿cuántos te quedan?",
                type: "calc",
                correct: 350,
                options: [350, 400, 300, 450, 250]
            },
            {
                category: "addsub",
                topic: "Suma Visual",
                question: "¿Cuántas estrellas hay en total?",
                type: "icons-group",
                group1: 9, group2: 7,
                icon: "fa-star text-yellow-400",
                correct: 16,
                options: [14, 15, 16, 17, 18]
            },
            {
                category: "mult",
                topic: "Multiplicación como Arreglo",
                question: "Hay 4 filas con 3 ordenadores cada una. ¿Cuántos hay en total?",
                type: "multiplication-visual",
                groups: 4, itemsPerGroup: 3,
                icon: "fa-laptop text-blue-500",
                correct: 12,
                options: [7, 10, 12, 14, 16]
            },
            {
                category: "mult",
                topic: "Tabla del 5",
                question: "¿Cuánto es 5 × 6?",
                type: "calc",
                correct: 30,
                options: [25, 28, 30, 32, 35]
            },
            {
                category: "mult",
                topic: "Suma Reiterada",
                question: "¿Qué multiplicación representa sumarle 4 tres veces (4 + 4 + 4)?",
                type: "math-desc",
                textDesc: "4 + 4 + 4",
                correct: "3 × 4",
                options: ["3 × 4", "4 × 4", "3 + 4", "3 × 3", "4 × 2"],
                isStringVal: true
            },
            {
                category: "patterns",
                topic: "Patrón Creciente",
                question: "¿Qué número falta? 150, 200, 250, ___, 350",
                type: "calc",
                correct: 300,
                options: [280, 290, 300, 310, 320]
            },
            {
                category: "patterns",
                topic: "Patrón Decreciente",
                question: "¿Qué número falta? 900, 800, 700, ___, 500",
                type: "calc",
                correct: 600,
                options: [650, 600, 550, 610, 590]
            },
            {
                category: "place",
                topic: "Comparación",
                question: "¿Cuál número es el MAYOR de todos?",
                type: "calc",
                correct: 890,
                options: [809, 890, 889, 799, 879]
            },
            {
                category: "mult",
                topic: "Tabla del 2",
                question: "Tienes 8 parejas de calcetines. ¿Cuántos calcetines son en total (2 × 8)?",
                type: "calc",
                correct: 16,
                options: [12, 14, 15, 16, 18]
            },
            {
                category: "addsub",
                topic: "Suma con Canje",
                question: "¿Cuánto es 185 + 115?",
                type: "calc",
                correct: 300,
                options: [290, 295, 300, 305, 310]
            },
            {
                category: "patterns",
                topic: "Patrones de 3 en 3",
                question: "¿Qué número sigue? 12, 15, 18, 21, ___",
                type: "calc",
                correct: 24,
                options: [22, 23, 24, 25, 27]
            }
        ];

        // --- Generador Dinámico de Preguntas (Infinito) ---
        function generateDynamicQuestion(category) {
            const chosenCategory = (category === 'all') 
                ? ['place', 'addsub', 'mult', 'patterns'][Math.floor(Math.random() * 4)] 
                : category;

            if (chosenCategory === 'place') {
                const type = Math.random() > 0.5 ? 'blocks' : 'place_val';
                if (type === 'blocks') {
                    const h = Math.floor(Math.random() * 5) + 1;
                    const t = Math.floor(Math.random() * 6);
                    const u = Math.floor(Math.random() * 8) + 1;
                    const val = h * 100 + t * 10 + u;
                    return {
                        category: "place",
                        topic: "Valor Posicional (Dinámico)",
                        question: "¿Qué número forman estos bloques multibase?",
                        type: "blocks",
                        hundreds: h, tens: t, units: u,
                        correct: val,
                        options: generateDistractors(val, 'near')
                    };
                } else {
                    const num = Math.floor(Math.random() * 800) + 100;
                    return {
                        category: "place",
                        topic: "Descomposición (Dinámico)",
                        question: `¿Cuál es el valor del dígito de las DECENAS en el número ${num}?`,
                        type: "calc",
                        correct: Math.floor((num % 100) / 10) * 10,
                        options: generateDistractors(Math.floor((num % 100) / 10) * 10, 'place')
                    };
                }
            } else if (chosenCategory === 'addsub') {
                const isAdd = Math.random() > 0.4;
                if (isAdd) {
                    const a = Math.floor(Math.random() * 400) + 100;
                    const b = Math.floor(Math.random() * 400) + 50;
                    const ans = a + b;
                    return {
                        category: "addsub",
                        topic: "Adición (Dinámico)",
                        question: `¿Cuánto es ${a} + ${b}?`,
                        type: "calc",
                        correct: ans,
                        options: generateDistractors(ans, 'near')
                    };
                } else {
                    const a = Math.floor(Math.random() * 500) + 300;
                    const b = Math.floor(Math.random() * 250) + 50;
                    const ans = a - b;
                    return {
                        category: "addsub",
                        topic: "Sustracción (Dinámico)",
                        question: `¿Cuánto es ${a} - ${b}?`,
                        type: "calc",
                        correct: ans,
                        options: generateDistractors(ans, 'near')
                    };
                }
            } else if (chosenCategory === 'mult') {
                const factor1 = Math.floor(Math.random() * 8) + 2; // 2 al 9
                const factor2 = Math.floor(Math.random() * 8) + 2;
                const ans = factor1 * factor2;
                
                if (Math.random() > 0.5) {
                    return {
                        category: "mult",
                        topic: "Multiplicación (Dinámico)",
                        question: `¿Cuánto es ${factor1} × ${factor2}?`,
                        type: "calc",
                        correct: ans,
                        options: generateDistractors(ans, 'mult')
                    };
                } else {
                    const icons = ["fa-cookie text-amber-600", "fa-car text-red-500", "fa-basketball text-orange-500", "fa-fish text-cyan-500"];
                    const icon = icons[Math.floor(Math.random() * icons.length)];
                    return {
                        category: "mult",
                        topic: "Grupos Iguales (Dinámico)",
                        question: `Hay ${factor1} grupos con ${factor2} objetos cada uno. ¿Cuántos hay en total?`,
                        type: "multiplication-visual",
                        groups: factor1,
                        itemsPerGroup: factor2,
                        icon: icon,
                        correct: ans,
                        options: generateDistractors(ans, 'mult')
                    };
                }
            } else { // patterns
                const step = [5, 10, 50, 100, 2][Math.floor(Math.random() * 5)];
                const start = Math.floor(Math.random() * 10) * step + 10;
                const seq = [start, start + step, start + step * 2, start + step * 3];
                const ans = start + step * 4;
                return {
                    category: "patterns",
                    topic: "Secuencia Numérica (Dinámico)",
                    question: `¿Qué número continúa el patrón? ${seq.join(', ')}, ___`,
                    type: "calc",
                    correct: ans,
                    options: generateDistractors(ans, 'pattern', step)
                };
            }
        }

        // Generador de Distractores Inteligentes para 5 Opciones
        function generateDistractors(correctVal, type, step = 10) {
            let options = new Set();
            options.add(correctVal);

            while (options.size < 5) {
                let offset = 0;
                if (type === 'near') {
                    offset = (Math.floor(Math.random() * 5) - 2) * 10;
                    if (offset === 0) offset = 5;
                } else if (type === 'mult') {
                    offset = (Math.floor(Math.random() * 5) - 2) * 2;
                    if (offset === 0) offset = 3;
                } else if (type === 'pattern') {
                    offset = (Math.floor(Math.random() * 4) - 2) * step;
                    if (offset === 0) offset = step / 2;
                } else {
                    offset = (Math.floor(Math.random() * 6) - 3) * 5;
                    if (offset === 0) offset = 10;
                }

                let candidate = correctVal + offset;
                if (candidate >= 0) options.add(candidate);
            }

            // Convertir a Array y Mezclar
            return Array.from(options).sort(() => Math.random() - 0.5);
        }

        // --- Estado del Juego ---
        let currentCategory = 'all';
        let currentQuestion = null;
        let roundQuestionCount = 0;
        let roundScore = 0;
        let totalScore = 0;
        const totalPerRound = 10;

        // Cambiar Categoría
        function setCategory(cat) {
            currentCategory = cat;
            document.querySelectorAll('.cat-btn').forEach(btn => {
                btn.className = 'cat-btn bg-white hover:bg-gray-100 text-slate-700 font-bold py-2 px-3 rounded-2xl text-xs sm:text-sm shadow border-b-4 border-slate-300 transition-all flex items-center justify-center gap-1.5';
            });
            const activeBtn = document.getElementById(`cat-${cat}`);
            if (activeBtn) {
                activeBtn.className = 'cat-btn bg-purple-600 text-white font-bold py-2 px-3 rounded-2xl text-xs sm:text-sm shadow border-b-4 border-purple-800 transition-all flex items-center justify-center gap-1.5';
            }
            nextQuestion();
        }

        // Obtener siguiente pregunta (combinando banco fijo y generador dinámico)
        function getNextQuestion() {
            // Filtrar del banco fijo por categoría
            const filteredFixed = fixedQuestions.filter(q => currentCategory === 'all' || q.category === currentCategory);
            
            // 50% probabilidad de usar banco fijo o generador dinámico si coincide categoría
            if (filteredFixed.length > 0 && Math.random() > 0.5) {
                const randomIdx = Math.floor(Math.random() * filteredFixed.length);
                return JSON.parse(JSON.stringify(filteredFixed[randomIdx]));
            } else {
                return generateDynamicQuestion(currentCategory);
            }
        }

        // Cargar y Renderizar Pregunta
        function loadQuestion(q) {
            currentQuestion = q;
            const qCard = document.getElementById('question-card');
            
            qCard.classList.remove('pop-in');
            void qCard.offsetWidth;
            qCard.classList.add('pop-in');

            document.getElementById('topic-tag').innerText = q.topic;
            document.getElementById('question-text').innerText = q.question;

            const visualContainer = document.getElementById('visual-container');
            visualContainer.innerHTML = '';

            // Renderizado de Recursos Visuales
            if (q.type === 'blocks') {
                for (let i = 0; i < q.hundreds; i++) {
                    const el = document.createElement('div');
                    el.className = 'block-hundred flex items-center justify-center text-xs font-bold text-yellow-900 m-1';
                    el.innerText = '100';
                    visualContainer.appendChild(el);
                }
                for (let i = 0; i < q.tens; i++) {
                    const el = document.createElement('div');
                    el.className = 'block-ten flex items-center justify-center text-xs font-bold text-white m-1';
                    el.innerText = '10';
                    visualContainer.appendChild(el);
                }
                for (let i = 0; i < q.units; i++) {
                    const el = document.createElement('div');
                    el.className = 'block-unit m-1';
                    visualContainer.appendChild(el);
                }
            } else if (q.type === 'icons') {
                for (let i = 0; i < q.count; i++) {
                    const icon = document.createElement('i');
                    icon.className = `fa-solid ${q.icon} text-3xl sm:text-4xl m-1 transform hover:scale-110 transition-transform`;
                    visualContainer.appendChild(icon);
                }
            } else if (q.type === 'icons-group') {
                const group1 = document.createElement('div');
                group1.className = 'flex flex-wrap p-2 bg-white rounded-xl border border-gray-200';
                for (let i = 0; i < q.group1; i++) {
                    group1.innerHTML += `<i class="fa-solid ${q.icon} text-2xl sm:text-3xl m-1"></i>`;
                }
                
                const plus = document.createElement('span');
                plus.className = 'text-3xl font-extrabold text-purple-600 mx-2';
                plus.innerText = '+';

                const group2 = document.createElement('div');
                group2.className = 'flex flex-wrap p-2 bg-white rounded-xl border border-gray-200';
                for (let i = 0; i < q.group2; i++) {
                    group2.innerHTML += `<i class="fa-solid ${q.icon} text-2xl sm:text-3xl m-1"></i>`;
                }

                visualContainer.appendChild(group1);
                visualContainer.appendChild(plus);
                visualContainer.appendChild(group2);
            } else if (q.type === 'multiplication-visual') {
                for (let g = 0; g < q.groups; g++) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'flex border-2 border-purple-300 bg-purple-50 p-2 rounded-2xl m-1 items-center justify-center';
                    for (let item = 0; item < q.itemsPerGroup; item++) {
                        groupDiv.innerHTML += `<i class="fa-solid ${q.icon} text-2xl sm:text-3xl m-1"></i>`;
                    }
                    visualContainer.appendChild(groupDiv);
                }
            } else if (q.type === 'math-desc') {
                visualContainer.innerHTML = `<div class="text-3xl font-extrabold text-purple-700 bg-purple-100 px-6 py-3 rounded-2xl border-2 border-purple-300">${q.textDesc}</div>`;
            } else {
                visualContainer.innerHTML = `<div class="text-5xl text-purple-400 font-bold"><i class="fa-solid fa-calculator"></i></div>`;
            }

            // Renderizar Opciones (Siempre 5 opciones)
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            const btnColors = [
                'bg-red-500 hover:bg-red-600 border-red-700 text-white',
                'bg-blue-500 hover:bg-blue-600 border-blue-700 text-white',
                'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white',
                'bg-amber-500 hover:bg-amber-600 border-amber-700 text-white',
                'bg-purple-500 hover:bg-purple-600 border-purple-700 text-white'
            ];

            const options = [...q.options].sort(() => Math.random() - 0.5);

            options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = `${btnColors[idx % btnColors.length]} border-b-4 font-num font-extrabold text-2xl sm:text-3xl py-4 px-2 rounded-2xl shadow-lg bounce-hover transition-all flex items-center justify-center active:translate-y-1`;
                btn.innerText = opt;
                btn.onclick = () => checkAnswer(opt, q.correct, btn);
                optionsContainer.appendChild(btn);
            });

            document.getElementById('feedback-box').innerHTML = '<span class="text-purple-600 animate-pulse">¡Elige la opción correcta!</span>';
        }

        // Evaluar Respuesta
        function checkAnswer(selected, correct, btnElement) {
            initAudio();
            const feedbackBox = document.getElementById('feedback-box');

            if (selected === correct) {
                playSuccessSound();
                confetti({
                    particleCount: 65,
                    spread: 60,
                    origin: { y: 0.7 }
                });

                roundScore += 10;
                totalScore += 10;
                document.getElementById('score-display').innerText = totalScore;

                feedbackBox.innerHTML = '<span class="text-emerald-600 font-extrabold text-2xl pop-in"><i class="fa-solid fa-circle-check"></i> ¡Excelente! ¡Muy bien!</span>';
                btnElement.classList.add('ring-4', 'ring-yellow-300', 'scale-105');

                setTimeout(() => {
                    roundQuestionCount++;
                    updateProgress();

                    if (roundQuestionCount >= totalPerRound) {
                        showRoundSummary();
                    } else {
                        nextQuestion();
                    }
                }, 1400);

            } else {
                playErrorSound();
                btnElement.classList.add('shake', 'opacity-50');
                feedbackBox.innerHTML = '<span class="text-rose-500 font-extrabold text-xl"><i class="fa-solid fa-face-smile-wink"></i> ¡Casi! Inténtalo de nuevo</span>';

                setTimeout(() => {
                    btnElement.classList.remove('shake');
                }, 500);
            }
        }

        // Actualizar Barra de Progreso
        function updateProgress() {
            document.getElementById('round-progress').innerText = `${roundQuestionCount + 1}/${totalPerRound}`;
            const pct = Math.min(((roundQuestionCount + 1) / totalPerRound) * 100, 100);
            document.getElementById('progress-bar').style.width = `${pct}%`;
        }

        // Siguiente Pregunta
        function nextQuestion() {
            const q = getNextQuestion();
            loadQuestion(q);
        }

        // Mostrar Resumen de la Ronda
        function showRoundSummary() {
            document.getElementById('modal-score').innerText = roundScore;
            
            let feedback = "¡Sigue practicando para mejorar!";
            if (roundScore >= 90) feedback = "¡Increíble! ¡Eres un maestro/a de las matemáticas! 🌟";
            else if (roundScore >= 70) feedback = "¡Buen trabajo! ¡Casi un puntaje perfecto! 🎉";
            
            document.getElementById('modal-feedback').innerText = feedback;
            document.getElementById('summary-modal').classList.remove('hidden');
        }

        // Iniciar Nueva Ronda
        function startNewRound() {
            roundQuestionCount = 0;
            roundScore = 0;
            document.getElementById('summary-modal').classList.add('hidden');
            updateProgress();
            nextQuestion();
        }

        // Síntesis de voz (Web Speech API)
        function speakCurrentQuestion() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                if (!currentQuestion) return;

                const textToSpeak = `${currentQuestion.question}`;
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'es-CL';
                utterance.rate = 0.85; // Ritmo amigable para estudiantes primarios

                window.speechSynthesis.speak(utterance);
            } else {
                alert("Tu navegador no admite reproducción de voz.");
            }
        }

        // Reiniciar Juego Completo
        function restartGame() {
            totalScore = 0;
            roundScore = 0;
            roundQuestionCount = 0;
            document.getElementById('score-display').innerText = totalScore;
            document.getElementById('summary-modal').classList.add('hidden');
            updateProgress();
            nextQuestion();
        }

        // Inicialización
        window.onload = function() {
            updateProgress();
            nextQuestion();
        };
