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
                <button class="nav-item basket " id="cartBtn">
                    <a class="nav-link" href="#" data-product="${productData}><i class="fa-solid fa-basket-shopping fa-lg"></i></a>
                </button>
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
});