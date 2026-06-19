import { useEffect } from 'react';

export default function useScrollReveal(dependencies = []) {
  const deps = Array.isArray(dependencies) ? dependencies : [dependencies];

  useEffect(() => {
    let observer;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        {
          threshold: 0.02, // Lower threshold to ensure even small/short items trigger instantly
          rootMargin: '0px 0px -10px 0px',
        }
      );

      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      elements.forEach((el) => {
        observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, deps);
}
