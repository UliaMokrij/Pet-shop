// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
  // Розділяємо всі куки на окремі частини
  const cookies = document.cookie.split(";");

  // Шукаємо куки з вказаним ім'ям
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

    // Перевіряємо, чи починається поточне кукі з шуканого імені
    if (cookie.startsWith(cookieName + "=")) {
      // Якщо так, повертаємо значення кукі
      return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
    }
  }
  // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
  return "";
}

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
  let productData = JSON.stringify(product);
  return `
    <div class='card' data-id="${product.data_id}">
        <img class='img card-img' src='img/${product.img}' alt=''>
            <div class="card-information">
                <p class='title'>${product.title}</p>
                <p class='price'>${product.price} $ </p>
                <a href="" class="nav-link nav-item buy cart-btn" id="cartBtn" data-product='${productData}'><i class="fa-solid fa-basket-shopping fa-lg"></i></a>
            </div>
    </div>
          
      `;
}

//Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
  // Отримуємо дані про товар з data-атрибута кнопки
  const productData = event.target.getAttribute("data-product");
  const product = JSON.parse(productData);
  alert("Товар додано в кошик ");
  console.log(product);
  // Додаємо товар до кошика
  cart.addItem(product);
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
  let buyButtons = document.querySelectorAll(".products-list .cart-btn");
  // Навішуємо обробник подій на кожну кнопку "Купити"
  if (buyButtons) {
    buyButtons.forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  }
});

// Отримуємо кнопку "Кошик"
let cartBtn = document.getElementById("cartBtn");

//клік на кнопку "Кошик"
cartBtn.addEventListener("click", function () {
  window.location.assign("cart.html");
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