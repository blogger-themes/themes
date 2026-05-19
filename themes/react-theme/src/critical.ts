import './styles/critical.css';

import { DEFAULT_THEME, PREFERENCES_KEY, PREFERENCES_VERSION } from '@/constants';
import { getZPersistedState, setZPersistedState } from '@/stores/helpers';
import type { PreferencesState, Theme } from '@/stores/preferences';

const preferencesState = getZPersistedState<Partial<PreferencesState>>(PREFERENCES_KEY, PREFERENCES_VERSION);

/**
 * Resolve and apply the initial document theme from persisted
 * preferences or the default theme, then ensure the preference
 * state is initialized in storage.
 */
const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeElement(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && darkMQ.matches);

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

const theme = preferencesState?.theme ?? DEFAULT_THEME;

updateThemeElement(theme);

if (!preferencesState?.theme) {
  setZPersistedState<PreferencesState>(PREFERENCES_KEY, { theme }, PREFERENCES_VERSION);
}

/**
 * Toggle the admin state class on the document element based on
 * the persisted blog admin authentication value.
 */
const BLOG_ADMIN_CLASS = 'is-blog-admin';

function updateBlogAdminElement(blogAdmin: boolean) {
  document.documentElement.classList[blogAdmin ? 'add' : 'remove'](BLOG_ADMIN_CLASS);
}

updateBlogAdminElement(preferencesState?.blogAdmin === true);

/**
 * Create and manage the initial page loader until the application
 * content is rendered. The loader is injected as early as possible,
 * optionally locks page scrolling, and is automatically hidden once
 * the root container receives content or the page finishes loading.
 */
const LOADER_HIDE_SCROLLBAR: boolean = true;
const MINIMUM_LOADER_DURATION: number = 1000;
const AUTO_HIDE_LOADER: boolean = true;

let rootElement: HTMLElement | null = document.getElementById('root');
let loaderElement: HTMLElement | null = null;

function onDOMLoaded(callback: () => void) {
  if (document.readyState === 'complete' || document.readyState !== 'loading') {
    callback();
    return;
  }
  const handler = () => {
    document.removeEventListener('DOMContentLoaded', handler);
    callback();
  };
  document.addEventListener('DOMContentLoaded', handler);
}

function createLoaderElement() {
  const element = document.createElement('div');
  element.className = 'loader-container';
  element.innerHTML =
    '<svg class="loader-icon-container" height="31.25" preserveAspectRatio="xMidYMid meet" viewBox="0 0 50 31.25" width="50" x="0px" y="0px"><path class="loader-icon-track" d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25" fill="none" pathlength="100" stroke-width="4"></path><path class="loader-icon-car" d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25" fill="none" pathlength="100" stroke-width="4"></path></svg>';
  return element;
}

function lockScroll() {
  if (LOADER_HIDE_SCROLLBAR) {
    document.documentElement.style.overflow = 'hidden';
  }
}

function unlockScroll() {
  if (LOADER_HIDE_SCROLLBAR) {
    document.documentElement.style.overflow = '';
  }
}

function mountLoader() {
  if (!document.body || loaderElement) {
    return;
  }

  loaderElement = createLoaderElement();

  lockScroll();
  document.body.appendChild(loaderElement);
}

function hideLoader() {
  if (!loaderElement) {
    return;
  }
  loaderElement.style.opacity = '0';
  loaderElement.style.visibility = 'hidden';
}

function removeLoaderOnHide() {
  if (!loaderElement) {
    return;
  }

  const onTransitionEnd = (event: TransitionEvent) => {
    if (loaderElement && event.propertyName === 'opacity' && window.getComputedStyle(loaderElement).opacity === '0') {
      loaderElement.removeEventListener('transitionend', onTransitionEnd);
      unlockScroll();
      loaderElement.remove();
      loaderElement = null;
    }
  };
  loaderElement.addEventListener('transitionend', onTransitionEnd);
}

function waitForRootContent() {
  if (!loaderElement) {
    return;
  }
  if (!rootElement) {
    hideLoader();
    return;
  }
  if (rootElement.firstChild) {
    hideLoader();
    return;
  }
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'childList') {
        observer.disconnect();
        hideLoader();
        return;
      }
    }
  });
  observer.observe(rootElement, { childList: true });
}

mountLoader();

onDOMLoaded(() => {
  rootElement ||= document.getElementById('root');

  mountLoader();
  removeLoaderOnHide();
});

if (AUTO_HIDE_LOADER) {
  if (MINIMUM_LOADER_DURATION > 0) {
    setTimeout(() => {
      onDOMLoaded(waitForRootContent);
    }, MINIMUM_LOADER_DURATION);
  } else {
    onDOMLoaded(waitForRootContent);
  }
}
