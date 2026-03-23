document.addEventListener('DOMContentLoaded', () => {

    // ================= PROJECT DATA =================
    const projectData = {
        wordle: {
            title: "Wordle Clone",
            fileName: "game.js",
            code: `// Wordle Clone - Main Logic
const dictionary = ['APPLE', 'GREAT', 'SWIFT', 'LEARN', 'REACT', 'WORLD', 'PIZZA', 'MOUSE'];
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function updateGrid() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';

    state.grid.forEach((row, i) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'row';

        row.forEach((letter, j) => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = letter;

            if (i < state.currentRow) {
                if (letter === state.secret[j]) {
                    box.classList.add('correct');
                } else if (state.secret.includes(letter)) {
                    box.classList.add('present');
                } else {
                    box.classList.add('absent');
                }
            }

            rowEl.appendChild(box);
        });

        gridEl.appendChild(rowEl);
    });
}

function handleKey(e) {
    const key = e.key.toUpperCase();

    if (key === 'ENTER') {
        if (state.currentCol === 5) submitRow();
    } else if (key === 'BACKSPACE') {
        if (state.currentCol > 0) {
            state.grid[state.currentRow][state.currentCol - 1] = '';
            state.currentCol--;
            updateGrid();
        }
    } else if (/^[A-Z]$/.test(key) && state.currentCol < 5) {
        state.grid[state.currentRow][state.currentCol] = key;
        state.currentCol++;
        updateGrid();
    }
}

function submitRow() {
    const guess = state.grid[state.currentRow].join('');

    if (guess === state.secret) {
        alert('You Won! 🎉');
        window.removeEventListener('keydown', handleKey);
    } else if (state.currentRow === 5) {
        alert('Game Over! The word was ' + state.secret);
    }

    state.currentRow++;
    state.currentCol = 0;
    updateGrid();
}

window.addEventListener('keydown', handleKey);
updateGrid();`
        },

        portfolio: {
            title: "Personal Portfolio",
            fileName: "script.js",
            code: `// This portfolio uses Node.js + PostgreSQL backend`
        },

        movie: {
            title: "Movie Discovery App",
            fileName: "app.js",
            code: `// OMDB API logic here`
        }
    };

    // ================= ROUTING =================
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');

    const portfolioView = document.getElementById('portfolio-view');
    const viewerView = document.getElementById('viewer-view');

    if (projectId && projectData[projectId]) {
        portfolioView.style.display = 'none';
        viewerView.style.display = 'block';

        const project = projectData[projectId];

        document.getElementById('project-title').innerText = project.title;
        document.getElementById('file-name').innerText = project.fileName;
        document.getElementById('code-block').textContent = project.code;

        document.title = `${project.title} - Code Viewer`;

        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

    } else if (projectId && !projectData[projectId]) {
        window.location.href = "index.html";
    } else {

        portfolioView.style.display = 'block';
        viewerView.style.display = 'none';

        // ================= NAVIGATION =================
        const links = document.querySelectorAll('.nav-links a');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();

                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }

                    document.querySelector('.nav-links')?.classList.remove('nav-active');
                }
            });
        });

        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger?.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });

        // ================= CONTACT FORM =================
        const contactForm = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');

        let lastSubmitTime = 0;

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerText;

                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    subject: document.getElementById('subject').value.trim(),
                    message: document.getElementById('message').value.trim()
                };

                try {
                    // Validation
                    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                        throw new Error("All fields are required");
                    }

                    if (!formData.email.includes("@")) {
                        throw new Error("Enter a valid email");
                    }

                    if (Date.now() - lastSubmitTime < 5000) {
                        throw new Error("Please wait before sending again");
                    }

                    lastSubmitTime = Date.now();

                    // API CALL (Render backend)
                    const response = await fetch("https://portfolio-backend-u7wr.onrender.com/contact", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (!data.success) {
                        throw new Error("Server error. Try again later.");
                    }

                    formMessage.innerText = "Message sent successfully!";
                    formMessage.className = "success";
                    contactForm.reset();

                } catch (error) {
                    console.error(error);
                    formMessage.innerText = error.message || "Something went wrong";
                    formMessage.className = "error";

                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
});