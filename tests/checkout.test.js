
var cart = [{
    id: "h7f8hggvbfrb",
    title: "TEster",
    price: "10$"
}]


test('heckout cart list is not empty', () => {
    expect(cart.length).not.toBe(0);
});

let response_url = "https://checkout.stripe.com/ckey=ebvrbrbrbrbbf"
test('testing that users are redirected to stripe', () => {
    expect(response_url).toMatch(/checkout.stripe.com/);
});
