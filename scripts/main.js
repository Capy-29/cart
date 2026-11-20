class Cart{
    constructor(){
        this.content = {};
        this.totalPrice = 0;
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
        document.getElementById("total").textContent = `total: ${this.totalPrice}`;
    }

    add(itemId){
        if(!this.content[itemId]){
            this.content[itemId] = 0;
        }
        this.content[itemId] += 1;
        this.totalPrice += catalog[itemId]["price"]

        this.update();
    }

    remove(itemId){
        if(!this.content[itemId]){
            this.content[itemId] = 0;
        }
        this.content[itemId] -= 1;
        this.totalPrice -= catalog[itemId]["price"]

        this.update();
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
const response = get("/data?name=catalog.json").then((value) => {
    catalog = value;
    updateScreen();
    updateFilder();
})

function updateScreen(selector = false){
    for(child of screen.children){
        document.dele
    }
    let items;
    if(selector){
        items = [];
        for(item_id of selector){
            items.push(catalog[item_id]);
        }
    }
    else{
        items = catalog;
    }

    for(const item of items){
        for(const tag of item["tags"]){
            if(!tag_map[tag]){
                tag_map[tag] = [];
            }
            tag_map[tag].push(item["index"]);
        }

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
filderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = [];
    for(const child of filderField.children){
        const checkbox = child.firstChild;
        if(checkbox.checked){
            items.push(...tag_map[checkbox.value]);
        }
    }
    updateScreen(items);
})

const cartSwitch = document.getElementById("filderSwitch");
cartSwitch.addEventListener("click", (e) => {
    toogleFilder();
})

