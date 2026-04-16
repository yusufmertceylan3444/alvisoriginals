import os

products = [
    {"id": "heritage-bomber-jacket", "name": "Heritage Bomber Jacket", "price": "$179.99", "image": "images/heritage_image_1776018757646.png"},
    {"id": "designer-oversized-shirt", "name": "Designer Oversized Shirt", "price": "$89.99", "image": "images/designer_image_1776018332858.png"},
    {"id": "classic-essential-tee", "name": "Classic Essential Tee", "price": "$49.99", "image": "images/classics_image_1776018347519.png"},
    {"id": "heritage-leather-jacket", "name": "Heritage Leather Jacket", "price": "$249.99", "image": "images/editorial_image_1776019075841.png"},
    {"id": "designer-track-pants", "name": "Designer Track Pants", "price": "$79.99", "image": "images/hero_image_1776019122064.png"},
    {"id": "classic-polo-shirt", "name": "Classic Polo Shirt", "price": "$39.99", "image": "images/classics_image_1776018347519.png"},
    {"id": "heritage-wool-coat", "name": "Heritage Wool Coat", "price": "$199.99", "image": "images/heritage_image_1776018757646.png"},
    {"id": "designer-graphic-tee", "name": "Designer Graphic Tee", "price": "$44.99", "image": "images/designer_image_1776018332858.png"}
]

pages = ["shop.html", "designer.html", "classics.html", "heritage.html"]
base_dir = "C:/Users/buket/Desktop/Sat/alvisoriginals"

panel_markup = """
    <div class="nav-panel-backdrop" data-panel-backdrop hidden></div>
    <section class="nav-panel search-panel" data-panel="search" aria-label="Search Panel">
        <div class="panel-header">
            <h3>Search alvis.com</h3>
            <button class="panel-close" data-panel-close aria-label="Close Search">↗</button>
        </div>
        <input class="search-field" type="text" placeholder="Search products, collections, support">
        <div class="panel-quick-links">
            <a href="shop.html">Find all designs</a>
            <a href="classics.html">Explore Classics</a>
            <a href="heritage.html">Explore Heritage</a>
            <a href="designer.html">Explore Designer</a>
        </div>
    </section>
    <section class="nav-panel bag-panel" data-panel="bag" aria-label="Bag Panel">
        <div class="panel-header">
            <h3>Your Bag</h3>
            <button class="panel-close" data-panel-close aria-label="Close Bag">↗</button>
        </div>
        <div class="bag-groups">
            <div class="bag-group">
                <h4>Favorites</h4>
                <ul class="bag-list" data-favorites-list></ul>
            </div>
            <div class="bag-group">
                <h4>Cart</h4>
                <ul class="bag-list" data-cart-list></ul>
            </div>
        </div>
        <p class="bag-empty" data-bag-empty>Your bag is empty.</p>
    </section>
"""

