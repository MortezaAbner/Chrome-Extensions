from PIL import Image

# باز کردن تصویر و تبدیل به کادر مربعی 128x128
img = Image.open("icon.jpg")
w, h = img.size
min_dim = min(w, h)

# برش مرکز تصویر
left = (w - min_dim) / 2
top = (h - min_dim) / 2
right = (w + min_dim) / 2
bottom = (h + min_dim) / 2

img_cropped = img.crop((left, top, right, bottom))
img_resized = img_cropped.resize((128, 128), Image.Resampling.LANCZOS)

# ذخیره به عنوان آیکون نهایی اکستنشن
img_resized.save("icon.png", "PNG")
print("✅ فایل icon.png با ابعاد 128x128 با موفقیت ساخته شد.")