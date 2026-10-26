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
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhgLbMsmN8e5xdiuUkPylNLeMPrRy2UeVJo10RZ8PQLrggEpHUOih6ZMXPBFtUFPaUTum8jovHHd_GSqeGtZJWtxCqjTehPw-kgfgri_I&s=10" alt="capy">
    </div>
    <h1>${item["name"]}</h1>
    <p>${item["price"]}</p>
    <button onclick="cart.add(${item["id"]}); console.log(cart.content);">Add to cart</button>
</div>
`
        const element = template.content.firstElementChild;
        screen.append(element);
    }
})