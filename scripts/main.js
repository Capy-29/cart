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
            if(n){
                const name = catalog[id]["name"];
                
                const li = document.createElement("li");
                li.setAttribute("class", "cart__ul__li");

                const p = document.createElement("p");
                p.setAttribute("class", "cart__ul__li__p")
                p.textContent = `${name}: ${n}`;
                li.appendChild(p);

                const removeButton = document.createElement("button");
                removeButton.textContent = "remove"
                removeButton.setAttribute("class", "cart__ul__li__button");
                removeButton.addEventListener("click", event => {
                    this.remove(id);
                });

                li.append(removeButton);
                cartList.appendChild(li);
            }
        }
        document.getElementById("total").textContent = `total: ${this.totalPrice()}`;
    }

    add(itemId){
        if(!this.content[itemId]){
            this.content[itemId] = 0;
        }
        this.content[itemId] += 1;

        this.update();
    }

    remove(itemId){
        if(!this.content[itemId]){
            this.content[itemId] = 0;
        }
        this.content[itemId] -= 1;

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
        const template = document.createElement("template");
        template.insertAdjacentHTML("beforeend",
`
<div class = "item";>
    <div class="image_container">
        <img src="${item["image"]}" alt="Item">
    </div>
    <h1>${item["name"]}</h1>
    <p>${item["price"]}</p>
</div>
`
        );
        const html = template.firstElementChild;

        const buyButton = document.createElement("button");
        buyButton.addEventListener("click", (e) =>{
            cart.add(item["index"]);
        })
        buyButton.textContent = "Add to cart";

        html.appendChild(buyButton);
        screen.appendChild(html);
    }
})

const cartSwitch = document.getElementById("cartSwitch");
cartSwitch.addEventListener("click", (e) => {
    toogleCart();
})