const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تعریف امن تابع applyAbsoluteBlurEngine در صورت نبودن آن
  if (!js.includes('function applyAbsoluteBlurEngine(')) {
    const missingFunctionDef = `
// تعریف تابع ماتی برای رفع ارور عدم شناسایی applyAbsoluteBlurEngine
function applyAbsoluteBlurEngine(dashPct, popupPct) {
  if (typeof setLiveBlur === 'function') {
    setLiveBlur(dashPct, popupPct);
  } else if (typeof applyBlurStyles === 'function') {
    applyBlurStyles(dashPct, popupPct);
  }
}
`;
    js = missingFunctionDef + '\n' + js;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ خطای applyAbsoluteBlurEngine is not defined برطرف شد.');
  }
}