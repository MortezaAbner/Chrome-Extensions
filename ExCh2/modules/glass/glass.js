/**
 * تنظیم مستقیم میزان ماتی و شفافیت شیشه روی تصویر پشت
 * @param {number} blurPx مقدار تاری بین 0 تا 40 پیکسل
 */
export function setGlassBlur(blurPx) {
  const root = document.documentElement;
  
  // اعمال مستقیم روی ریشه CSS
  root.style.setProperty('--dash-blur-px', `${blurPx}px`);
  
  // ذخیره در مرورگر
  localStorage.setItem('abner_glass_blur', blurPx);
}

export function initGlass() {
  const savedBlur = localStorage.getItem('abner_glass_blur') || 16;
  setGlassBlur(savedBlur);

  const slider = document.getElementById('glassBlurSlider');
  const label = document.getElementById('glassBlurVal');
  const btnSettings = document.getElementById('dock-btn-settings');
  const settingsPopup = document.getElementById('glassSettingsPopup');

  if (slider) {
    slider.value = savedBlur;
    if (label) label.textContent = `${savedBlur}px`;

    // تغییر آنی به محض حرکت دادن اسلایدر
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      setGlassBlur(val);
      if (label) label.textContent = `${val}px`;
    });
  }

  // باز و بسته شدن پنل تنظیمات با کلیک روی چرخ‌دنده داکر
  if (btnSettings && settingsPopup) {
    btnSettings.addEventListener('click', () => {
      settingsPopup.classList.toggle('hidden');
    });
  }
}