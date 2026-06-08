import os
from PIL import Image, ImageDraw

input_path = '/home/user/Public/wild-waves-safaris/savanna-vision-craft/public/original_logo.jpeg'
output_dir = '/home/user/Public/wild-waves-safaris/savanna-vision-craft/public/'

img = Image.open(input_path).convert("RGBA")

size = img.height
crop_img = img.crop((0, 0, size, size))

mask = Image.new('L', (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, size, size), fill=255)

result = Image.new('RGBA', (size, size))
result.paste(crop_img, (0,0), mask)

result.save(os.path.join(output_dir, 'favicon.png'), format='PNG')
result.save(os.path.join(output_dir, 'apple-touch-icon.png'), format='PNG')

img_32 = result.resize((32, 32), Image.Resampling.LANCZOS)
img_32.save(os.path.join(output_dir, 'favicon.ico'), format='ICO')

print("Favicons generated successfully!")
