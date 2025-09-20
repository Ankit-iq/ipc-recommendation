// main.js - IPC Recommender System

document.addEventListener('DOMContentLoaded', function () {
    initializeSearch();
    initializeBrowseFilters();
    initializeFormValidation();
    initializeScrollEffects();
    initializeTooltips();
    initializeAccessibility();
});

// ---------------- Search Functionality ----------------
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const queryTextarea = document.getElementById('query');

    if (searchForm && queryTextarea) {
        // Keep spacebar working in textarea
        queryTextarea.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.stopPropagation(); // prevent interference from other handlers
            }
        });

        // Auto-resize textarea
        queryTextarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        // Character counter
        const maxLength = 1000;
        const charCounter = document.createElement('div');
        charCounter.className = 'form-text text-end mt-1';
        charCounter.innerHTML = `<small><span id="charCount">0</span>/${maxLength} characters</small>`;
        queryTextarea.parentNode.appendChild(charCounter);

        queryTextarea.addEventListener('input', function () {
            const count = this.value.length;
            document.getElementById('charCount').textContent = count;

            if (count > maxLength * 0.9 && count < maxLength) {
                charCounter.className = 'form-text text-end mt-1 text-warning';
            } else if (count >= maxLength) {
                charCounter.className = 'form-text text-end mt-1 text-danger';
            } else {
                charCounter.className = 'form-text text-end mt-1';
            }
        });

        // Submit button loading state
        searchForm.addEventListener('submit', function () {
            const submitBtn = searchForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Searching...';
            }
        });
    }
}

// ---------------- Browse Filters ----------------
function initializeBrowseFilters() {
    const sectionFilter = document.getElementById('sectionFilter');
    const chapterFilter = document.getElementById('chapterFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (!sectionFilter && !chapterFilter) return;

    function applyFilters() {
        const searchTerm = (sectionFilter?.value || '').toLowerCase();
        const selectedChapter = chapterFilter?.value || '';
        const sections = document.querySelectorAll('.section-item');
        let visibleCount = 0;

        sections.forEach(section => {
            const sectionNumber = section.dataset.section?.toLowerCase() || '';
            const offense = section.dataset.offense?.toLowerCase() || '';
            const description = section.dataset.description?.toLowerCase() || '';
            const chapter = section.dataset.chapter || '';

            const matchesSearch = !searchTerm || sectionNumber.includes(searchTerm) || offense.includes(searchTerm) || description.includes(searchTerm);
            const matchesChapter = !selectedChapter || chapter === selectedChapter;

            section.style.display = (matchesSearch && matchesChapter) ? '' : 'none';
            if (matchesSearch && matchesChapter) visibleCount++;
        });

        const noResults = document.getElementById('noResults');
        if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    let searchTimeout;
    function debouncedApplyFilters() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    }

    if (sectionFilter) sectionFilter.addEventListener('input', debouncedApplyFilters);
    if (chapterFilter) chapterFilter.addEventListener('change', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', function () {
        if (sectionFilter) sectionFilter.value = '';
        if (chapterFilter) chapterFilter.value = '';
        applyFilters();
    });
}

// ---------------- Form Validation ----------------
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => input.classList.contains('is-invalid') && validateInput(input));
        });

        form.addEventListener('submit', function (e) {
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) isValid = false;
            });
            if (!isValid) e.preventDefault();
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    if (value.length > 0) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        return false;
    }
}

// ---------------- Scroll Effects ----------------
function initializeScrollEffects() {
    const searchLinks = document.querySelectorAll('a[href="#search-section"]');
    searchLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.getElementById('search-section');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const scrollButton = createScrollToTopButton();
    window.addEventListener('scroll', function () {
        scrollButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });
}

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'btn btn-primary position-fixed';
    button.style.cssText = 'bottom:2rem; right:2rem; width:50px; height:50px; border-radius:50%; display:none; z-index:1000;';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(button);
    return button;
}

// ---------------- Tooltips ----------------
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (window.bootstrap) tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

// ---------------- Accessibility ----------------
function initializeAccessibility() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';

    // Focus cards & keyboard events
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) link.click();
            }
        });
    });

    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'visually-hidden-focusable btn btn-primary position-absolute';
    skipLink.style.cssText = 'top:1rem; left:1rem; z-index:9999;';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}
