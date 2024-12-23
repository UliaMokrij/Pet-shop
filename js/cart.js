let orderBtn = document.querySelector("#orderBtn");
let orderSection = document.querySelector(".order");

let cart_list = document.querySelector(".cart-items-list");
let cart_total = document.querySelector(".cart-total");

orderBtn.addEventListener("click", function () {
  orderBtn.style.display = "none";
  orderSection.style.display = "block";
});

function get_item(item) {
  return `<div class = "cart-item" style='background-color: white;margin-bottom:20px;padding:0vw 4vw;border-radius:30px;display:flex;justify-content: space-between;align-items:center;width:80vw'>
        <h4 class="cart-item-title">${item.title}</h4>
        <img src="img/${item.img}" width="100vw"/>
        <div class="cart-item-quantity">Quantity: 
        <input data-item="${
          item.title
        }" class="form-control quantity-input" type="number" name="quantity" min="1" value="${
    item.quantity
  }">
        </div>
        <div class="cart-item-price" data-price="${item.price}"> ${item.price * item.quantity} $ </div>
        </div>`;
}

function showCartList() {
  cart_list.innerHTML = "";
  for (let key in cart.items) {
    // проходимося по всіх ключах об'єкта cart.items
    cart_list.innerHTML += get_item(cart.items[key]);
  }
  cart_total.innerHTML = cart.calculateTotal();
}

showCartList();

cart_list.addEventListener("change", (event) => {
  let target = event.target;
  const itemTitle = target.getAttribute("data-item");
  const newQuantity = +target.value;
  if (newQuantity > 0) {
    cart.updateQuantity(itemTitle, newQuantity);
    showCartList(); // Оновити список товарів у кошику
  }
});
