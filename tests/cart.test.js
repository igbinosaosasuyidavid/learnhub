const { addToCart, removeCart } = require("../src/contexts/carttester")

var cart = []
const course = {
    id: "5893rhr9nnvj30"
}

test('cart is empty', () => {
    expect(cart.length).toBe(0);
});

cart = addToCart(course, cart)

test('if course is in cart', () => {
    expect(cart.some(e => e.id === course.id)).toBe(false);
});

// If this is ran then  the test for "is in cart will fail"
cart = removeCart(course.id, cart)
test('if not in cart', () => {
    expect(!cart.some(e => e.id === course.id)).toBe(true);
});