for page_name in pages:
    if page_name == "shop.html":
        title_tag = "Store | ALVIS ORIGINALS"
        h1_text = "All Designs"
        active_all = 'class="active"'
        active_classics = ""
        active_heritage = ""
        active_designer = ""
    elif page_name == "classics.html":
        title_tag = "Classics | ALVIS ORIGINALS"
        h1_text = "Classics"
        active_all = ""
        active_classics = 'class="active"'
        active_heritage = ""
        active_designer = ""
    elif page_name == "heritage.html":
        title_tag = "Heritage | ALVIS ORIGINALS"
        h1_text = "Heritage"
        active_all = ""
        active_classics = ""
        active_heritage = 'class="active"'
        active_designer = ""
    else:
        title_tag = "Designer | ALVIS ORIGINALS"
        h1_text = "Designer"
        active_all = ""
        active_classics = ""
        active_heritage = ""
        active_designer = 'class="active"'

    next_series_map = {
        "shop.html": "classics.html",
        "classics.html": "heritage.html",
        "heritage.html": "designer.html",
        "designer.html": "shop.html"
    }
    next_series_page = next_series_map[page_name]

    product_cards = ""
    for product in products:
        product_cards += f"""
            <div class="prod-card" data-product-id="{product["id"]}">
                <button class="heart" aria-label="Favorite {product["name"]}" aria-pressed="false">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
                <a href="product.html"><img class="garment" src="{product["image"]}" alt="{product["name"]}"></a>
                <h3>{product["name"]}</h3>
                <p class="price">{product["price"]}</p>
                <button class="btn-add">Add to Cart</button>
            </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_tag}</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <style>
        :root {{
            --store-bg: #e2d8c9;
            --card-bg: #eae3d6;
        }}
        body {{
            background-color: #fff;
            padding-top: 50px;
        }}
        .navbar {{
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: none;
        }}
        .store-hero {{
            background-color: var(--store-bg);
            position: relative;
            padding: 5.1rem 6rem 7rem;
            overflow: hidden;
        }}
        .hero-left {{
            position: relative;
            z-index: 3;
            max-width: 560px;
        }}
        .hero-left h1 {{
            font-family: "Georgia", "Times New Roman", serif;
            font-size: 5rem;
            font-weight: 400;
            margin: 0 0 0.5rem;
            color: #111;
            letter-spacing: -0.01em;
        }}
        .hero-nav {{
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 4;
            position: relative;
            margin-top: 0.9rem;
            font-size: 1rem;
            font-weight: 500;
            flex-wrap: wrap;
        }}
        .hero-nav a {{
            text-decoration: none;
            color: #111;
            padding-bottom: 5px;
        }}
        .hero-nav a.active {{
            border-bottom: 2px solid #111;
            font-weight: 700;
        }}
        .hero-nav span.sep {{
            color: #777;
            font-weight: 300;
        }}
        .slider-next {{
            position: absolute;
            right: 3rem;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            z-index: 5;
        }}
        .store-grid-container {{
            max-width: 1400px;
            margin: -65px auto 6rem;
            padding: 0 2rem;
            position: relative;
            z-index: 10;
        }}
        .store-grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }}
        .prod-card {{
            background-color: var(--card-bg);
            border-radius: 20px;
            padding: 2.5rem 1.5rem 1.5rem;
            position: relative;
            text-align: center;
            transition: transform 0.3s;
        }}
        .prod-card:hover {{
            transform: translateY(-6px);
        }}
        .prod-card .heart {{
            position: absolute;
            top: 1.1rem;
            right: 1.1rem;
            opacity: 0.7;
            cursor: pointer;
        }}
        .prod-card img.garment {{
            width: 100%;
            height: 200px;
            object-fit: contain;
            mix-blend-mode: multiply;
            margin-bottom: 2rem;
        }}
        .prod-card h3 {{
            font-size: 13px;
            font-weight: 500;
            margin: 0 0 0.3rem;
            color: #111;
        }}
        .prod-card p.price {{
            font-size: 13px;
            font-weight: 700;
            margin: 0 0 1rem;
            color: #111;
        }}
        .prod-card .btn-add {{
            background: #000;
            color: #fff;
            border: none;
            padding: 8px 24px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }}
        @media (max-width: 1200px) {{
            .store-grid {{
                grid-template-columns: repeat(3, 1fr);
            }}
        }}
        @media (max-width: 900px) {{
            .store-grid {{
                grid-template-columns: repeat(2, 1fr);
            }}
            .hero-left h1 {{
                font-size: 3.6rem;
            }}
        }}
        @media (max-width: 768px) {{
            .store-hero {{
                padding: 2.35rem 1.2rem 1.45rem;
                text-align: center;
            }}
            .hero-left {{
                max-width: 100%;
            }}
            .hero-left h1 {{
                font-size: 2.75rem;
            }}
            .hero-nav {{
                margin-top: 0.35rem;
                justify-content: center;
                flex-wrap: wrap;
                font-size: 0.95rem;
                gap: 0.6rem;
            }}
            .slider-next {{
                display: none;
            }}
            .store-grid-container {{
                margin: 1.2rem auto 4rem;
                padding: 0 0.85rem;
            }}
        }}
        @media (max-width: 600px) {{
            .store-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-links">
            <a href="shop.html">Store</a>
            <div class="nav-dropdown">
                <a href="#" style="cursor: pointer;">Series</a>
                <div class="dropdown-content">
                    <a href="classics.html">Classics</a>
                    <a href="heritage.html">Heritage</a>
                    <a href="designer.html">Designer</a>
                </div>
            </div>
        </div>
        <div class="nav-logo"><a href="index.html"><h1>ΛLVIS</h1></a></div>
        <div class="nav-actions">
            <div class="nav-links nav-links-right">
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
            </div>
            <button class="nav-icon-link nav-icon-button" data-panel-toggle="search" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"></circle>
                    <path d="M20 20L16.65 16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
            </button>
            <button class="nav-icon-link nav-icon-button" data-panel-toggle="bag" aria-label="Bag">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 8.5h12l-1 11H7l-1-11z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <path d="M9 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
                <span class="nav-icon-badge" data-cart-count>0</span>
            </button>
            <button class="mobile-nav-toggle" aria-label="Toggle Navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    <div class="mobile-nav-overlay" id="mobile-nav-overlay">
        <a href="shop.html">Store</a>
        <div class="mobile-series-group">
            <span class="mobile-series-label">Series</span>
            <a href="classics.html">Classics</a>
            <a href="heritage.html">Heritage</a>
            <a href="designer.html">Designer</a>
        </div>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </div>
{panel_markup}
    <div class="store-hero fade-trigger">
        <div class="hero-left">
            <h1>{h1_text}</h1>
        </div>
        <div class="hero-nav">
            <a href="shop.html" {active_all}>All</a><span class="sep">|</span>
            <a href="classics.html" {active_classics}>Classics</a><span class="sep">|</span>
            <a href="heritage.html" {active_heritage}>Heritage</a><span class="sep">|</span>
            <a href="designer.html" {active_designer}>Designer</a>
        </div>
        <div class="slider-next" data-next-series="{next_series_page}" aria-label="Next series">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </div>
    </div>

    <div class="store-grid-container fade-trigger">
        <div class="store-grid">
{product_cards}
        </div>
    </div>

    <footer style="background: #f5f5f7; padding: 4rem 0 2rem; margin-top: 4rem; font-size: 12px; color: #86868b; line-height: 1.6; font-family: var(--font-primary, sans-serif);">
        <div class="container">
            <div style="border-bottom: 1px solid #d2d2d7; padding-bottom: 2rem; margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between;">
                <div style="max-width: 300px;">
                    <h3 style="font-size: 14px; color: var(--color-text); margin-bottom: 1rem;">ALVIS ORIGINALS</h3>
                    <p>Elegance redefined. Shop safely and securely with Alvis Originals. All collections are limited edition. Free express local delivery available.</p>
                </div>
                <div style="display: flex; gap: 4rem;">
                    <div>
                        <h4 style="font-size: 12px; color: var(--color-text); margin-bottom: 1rem;">Shop</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <a href="shop.html">All Garments</a>
                            <a href="classics.html">Classics</a>
                            <a href="heritage.html">Heritage</a>
                            <a href="designer.html">Designer</a>
                        </div>
                    </div>
                    <div>
                        <h4 style="font-size: 12px; color: var(--color-text); margin-bottom: 1rem;">Company</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <a href="about.html">About Us</a>
                            <a href="contact.html">Contact Support</a>
                            <a href="privacy.html">Privacy Policy</a>
                            <a href="terms.html">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <p>Copyright © 2026 ALVIS Inc. All rights reserved.</p>
                <div style="display: flex; gap: 1.5rem;">
                    <a href="https://instagram.com/alvisoriginals">Instagram</a>
                </div>
            </div>
        </div>
    </footer>
    <script src="js/app.js"></script>
</body>
</html>"""

    with open(os.path.join(base_dir, page_name), "w", encoding="utf-8") as generated_file:
        generated_file.write(html)
