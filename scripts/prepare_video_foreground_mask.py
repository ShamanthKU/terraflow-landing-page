import cv2
import numpy as np
from PIL import Image, ImageFilter
import os

os.makedirs('public/images/layers', exist_ok=True)

# Load the extracted 1080p video frame
frame_path = 'public/images/layers/video_frame_0.jpg'
img = Image.open(frame_path).convert('RGBA')
w, h = img.size
print(f"Video frame dimensions: {w}x{h}")

# We need an overscanned foreground layer so that when translated upwards and horizontally during parallax,
# edges are never exposed.
pad_top = 100
pad_bottom = 200
pad_x = 100
new_w = w + pad_x * 2
new_h = h + pad_top + pad_bottom

img_np = np.array(img, dtype=float)

# Foreground layer mask: The nearest rolling hill crest with vivid flowers and grass
# In the 1080px frame, the nearest foreground hill is located in the lower 32% (y >= 740 in middle, y >= 700 on sides)
fg_arr = img_np.copy()
alpha_fg = np.zeros((h, w), dtype=np.uint8)

for x in range(w):
    nx = (x - w / 2.0) / (w / 2.0) # -1 to 1
    # Crest formula matching the nearest foreground hill
    crest_y = int(h * 0.74 - 70 * np.cos(nx * 2.35))
    for y in range(h):
        if y >= crest_y:
            fade = min(255, int((y - crest_y + 1) * 30))
            alpha_fg[y, x] = fade

# Soft feathering at the hill crest
alpha_fg_img = Image.fromarray(alpha_fg).filter(ImageFilter.GaussianBlur(radius=2.5))
fg_arr[:, :, 3] = np.array(alpha_fg_img)
fg_sub_img = Image.fromarray(fg_arr.astype(np.uint8))

# Create overscan canvas for the foreground mask
fg_overscan = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
fg_overscan.paste(fg_sub_img, (pad_x, pad_top))

# Extend bottom pixels downwards into pad_bottom so bottom edge never shows
bottom_strip = fg_sub_img.crop((0, h-1, w, h)).resize((w, pad_bottom))
fg_overscan.paste(bottom_strip, (pad_x, pad_top + h))

fg_overscan.save('public/images/layers/video-foreground-mask.png', format='PNG')
print("Video foreground mask created successfully: public/images/layers/video-foreground-mask.png")
