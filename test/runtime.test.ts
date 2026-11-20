// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderTags } from '../src/html';
import { resolveOptions, type SplashScreenOptions } from '../src/options';
import { hideSplashScreen } from '../src/runtime';

type TestWindow = Window & { __VPSS__?: unknown };

/** Render the plugin's tags into the jsdom document and run the inline script */
function setupSplash(options: Partial<SplashScreenOptions> = {}) {
  const resolved = resolveOptions({ logoSrc: 'logo.svg', ...options });
  const [style, splash, script] = renderTags(resolved, '<svg></svg>');

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style id="${style.attrs!.id}">${style.children}</style>`
  );
  const div = document.createElement('div');
  for (const [key, value] of Object.entries(splash.attrs!)) {
    div.setAttribute(key, String(value));
  }
  div.innerHTML = splash.children as string;
  document.body.prepend(div);

  new Function(script.children as string)();

  return div;
}

function getSplash() {
  return document.getElementById('vpss');
}

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  delete (window as TestWindow).__VPSS__;
  vi.restoreAllMocks();
  // @ts-expect-error cleanup of test mocks
  delete HTMLElement.prototype.animate;
  // @ts-expect-error cleanup of test mocks
  delete window.matchMedia;
});

describe('hideSplashScreen', () => {
  it('shows the splash and removes it with its styles', async () => {
    setupSplash();
    expect(getSplash()!.style.visibility).toBe('visible');

    await hideSplashScreen();

    expect(getSplash()).toBeNull();
    expect(document.getElementById('vpss-style')).toBeNull();
  });

  it('resolves only after the element is removed', async () => {
    setupSplash({ minDurationMs: 50 });
    const start = performance.now();

    const promise = hideSplashScreen();
    expect(getSplash()).not.toBeNull();

    await promise;
    expect(getSplash()).toBeNull();
    expect(performance.now() - start).toBeGreaterThanOrEqual(45);
  });

  it('is harmless to call repeatedly', async () => {
    setupSplash({ minDurationMs: 20 });
    const vpss = (window as TestWindow).__VPSS__ as { remove: () => void };
    const remove = vi.spyOn(vpss, 'remove');

    await Promise.all([hideSplashScreen(), hideSplashScreen()]);
    await hideSplashScreen();

    expect(getSplash()).toBeNull();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('sets data-vpss-state to "hiding"', async () => {
    const splash = setupSplash({ minDurationMs: 20 });
    expect(splash.dataset.vpssState).toBe('visible');

    const promise = hideSplashScreen();
    await vi.waitFor(() => expect(splash.dataset.vpssState).toBe('hiding'));
    await promise;
  });

  it('does not crash without the global', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(hideSplashScreen()).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledOnce();
  });

  it('removes the splash immediately with ?vpss=false and strips the param', async () => {
    window.history.replaceState(null, '', '/?vpss=false&keep=1');
    setupSplash();

    expect(getSplash()).toBeNull();
    expect(window.location.search).toBe('?keep=1');
    await expect(hideSplashScreen()).resolves.toBeUndefined();
  });
});

describe('fade-out', () => {
  function mockAnimate() {
    const animate = vi.fn(() => ({ finished: Promise.resolve() }));
    HTMLElement.prototype.animate = animate as never;
    return animate;
  }

  function mockReducedMotion(matches: boolean) {
    window.matchMedia = vi.fn(() => ({ matches })) as never;
  }

  it('fades out with fadeDurationMs', async () => {
    const animate = mockAnimate();
    setupSplash({ fadeDurationMs: 400 });

    await hideSplashScreen();

    expect(animate).toHaveBeenCalledWith(
      [{ opacity: 1 }, { opacity: 0 }],
      expect.objectContaining({ duration: 400 })
    );
  });

  it('removes the splash even if the fade animation never finishes', async () => {
    HTMLElement.prototype.animate = vi.fn(() => ({
      finished: new Promise(() => {}),
    })) as never;
    setupSplash({ fadeDurationMs: 50 });

    await hideSplashScreen();

    expect(getSplash()).toBeNull();
  });

  it('skips the fade when the user prefers reduced motion', async () => {
    const animate = mockAnimate();
    mockReducedMotion(true);
    setupSplash();

    await hideSplashScreen();

    expect(animate).not.toHaveBeenCalled();
    expect(getSplash()).toBeNull();
  });
});

describe('waitForAnimations', () => {
  function fakeAnimation(endTime: number, finished: Promise<unknown>) {
    return { effect: { getComputedTiming: () => ({ endTime }) }, finished };
  }

  it('waits for finite animations and ignores infinite ones', async () => {
    let finishLogo!: () => void;
    const logoFinished = new Promise<void>((resolve) => (finishLogo = resolve));
    const splash = setupSplash({ waitForAnimations: true });

    splash.getAnimations = (() => [
      fakeAnimation(1000, logoFinished),
      fakeAnimation(Infinity, new Promise(() => {})),
    ]) as never;

    let done = false;
    const promise = hideSplashScreen().then(() => (done = true));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(done).toBe(false);
    expect(getSplash()).not.toBeNull();

    finishLogo();
    await promise;
    expect(getSplash()).toBeNull();
  });

  it('does not wait when disabled', async () => {
    const splash = setupSplash();
    const getAnimations = vi.fn(() => []);
    splash.getAnimations = getAnimations as never;

    await hideSplashScreen();

    expect(getAnimations).not.toHaveBeenCalled();
  });
});
