// ===== Звёздное поле на canvas с лёгким параллаксом =====
(function starfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w, h, dpr;
    let stars = [];
    let pointer = { x: 0, y: 0 };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildStars();
    }

    function buildStars() {
        const density = Math.min(180, Math.floor((w * h) / 8000));
        stars = Array.from({ length: density }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.3 + 0.3,
            baseAlpha: Math.random() * 0.6 + 0.25,
            twinkleSpeed: Math.random() * 0.015 + 0.004,
            phase: Math.random() * Math.PI * 2,
            depth: Math.random() * 0.6 + 0.2 // parallax depth
        }));
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            const twinkle = reduceMotion ? 0 : Math.sin(t * s.twinkleSpeed + s.phase) * 0.35;
            const alpha = Math.max(0, Math.min(1, s.baseAlpha + twinkle));
            const px = s.x + pointer.x * s.depth * 14;
            const py = s.y + pointer.y * s.depth * 14;
            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(243, 241, 236, ${alpha})`;
            ctx.fill();
        }
        if (!reduceMotion) requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
        pointer.x = (e.clientX / w) - 0.5;
        pointer.y = (e.clientY / h) - 0.5;
    }, { passive: true });

    resize();
    draw(0);
    if (reduceMotion) draw(0); // single static frame
})();

// ===== Счётчики статистики =====
document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else counter.textContent = target;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(step);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    };

    counters.forEach(animateCounter);

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
