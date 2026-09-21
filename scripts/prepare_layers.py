import os
from PIL import Image, ImageFilter
import numpy as np

os.makedirs('public/images', exist_ok=True)
src_path = 'public/images/terraflow-landscape.jpg'
img = Image.open(src_path).convert('RGBA')
w, h = img.size
arr = np.array(img, dtype=float)

# 1. Base Layer: Full landscape with extra sky extension at the top so text has pristine open sky
# Create extended canvas (w x (h + 120)) so sky has plenty of vertical headroom
sky_extend = 100
extended_h = h + sky_extend
base_canvas = Image.new('RGB', (w, extended_h), (242, 247, 252))

# Sample top sky color from img (y=0 to y=15)
sky_sample = np.array(img.crop((0, 0, w, 20))).mean(axis=(0, 1))[:3].astype(int)

# Create soft sky gradient for extended top
gradient_top = Image.new('RGB', (w, sky_extend), tuple(sky_sample))
base_canvas.paste(gradient_top, (0, 0))
base_canvas.paste(img.convert('RGB'), (0, sky_extend))
base_canvas.save('public/images/landscape-sky-mountains.jpg', quality=95)

# 2. Foreground Layer: The closest prominent rolling hill crest with vivid wildflowers
# In the 575px height image, the foreground hill is in the bottom ~35% (y >= 430 in center, y >= 390 on sides)
fg_arr = np.array(img).copy()
alpha_fg = np.zeros((h, w), dtype=np.uint8)

for x in range(w):
    nx = (x - w / 2.0) / (w / 2.0) # -1 to 1
    # Crest formula for only the nearest foreground hill
    crest_y = int(h * 0.76 - 40 * np.cos(nx * 2.5))
    for y in range(h):
        if y >= crest_y:
            fade = min(255, int((y - crest_y + 1) * 35))
            alpha_fg[y, x] = fade

alpha_fg_img = Image.fromarray(alpha_fg).filter(ImageFilter.GaussianBlur(radius=2))
fg_arr[:, :, 3] = np.array(alpha_fg_img)
fg_sub_img = Image.fromarray(fg_arr)

# Place foreground on matching extended canvas so both layers have identical dimensions
fg_extended_canvas = Image.new('RGBA', (w, extended_h), (0, 0, 0, 0))
fg_extended_canvas.paste(fg_sub_img, (0, sky_extend))
fg_extended_canvas.save('public/images/landscape-foreground.png')

print("Refined landscape depth layers generated successfully!")
