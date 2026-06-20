document.addEventListener('DOMContentLoaded', () => {

    // ── Custom Cursor ──
    const cursor = document.getElementById('custom-cursor');
    const blur = document.getElementById('cursor-blur');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            blur.style.left = e.clientX + 'px';
            blur.style.top = e.clientY + 'px';
        }, 80);
    });

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
            blur.style.borderColor = 'var(--accent-color)';
            blur.style.transform = 'translate(-50%, -50%) scale(2.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            blur.style.borderColor = 'rgba(129,140,248,0.45)';
            blur.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // ── Scroll Reveal ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Navbar shrink on scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.parentElement.style.padding = '0';
        } else {
            navbar.parentElement.style.padding = '';
        }
    });

    // ── Scroll to Top ──
    const scrollTopBtn = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('active', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Skills Filter + Show All ──
    const skillItems = document.querySelectorAll('.skill-item');
    const filterTabs = document.querySelectorAll('#skills-filter .filter-tab');
    const showAllBtn = document.getElementById('show-all-skills');
    const showAllLabel = document.getElementById('show-all-label');
    const showAllIcon = document.getElementById('show-all-icon');
    const skillsRemainingCount = document.getElementById('skills-remaining-count');
    const INITIAL_VISIBLE = 8;
    let currentFilter = 'all';
    let showingAll = false;

    function applySkillFilter(filter) {
        currentFilter = filter;
        showingAll = false;
        showAllLabel.textContent = 'Show All';
        showAllIcon.style.transform = 'rotate(0deg)';

        let visible = 0;
        skillItems.forEach(item => {
            const cat = item.dataset.category;
            const matches = filter === 'all' || cat === filter;
            if (matches) {
                item.style.display = '';
                visible++;
            } else {
                item.style.display = 'none';
            }
        });

        // Hide extras beyond INITIAL_VISIBLE
        let shown = 0;
        skillItems.forEach(item => {
            if (item.style.display === 'none') return;
            shown++;
            if (shown > INITIAL_VISIBLE) item.classList.add('hidden');
            else item.classList.remove('hidden');
        });

        const hidden = visible - Math.min(visible, INITIAL_VISIBLE);
        if (hidden > 0) {
            showAllBtn.style.display = 'flex';
            skillsRemainingCount.textContent = `(${hidden} more)`;
        } else {
            showAllBtn.style.display = visible > INITIAL_VISIBLE ? 'flex' : 'none';
        }
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applySkillFilter(tab.dataset.filter);
        });
    });

    showAllBtn.addEventListener('click', () => {
        showingAll = !showingAll;
        skillItems.forEach(item => {
            if (item.style.display !== 'none') {
                item.classList.toggle('hidden', false);
            }
        });
        if (showingAll) {
            showAllLabel.textContent = 'Show Less';
            showAllIcon.style.transform = 'rotate(180deg)';
            skillsRemainingCount.textContent = '';
        } else {
            applySkillFilter(currentFilter);
        }
    });

    // Init skills
    applySkillFilter('all');

    // ── Projects: Filter + Search ──
    const projectCards = document.querySelectorAll('.project-featured-card');
    const projFilterTabs = document.querySelectorAll('.proj-filter-tab');
    const searchInput = document.getElementById('project-search-input');
    const noResults = document.getElementById('no-results');
    let activeProjectFilter = 'all';

    function applyProjectFilters() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        projectCards.forEach(card => {
            const categories = card.dataset.category || '';
            const name = card.dataset.name || '';
            const matchesFilter = activeProjectFilter === 'all' || categories.includes(activeProjectFilter);
            const matchesSearch = query === '' || name.includes(query);

            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    projFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            projFilterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeProjectFilter = tab.dataset.filter;
            applyProjectFilters();
        });
    });

    searchInput.addEventListener('input', applyProjectFilters);

    // ── Contact Form ──
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');

            btnText.textContent = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btnText.textContent = 'Message Sent!';
                btn.style.opacity = '1';
                formStatus.innerHTML = '<p style="color: var(--accent-color); margin-top: 14px; font-weight: 600; text-align:center;">✓ Thank you! Your message has been received.</p>';
                contactForm.reset();

                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    btn.disabled = false;
                    formStatus.innerHTML = '';
                }, 4000);
            }, 1800);
        });
    }

    // ── WhatsApp Banner ──
    const whatsappBanner = document.getElementById('whatsapp-banner');
    const closeBannerBtn = document.getElementById('close-banner-btn');
    
    if (whatsappBanner && closeBannerBtn) {
        let isDismissed = sessionStorage.getItem('whatsapp-banner-dismissed') === 'true';
        
        function handleBannerVisibility() {
            if (isDismissed) return;
            
            if (window.scrollY > 200) {
                whatsappBanner.classList.add('show');
                document.body.classList.add('banner-active');
            } else {
                whatsappBanner.classList.remove('show');
                document.body.classList.remove('banner-active');
            }
        }
        
        window.addEventListener('scroll', handleBannerVisibility);
        
        closeBannerBtn.addEventListener('click', () => {
            isDismissed = true;
            sessionStorage.setItem('whatsapp-banner-dismissed', 'true');
            whatsappBanner.classList.remove('show');
            document.body.classList.remove('banner-active');
        });
        
        // Initial check in case they reload scrolled down
        handleBannerVisibility();
    }

});
