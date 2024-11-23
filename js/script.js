document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const home_btn = document.querySelector(".home_btn");

    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            const cardId = card.getAttribute("data-id");
            window.location.href = `details.html?id=${cardId}`;
        });
    });
    home_btn.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});

async function getProducts() {
    // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
    let response = await fetch("store_db.json");
    // Очікуємо на отримання та розпакування JSON-даних з відповіді
    let products = await response.json();
    console.log(products)
    // Повертаємо отримані продукти
    return products;
}

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    let productData=JSON.stringify(product)
    return `
  <div class='card' data-id="${product.data_id}">
        <img class='img card-img' src='img/${product.img}' alt=''>
            <div class="card-information">
                <p class='title'>${product.title}</p>
                    <a class="nav-link nav-item basket cart-btn" id="cartBtn href="#" data-product="${productData}><i class="fa-solid fa-basket-shopping fa-lg"></i></a>
                <p class='price'>${product.price}</p>
            </div>
    </div>
            
        `;
}

getProducts().then(function (products) {
    let productsList = document.querySelector(".products-list");
    if (productsList) {
        products.forEach(function (product) {
            // Відображаємо товари на сторінці
            productsList.innerHTML += getCardHTML(product);
        });
    }
    // Отримуємо всі кнопки "Купити"
    let buyButtons=document.querySelectorAll(".products-list .cart-btn")
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if(buyButtons){
        buyButtons.forEach(function(button){
            button.addEventListener("click", addToCart)
        })
    }
});

// Отримуємо кнопку "Кошик"
let cartBtn = document.getElementById("cartBtn");

//клік на кнопку "Кошик"
cartBtn.addEventListener("click", function () {
window. location.assign("cart.html");
});

// Створення класу кошика
class ShoppingCart {
    constructor() {
      this.items = {};//усі товари кошика
      this.cartCounter = document.querySelector(".cart-counter"); // отримуємо лічильник кількості товарів у кошику
      this.cartElement = document.querySelector("#cart-items");
      this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }
  
    // Додавання товару до кошика
    addItem(item) {
      if (this.items[item.title]) {
        this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
      } else {
        this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
        this.items[item.title].quantity = 1;
      }
      this.updateCounter(); // Оновлюємо лічильник товарів
      this.saveCartToCookies();
    }
  
    // Зміна кількості товарів товарів
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
  
    // Оновлення лічильника товарів
    updateCounter() {
      let count = 0;
      for (let key in this.items) {
        // проходимося по всіх ключах об'єкта this.items
        count += this.items[key].quantity; // рахуємо кількість усіх товарів
      }
      this.cartCounter.innerHTML = count; // оновлюємо лічильник на сторінці
    }
  
    // Зберігання кошика в кукі
    saveCartToCookies() {
      let cartJSON = JSON.stringify(this.items);
      document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }
  
    // Завантаження кошика з кукі
    loadCartFromCookies() {
      let cartCookie = getCookieValue("cart");
      if (cartCookie && cartCookie !== "") {
        this.items = JSON.parse(cartCookie);
        this.updateCounter();
      }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
      let total = 0;
      for (let key in this.items) {
        // проходимося по всіх ключах об'єкта this.items
        total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
      }
      return total;
    }
  }
  
  // Створення об'єкта кошика
  let cart = new ShoppingCart();

