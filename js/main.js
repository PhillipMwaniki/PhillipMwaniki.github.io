/* Phillip Mwaniki — site behaviour. Vanilla, no dependencies. */

(function () {
    'use strict';

    /* --- Theme toggle ---------------------------------------------------- */

    var toggle = document.getElementById('theme-toggle');

    toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');

        if (!current) {
            // No explicit choice yet — flip away from whatever the OS is giving us.
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            current = prefersDark ? 'dark' : 'light';
        }

        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* --- Mobile menu ----------------------------------------------------- */

    var menuBtn = document.getElementById('menu-btn');
    var nav = document.getElementById('nav');

    function closeMenu() {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    /* --- Header shadow on scroll ----------------------------------------- */

    var header = document.querySelector('.site-header');

    function onScroll() {
        header.classList.toggle('is-stuck', window.scrollY > 8);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- Earlier roles --------------------------------------------------- */

    var moreBtn = document.getElementById('more-jobs');
    var early = document.querySelectorAll('.job.is-early');

    moreBtn.addEventListener('click', function () {
        var expanded = moreBtn.getAttribute('aria-expanded') === 'true';

        early.forEach(function (job) { job.hidden = expanded; });

        moreBtn.setAttribute('aria-expanded', String(!expanded));
        moreBtn.textContent = expanded
            ? 'Show ' + early.length + ' earlier roles'
            : 'Hide earlier roles';

        if (expanded) {
            document.getElementById('experience').scrollIntoView({ block: 'start' });
        }
    });

    /* --- Active nav link -------------------------------------------------- */

    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var sections = links
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                links.forEach(function (a) {
                    a.classList.toggle(
                        'is-active',
                        a.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (s) { observer.observe(s); });
    }
})();
