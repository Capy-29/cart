class Cart{
    constructor(){
        this.content = {};
        for(let i = 0; i < 20; i++){
            this.content[i] = 0;
        }

        this.totalPrice = 0;
        this.discount = 1;
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
        const final_price = Math.round(this.totalPrice * this.discount * 100) / 100;
        document.getElementById("total").textContent = `total: ${final_price}`;
    }

    add(itemId){
        this.content[itemId] += 1;
        this.totalPrice += catalog[itemId]["price"]
        this.update();
        updateScreen(selector);
    }

    remove(itemId){
        this.content[itemId] -= 1;
        this.totalPrice -= catalog[itemId]["price"]
        this.update();
        updateScreen(selector);
    }
}

function toogleFilder(){
    cartElement = document.getElementById("filter_search");
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

const tag_map = {};
var catalog;
const screen = document.getElementById("screen");
const response = get("catalog.json").then((value) => {
    catalog = value;

    for(const item of catalog){
        for(const tag of item["tags"]){
            if(!tag_map[tag]){
                tag_map[tag] = [];
            }
            tag_map[tag].push(item["index"]);
        }
    }
    updateScreen();
    updateFilder();
})

var cards;
function updateScreen(selector = false){
    screen.innerHTML="";
    let items;
    if(selector){
        items = new Set();  
        for(item_id of selector){
            items.add(catalog[item_id]);
        }
    }
    else{
        items = catalog;
    }

    cards = {};
    for(const item of items){
        const template = document.createElement("template");
        template.insertAdjacentHTML("beforeend",
`
<div class = "item";>
    <div class="image_container">
        <img src="${item["image"]}" alt="Item">
    </div>
    <h1>${item["name"]}</h1>
    <p>price: ${item["price"]}</p>
    <p>in stock: ${item["stock"]}</p>
</div>
`
        );
        const html = template.firstElementChild;

        if(cart.content[item["index"]] < item["stock"]){
            const buyButton = document.createElement("button");
            buyButton.addEventListener("click", (e) =>{
                cart.add(item["index"]);
            })
            buyButton.textContent = "Add to cart";
            html.appendChild(buyButton);
        }
        else{
            const error = document.createElement("p");
            error.setAttribute("class", "error");
            error.textContent = "out of stock!";
            html.appendChild(error);
        }

        screen.appendChild(html);
        cards[item["index"]] = html;
    }
}
function updateFilder(){
    const field = document.getElementById("filter_search__field");
    for(const tag of Object.keys(tag_map)){
        label = document.createElement("label");
        input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", tag);
        label.textContent = tag;

        label.prepend(input);
        field.appendChild(label);
    }
}


const filderForm = document.getElementById("filter_search__form");
const filderField = document.getElementById("filter_search__field");
var selector;
filderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = [];
    for(const child of filderField.children){
        const checkbox = child.firstChild;
        if(checkbox.checked){
            items.push(...tag_map[checkbox.value]);
        }
    }
    if(items.length === 0){
        updateScreen(false)
    }
    else{
        updateScreen(items);
    }
    selector = items;
})

const cartSwitch = document.getElementById("filderSwitch");
cartSwitch.addEventListener("click", (e) => {
    toogleFilder();
})

discount_codes = {
    "lorem": 0.9,
    "ipsum": 0.7,
    "dolor": 0.5
}
document.getElementById("discount_code_form").addEventListener("submit", (event) => {
    event.preventDefault();
    const code = document.getElementById("discount_code_input").value;
    
    if(Object.keys(discount_codes).includes(code)){
        document.getElementById("discount_code_error").style.display = "none";
        cart.discount = discount_codes[code];
        cart.update();
    }
    else{
        document.getElementById("discount_code_error").style.display = "block";
    }
})