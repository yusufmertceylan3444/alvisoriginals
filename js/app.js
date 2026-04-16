document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.fade-trigger, .apple-section, .promo-card, .product-item');

  reveals.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Video toggle logic
  const heroVideo = document.getElementById('hero-video');
  const videoToggle = document.getElementById('video-toggle');
  const iconPause = document.getElementById('icon-pause');
  const iconPlay = document.getElementById('icon-play');

  if (heroVideo && videoToggle) {
    videoToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (heroVideo.paused) {
        heroVideo.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        heroVideo.pause();
        iconPause.style.display = 'none';
        iconPlay.style.display = 'block';
      }
    });
  }

  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');

  if (mobileToggle && mobileOverlay) {
    const closeMobileMenu = () => {
      mobileToggle.classList.remove('active');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', () => {
      const willOpen = !mobileOverlay.classList.contains('open');
      mobileToggle.classList.toggle('active', willOpen);
      mobileOverlay.classList.toggle('open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileOverlay.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  const storageKeys = {
    cart: 'alvis-cart'
  };

  const readState = (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : [];
    } catch (_error) {
      return [];
    }
  };

  const writeState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  let cart = readState(storageKeys.cart);
  let favorites = readState(storageKeys.favorites || 'alvis-favorites');

  const panelBackdrop = document.querySelector('[data-panel-backdrop]');
  const searchPanel = document.querySelector('[data-panel="search"]');
  const searchField = document.querySelector('.search-field');
  const bagPanel = document.querySelector('[data-panel="bag"]');
  const panelTriggers = document.querySelectorAll('[data-panel-toggle]');
  const bagTrigger = document.querySelector('[data-panel-toggle="bag"]');
  const cartBadge = document.querySelector('[data-cart-count]');
  const cartList = document.querySelector('[data-cart-list]');
  const bagEmptyState = document.querySelector('[data-bag-empty]');
  const bagReviewSection = document.querySelector('[data-bag-review]');
  const productCards = document.querySelectorAll('.prod-card');

  const normalizeProduct = (product) => ({
    id: product.id || product.name.toLowerCase().replace(/\s+/g, '-'),
    name: product.name || 'ALVIS Product',
    price: product.price || '$0.00',
    image: product.image || 'images/couples.png'
  });

  const closePanels = () => {
    if (searchPanel) {
      searchPanel.classList.remove('open');
    }
    if (bagPanel) {
      bagPanel.classList.remove('open');
    }
    if (panelBackdrop) {
      panelBackdrop.hidden = true;
      panelBackdrop.classList.remove('open');
    }
    document.body.classList.remove('panel-open');
  };

  const openPanel = (panelName) => {
    if (!panelBackdrop) {
      return;
    }
    closePanels();
    const panel = panelName === 'search' ? searchPanel : bagPanel;
    if (!panel) {
      return;
    }
    panelBackdrop.hidden = false;
    panelBackdrop.classList.add('open');
    panel.classList.add('open');
    document.body.classList.add('panel-open');
  };

  const productMarkup = (item) => `
    <li class="bag-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="bag-item-meta">
        <p>${item.name}</p>
        <span>${item.price}</span>
      </div>
    </li>
  `;

  const updatePanelData = () => {
    if (cartBadge) {
      cartBadge.textContent = String(cart.length);
      cartBadge.classList.toggle('has-items', cart.length > 0);
    }
    if (cartList) {
      cartList.innerHTML = cart.length
        ? cart.map((item) => productMarkup(item)).join('')
        : '<li class="bag-placeholder">Your bag is currently empty.</li>';
    }
    if (bagEmptyState) {
      bagEmptyState.style.display = cart.length ? 'none' : 'block';
    }
    if (bagReviewSection) {
      bagReviewSection.classList.toggle('has-items', cart.length > 0);
    }
  };

  const setFavoriteVisualState = () => {
    productCards.forEach((card) => {
      const product = getProductFromCard(card);
      const heart = card.querySelector('.heart');
      if (!heart || !product) {
        return;
      }
      const active = favorites.some((item) => item.id === product.id);
      heart.classList.toggle('active', active);
      heart.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const getProductFromCard = (card) => {
    if (!card) {
      return null;
    }
    const title = card.querySelector('h3')?.textContent?.trim();
    const price = card.querySelector('.price')?.textContent?.trim();
    const image = card.querySelector('img.garment')?.getAttribute('src');
    if (!title || !price || !image) {
      return null;
    }
    return normalizeProduct({
      id: card.dataset.productId || title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price,
      image
    });
  };

  const animateProductToBag = (sourceImage) => {
    if (!sourceImage || !bagTrigger) {
      return Promise.resolve();
    }

    const sourceRect = sourceImage.getBoundingClientRect();
    const targetRect = bagTrigger.getBoundingClientRect();
    if (!sourceRect.width || !sourceRect.height) {
      return Promise.resolve();
    }

    const flyImage = sourceImage.cloneNode(true);
    flyImage.classList.add('cart-fly-image');
    const startSize = Math.min(sourceRect.width, sourceRect.height, 120);
    const startX = sourceRect.left + (sourceRect.width - startSize) / 2;
    const startY = sourceRect.top + (sourceRect.height - startSize) / 2;
    flyImage.style.width = `${startSize}px`;
    flyImage.style.height = `${startSize}px`;
    flyImage.style.left = `${startX}px`;
    flyImage.style.top = `${startY}px`;
    flyImage.style.transform = 'translate3d(0, 0, 0) scale(1)';
    flyImage.style.opacity = '1';
    document.body.appendChild(flyImage);

    const deltaX = targetRect.left + (targetRect.width / 2) - (startX + startSize / 2);
    const deltaY = targetRect.top + (targetRect.height / 2) - (startY + startSize / 2);

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        flyImage.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.16)`;
        flyImage.style.opacity = '0.25';
      });

      window.setTimeout(() => {
        flyImage.remove();
        bagTrigger.classList.remove('cart-bump');
        void bagTrigger.offsetWidth;
        bagTrigger.classList.add('cart-bump');
        resolve();
      }, 740);
    });
  };

  panelTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const panelName = trigger.getAttribute('data-panel-toggle');
      if (!panelName) {
        return;
      }
      const isOpen = panelName === 'search'
        ? searchPanel?.classList.contains('open')
        : bagPanel?.classList.contains('open');
      if (isOpen) {
        closePanels();
      } else {
        openPanel(panelName);
      }
    });
  });

  document.querySelectorAll('[data-panel-close]').forEach((button) => {
    button.addEventListener('click', closePanels);
  });

  if (panelBackdrop) {
    panelBackdrop.addEventListener('click', closePanels);
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (
      target.closest('.nav-panel') ||
      target.closest('[data-panel-toggle]')
    ) {
      return;
    }
    closePanels();
  });

  // Search functionality
  if (searchField) {
    searchField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const query = searchField.value.trim();
        if (query) {
          window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanels();
    }
  });

  productCards.forEach((card) => {
    const heart = card.querySelector('.heart');
    const addButton = card.querySelector('.btn-add');
    const product = getProductFromCard(card);
    if (!product) {
      return;
    }

    if (heart) {
      heart.addEventListener('click', () => {
        const exists = favorites.some((item) => item.id === product.id);
        favorites = exists
          ? favorites.filter((item) => item.id !== product.id)
          : [...favorites, product];
        writeState(storageKeys.favorites, favorites);
        setFavoriteVisualState();
        updatePanelData();
      });
    }

    if (addButton) {
      addButton.addEventListener('click', () => {
        const productId = card.dataset.productId;
        const productInfo = productData[productId];
        
        if (productInfo && productModalBackdrop) {
          const enhancedProduct = {
            ...product,
            ...productInfo,
            id: productId
          };
          openProductModal(enhancedProduct);
        } else {
          // Fallback to original behavior if product data not found
          cart = [...cart, product];
          writeState(storageKeys.cart, cart);
          const sourceImage = card.querySelector('img.garment');
          animateProductToBag(sourceImage).then(() => {
            updatePanelData();
            openPanel('bag');
          });
        }
      });
    }
  });

  // Product Page functionality
  const productPageAddButton = document.getElementById('productPageAddToBag');
  const productPageWishlist = document.getElementById('productPageWishlist');
  const productPageColorOptions = document.querySelectorAll('.color-option');
  const productPageSizeOptions = document.querySelectorAll('.size-option');

  let productPageSelectedColor = 'White';
  let productPageSelectedSize = 'M';

  // Product page color selection
  productPageColorOptions.forEach(option => {
    option.addEventListener('click', () => {
      productPageSelectedColor = option.getAttribute('data-color');
      document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateProductPageAddToBagButton();
    });
  });

  // Product page size selection
  productPageSizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      productPageSelectedSize = option.getAttribute('data-size');
      document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateProductPageAddToBagButton();
    });
  });

  const updateProductPageAddToBagButton = () => {
    if (productPageAddButton) {
      productPageAddButton.disabled = !productPageSelectedColor || !productPageSelectedSize;
    }
  };

  // Set initial color selection
  if (productPageColorOptions.length > 0) {
    productPageColorOptions[0].classList.add('selected');
  }

  // Product page add to bag functionality
  if (productPageAddButton) {
    productPageAddButton.addEventListener('click', () => {
      const product = normalizeProduct({
        id: 'villa-edition',
        name: document.querySelector('.product-page-name')?.textContent?.trim() || 'Villa Edition',
        price: document.querySelector('.product-page-price')?.textContent?.trim() || '$240.00',
        image: document.querySelector('.product-page-image img')?.getAttribute('src') || 'images/designer_image_1776018332858.png'
      });

      const productWithVariants = {
        ...product,
        selectedColor: productPageSelectedColor,
        selectedSize: productPageSelectedSize,
        variantId: `${product.id}-${productPageSelectedColor}-${productPageSelectedSize}`
      };

      cart = [...cart, productWithVariants];
      writeState(storageKeys.cart, cart);
      
      const sourceImage = document.querySelector('.product-page-image img');
      animateProductToBag(sourceImage).then(() => {
        updatePanelData();
        openPanel('bag');
      });
    });
  }

  // Product page wishlist functionality
  if (productPageWishlist) {
    const product = normalizeProduct({
      id: 'villa-edition',
      name: document.querySelector('.product-page-name')?.textContent?.trim() || 'Villa Edition',
      price: document.querySelector('.product-page-price')?.textContent?.trim() || '$240.00',
      image: document.querySelector('.product-page-image img')?.getAttribute('src') || 'images/designer_image_1776018332858.png'
    });

    const isInWishlist = favorites.some(item => item.id === product.id);
    productPageWishlist.classList.toggle('active', isInWishlist);

    productPageWishlist.addEventListener('click', () => {
      const exists = favorites.some(item => item.id === product.id);
      if (exists) {
        favorites = favorites.filter(item => item.id !== product.id);
        productPageWishlist.classList.remove('active');
      } else {
        favorites = [...favorites, product];
        productPageWishlist.classList.add('active');
      }
      
      writeState(storageKeys.favorites || 'alvis-favorites', favorites);
      setFavoriteVisualState();
      updatePanelData();
    });
  }

  // Fallback for old product page structure
  const oldProductPageAddButton = document.querySelector('button.btn.btn-accent');
  if (oldProductPageAddButton && !productPageAddButton && !productCards.length) {
    oldProductPageAddButton.addEventListener('click', () => {
      const product = normalizeProduct({
        id: document.querySelector('h1')?.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || 'villa-edition',
        name: document.querySelector('h1')?.textContent?.trim() || 'Villa Edition',
        price: document.querySelector('p[style*="font-size: 1.2rem"]')?.textContent?.trim() || '$0.00',
        image: document.querySelector('.product-img-box img')?.getAttribute('src') || 'images/couples.png'
      });
      cart = [...cart, product];
      writeState(storageKeys.cart, cart);
      const sourceImage = document.querySelector('.product-img-box img');
      animateProductToBag(sourceImage).then(() => {
        updatePanelData();
        openPanel('bag');
      });
    });
  }

  const sliderNextButton = document.querySelector('.slider-next');
  if (sliderNextButton) {
    sliderNextButton.addEventListener('click', () => {
      const nextPage = sliderNextButton.getAttribute('data-next-series');
      if (nextPage) {
        window.location.href = nextPage;
      }
    });
  }

  // Product Modal functionality
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const productModal = document.getElementById('productModal');
  const productModalClose = document.getElementById('productModalClose');
  const modalProductImage = document.getElementById('modalProductImage');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductBrand = document.getElementById('modalProductBrand');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const colorOptions = document.getElementById('colorOptions');
  const sizeOptions = document.getElementById('sizeOptions');
  const modalAddToBag = document.getElementById('modalAddToBag');
  const modalWishlist = document.getElementById('modalWishlist');

  let selectedProduct = null;
  let selectedColor = null;
  let selectedSize = null;

  // Sample product data with colors and sizes
  const productData = {
    'heritage-bomber-jacket': {
      name: 'Heritage Bomber Jacket',
      brand: 'ALVIS Originals',
      price: '$179.99',
      image: 'images/heritage_image_1776018757646.png',
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'Navy', value: '#1e3a8a' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'designer-oversized-shirt': {
      name: 'Designer Oversized Shirt',
      brand: 'ALVIS Originals',
      price: '$89.99',
      image: 'images/designer_image_1776018332858.png',
      colors: [
        { name: 'White', value: '#ffffff' },
        { name: 'Blue', value: '#3b82f6' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'classic-essential-tee': {
      name: 'Classic Essential Tee',
      brand: 'ALVIS Originals',
      price: '$49.99',
      image: 'images/classics_image_1776018347519.png',
      colors: [
        { name: 'White', value: '#ffffff' },
        { name: 'Black', value: '#000000' },
        { name: 'Gray', value: '#6b7280' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'heritage-leather-jacket': {
      name: 'Heritage Leather Jacket',
      brand: 'ALVIS Originals',
      price: '$249.99',
      image: 'images/editorial_image_1776019075841.png',
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'Brown', value: '#92400e' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'designer-track-pants': {
      name: 'Designer Track Pants',
      brand: 'ALVIS Originals',
      price: '$79.99',
      image: 'images/hero_image_1776019122064.png',
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'Gray', value: '#6b7280' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'classic-polo-shirt': {
      name: 'Classic Polo Shirt',
      brand: 'ALVIS Originals',
      price: '$39.99',
      image: 'images/classics_image_1776018347519.png',
      colors: [
        { name: 'White', value: '#ffffff' },
        { name: 'Navy', value: '#1e3a8a' },
        { name: 'Red', value: '#dc2626' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'heritage-wool-coat': {
      name: 'Heritage Wool Coat',
      brand: 'ALVIS Originals',
      price: '$199.99',
      image: 'images/heritage_image_1776018757646.png',
      colors: [
        { name: 'Camel', value: '#d97706' },
        { name: 'Black', value: '#000000' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'designer-graphic-tee': {
      name: 'Designer Graphic Tee',
      brand: 'ALVIS Originals',
      price: '$44.99',
      image: 'images/designer_image_1776018332858.png',
      colors: [
        { name: 'White', value: '#ffffff' },
        { name: 'Black', value: '#000000' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }
  };

  const openProductModal = (product) => {
    selectedProduct = product;
    selectedColor = null;
    selectedSize = null;

    // Update modal content
    modalProductImage.src = product.image;
    modalProductImage.alt = product.name;
    modalProductName.textContent = product.name;
    modalProductBrand.textContent = product.brand;
    modalProductPrice.textContent = product.price;

    // Populate color options
    colorOptions.innerHTML = '';
    product.colors.forEach((color, index) => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.style.backgroundColor = color.value;
      colorOption.setAttribute('data-color', color.name);
      colorOption.setAttribute('aria-label', color.name);
      
      if (index === 0) {
        colorOption.classList.add('selected');
        selectedColor = color.name;
      }
      
      colorOption.addEventListener('click', () => selectColor(color.name, colorOption));
      colorOptions.appendChild(colorOption);
    });

    // Populate size options
    sizeOptions.innerHTML = '';
    product.sizes.forEach(size => {
      const sizeOption = document.createElement('div');
      sizeOption.className = 'size-option';
      sizeOption.textContent = size;
      sizeOption.setAttribute('data-size', size);
      
      sizeOption.addEventListener('click', () => selectSize(size, sizeOption));
      sizeOptions.appendChild(sizeOption);
    });

    // Update wishlist button state
    const isInWishlist = favorites.some(item => item.id === product.id);
    modalWishlist.classList.toggle('active', isInWishlist);

    // Update add to bag button state
    updateAddToBagButton();

    // Show modal
    productModalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    productModalBackdrop.hidden = true;
    document.body.style.overflow = '';
    selectedProduct = null;
    selectedColor = null;
    selectedSize = null;
  };

  const selectColor = (colorName, element) => {
    selectedColor = colorName;
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    updateAddToBagButton();
  };

  const selectSize = (size, element) => {
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    updateAddToBagButton();
  };

  const updateAddToBagButton = () => {
    if (modalAddToBag) {
      modalAddToBag.disabled = !selectedColor || !selectedSize;
    }
  };

  // Modal event listeners
  if (productModalClose) {
    productModalClose.addEventListener('click', closeProductModal);
  }

  if (productModalBackdrop) {
    productModalBackdrop.addEventListener('click', (e) => {
      if (e.target === productModalBackdrop) {
        closeProductModal();
      }
    });
  }

  if (modalAddToBag) {
    modalAddToBag.addEventListener('click', () => {
      if (!selectedProduct || !selectedColor || !selectedSize) return;

      const productWithVariants = {
        ...selectedProduct,
        selectedColor,
        selectedSize,
        variantId: `${selectedProduct.id}-${selectedColor}-${selectedSize}`
      };

      cart = [...cart, productWithVariants];
      writeState(storageKeys.cart, cart);
      
      const sourceImage = modalProductImage;
      animateProductToBag(sourceImage).then(() => {
        updatePanelData();
        closeProductModal();
        openPanel('bag');
      });
    });
  }

  if (modalWishlist) {
    modalWishlist.addEventListener('click', () => {
      if (!selectedProduct) return;

      const exists = favorites.some(item => item.id === selectedProduct.id);
      if (exists) {
        favorites = favorites.filter(item => item.id !== selectedProduct.id);
        modalWishlist.classList.remove('active');
      } else {
        favorites = [...favorites, selectedProduct];
        modalWishlist.classList.add('active');
      }
      
      writeState(storageKeys.favorites || 'alvis-favorites', favorites);
      setFavoriteVisualState();
      updatePanelData();
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !productModalBackdrop.hidden) {
      closeProductModal();
    }
  });

  updatePanelData();
  setFavoriteVisualState();
});
