const fs = require('fs');
const path = require('path');

console.log('📐 در حال تغییر فرم بوکمارک‌های آبنر به مربع و تنظیم چیدمان وسط‌چین...');

const bookmarkDir = path.join(__dirname, 'modules', 'bookmark');
if (!fs.existsSync(bookmarkDir)) {
  fs.mkdirSync(bookmarkDir, { recursive: true });
}

// استایل به‌‌روزشده: وسط‌چین کردن کامل و ابعاد مربعی متقارن
const bookmarkCss = `
/* ========================================================
   استایل شیشه‌ای بوکمارک‌های مربعی و وسط‌چین آبنر
======================================================== */
.ab-bookmarks-wrapper {
  width: 100%;
  max-width: 660px;
  margin: 20px auto 30px auto !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  direction: rtl;
  user-select: none;
  font-family: inherit;
  z-index: 10;
}

/* تب‌ها و پوشه‌های بالای بوکمارک به صورت وسط‌چین */
.ab-folder-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;
  flex-wrap: wrap;
}

.ab-folder-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, calc(var(--dash-glass-opacity, 0.12) + 0.05)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  color: #fff;
  transition: all 0.2s ease;
}
.ab-folder-tab:hover {
  background: rgba(255, 255, 255, 0.22) !important;
  transform: translateY(-1px);
}
.ab-folder-tab.active {
  background: #2563eb !important;
  border-color: #3b82f6 !important;
}

.ab-add-folder-btn {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  border: 1px dashed var(--dash-glass-border, rgba(255, 255, 255, 0.35));
  background: rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}
.ab-add-folder-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* شبکه بوکمارک‌های متقارن مربعی */
.ab-bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(6, 88px) !important;
  grid-auto-rows: 88px !important;
  gap: 12px !important;
  justify-content: center !important;
  width: 100%;
}

@media (max-width: 768px) {
  .ab-bookmarks-grid {
    grid-template-columns: repeat(4, 76px) !important;
    grid-auto-rows: 76px !important;
    gap: 10px !important;
  }
}

@media (max-width: 480px) {
  .ab-bookmarks-grid {
    grid-template-columns: repeat(3, 72px) !important;
    grid-auto-rows: 72px !important;
    gap: 8px !important;
  }
}

/* فرم کاملاً مربعی برای هر کارت بوکمارک */
.ab-bookmark-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1 !important;
  padding: 6px !important;
  border-radius: 18px !important;
  cursor: pointer;
  box-sizing: border-box;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s ease, filter 0.2s ease, background 0.2s ease;
}

.ab-bookmark-box:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.15);
}

/* خانه شاخص دم دستی به فرم مربعی */
.ab-bookmark-box.is-damdasti {
  border: 1px dashed rgba(59, 130, 246, 0.7) !important;
  background: rgba(59, 130, 246, calc(var(--dash-glass-opacity, 0.12) + 0.12)) !important;
}

.ab-box-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 2px;
}
.ab-box-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.ab-box-title {
  font-size: 11.5px;
  font-weight: 500;
  color: #fff;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 1.2;
}

.ab-box-dots {
  position: absolute;
  top: 4px;
  left: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  cursor: pointer;
  padding: 1px 3px;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.ab-bookmark-box:hover .ab-box-dots { opacity: 1; }
.ab-box-dots:hover { background: rgba(255, 255, 255, 0.25); color: #fff; }

.ab-bookmark-box.is-selected {
  outline: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.3) !important;
}
.ab-bookmark-box.is-selected::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 4px;
  background: #3b82f6;
  color: #fff;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* منوی ۶ حالته آبنر */
.ab-context-menu {
  position: fixed;
  z-index: 9999999;
  width: 185px;
  background: var(--dash-menu-bg, rgba(28, 22, 26, 0.92)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.22)) !important;
  border-radius: 18px !important;
  padding: 6px !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6) !important;
  direction: rtl !important;
  color: #fff !important;
  font-family: inherit !important;
}
.ab-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ab-menu-item:hover { background: rgba(255, 255, 255, 0.15); }
.ab-menu-item.danger { color: #ef4444; }

.ab-submenu-trigger { position: relative; }
.ab-submenu-box {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 145px;
  background: var(--dash-menu-bg, rgba(28, 22, 26, 0.95));
  backdrop-filter: blur(var(--dash-blur-px, 20px));
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 14px;
  padding: 6px;
}
.ab-submenu-trigger:hover .ab-submenu-box { display: block; }
.ab-submenu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.ab-submenu-row:hover { background: rgba(255, 255, 255, 0.12); }
.ab-submenu-row.active { color: #60a5fa; }

/* نوار انتخاب دسته‌جمعی */
.ab-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: var(--dash-menu-bg, rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 9999px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 999999;
  color: #fff;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
}
.ab-bulk-bar.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.ab-bulk-counter {
  background: #3b82f6;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
.ab-bulk-del { color: #ef4444; cursor: pointer; }
.ab-bulk-close { cursor: pointer; opacity: 0.7; }

/* پاپ‌آپ شیشه‌ای */
.ab-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000000;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.ab-modal-overlay.active { opacity: 1; pointer-events: auto; }
.ab-glass-modal {
  width: 90%;
  max-width: 360px;
  padding: 22px;
  border-radius: 22px;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.15)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.25));
  color: #fff;
}
.ab-glass-modal h3 { margin: 0 0 14px 0; font-size: 15px; }
.ab-glass-modal input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  box-sizing: border-box;
}
.ab-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.ab-btn-save {
  flex: 1; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;
}
.ab-btn-cancel {
  flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.15); border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2)); color: #fff; border-radius: 12px; cursor: pointer;
}
`;

fs.writeFileSync(path.join(bookmarkDir, 'bookmark.css'), bookmarkCss, 'utf8');
console.log('✅ فایل استایل مربعی modules/bookmark/bookmark.css به‌روزرسانی شد.');