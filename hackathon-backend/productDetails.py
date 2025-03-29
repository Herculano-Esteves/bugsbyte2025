import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0"}

def get_product_details(product_url):
    """Scrape the product details (image, price, packaging type, and description)."""
    
    response = requests.get(product_url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch product details from {product_url}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract image URL
    image_tag = soup.select_one("img.zoomImg")
    image_url = image_tag["src"] if image_tag else None

    # Extract price
    price_tag = soup.select_one("span.value .ct-price-formatted")
    if price_tag:
        price_text = price_tag.text.strip().replace("€", "").replace(",", ".")
        price = float(price_text)
    else:
        price = None

    # Extract packaging type (e.g., "/un", "/kg")
    package_tag = soup.select_one("span.pwc-m-unit")
    type_of_package = package_tag.text.strip() if package_tag else None

    # Extract description
    description_tag = soup.select_one("div.ct-pdp--short-description")
    description = description_tag.text.strip() if description_tag else None

    # Return as a dictionary
    return {
        "image_url": image_url,
        "price": price,
        "type_of_package": type_of_package,
        "description": description,
    }
