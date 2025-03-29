import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# Configuration
SEARCH_URL = "https://www.continente.pt/pesquisa/?q="
DECREMENT_STEP = 3  # Change this to modify the number of characters removed in each step
HEADERS = {"User-Agent": "Mozilla/5.0"}  # Some sites block bots, so we use a User-Agent

def search_product(product_name):
    """Search for the product and return the first result URL."""
    search_query = product_name.replace(" ", "+")
    url = SEARCH_URL + search_query
    print(f"Searching: {url}")

    while len(search_query) > 0:
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to fetch results for {search_query}")
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        product_link = soup.select_one("a[href^='/produto/']")  # Find <a> whose href starts with "/produto/"

        if product_link and "href" in product_link.attrs:
            first_product_url = "https://www.continente.pt" + product_link["href"]
            print(f"Found product: {first_product_url}")
            return first_product_url

        # Shorten search query if no results
        print(f"No results for: {search_query}, reducing query...")
        search_query = search_query[:-DECREMENT_STEP]
        url = SEARCH_URL + search_query
        time.sleep(1)  # To avoid being blocked

    print("No product found.")
    return None


def get_product_details(product_url):
    """Scrape the product details (image, price, packaging type, and description)."""
    
    response = requests.get(product_url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch product details from {product_url}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Debugging: print the entire page to see the structure
    print(f"Parsing product page: {product_url}")
    print(f"Page content:\n{soup.prettify()[:1000]}")  # Print the first 1000 characters for inspection

    # Extract image URL
    image_tag = soup.select_one("div.pdp-carousel-item img.ct-product-image")
    if image_tag:
        image_url = image_tag["src"]
        print(f"Image found: {image_url}")
    else:
        image_url = None
        print("No image found")

    # Extract price
    price_tag = soup.select_one("span.value .ct-price-formatted")
    if price_tag:
        price_text = price_tag.text.strip().replace("€", "").replace(",", ".")
        price = float(price_text)
        print(f"Price found: €{price}")
    else:
        price = None
        print("No price found")

    # Extract packaging type (e.g., "/un", "/kg")
    package_tag = soup.select_one("span.pwc-m-unit")
    if package_tag:
        type_of_package = package_tag.text.strip()
        print(f"Package type found: {type_of_package}")
    else:
        type_of_package = None
        print("No package type found")

    # Extract description
    description_tag = soup.select_one("div.ct-pdp--short-description")
    if description_tag:
        description = description_tag.text.strip()
        print(f"Description found: {description}")
    else:
        description = None
        print("No description found")

    # Extract name_url
    name_url_tag = soup.select_one("h1.pwc-h3.col-h3.product-name.pwc-font--primary-extrabold")
    if name_url_tag:
        name_url = name_url_tag.text.strip()
        print(f"name_url found: {name_url}")
    else:
        name_url = None
        print("No name_url found")

    # Return as a dictionary
    return {
        "image_url": image_url,
        "price": price,
        "type_of_package": type_of_package,
        "description": description,
        "name_url": name_url
    }

# Load CSV
csv_file = "prodTest.csv"  # Change this to your actual file path
df = pd.read_csv(csv_file, sep=";")  # Adjust separator if necessary

# Process each product
for product_name in df["product_dsc"]:
    product_url = search_product(product_name)
    if product_url:
        details = get_product_details(product_url)
        if details:
            print(f"Product details: {details}")
        else:
            print(f"No details found for product: {product_name}")
