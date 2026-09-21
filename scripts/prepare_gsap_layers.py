import os
from PIL import Image, ImageFilter
import numpy as np

os.makedirs('public/images/layers', exist_ok=True)
src_path = 'public/images/terraflow-landscape.jpg'
img = Image.open(src_path).convert('RGBA')
w, h = img.size
print(f"Original image size: {w}x{h}")

# Overscan margins:
# Add 60px on top, 60px on bottom, 40px left and right for parallax overscan
pad_top = 80
pad_bottom = 60
pad_x = 50
new_w = w + pad_x * 2
new_h = h + pad_top + pad_bottom

img_np = np.array(img, dtype=float)

# 1. SKY LAYER
# Extract the top sky color and gradient, extended across the whole overscan canvas
sky_canvas = Image.new('RGB', (new_w, new_h), (242, 247, 252))
# Sample sky color from original top rows
sky_top_color = img_np[:20, :, :3].mean(axis=(0, 1)).astype(int)
sky_mid_color = img_np[60:100, :, :3].mean(axis=(0, 1)).astype(int)

# Fill with subtle sky gradient
for y in range(new_h):
    t = min(1.0, y / (new_h * 0.5))
    c = (1.0 - t) * sky_top_color + t * sky_mid_color
    sky_canvas.paste(Image.new('RGB', (new_w, 1), tuple(c.astype(int))), (0, y))

sky_canvas.save('public/images/layers/sky.jpg', quality=95)
print("Sky layer created.")

# 2. MOUNTAIN LAYER
# Distant pale blue mountains: present from ~y=120 to y=330
mountains_canvas = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
mountains_sub = img_np.copy()
mountains_alpha = np.zeros((h, w), dtype=np.uint8)

# Color mask: mountains are bluish / desaturated (R and G close, B slightly higher, G > R is low)
# Green hills start where G - R > 25 and G > 90
for y in range(h):
    for x in range(w):
        r, g, b, _ = img_np[y, x]
        # In upper part (y < 350)
        if y < 350:
            # Sky threshold: sky is very bright (R > 220, G > 230, B > 240)
            is_sky = (r > 215 and g > 225 and b > 235)
            # Green hill check
            is_green = (g > r + 18 and g > 90 and y > 240)
            if not is_sky and not is_green:
                # Calculate opacity fade at top boundary of mountain
                # And fade at bottom
                mountains_alpha[y, x] = 255
            elif is_sky and y > 120:
                # Soft blend near mountain ridge
                mountains_alpha[y, x] = 0
            else:
                mountains_alpha[y, x] = 0

# Smooth the mountain alpha
m_alpha_img = Image.fromarray(mountains_alpha).filter(ImageFilter.GaussianBlur(radius=2.5))
mountains_sub[:, :, 3] = np.array(m_alpha_img)

# Paste on overscan canvas at (pad_x, pad_top)
mountains_canvas.paste(Image.fromarray(mountains_sub.astype(np.uint8)), (pad_x, pad_top))
mountains_canvas.save('public/images/layers/mountains.png')
print("Mountains layer created.")

# 3. MIDGROUND LAYER (Rolling green hills without foreground crest)
# The full landscape with sky removed, so it can move as the core landscape plane
midground_canvas = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
mid_sub = img_np.copy()
mid_alpha = np.zeros((h, w), dtype=np.uint8)

for y in range(h):
    for x in range(w):
        r, g, b, _ = img_np[y, x]
        # Check if green hill or foreground
        is_green_or_flower = (g > r + 12 and g > 75) or (r > 160 and g < 120) or (b > 140 and r > 100) or y >= 320
        if is_green_or_flower and y > 220:
            mid_alpha[y, x] = 255
        elif y > 240:
            mid_alpha[y, x] = min(255, int((y - 240) * 15))

mid_alpha_img = Image.fromarray(mid_alpha).filter(ImageFilter.GaussianBlur(radius=2))
mid_sub[:, :, 3] = np.array(mid_alpha_img)

midground_canvas.paste(Image.fromarray(mid_sub.astype(np.uint8)), (pad_x, pad_top))
midground_canvas.save('public/images/layers/midground.png')
print("Midground layer created.")

# 4. FOREGROUND LAYER (Nearest prominent rolling hill crest with vivid wildflowers)
# This is the closest layer that moves fastest (speed 1.0)
fg_canvas = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
fg_sub = img_np.copy()
fg_alpha = np.zeros((h, w), dtype=np.uint8)

for x in range(w):
    nx = (x - w / 2.0) / (w / 2.0)
    # Hill crest contour across the bottom third
    crest_y = int(h * 0.75 - 42 * np.cos(nx * 2.4))
    for y in range(h):
        if y >= crest_y:
            fade = min(255, int((y - crest_y + 1) * 45))
            fg_alpha[y, x] = fade

fg_alpha_img = Image.fromarray(fg_alpha).filter(ImageFilter.GaussianBlur(radius=1.8))
fg_sub[:, :, 3] = np.array(fg_alpha_img)

fg_canvas.paste(Image.fromarray(fg_sub.astype(np.uint8)), (pad_x, pad_top))
fg_canvas.save('public/images/layers/foreground.png')
print("Foreground layer created.")

# 5. BASE CONTINUOUS BACKDROP (Guarantees 100% photographic visual continuity)
base_canvas = Image.new('RGB', (new_w, new_h), tuple(sky_top_color))
# Fill gradient top
for y in range(pad_top):
    t = y / pad_top
    c = (1.0 - t) * sky_top_color + t * sky_mid_color
    base_canvas.paste(Image.new('RGB', (new_w, 1), tuple(c.astype(int))), (0, y))
base_canvas.paste(img.convert('RGB'), (pad_x, pad_top))
# Extend bottom slightly
bottom_row = img.crop((0, h-1, w, h)).resize((new_w, pad_bottom))
base_canvas.paste(bottom_row, (0, pad_top + h))
base_canvas.save('public/images/layers/base-landscape.jpg', quality=95)
print("Base continuous backdrop created.")

print("All GSAP depth layers generated successfully with overscan!")
