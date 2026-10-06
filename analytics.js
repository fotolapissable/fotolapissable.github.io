/*!
 * analytics.js - GA4 condiviso per le PWA fotolapissable
 * Uso (in ogni app, dentro <head>):
 *   <script src="/analytics.js" data-id="G-XXXXXXXXXX" data-app="etna-trails" defer></script>
 */
(function () {
  var s = document.currentScript;
  var ID = s.getAttribute('data-id');
  var APP = s.getAttribute('data-app') || 'sconosciuta';
  if (!ID || ID.indexOf('XXXX') > -1) return;

  // Modalità di visualizzazione: browser o app installata
  var standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  var mode = standalone ? 'installata' : 'browser';

  // Carica gtag
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(g);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID, {
    app_name: APP,
    display_mode: mode,
    cookie_flags: 'SameSite=None;Secure'
  });
  gtag('set', 'user_properties', { display_mode: mode });

  function ev(name, params) {
    gtag('event', name, Object.assign({ app_name: APP, display_mode: mode }, params || {}));
  }
  window.trackEvent = ev; // uso manuale: trackEvent('nome_evento', {chiave:'valore'})

  // Apertura da app installata
  if (standalone) ev('pwa_launch');

  // Prompt di installazione mostrato
  window.addEventListener('beforeinstallprompt', function () {
    ev('pwa_install_prompt');
  });

  // Installazione completata
  window.addEventListener('appinstalled', function () {
    ev('pwa_installed');
  });

  // Uso offline
  window.addEventListener('offline', function () { ev('pwa_offline'); });

  // Nuova versione del service worker pronta
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      ev('pwa_updated');
    });
  }
})();
