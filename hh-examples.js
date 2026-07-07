// Expand/collapse behaviour for the HH – Accordion example previews.
//
// The real component uses native <details>/<summary> elements, but Mintlify's
// MDX renderer strips those from raw HTML, so the docs examples use
// <div class="accordion__item"> / <div class="accordion__heading"> instead.
// This script recreates the native toggle behaviour by adding/removing the
// same [open] attribute the component's CSS keys off.
//
// Mintlify loads every .js file in the repo on all pages; event delegation on
// document keeps this working across client-side page navigations.

(function () {
  function toggle(item, heading) {
    if (item.hasAttribute('open')) {
      item.removeAttribute('open');
    } else {
      item.setAttribute('open', '');
    }
    heading.setAttribute('aria-expanded', item.hasAttribute('open') ? 'true' : 'false');
  }

  function headingFrom(target) {
    return target && target.closest
      ? target.closest('.hh-example .accordion__heading')
      : null;
  }

  document.addEventListener('click', function (e) {
    var heading = headingFrom(e.target);
    if (!heading) return;
    var item = heading.closest('.accordion__item');
    if (item) toggle(item, heading);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var heading = headingFrom(e.target);
    if (!heading) return;
    e.preventDefault();
    var item = heading.closest('.accordion__item');
    if (item) toggle(item, heading);
  });

  // Make the div headings keyboard-focusable and announce their state,
  // matching the accessibility of the real <summary> element.
  var scheduled = false;
  function enhance() {
    scheduled = false;
    var headings = document.querySelectorAll('.hh-example .accordion__heading');
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (h.getAttribute('role') !== 'button') {
        h.setAttribute('role', 'button');
        h.setAttribute('tabindex', '0');
        var item = h.closest('.accordion__item');
        h.setAttribute('aria-expanded', item && item.hasAttribute('open') ? 'true' : 'false');
      }
    }
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(enhance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }

  new MutationObserver(scheduleEnhance).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
