export function initClock() {
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');

  function update() {
    const now = new Date();
    if (clockTime) {
      clockTime.textContent = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    }
    if (clockDate) {
      clockDate.textContent = now.toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  }

  update();
  setInterval(update, 1000);
}