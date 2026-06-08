import os
import urllib.request
import subprocess

partners = [
  {"name": "KWS", "logo": "https://www.kws.go.ke/sites/default/files/logo_2.png"},
  {"name": "TRA", "logo": "https://tra.go.ke/wp-content/uploads/2024/09/Logo-TRA.png"},
  {"name": "Safari Bookings", "logo": "https://cfstatic.safaribookings.com/img/logos/logo-240x35.png"},
  {"name": "TOSK", "logo": "https://staging.toskenya.org/wp-content/uploads/2024/03/tosk_logo_v2.webp"},
  {"name": "Magical Kenya", "logo": "https://i.pinimg.com/736x/58/91/7f/58917f27ff0f4b5315f9388877d62bd0.jpg"},
  {"name": "Sopa Lodges", "logo": "https://www.sopalodges.com/images/logos/sopalodges-logo.png"},
  {"name": "Serena Hotels", "logo": "https://image-tc.galaxy.tf/wisvg-2kxzoagrzpaii22pmbq9rz11m/serena-hotel-logo.svg?width=128&height=80"},
  {"name": "TripAdvisor", "logo": "https://static.tacdn.com/img2/brand_refresh_2025/logos/wordmark.svg"},
  {"name": "Safari Link", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYkVixZOmNLseNULkT9hPhNWBRLe4XFwIG1Q&s"},
  {"name": "Mombasa Air", "logo": "https://storage.aerocrs.com/99/system/logo.png"},
  {"name": "Jambojet", "logo": "https://www.flightscanner.co.ke/wp-content/uploads/2016/12/Jambojet-logo-wide.png"},
  {"name": "SGR", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfUOg0O776XzR-tL21xaFeLSh4JN6acs5ng&s"}
]

out_dir = "/home/user/Public/wild-waves-safaris/savanna-vision-craft/public/partners"
os.makedirs(out_dir, exist_ok=True)

new_code = "const partners = [\n"

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

for p in partners:
    url = p["logo"]
    name = p["name"].lower().replace(' ', '-')
    tmp_path = os.path.join(out_dir, f"{name}_tmp")
    
    try:
        urllib.request.urlretrieve(url, tmp_path)
    except Exception as e:
        print(f"Failed to download {name}: {e}")
        continue

    is_svg = ".svg" in url
    final_ext = "svg" if is_svg else "webp"
    final_name = f"{name}.{final_ext}"
    final_path = os.path.join(out_dir, final_name)

    if is_svg:
        os.rename(tmp_path, final_path)
    else:
        # Convert to webp
        subprocess.run(["convert", tmp_path, "-quality", "85", final_path])
        os.remove(tmp_path)
    
    print(f"Saved {final_name}")
    new_code += f"  {{ name: \"{p['name']}\", logo: \"/partners/{final_name}\" }},\n"

new_code += "];"

print("\n--- NEW CODE FOR Footer.tsx ---")
print(new_code)

