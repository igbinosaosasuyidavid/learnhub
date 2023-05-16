 function addToCart(data,cart) {
    if (cart.some(e => e.id === data.id)) {
    } else {
      cart=[...cart.filter(c => c.id !== data.id), data]
  
    }
    return cart
  
  
  
  
  }
function removeCart(id,cart) {
    return cart.filter((data) => data.id !== id)
  }
  
module.exports={
    addToCart:addToCart,
    removeCart:removeCart
}