import requests
from bs4 import BeautifulSoup
import json
import time
import random
from fake_useragent import UserAgent

# Configuration
BASE_URL = "https://www.justia.com/lawyers/civil-rights/south-carolina"
OUTPUT_FILE = "attorneys_sc.json"
MAX_PAGES = 10  # Set higher for full scrape (e.g., 50)

def get_headers():
    ua = UserAgent()
    return {
        'User-Agent': ua.random,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
    }

def parse_attorney(card):
    """Extracts data from a single attorney card HTML element."""
    try:
        # Name
        name_tag = card.find('strong', class_='name')
        name = name_tag.get_text(strip=True) if name_tag else "Unknown"

        # Firm
        firm_tag = card.find('span', class_='law-firm-name')
        firm = firm_tag.get_text(strip=True) if firm_tag else None

        # Contact Info Block
        phone_tag = card.find('a', class_=['phone', '-phone'])
        phone = phone_tag.get_text(strip=True) if phone_tag else None

        # Address (Often unstructured, grabbing snippet)
        address_tag = card.find('span', class_='address')
        address = address_tag.get_text(" ", strip=True) if address_tag else "South Carolina"

        # Website / Profile Link
        link_tag = name_tag.find_parent('a')
        website = link_tag['href'] if link_tag else None

        # Specialty tags (Grab secondary practice areas)
        specialties = []
        spec_block = card.find('div', class_='practices')
        if spec_block:
            specialties = [s.get_text(strip=True) for s in spec_block.find_all('a')]

        return {
            "name": name,
            "firm": firm,
            "phone": phone,
            "address": address,
            "website": website,
            "specialties": specialties,
            "state": "South Carolina",
            "source": "Justia"
        }
    except Exception as e:
        print(f"[-] Error parsing card: {e}")
        return None

def scrape():
    all_attorneys = []
    
    print(f"[*] Starting scrape of {BASE_URL}")

    for page in range(1, MAX_PAGES + 1):
        url = f"{BASE_URL}?page={page}" if page > 1 else BASE_URL
        print(f"[*] Scraping Page {page}...")

        try:
            response = requests.get(url, headers=get_headers(), timeout=10)
            
            if response.status_code != 200:
                print(f"[!] Failed to load page {page}: Status {response.status_code}")
                break

            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the main listing container
            # Note: Class names can change; inspect Justia source if this breaks.
            # Currently standard listing is div class="lawyer-card" or similar wrapper
            cards = soup.find_all('div', class_='jcard') 

            if not cards:
                print("[!] No listings found on this page. Stopping.")
                break

            for card in cards:
                data = parse_attorney(card)
                if data:
                    all_attorneys.append(data)

            # Random sleep to behave like a human
            sleep_time = random.uniform(2, 5)
            time.sleep(sleep_time)

        except Exception as e:
            print(f"[!] Critical error on page {page}: {e}")
            break

    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_attorneys, f, indent=2, ensure_ascii=False)
    
    print(f"\n[+] Scrape Complete. {len(all_attorneys)} attorneys saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    scrape()
