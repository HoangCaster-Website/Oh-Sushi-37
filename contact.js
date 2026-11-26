(() => {
  'use strict';
  const restaurant = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  function openDraft(subject, body) {
    const link = document.createElement('a');
    link.href = `mailto:${restaurant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.click();
  }
  function openWhatsApp(number, body) {
    const link = document.createElement('a');
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
    return link.href;
  }
  async function copyDraft(text, feedback, wrapper, field) {
    try {
      await navigator.clipboard.writeText(text);
      feedback.textContent = 'Anfrage kopiert. Bitte senden Sie sie an das Restaurant und warten Sie auf die Bestätigung.';
      wrapper.hidden = true;
    } catch {
      wrapper.hidden = false;
      field.value = text; field.focus(); field.select();
      feedback.textContent = 'Bitte kopieren Sie den markierten Text und senden Sie ihn an das Restaurant.';
    }
  }
  window.RestaurantContact = {openDraft, openWhatsApp, copyDraft};
})();
