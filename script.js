// ================================
// AWWWARDS-LEVEL PORTFOLIO JAVASCRIPT
// BLACK SCREEN FIX - Transition Removed
// ================================

// ================================
// CONFIGURATION
// ================================
const config = {
    cursorEnabled: window.innerWidth > 1024,
    scrollSpeed: 1,
    magneticStrength: 0.3
};

// Show content immediately - CRITICAL FIX
document.body.style.opacity = '1';
document.body.style.visibility = 'visible';

// ================================
// LOCOMOTIVE SCROLL INITIALIZATION
// ================================
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 1,
    smoothMobile: false,
    smartphone: {
        smooth: false
    },
    tablet: {
        smooth: false
    },
    lerp: 0.08
});

// ================================
// GSAP SCROLLTRIGGER SETUP
// ================================
gsap.registerPlugin(ScrollTrigger);

scroll.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
        return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform
        ? 'transform'
        : 'fixed'
});

ScrollTrigger.addEventListener('refresh', () => scroll.update());

// ================================
// REMOVE PAGE TRANSITION - FIX
// ================================
function removePageTransition() {
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        // Hide it immediately
        pageTransition.style.display = 'none';
    }
}

// Remove transition immediately
removePageTransition();

// ================================
// CUSTOM CURSOR
// ================================
const customCursor = {
    cursor: document.querySelector('.cursor'),
    dot: document.querySelector('.cursor-dot'),
    outline: document.querySelector('.cursor-outline'),
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,

    init() {
        if (!config.cursorEnabled) {
            if (this.cursor) this.cursor.style.display = 'none';
            return;
        }

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.animate();
        this.addHoverEffects();
    },

    animate() {
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;

        if (this.cursor) {
            this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0)`;
        }

        requestAnimationFrame(() => this.animate());
    },

    addHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .project-image-wrap, .skill-card');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) this.cursor.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', () => {
                if (this.cursor) this.cursor.classList.remove('cursor-hover');
            });
        });
    }
};

// ================================
// FULLSCREEN NAVIGATION
// ================================
const fullscreenNav = {
    menuToggle: document.getElementById('menuToggle'),
    nav: document.querySelector('.fullscreen-nav'),
    overlay: document.querySelector('.nav-overlay'),
    contentWrap: document.querySelector('.nav-content-wrap'),
    links: document.querySelectorAll('.nav-link'),
    isOpen: false,

    init() {
        if (!this.menuToggle) return;
        this.menuToggle.addEventListener('click', () => this.toggle());
        this.addLinkListeners();
    },

    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        this.menuToggle.classList.add('active');
        this.nav.style.pointerEvents = 'all';

        const tl = gsap.timeline();

        tl.to(this.overlay, {
            clipPath: 'circle(150% at 100% 0%)',
            duration: 1,
            ease: 'power4.inOut'
        });

        tl.to(this.contentWrap, {
            opacity: 1,
            duration: 0.3
        }, '-=0.3');

        this.links.forEach((link, index) => {
            const text = link.querySelector('.nav-link-text');
            if (text) {
                tl.to(text, {
                    y: 0,
                    duration: 0.8,
                    ease: 'power4.out'
                }, `-=${0.6 - (index * 0.05)}`);
            }
        });

        tl.from('.nav-footer > *', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.6');
    },

    close() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');

        const tl = gsap.timeline({
            onComplete: () => {
                this.nav.style.pointerEvents = 'none';
            }
        });

        this.links.forEach((link, index) => {
            const text = link.querySelector('.nav-link-text');
            if (text) {
                tl.to(text, {
                    y: '100%',
                    duration: 0.5,
                    ease: 'power4.in'
                }, index * 0.03);
            }
        });

        tl.to(this.contentWrap, {
            opacity: 0,
            duration: 0.3
        }, '-=0.3');

        tl.to(this.overlay, {
            clipPath: 'circle(0% at 100% 0%)',
            duration: 0.8,
            ease: 'power4.inOut'
        }, '-=0.2');
    },

    addLinkListeners() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');

                this.close();

                setTimeout(() => {
                    scroll.scrollTo(target, {
                        duration: 1500,
                        offset: -100
                    });
                }, 800);
            });
        });
    }
};


// ================================
// MAGNETIC BUTTONS
// ================================
const magneticButtons = {
    buttons: document.querySelectorAll('.magnetic-btn'),

    init() {
        if (window.innerWidth < 1024) return;

        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMouseMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, button));
        });
    },

    handleMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
            x: x * config.magneticStrength,
            y: y * config.magneticStrength,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    handleMouseLeave(e, button) {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }
};

// ================================
// HERO ANIMATIONS
// ================================
function initHeroAnimations() {
    const titleLines = document.querySelectorAll('.title-line');
    if (titleLines.length > 0) {
        gsap.fromTo(titleLines,
            { y: 150, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.3 }
        );
    }

    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) {
        gsap.fromTo(heroDesc,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' }
        );
    }

    const ctaButtons = document.querySelectorAll('.hero-cta-wrap .button-54');
    if (ctaButtons.length > 0) {
        gsap.fromTo(ctaButtons,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 1, ease: 'power3.out' }
        );
    }

    const avatar = document.querySelector('.avatar-outer');
    if (avatar) {
        gsap.fromTo(avatar,
            { scale: 0, rotation: 180, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.6)', delay: 0.2 }
        );
    }

    const label = document.querySelector('.hero-label');
    if (label) {
        gsap.fromTo(label,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out' }
        );
    }
}

// ================================
// SCROLL PROGRESS
// ================================
const scrollProgress = {
    bar: document.querySelector('.progress-bar'),

    init() {
        if (!this.bar) return;
        scroll.on('scroll', (args) => {
            const progress = (args.scroll.y / (args.limit.y || 1)) * 100;
            this.bar.style.width = `${progress}%`;
        });
    }
};

// ================================
// SPLIT TEXT ANIMATION
// ================================
function splitText() {
    const elements = document.querySelectorAll('.split-text');

    elements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';

        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            element.appendChild(span);
        });

        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            scroller: '[data-scroll-container]',
            onEnter: () => {
                gsap.to(element.querySelectorAll('span'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: 'power3.out'
                });
            }
        });
    });
}


// ================================
// PROJECT ANIMATIONS
// ================================
function initProjectAnimations() {
    const projects = document.querySelectorAll('.project-item');

    projects.forEach((project) => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top 80%',
                scroller: '[data-scroll-container]',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });
}

// ================================
// SKILL ITEMS ANIMATION
// ================================
function initSkillAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const items = category.querySelectorAll('.skill-item');

        gsap.from(items, {
            scrollTrigger: {
                trigger: category,
                start: 'top 80%',
                scroller: '[data-scroll-container]',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out'
        });
    });
}



// ================================
// REVEAL TEXT ANIMATION
// ================================
function revealTextElements() {
    const elements = document.querySelectorAll('.reveal-text');

    elements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                scroller: '[data-scroll-container]',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// ================================
// FORM SUBMISSION
// ================================
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                submitBtn.textContent = 'MESSAGE SENT!';
                submitBtn.style.background = '#000';
                submitBtn.style.color = '#fff';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'transparent';
                    submitBtn.style.color = '#000';
                    form.reset();
                }, 3000);
            }
        });
    });
}

// ================================
// TIME UPDATE
// ================================
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// ================================
// CTA BUTTON ACTIONS
// ================================
function initCTAActions() {
    const heroCTA = document.querySelector('.hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', () => {
            scroll.scrollTo('#projects', {
                duration: 1500,
                offset: -100
            });
        });
    }

    const heroCTAAlt = document.querySelector('.hero-cta-alt');
    if (heroCTAAlt) {
        heroCTAAlt.addEventListener('click', () => {
            scroll.scrollTo('#contact', {
                duration: 1500,
                offset: -100
            });
        });
    }
}

// ================================
// PARALLAX EFFECTS
// ================================
// ================================
// PARALLAX EFFECTS
// ================================
function initParallaxEffects() {
    const canvasWrap = document.querySelector('.hero-canvas-wrap');
    if (canvasWrap) {
        gsap.to(canvasWrap, {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scroller: '[data-scroll-container]',
                scrub: true
            },
            y: 150,
            scale: 0.8,
            opacity: 0.5,
            ease: 'none'
        });
    }
}

// ================================
// RESPONSIVE HANDLING
// ================================
let windowWidth = window.innerWidth;

window.addEventListener('resize', () => {
    if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        scroll.update();
        ScrollTrigger.refresh();

        config.cursorEnabled = window.innerWidth > 1024;
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = config.cursorEnabled ? 'block' : 'none';
        }
    }
});

// ================================
// INITIALIZATION - FIXED
// ================================
function initAll() {
    // Ensure content is visible
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';

    // Remove page transition
    removePageTransition();

    // Initialize core features
    customCursor.init();
    fullscreenNav.init();
    magneticButtons.init();
    scrollProgress.init();


    // Initialize animations
    initHeroAnimations();
    splitText();
    initProjectAnimations();
    revealTextElements();
    initContactForm();
    initCTAActions();
    initParallaxEffects();

    // Start time update
    updateTime();
    setInterval(updateTime, 60000);

    // Final refresh
    setTimeout(() => {
        scroll.update();
        ScrollTrigger.refresh();
    }, 300);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Backup initialization on window load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    removePageTransition();
    scroll.update();
    ScrollTrigger.refresh();
});

console.log('ðŸš€ Portfolio Initialized - Black Screen Fixed!');
