/* ============================================================
   CAFÉ CONNECT — script.js
   ============================================================

   This file contains all the interactive behaviour for the site.

   TABLE OF CONTENTS:
    1. Navbar Scroll Behaviour   — changes style on scroll
    2. Hamburger Menu Toggle     — opens/closes mobile nav
    3. Close Mobile Menu on Link Click
    4. Menu Tab Switching        — shows the selected menu category
    5. Scroll Animations         — fades elements in as you scroll
    6. Active Nav Link Highlight — highlights the current section link

   KEY CONCEPT — "Selecting Elements":
   Before JavaScript can interact with an HTML element, we need
   to find it. We use these methods to do that:
   - document.getElementById('id')     → finds ONE element by its id
   - document.querySelector('.class')  → finds the FIRST matching element
   - document.querySelectorAll('.cls') → finds ALL matching elements (a list)

   KEY CONCEPT — "Events":
   element.addEventListener('event', function) means:
   "When [event] happens on [element], run [function]."
   Common events: 'click', 'scroll', 'mouseover'

============================================================ */


/* ============================================================
   1. NAVBAR SCROLL BEHAVIOUR
   ──────────────────────────────────────────────────────────
   The navbar starts transparent (so the hero image shows through).
   When the user scrolls more than 60px, we add the "scrolled"
   class. The CSS then adds a white background + shadow.
============================================================ */

// Select the navbar element using its id
const navbar = document.getElementById('navbar');

// Listen for every scroll event on the entire window
window.addEventListener('scroll', function () {
    /*
       window.scrollY = how many pixels the page has been scrolled
       vertically (0 means you're at the very top).
    */
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');      // → white background in CSS
    } else {
        navbar.classList.remove('scrolled');   // → transparent again
    }
});


/* ============================================================
   2. HAMBURGER MENU TOGGLE (MOBILE)
   ──────────────────────────────────────────────────────────
   On mobile, the nav links are hidden in a collapsed container.
   Clicking the hamburger button adds the "open" class to both:
   - The hamburger (so it animates into an X shape)
   - The nav-links (so they slide down and become visible)
   Clicking again removes the class and hides them again.
============================================================ */

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', function () {
    /*
       classList.toggle('class') works like a switch:
       - If the class is NOT there, it adds it.
       - If the class IS there, it removes it.
    */
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');

    /*
       aria-expanded tells screen readers whether the menu is open.
       This is important for accessibility.
    */
    const isOpen = hamburger.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});


/* ============================================================
   3. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
   ──────────────────────────────────────────────────────────
   When a user taps a nav link on mobile, the page scrolls to
   that section but the menu stays open — which is annoying.
   This code closes the menu automatically.
============================================================ */

// querySelectorAll returns a NodeList (like an array) of all matching elements
const allNavLinks = document.querySelectorAll('.nav-link');

allNavLinks.forEach(function (link) {
    // For each nav link, listen for a click
    link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});


/* ============================================================
   4. MENU TAB SWITCHING
   ──────────────────────────────────────────────────────────
   Each tab button has a data-tab attribute, e.g.:
       <button data-tab="coffee">☕ Coffee</button>

   When a button is clicked:
   1. Remove "active" from ALL buttons and ALL grids.
   2. Add "active" to the clicked button.
   3. Find the grid whose id matches "tab-" + data-tab value.
   4. Add "active" to that grid (CSS makes it visible).
   5. Re-trigger fade-in animations for the newly visible cards.
============================================================ */

const tabButtons = document.querySelectorAll('.tab-btn');
const menuGrids  = document.querySelectorAll('.menu-grid');

tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {

        // Step 1: Clear "active" from all buttons and grids
        tabButtons.forEach(function (btn)  { btn.classList.remove('active'); });
        menuGrids.forEach(function  (grid) { grid.classList.remove('active'); });

        // Step 2: Activate the clicked button
        button.classList.add('active');

        // Step 3: Find the matching grid
        // getAttribute reads the value of an HTML attribute
        const targetTabName = button.getAttribute('data-tab');  // e.g. "coffee"
        const targetGrid    = document.getElementById('tab-' + targetTabName); // "tab-coffee"

        // Step 4: Show the grid
        if (targetGrid) {
            targetGrid.classList.add('active');

            // Step 5: Re-animate cards that weren't visible before
            const cardsInGrid = targetGrid.querySelectorAll('.fade-in');
            animateElements(cardsInGrid);
        }
    });
});


/* ============================================================
   5. SCROLL ANIMATIONS — FADE-IN ON SCROLL
   ──────────────────────────────────────────────────────────
   We use the IntersectionObserver API — a modern, efficient way
   to detect when an element becomes visible in the viewport.

   HOW IT WORKS:
   1. We create an "observer" with a callback function.
   2. We tell it to "observe" every .fade-in element.
   3. When an observed element enters the viewport (scrolled to),
      the callback runs and adds the "visible" class.
   4. CSS then transitions the element from hidden to visible.
   5. We "unobserve" the element so it doesn't trigger again.

   This is much better than listening to the scroll event because
   it doesn't run on every single scroll tick — only when elements
   cross the boundary.
============================================================ */

// Create the IntersectionObserver
const scrollObserver = new IntersectionObserver(
    // This callback runs whenever observed elements enter or leave the viewport
    function (entries) {
        entries.forEach(function (entry) {
            /*
               entry.isIntersecting = true  → element is now visible
               entry.isIntersecting = false → element has left the viewport
            */
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Trigger CSS animation
                scrollObserver.unobserve(entry.target); // Stop watching this element
            }
        });
    },
    {
        /*
           threshold: 0.1 means the callback fires when at least
           10% of the element is visible in the viewport.
        */
        threshold: 0.1,

        /*
           rootMargin shrinks the "trigger zone" by 40px from the bottom.
           This makes elements animate a bit before they reach the very
           bottom of the screen, which feels more natural.
        */
        rootMargin: '0px 0px -40px 0px'
    }
);

// Helper function: start observing a list of elements
function animateElements(elements) {
    elements.forEach(function (el) {
        // Reset to invisible first (for re-animations on tab switch)
        el.classList.remove('visible');
        // Tell the observer to watch this element
        scrollObserver.observe(el);
    });
}

// On page load, observe ALL .fade-in elements
const allFadeElements = document.querySelectorAll('.fade-in');
animateElements(allFadeElements);


/* ============================================================
   6. ACTIVE NAV LINK HIGHLIGHT
   ──────────────────────────────────────────────────────────
   As the user scrolls, we check which section is currently
   in the viewport and highlight the matching nav link.

   HOW IT WORKS:
   1. Get all sections that have an id (home, menu, about, etc.)
   2. On every scroll, check each section's position.
   3. If the current scroll position is inside a section, mark
      its nav link as "active-link".
============================================================ */

// Select all <section> elements that have an id attribute
const allSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', function () {
    let currentSectionId = '';

    allSections.forEach(function (section) {
        /*
           offsetTop = distance from the top of the page to the top of the element.
           We subtract 120px (navbar height + buffer) so the highlight
           switches slightly before the section reaches the very top.
        */
        const sectionTop    = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        // Check if the current scroll position is inside this section
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');  // e.g. "menu"
        }
    });

    // Update the nav links: remove active from all, add to the current one
    allNavLinks.forEach(function (link) {
        link.classList.remove('active-link');

        /*
           link.getAttribute('href') returns e.g. "#menu"
           We compare it to "#" + currentSectionId = "#menu"
        */
        if (link.getAttribute('href') === '#' + currentSectionId) {
            link.classList.add('active-link');
        }
    });
});
