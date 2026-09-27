// ============================================
// Mobile Navigation
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
});

document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ============================================
// Navbar scroll state + back to top
// ============================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    backToTop.classList.toggle('visible', window.scrollY > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================
// Active nav link highlighting
// ============================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 160;
    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) currentId = section.id;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
};
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ============================================
// Scroll reveal
// ============================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('in-view'));
}

// ============================================
// Pipe route draw-on-scroll
// ============================================
const pipeLine = document.querySelector('.pipe-line');
if (pipeLine && 'IntersectionObserver' in window) {
    const pipeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pipeLine.classList.add('drawn');
                pipeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    pipeObserver.observe(pipeLine);
} else if (pipeLine) {
    pipeLine.classList.add('drawn');
}

// ============================================
// Contact form validation + submission
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const fieldErrors = {
    name: document.getElementById('nameError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError')
};

const isValidPhone = (value) => value.replace(/\D/g, '').length >= 7;

const setFieldError = (field, message) => {
    const input = document.getElementById(field);
    input.classList.toggle('invalid', Boolean(message));
    if (fieldErrors[field]) fieldErrors[field].textContent = message || '';
};

const validateForm = (data) => {
    let valid = true;
    if (!data.name.trim()) { setFieldError('name', 'Please enter your name.'); valid = false; }
    else setFieldError('name', '');

    if (!isValidPhone(data.phone)) { setFieldError('phone', 'Please enter a valid phone number.'); valid = false; }
    else setFieldError('phone', '');

    if (!data.message.trim() || data.message.trim().length < 8) {
        setFieldError('message', 'A quick description helps us send the right plumber.');
        valid = false;
    } else setFieldError('message', '');

    return valid;
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value
    };

    if (!validateForm(data)) {
        formStatus.textContent = 'Please fix the fields above and try again.';
        formStatus.className = 'form-status error';
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        // NOTE: No backend is wired up yet. Replace this with a real submission —
        // fetch() to your own API/CRM, or a service like Formspree / Netlify Forms.
        await new Promise(resolve => setTimeout(resolve, 900));

        formStatus.textContent = "Got it — we'll text or call you shortly to confirm.";
        formStatus.className = 'form-status success';
        contactForm.reset();
    } catch (err) {
        formStatus.textContent = 'Something went wrong. Please call us directly instead.';
        formStatus.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnLoading.hidden = true;
    }
});