(() => {
  'use strict';
  const dialog = document.querySelector('#holiday-dialog');
  const controls = [...document.querySelectorAll('[data-open-holiday]')];
  const key = 'oh-sushi-37-holidays-2026-2027';
  let shown = false;
  let automaticTimer;
  const active = () => window.RestaurantCalendar.now().date <= dialog.dataset.validThrough;
  function wasShown() {
    try { return shown || sessionStorage.getItem(key) === 'seen'; }
    catch { return shown; }
  }
  function show(trigger) {
    if (!active()) return;
    window.RestaurantDialogs.open(dialog, trigger);
    shown = true;
    try { sessionStorage.setItem(key, 'seen'); } catch { /* Optional persistence. */ }
  }
  function cancelAutomatic() { clearTimeout(automaticTimer); }
  function refresh() {
    const available = active();
    controls.forEach(control => { control.hidden = !available; });
    if (!available) {
      cancelAutomatic();
      window.RestaurantDialogs.close(dialog);
    }
  }
  controls.forEach(control => control.addEventListener('click', event => {
    event.preventDefault(); cancelAutomatic(); show(control);
  }));
  dialog.querySelector('[data-holiday-menu]').addEventListener('click', () => {
    window.RestaurantDialogs.close(dialog);
  });
  // Never interrupt a guest already browsing or using another service dialog.
  document.addEventListener('before-service-open', cancelAutomatic);
  document.addEventListener('pointerdown', cancelAutomatic, {once: true});
  document.addEventListener('keydown', cancelAutomatic, {once: true});
  document.addEventListener('restaurant-calendar-change', refresh);
  window.addEventListener('pageshow', refresh);
  refresh();
  if (active() && !wasShown()) {
    automaticTimer = setTimeout(() => {
      if (!document.hidden && !document.querySelector('dialog[open]') && !document.body.classList.contains('nav-open')) show();
    }, 900);
  }
})();
