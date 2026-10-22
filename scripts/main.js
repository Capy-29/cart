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