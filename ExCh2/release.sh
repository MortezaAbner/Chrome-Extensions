#!/usr/bin/env bash
set -e

MANIFEST_FILE="manifest.json"

if [ ! -f "$MANIFEST_FILE" ]; then
    echo "خطا: فایل manifest.json پیدا نشد!"
    exit 1
fi

# ۱. دریافت پیام کامیت برای عنوان تغییرات
COMMIT_MSG="${1:-Update UI and Glass Styles}"

# ۲. خواندن نسخه فعلی از manifest.json و افزایش خودکار آن
CURRENT_VERSION=$(grep -o '"version": *"[^"]*"' "$MANIFEST_FILE" | cut -d'"' -f4)
if [ -z "$CURRENT_VERSION" ]; then
    CURRENT_VERSION="1.32.94"
fi

# تفکیک نسخه سه رقمی یا چندبخشی
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
LEN=${#VERSION_PARTS[@]}
LAST_INDEX=$((LEN - 1))
VERSION_PARTS[$LAST_INDEX]=$((VERSION_PARTS[$LAST_INDEX] + 1))

# ساخت نسخه جدید به شکل خودکار
NEW_VERSION=$(IFS=. ; echo "${VERSION_PARTS[*]}")
TAG_NAME="v$NEW_VERSION"
ZIP_NAME="Chrome-Extension-$TAG_NAME.zip"

echo "نسخه قبلی: $CURRENT_VERSION"
echo "نسخه جدید ارتقایافته: $NEW_VERSION"

# اعمال نسخه جدید در manifest.json
sed -i.bak -E "s/\"version\": *\"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" "$MANIFEST_FILE" && rm -f "${MANIFEST_FILE}.bak"

# ۳. پاکسازی تمام فایل‌های فشرده قبلی
rm -f Chrome-Extension-*.zip

# ۴. ساخت پکیج زیپ جدید
echo "در حال ساخت پکیج فشرده: $ZIP_NAME..."
zip -r "$ZIP_NAME" . -x "*.git*" "release.sh" "*.bak" "Chrome-Extension-*.zip"

# ۵. کامیت و اعمال تگ در گیت
git add .
git commit -m "chore(release): $TAG_NAME - $COMMIT_MSG" || true
git tag -fa "$TAG_NAME" -m "Release $TAG_NAME"
git push origin main --tags

# ۶. انتشار ریلیز در گیت‌هاب مشابه تصویر
if command -v gh &> /dev/null; then
    RELEASE_TITLE="Abner Extension $TAG_NAME - $COMMIT_MSG"

    # متن توضیحات ریلیز دو زبانه (فارسی و انگلیسی)
    RELEASE_NOTES="### 🇮🇷 تغییرات نسخه $TAG_NAME:

* $COMMIT_MSG
* مات‌تر و خواناتر شدن استایل شیشه‌ای المان‌ها، ویجت‌ها و پنل تسک
* هماهنگی چیدمان سایدبار و تقویم با قالب شیشه‌ای آبنر
* بسته‌شدن خودکار و هوشمند منوها و کشوها

---

### 🇬🇧 Release Notes ($TAG_NAME):

* $COMMIT_MSG
* Enhanced frosted glass blur and opacity for interface elements and task panel
* Aligned sidebar layout and calendar integration
* Intelligent drawer backdrop handling and performance improvements"

    echo "در حال انتشار در گیت‌هاب..."
    gh release create "$TAG_NAME" "$ZIP_NAME" \
        --title "$RELEASE_TITLE" \
        --notes "$RELEASE_NOTES"

    echo "✅ نسخه $TAG_NAME دقیقاً مشابه تصویر با موفقیت در گیت‌هاب منتشر شد!"
else
    echo "⚠️ دستور gh نصب نیست؛ تگ ثبت شد و فایل $ZIP_NAME در پوشه ساخته شد."
fi