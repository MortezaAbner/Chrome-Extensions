const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تعریف امن تابع applyAbsoluteBlurEngine در صورت نبودن آن برای رفع ارور referenceError
  const missingFunctionDef = `
// تعریف تابع ماتی برای رفع ارور applyAbsoluteBlurEngine is not defined
function applyAbsoluteBlurEngine(dashPct, popupPct) {
  if (typeof setLiveBlur === 'function') {
    setLiveBlur(dashPct, popupPct);
  } else if (typeof applyBlurStyles === 'function') {
    applyBlurStyles(dashPct, popupPct);
  }
}
`;

  // افزودن تعریف تابع به ابتدای فایل، فقط در صورتی که قبلا تعریف نشده باشد
  if (!js.includes('function applyAbsoluteBlurEngine(')) {
    js = missingFunctionDef + '\n' + js;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ خطای ReferenceError برطرف شد و تابع applyAbsoluteBlurEngine تعریف شد.');
  } else {
    console.log('ℹ️ تابع applyAbsoluteBlurEngine قبلاً در فایل موجود است.');
  }
} else {
  console.log('❌ فایل script.js پیدا نشد.');
}