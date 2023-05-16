function passwordEqual(password1, password2) {
    if (password1 === password2) {
        return true
    } else {
        return false
    }
}

let userPassword = '1234567'
let confirmUserPassword = '1234567'
test('password the same', () => {
    expect(passwordEqual(userPassword, confirmUserPassword)).toBe(true);
});