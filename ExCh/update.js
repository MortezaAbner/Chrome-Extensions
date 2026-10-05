const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. حذف هرگونه alert در دکمه تأیید ماتی و بستن قطعی پاپ‌آپ تنظیمات
  const fixedSaveHandler = `
    if (btnSave) {
      btnSave.onclick = (e) => {
        if (e) e.stopPropagation();
        if (typeof slD !== 'undefined' && slD) persistentDash = slD.value;
        if (typeof slP !== 'undefined' && slP) persistentPopup = slP.value;
        if (typeof sDash !== 'undefined' && sDash) savedD = sDash.value;
        if (typeof sPopup !== 'undefined' && sPopup) savedP = sPopup.value;
        if (typeof sliderDash !== 'undefined' && sliderDash) committedDash = sliderDash.value;
        if (typeof sliderPopup !== 'undefined' && sliderPopup) committedPopup = sliderPopup.value;

        const finalDash = (typeof sDash !== 'undefined' && sDash) ? sDash.value : ((typeof slD !== 'undefined' && slD) ? slD.value : (typeof sliderDash !== 'undefined' && sliderDash ? sliderDash.value : '25'));
        const finalPopup = (typeof sPopup !== 'undefined' && sPopup) ? sPopup.value : ((typeof slP !== 'undefined' && slP) ? slP.value : (typeof sliderPopup !== 'undefined' && sliderPopup ? sliderPopup.value : '65'));

        localStorage.setItem('user_dash_blur_pct', finalDash);
        localStorage.setItem('user_popup_blur_pct', finalPopup);
        localStorage.setItem('blur_dash_val', finalDash);
        localStorage.setItem('blur_popup_val', finalPopup);
        localStorage.setItem('cfg_dash_blur', finalDash);
        localStorage.setItem('cfg_popup_blur', finalPopup);

        if (typeof setLiveBlur === 'function') setLiveBlur(finalDash, finalPopup);
        if (typeof applyBlurStyles === 'function') applyBlurStyles(finalDash, finalPopup);
        if (typeof onSliderDrag === 'function') onSliderDrag();

        // بستن کامل پاپ‌آپ تنظیمات بدون نمایش پیام
        const settingsView = document.getElementById('view-settings');
        if (settingsView) {
          settingsView.classList.remove('active');
        }
        const dashView = document.getElementById('view-dashboard');
        if (dashView) {
          dashView.classList.add('active');
        }
        const dockHome = document.getElementById('dock-home-btn');
        if (dockHome) {
          dockHome.classList.add('active');
        }
      };
    }
  `;

  // پاک کردن آلرت و جایگزینی با بستن سریع
  js = js.replace(/if\s*\(btnSave\)\s*\{[\s\S]*?alert\([^)]*\);?[\s\S]*?\};?\s*\}/, fixedSaveHandler.trim());
  js = js.replace(/if\s*\(btnSave\)\s*\{[\s\S]*?modalSettings\.classList\.remove\('active'\);[\s\S]*?\};?\s*\}/, fixedSaveHandler.trim());

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ آلرت تایید ماتی حذف شد و بستن خودکار پاپ‌آپ بدون پیام اضافه شد.');
}