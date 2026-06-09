/* =============================================
   🎨 CARTOON PORTFOLIO - JAVASCRIPT
   Interactive Animations & Theme Toggle
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // ===== NAVBAR SCROLL EFFECTS =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar shadow on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ===== DONUT CHART =====
    createDonutChart();

    // ===== HOBI BAR ANIMATION (Intersection Observer) =====
    const hobiBars = document.querySelectorAll('.hobi-bar-fill');
    const hobiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                hobiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    hobiBars.forEach(bar => hobiObserver.observe(bar));

    // ===== STAR RATING =====
    setupStarRating();

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.cartoon-card, .section-header');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});

// ===== DONUT CHART CREATION =====
function createDonutChart() {
    const svg = document.querySelector('.chart-svg');
    const data = [
        { label: 'Bermain Game', percent: 35, color: '#FF6B6B', emoji: '🎮' },
        { label: 'Coding', percent: 30, color: '#4ECDC4', emoji: '💻' },
        { label: 'Olahraga', percent: 20, color: '#FFE66D', emoji: '⚽' },
        { label: 'Tidur', percent: 15, color: '#A78BFA', emoji: '😴' },
    ];

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    data.forEach((item, index) => {
        const segmentLength = (item.percent / 100) * circumference;
        const gapSize = 4;
        const offset = (cumulativePercent / 100) * circumference;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('class', 'chart-segment');
        circle.setAttribute('stroke', item.color);
        circle.setAttribute('stroke-dasharray', `${segmentLength - gapSize} ${circumference - segmentLength + gapSize}`);
        circle.setAttribute('stroke-dashoffset', (-offset).toString());

        // Animation delay
        circle.style.opacity = '0';
        circle.style.transition = `all 0.8s ease ${index * 0.2}s`;

        svg.appendChild(circle);

        // Animate after a short delay
        setTimeout(() => {
            circle.style.opacity = '1';
        }, 300);

        // Hover effect - update center text
        circle.addEventListener('mouseenter', () => {
            const centerEmoji = document.querySelector('.chart-center-emoji');
            const centerText = document.querySelector('.chart-center-text');
            centerEmoji.textContent = item.emoji;
            centerText.textContent = `${item.label}\n${item.percent}%`;
            centerEmoji.style.transform = 'scale(1.3)';
        });

        circle.addEventListener('mouseleave', () => {
            const centerEmoji = document.querySelector('.chart-center-emoji');
            const centerText = document.querySelector('.chart-center-text');
            centerEmoji.textContent = '🎮';
            centerText.textContent = 'Hobi';
            centerEmoji.style.transform = 'scale(1)';
        });

        cumulativePercent += item.percent;
    });
}

// ===== STAR RATING SYSTEM =====
function setupStarRating() {
    const starsContainer = document.getElementById('starsContainer');
    const stars = starsContainer.querySelectorAll('.star');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultText = document.getElementById('resultText');
    const ratingConfetti = document.getElementById('ratingConfetti');

    // Rating data (simulated with localStorage)
    let ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    let currentRating = 0;

    const emojis = ['', '😕', '🙂', '😊', '😃', '🤩'];
    const messages = [
        '',
        'Terima kasih atas penilaianmu!',
        'Cukup baik, terima kasih!',
        'Baik sekali, terima kasih!',
        'Wah, bagus! Terima kasih! 🎉',
        'Luar biasa! Kamu yang terbaik! 🎉🎊'
    ];

    // Hover effects
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1, 'hover-active');
        });

        star.addEventListener('mouseleave', () => {
            clearHoverStars();
            if (currentRating > 0) {
                highlightStars(currentRating, 'active');
            }
        });

        star.addEventListener('click', () => {
            currentRating = index + 1;
            highlightStars(currentRating, 'active');

            // Pop animation
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.remove('pop');
                    // Trigger reflow
                    void s.offsetWidth;
                    s.classList.add('pop');

                    // Particle burst
                    createParticles(s);
                }
            });

            // Update result
            resultEmoji.textContent = emojis[currentRating];
            resultText.textContent = messages[currentRating];
            resultEmoji.style.transform = 'scale(1.3)';
            setTimeout(() => {
                resultEmoji.style.transform = 'scale(1)';
            }, 300);

            // Save rating
            ratings.push(currentRating);
            localStorage.setItem('ratings', JSON.stringify(ratings));

            // Update stats
            updateRatingStats(ratings);

            // Confetti for 5 stars
            if (currentRating === 5) {
                createConfetti();
            }
        });
    });

    function highlightStars(count, className) {
        stars.forEach((star, i) => {
            if (i < count) {
                star.classList.add(className);
            } else {
                star.classList.remove(className);
            }
        });
    }

    function clearHoverStars() {
        stars.forEach(star => {
            star.classList.remove('hover-active');
        });
    }

    function createParticles(starEl) {
        const particlesContainer = starEl.querySelector('.star-particles');
        particlesContainer.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.classList.add('star-particle');
            const angle = (i / 8) * 360;
            const distance = 20 + Math.random() * 20;
            const tx = Math.cos((angle * Math.PI) / 180) * distance;
            const ty = Math.sin((angle * Math.PI) / 180) * distance;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = '50%';
            particle.style.top = '50%';
            particlesContainer.appendChild(particle);
        }

        starEl.classList.add('burst');
        setTimeout(() => {
            starEl.classList.remove('burst');
        }, 600);
    }

    function createConfetti() {
        ratingConfetti.innerHTML = '';
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#F093FB', '#4FACFE'];

        for (let i = 0; i < 40; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = `${-10 + Math.random() * 20}%`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = `${6 + Math.random() * 8}px`;
            piece.style.height = `${6 + Math.random() * 8}px`;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDelay = `${Math.random() * 0.5}s`;
            piece.style.animationDuration = `${1 + Math.random() * 1}s`;
            ratingConfetti.appendChild(piece);

            setTimeout(() => {
                piece.classList.add('active');
            }, 50);
        }

        // Clean up
        setTimeout(() => {
            ratingConfetti.innerHTML = '';
        }, 3000);
    }

    // Initialize stats
    updateRatingStats(ratings);
}

function updateRatingStats(ratings) {
    const total = ratings.length;
    const avg = total > 0 ? (ratings.reduce((a, b) => a + b, 0) / total).toFixed(1) : '0.0';

    document.getElementById('avgRating').textContent = avg;
    document.getElementById('totalRatings').textContent = total;

    for (let i = 1; i <= 5; i++) {
        const count = ratings.filter(r => r === i).length;
        const percent = total > 0 ? (count / total) * 100 : 0;
        document.getElementById(`bar${i}`).style.width = `${percent}%`;
        document.getElementById(`count${i}`).textContent = count;
    }
}
