import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL-Q3GhUnWUUVXvdp-yN4I4ncto3vud4c",
    authDomain: "portfolio-16203.firebaseapp.com",
    projectId: "portfolio-16203",
    storageBucket: "portfolio-16203.firebasestorage.app",
    messagingSenderId: "1011071848995",
    appId: "1:1011071848995:web:6bd7a700fa2448912a1796",
    measurementId: "G-P1L149TZZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Project Data for Viewer
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
    gridEl.innerHTML = ''; // Clear
    
    state.grid.forEach((row, i) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'row';
        row.forEach((letter, j) => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = letter;
            
            // If row is submitted, apply colors
            if (i < state.currentRow) {
                if (letter === state.secret[j]) {
                    box.classList.add('correct'); // Green
                } else if (state.secret.includes(letter)) {
                    box.classList.add('present'); // Yellow
                } else {
                    box.classList.add('absent');  // Gray
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
        if (state.currentCol === 5) {
            submitRow();
        }
    } else if (key === 'BACKSPACE') {
        if (state.currentCol > 0) {
            state.grid[state.currentRow][state.currentCol - 1] = '';
            state.currentCol--;
            updateGrid();
        }
    } else if (key.match(/^[A-Z]$/) && state.currentCol < 5) {
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
            code: `// See the actual script.js file for the source code!
// This file connects to Firebase for real-time contact form submissions.`
        },
        movie: {
            title: "Movie Discovery App",
            fileName: "app.js",
            code: `const API_KEY = 'YOUR_OMDB_KEY';
const API_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('btn-search');
const resultsGrid = document.querySelector('.movie-grid');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
});

async function fetchMovies(term) {
    try {
        const res = await fetch(\`\${API_URL}?apikey=\${API_KEY}&s=\${term}\`);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            resultsGrid.innerHTML = \`<p class="error">\${data.Error}</p>\`;
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies(movies) {
    resultsGrid.innerHTML = movies.map(movie => \`
        <div class="movie-card" onclick="viewDetails('\${movie.imdbID}')">
            <div class="poster-container">
                <img src="\${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="\${movie.Title}">
            </div>
            <div class="movie-info">
                <h3>\${movie.Title}</h3>
                <span>\${movie.Year}</span>
            </div>
        </div>
    \`).join('');
}

async function viewDetails(id) {
    const res = await fetch(\`\${API_URL}?apikey=\${API_KEY}&i=\${id}\`);
    const movie = await res.json();
    
    document.getElementById('modal-title').innerText = movie.Title;
    document.getElementById('modal-plot').innerText = movie.Plot;
    document.getElementById('modal-rating').innerText = movie.imdbRating;
    document.getElementById('movie-modal').style.display = 'block';
}`
        }
    };

    // Route Handling (Viewer vs Portfolio)
    // Note: window.location.search might not parse elegantly if hash routing was mixed, but here it's simple
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

        // Trigger Prism
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    } else {
        portfolioView.style.display = 'block';
        viewerView.style.display = 'none';

        // Smooth scrolling
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                        // Close mobile menu
                        const navLinks = document.querySelector('.nav-links');
                        if (navLinks) navLinks.classList.remove('nav-active');
                    }
                }
            });
        });

        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('nav-active');
            });
        }

        // Contact Form Submission (Firebase)
        const contactForm = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalBtnText = submitBtn.innerText;

                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date()
                };

                try {
                    // Check if db is initialized
                    if (!db) {
                        throw new Error("Firestore is not initialized. Check your Firebase configuration.");
                    }

                    // Write to Firestore "Portfolio_messages" collection
                    await addDoc(collection(db, "Portfolio_messages"), formData);

                    formMessage.innerText = 'Message sent successfully!';
                    formMessage.className = 'success';
                    contactForm.reset();

                } catch (error) {
                    console.error('Detailed Firebase Error:', error);

                    let userFriendlyMessage = 'Failed to send message. Please try again.';

                    if (error.code === 'permission-denied') {
                        userFriendlyMessage = 'Error: Permission Denied. Please ensure Firestore Security Rules allow writes to "Portfolio_messages".';
                    } else if (error.message.includes('not initialized')) {
                        userFriendlyMessage = 'Error: Database not initialized correctly.';
                    }

                    formMessage.innerText = userFriendlyMessage;
                    formMessage.className = 'error';
                } finally {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
});
