// Inlined into index.html by the plugin. Plain JS: it runs as-is in the browser.
// `__VPSS_OPTIONS__` is replaced with a JSON object at build time.
(function (options) {
  const id = 'vpss';
  // Upper bound for `waitForAnimations` so a broken animation can't block the app
  const MAX_ANIMATION_WAIT_MS = 5000;
  const url = new URL(window.location.href);
  const param = url.searchParams.get(id);

  let hiding = null;

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  // Resolves when all finite CSS animations inside the splash have finished.
  // Infinite animations (eg. the loaders) are ignored.
  function waitForFiniteAnimations(element) {
    if (typeof element.getAnimations !== 'function') return Promise.resolve();

    const finite = element
      .getAnimations({ subtree: true })
      .filter(function (a) {
        const timing = a.effect && a.effect.getComputedTiming();
        return timing && isFinite(timing.endTime);
      });

    if (finite.length === 0) return Promise.resolve();

    const finished = Promise.all(
      finite.map(function (a) {
        return a.finished.catch(function () {});
      })
    );

    return Promise.race([finished, wait(MAX_ANIMATION_WAIT_MS)]);
  }

  window.__VPSS__ = {
    id: id,
    hidden: param === 'false',
    renderedAt: performance.now(),
    minDurationMs: options.minDurationMs,
    fadeDurationMs: options.fadeDurationMs,
    waitForAnimations: options.waitForAnimations,
    getElement: function () {
      return document.getElementById(id);
    },
    getStyles: function () {
      return document.getElementById(id + '-style');
    },
    show: function () {
      const element = this.getElement();
      if (!element) return;
      element.style.visibility = 'visible';
    },
    // Returns a promise that resolves once the splash screen has been removed.
    // Repeated calls return the same promise.
    hide: function () {
      const self = this;
      if (hiding) return hiding;

      const element = self.getElement();
      if (!element) return Promise.resolve();

      // Set hidden flag to signal that hiding has started
      self.hidden = true;

      hiding = (async function () {
        const elapsed = performance.now() - self.renderedAt;
        const remaining = Math.max(self.minDurationMs - elapsed, 0);
        if (remaining > 0) await wait(remaining);

        element.setAttribute('data-vpss-state', 'hiding');

        if (self.waitForAnimations) {
          await waitForFiniteAnimations(element);
        }

        const duration = prefersReducedMotion() ? 0 : self.fadeDurationMs;

        if (duration > 0 && typeof element.animate === 'function') {
          const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards',
          });
          // Timer fallback: animations don't advance in background tabs, so
          // don't let a paused animation keep the splash around forever
          await Promise.race([
            animation.finished.catch(function () {}),
            wait(duration + 100),
          ]);
        }

        self.remove();
      })();

      return hiding;
    },
    remove: function () {
      const element = this.getElement();
      const styles = this.getStyles();
      if (element) element.remove();
      if (styles) styles.remove();
    },
  };

  if (window.__VPSS__.hidden) {
    window.__VPSS__.remove();
  } else {
    window.__VPSS__.show();
  }

  // Remove query param from URL
  if (param) {
    url.searchParams.delete(id);
    window.history.replaceState(window.history.state, '', url);
  }
})(__VPSS_OPTIONS__);
