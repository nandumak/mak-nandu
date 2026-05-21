// Product Database
const PRODUCTS = [
  {
    id: 1,
    name: "Stride Max Air",
    category: "Sneakers",
    price: 120,
    sizes: [8, 9, 10],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Cyber Ranger Boot",
    category: "Boots",
    price: 160,
    sizes: [9, 10, 11],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Speed Cleat Elite",
    category: "Cleats",
    price: 140,
    sizes: [7, 8, 9],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Easy Slide Slipper",
    category: "Chapels",
    price: 45,
    sizes: [6, 7, 8],
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Urban Classic Sneaker",
    category: "Sneakers",
    price: 75,
    sizes: [6, 7, 8, 9, 10],
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "Trekker Mountain Boot",
    category: "Boots",
    price: 180,
    sizes: [8, 9, 10, 11],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
  }
];

let cart = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupCartEvents();
  setupFilterEvents();
});

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const sizeFilter = document.getElementById("sizeFilter").value;
  const sortFilter = document.getElementById("sortFilter").value;
  const maxPrice = parseFloat(document.getElementById("priceRange").value);
  const resultCount = document.getElementById("resultCount");
  
  if (!grid) return;

  // Filter products
  let filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchInput);
    const matchesSize = sizeFilter === "all" || p.sizes.includes(parseInt(sizeFilter));
    const matchesPrice = p.price <= maxPrice;
    
    return matchesCategory && matchesSearch && matchesSize && matchesPrice;
  });

  // Sort products
  if (sortFilter === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortFilter === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortFilter === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Update counts
  resultCount.innerText = `${filtered.length} products found`;

  // Draw grid
  grid.innerHTML = "";
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No footwear matching your search or filters was found.</div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    
    card.innerHTML = `
      <figure>
        <span class="badge">${p.category}</span>
        <img src="${p.image}" alt="${p.name}">
      </figure>
      <div class="product-info">
        <div class="product-title-row">
          <h3>${p.name}</h3>
          <strong>$${p.price}</strong>
        </div>
        <div class="meta">
          <span class="stars">★ ${p.rating}</span>
          <span>Sizes: ${p.sizes.join(", ")}</span>
        </div>
        <button class="add-button" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter Event Listeners
function setupFilterEvents() {
  const tiles = document.querySelectorAll(".collection-tile");
  const searchInput = document.getElementById("searchInput");
  const sizeFilter = document.getElementById("sizeFilter");
  const sortFilter = document.getElementById("sortFilter");
  const priceRange = document.getElementById("priceRange");
  const priceLabel = document.getElementById("priceLabel");

  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      tiles.forEach(t => t.classList.remove("active"));
      tile.classList.add("active");
      activeCategory = tile.getAttribute("data-category");
      renderProducts();
    });
  });

  if (searchInput) searchInput.addEventListener("input", renderProducts);
  if (sizeFilter) sizeFilter.addEventListener("change", renderProducts);
  if (sortFilter) sortFilter.addEventListener("change", renderProducts);
  
  if (priceRange) {
    priceRange.addEventListener("input", () => {
      priceLabel.innerText = `$${priceRange.value}`;
      renderProducts();
    });
  }
}

// Cart Mechanics
function setupCartEvents() {
  const cartBtn = document.querySelector(".cart-button");
  const closeCart = document.getElementById("closeCart");
  const cartPanel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");

  if (cartBtn && cartPanel && overlay) {
    cartBtn.addEventListener("click", () => {
      cartPanel.classList.add("open");
      cartPanel.setAttribute("aria-hidden", "false");
      overlay.classList.add("show");
    });
  }

  const closeFn = () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    overlay.classList.remove("show");
  };

  if (closeCart) closeCart.addEventListener("click", closeFn);
  if (overlay) overlay.addEventListener("click", closeFn);
}

// Add Item
window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }

  updateCartUI();
  
  // Auto open cart panel on add
  const cartPanel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  if (cartPanel && overlay) {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    overlay.classList.add("show");
  }
};

// Remove or Decrement Item
window.changeQty = function(productId, delta) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }

  updateCartUI();
};

// Update Cart DOM
function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartCount || !cartTotal) return;

  // Update counts
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  cartCount.innerText = totalItems;
  cartTotal.innerText = `$${totalPrice}`;

  // Draw items
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = `<div style="text-align:center; padding: 40px 0; color: #656b73;">Your shopping cart is empty.</div>`;
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.product.image}" alt="${item.product.name}">
      <div>
        <h3>${item.product.name}</h3>
        <p>$${item.product.price}</p>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="qty-button" onclick="changeQty(${item.product.id}, -1)">-</button>
        <strong>${item.qty}</strong>
        <button class="qty-button" onclick="changeQty(${item.product.id}, 1)">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });
}
