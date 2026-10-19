'use client';

import React, { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '120px 0px 120px 0px',
      threshold: 0.02,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll(
        '.reveal-fade, .reveal-up, .reveal-scale, .reveal-stagger, .reveal-card, .reveal-card-arch, .ira-product-card-premium, .arch-card-wrapper, .collection-look-card'
      );
      elements.forEach((el) => {
        // If element is already within viewport height + buffer, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeElements();

    const timer = setTimeout(observeElements, 100);

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
