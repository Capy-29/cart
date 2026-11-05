class Cart{
    constructor(){
        this.content = {};
    }

    update(){
        const cartList = document.getElementById("cart-list");
        while (cartList.firstChild) {
            cartList.removeChild(cartList.firstChild);
        }

        for(const [id, n] of Object.entries(this.content)){
            const name = catalog[id]["name"];
            const li = document.createElement("li");
            const text = document.createTextNode(`${name}: ${n}`);
            li.appendChild(text);
            const removeButton = document.createElement("button");
            removeButton.onclick="cart.remove();";
            li.append(removeButton);
            cartList.appendChild(li);
        }
        document.getElementById("total").textContent = `total: ${this.totalPrice()}`;
    }

    add(itemId){
        if(!cart.content[itemId]){
            cart.content[itemId] = 0;
        }
        cart.content[itemId] += 1;

        this.update();
    }

    remove(itemId){
        if(!cart.content[itemId]){
            cart.content[itemId] = 0;
        }
        cart.content[itemId] -= 1;

        this.update();
    }

    totalPrice(){
        let total = 0;
        for(const [id, n] of Object.entries(this.content)){
            const price = catalog[id]["price"];
            total += price * n;
        }
        return total;
    }
}

function filter(arr, category, value){
    const res = [];
    for(const item of arr){
        if(item[category] === value){
            res.push(item)
        }
    }
    return res;
}

function toogleCart(){
    cartElement = document.getElementById("cart");
    if(cartElement.style.display === "block"){
        cartElement.style.display = "none";
    }
    else{
        cartElement.style.display = "block";
    }
}


const cart = new Cart();

async function get(url) {
    const response = await fetch(url);
    return await response.json();
}

var catalog;
const response = get("/data?name=catalog.json").then((value) => {
    catalog = value;
    const screen = document.getElementById("screen");
    for(const item of catalog){
        screen.insertAdjacentHTML("beforeend",
`
<div class = "item";>
    <div class="image_container">
        <img src="${item["image"]}" alt="Item">
    </div>
    <h1>${item["name"]}</h1>
    <p>${item["price"]}</p>
    <button onclick="cart.add(${item["index"]}); console.log(cart.content);">Add to cart</button>
</div>
`);
    }
})