class Cart{
    constructor(){
        this.content = {};
    }

    add(itemId){
        if(!cart.content[itemId]){
            cart.content[itemId] = 0;
        }
        cart.content[itemId] += 1;
    }

    remove(itemId){
        cart.content[itemId] -= 1;
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

const response = get("/data?name=catalog.json").then((value) => {
    const screen = document.getElementById("screen");
    for(const item of value){
        const template = document.createElement("template");
        template.innerHTML = 
`
<div class = "item";>
    <div class="image_container">
        <img src="${item["image"]}" alt="Item">
    </div>
    <h1>${item["name"]}</h1>
    <p>${item["price"]}</p>
    <button onclick="cart.add(${item["index"]}); console.log(cart.content);">Add to cart</button>
</div>
`
        const element = template.content.firstElementChild;
        screen.append(element);
    }
})