
/**
 * ماژول جاوااسکریپت ساعت و آب‌وهوای آبنر
 */
(function() {
  function render() {
    const rightCol = document.querySelector('.right-column') || document.body;
    let box = document.getElementById('abner-modular-weather');
    if (!box) {
      box = document.createElement('div');
      box.id = 'abner-modular-weather';
      rightCol.prepend(box);
    }
    const d = new Date();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');

    box.innerHTML = `
      <div class="ab-weather-card">
        <div>
          <div style="font-size:18px;font-weight:bold;">${h}:${m}</div>
          <div style="font-size:11px;opacity:0.75;">سه‌شنبه . تهران</div>
        </div>
        <div style="text-align:left;">
          <div style="font-size:18px;font-weight:bold;color:#60a5fa;">۲۸°</div>
          <div style="font-size:11px;opacity:0.75;">کمی ابری ⛅</div>
        </div>
      </div>
    `;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  setInterval(render, 10000);
})();
