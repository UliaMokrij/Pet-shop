function getCookieValue(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return "";
}

async function getProducts() {
  try {
    let response = await fetch("store_db.json");
    if (!response.ok) {
      throw new Error("Failed to fetch products: " + response.statusText);
    }
    let products = await response.json();
    console.log("Loaded products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function getCardHTML(product) {
  let productData = JSON.stringify(product);
  return `
    <div class='card' data-id="${product.data_id}">
        <img class='img card-img' src='img/${product.img}' alt=''>
        <div class="card-information">
            <p class='title'>${product.title}</p>
            <p class='price'>${product.price} $</p>
            <a href="#" class="nav-link nav-item buy cart-btn" data-product='${productData}'>
                <i class="fa-solid fa-basket-shopping fa-lg"></i>
            </a>
        </div>
    </div>
  `;
}

function addToCart(event) {
  event.preventDefault();
  const button = event.target.closest(".cart-btn");
  if (!button) {
    console.error(
      "Product data is missing! The clicked element is not the correct button."
    );
    return;
  }
  const productData = button.getAttribute("data-product");
  if (!productData) {
    console.error("Product data is missing! No data-product attribute found.");
    return;
  }
  const product = JSON.parse(productData);
  if (!product || !product.title) {
    console.error("Invalid product data:", product);
    return;
  }
  alert("Product added to the cart!");
  console.log("Added to cart:", product);
  cart.addItem(product);
}

getProducts().then(function (products) {
  let productsList = document.querySelector(".products-list");
  if (productsList) {
    products.forEach(function (product) {
      productsList.innerHTML += getCardHTML(product);
    });
  }
  let buyButtons = document.querySelectorAll(".products-list .cart-btn");
  if (buyButtons) {
    buyButtons.forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  }
});

let cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
  cartBtn.addEventListener("click", function () {
    window.location.assign("cart.html");
  });
}

class ShoppingCart {
  constructor() {
    this.items = {};
    this.cartCounter = document.querySelector(".cart-counter");
    this.cartElement = document.querySelector("#cart-items");
    this.loadCartFromCookies();
  }

  addItem(item) {
    if (this.items[item.title]) {
      this.items[item.title].quantity += 1;
    } else {
      this.items[item.title] = item;
      this.items[item.title].quantity = 1;
    }
    this.updateCounter();
    this.saveCartToCookies();
  }

  updateQuantity(itemTitle, newQuantity) {
    if (this.items[itemTitle]) {
      this.items[itemTitle].quantity = newQuantity;
      if (this.items[itemTitle].quantity == 0) {
        delete this.items[itemTitle];
      }
      this.updateCounter();
      this.saveCartToCookies();
    }
  }

  updateCounter() {
    let count = 0;
    for (let key in this.items) {
      count += this.items[key].quantity;
    }
    if (this.cartCounter) {
      this.cartCounter.innerHTML = count;
    }
  }

  saveCartToCookies() {
    let cartJSON = JSON.stringify(this.items);
    document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }

  loadCartFromCookies() {
    let cartCookie = getCookieValue("cart");
    if (cartCookie && cartCookie !== "") {
      this.items = JSON.parse(cartCookie);
      this.updateCounter();
    }
  }

  calculateTotal() {
    let total = 0;
    for (let key in this.items) {
      total += this.items[key].price * this.items[key].quantity;
    }
    return total;
  }
}

let cart = new ShoppingCart();