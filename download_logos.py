#!/usr/bin/env python3
"""Download official company logos using browser navigation and web scraping."""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
import re
from typing import Optional, Tuple
import time

LOGOS_DIR = r"C:\Users\UnofficialMango\documents\projects\bruceliu.info\img\logos"

# Company configurations with URLs to try
COMPANIES = {
    "typeDev": [
        "https://www.typedev.com",
        "https://typedev.com",
    ],
    "TypeDev Technologies": [
        "https://www.typedev.com",
        "https://typedev.com",
    ],
    "Discovery Vitality Life": [
        "https://www.discovery.co.za",
        "https://discovery.co.za",
    ],
    "Modul University of Vienna": [
        "https://www.modul.ac.at",
        "https://modul.ac.at",
    ],
    "InfluApp": [
        "https://www.influapp.com",
        "https://influapp.com",
    ],
    "ThutoPele Center": [
        "https://www.thutopele.co.za",
        "https://thutopele.co.za",
    ],
    "TuksNovation": [
        "https://www.tuksnovation.co.za",
        "https://tuksnovation.co.za",
    ],
    "University of Pretoria": [
        "https://www.up.ac.za",
        "https://up.ac.za",
    ],
    "LiuPark (Pty) Ltd": [
        "https://liupark.co.za",
        "https://www.liupark.co.za",
    ],
    "Pattern Matched Technologies (Pty) Ltd": [
        "https://www.patternmatched.com",
        "https://patternmatched.com",
    ],
    "Pretoria High School for Girls": [
        "https://www.phsg.co.za",
        "https://phsg.co.za",
    ],
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
}

def extract_logo_from_html(html: str, base_url: str) -> Optional[str]:
    """Extract logo URL from HTML using multiple methods."""
    soup = BeautifulSoup(html, 'html.parser')
    
    # Method 1: og:image meta tag (most reliable for brand images)
    og_image = soup.find('meta', property='og:image')
    if og_image and og_image.get('content'):
        logo_url = urljoin(base_url, og_image['content'])
        print(f"  Found via og:image: {logo_url}")
        return logo_url
    
    # Method 2: Twitter card image
    twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})
    if twitter_image and twitter_image.get('content'):
        logo_url = urljoin(base_url, twitter_image['content'])
        print(f"  Found via twitter:image: {logo_url}")
        return logo_url
    
    # Method 3: Images with "logo" in alt text or src
    for img in soup.find_all('img'):
        alt = (img.get('alt', '') or '').lower()
        src = (img.get('src', '') or '').lower()
        
        if any(pattern in alt or pattern in src for pattern in ['logo', 'brand', 'site-logo']):
            logo_url = urljoin(base_url, img['src'])
            print(f"  Found via logo image: {logo_url}")
            return logo_url
    
    # Method 4: First image on page (often the logo)
    first_img = soup.find('img')
    if first_img and first_img.get('src'):
        logo_url = urljoin(base_url, first_img['src'])
        print(f"  Found as first image: {logo_url}")
        return logo_url
    
    # Method 5: SVG logo in header/nav
    for svg in soup.find_all('svg'):
        if svg.parent and any(pattern in (svg.parent.get('class', []) or [''])[0].lower() 
                              for pattern in ['header', 'nav', 'logo']):
            print(f"  Found SVG logo")
            return None  # Can't easily extract SVG URL
    
    return None

def download_image(url: str, filename: str) -> bool:
    """Download an image from URL."""
    try:
        response = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
        if response.status_code == 200 and len(response.content) > 500:
            # Check if it's actually an image (not HTML error page)
            content_type = response.headers.get('content-type', '')
            if 'image' in content_type or response.content[:4] in [b'\x89PNG', b'\xff\xd8\xff\xe0', b'<svg']:
                filepath = os.path.join(LOGOS_DIR, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"  Downloaded to {filename} ({len(response.content)} bytes)")
                return True
            else:
                print(f"  Not an image (content-type: {content_type})")
        else:
            print(f"  Failed: HTTP {response.status_code}, size={len(response.content)}")
    except Exception as e:
        print(f"  Error downloading: {e}")
    
    return False

def try_favicon(company_name: str) -> bool:
    """Try to download favicon.ico."""
    # Try common URL patterns
    url_patterns = [
        f"https://www.{company_name.lower().replace(' ', '')}.com/favicon.ico",
        f"https://{company_name.lower().replace(' ', '')}.com/favicon.ico",
        f"https://www.{company_name.lower().replace(' ', '')}.co.za/favicon.ico",
    ]
    
    for url in url_patterns:
        try:
            response = requests.get(url, headers=HEADERS, timeout=10)
            if response.status_code == 200 and len(response.content) > 500:
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type or response.content[:4] == b'\x89PNG':
                    filepath = os.path.join(LOGOS_DIR, f"{company_name.lower().replace(' ', '_')}.png")
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    print(f"  Downloaded favicon to {filepath}")
                    return True
        except Exception:
            continue
    
    return False

def download_logo(company_name: str) -> bool:
    """Download logo for a company using multiple methods."""
    print(f"\n{'='*60}")
    print(f"Processing: {company_name}")
    print('='*60)
    
    # Method 1: Try favicon first (fastest)
    if try_favicon(company_name):
        return True
    
    # Method 2: Try official websites
    for url in COMPANIES.get(company_name, []):
        print(f"\nTrying URL: {url}")
        try:
            response = requests.get(url, headers=HEADERS, timeout=10)
            if response.status_code == 200 and len(response.content) > 1000:
                logo_url = extract_logo_from_html(response.text, url)
                if logo_url:
                    filename = f"{company_name.lower().replace(' ', '_')}.png"
                    if download_image(logo_url, filename):
                        return True
        except Exception as e:
            print(f"  Error accessing {url}: {e}")
    
    # Method 3: Try alternative domains
    alt_domains = [
        f"https://{company_name.lower().replace(' ', '')}.com",
        f"https://{company_name.lower().replace(' ', '')}.org",
    ]
    
    for alt_url in alt_domains:
        print(f"\nTrying URL: {alt_url}")
        try:
            response = requests.get(alt_url, headers=HEADERS, timeout=10)
            if response.status_code == 200 and len(response.content) > 1000:
                logo_url = extract_logo_from_html(response.text, alt_url)
                if logo_url:
                    filename = f"{company_name.lower().replace(' ', '_')}.png"
                    if download_image(logo_url, filename):
                        return True
        except Exception as e:
            print(f"  Error accessing {alt_url}: {e}")
    
    print(f"\n❌ Failed to download logo for {company_name}")
    return False

def main():
    """Main function to download all logos."""
    os.makedirs(LOGOS_DIR, exist_ok=True)
    
    results = {}
    for company in COMPANIES.keys():
        success = download_logo(company)
        results[company] = "✓" if success else "✗"
        time.sleep(1)  # Be polite to servers
    
    print(f"\n{'='*60}")
    print("SUMMARY")
    print('='*60)
    for company, status in results.items():
        print(f"{status} {company}")
    
    # List downloaded files
    print(f"\nDownloaded files:")
    for f in sorted(os.listdir(LOGOS_DIR)):
        filepath = os.path.join(LOGOS_DIR, f)
        size = os.path.getsize(filepath)
        print(f"  - {f} ({size} bytes)")

if __name__ == "__main__":
    main()
