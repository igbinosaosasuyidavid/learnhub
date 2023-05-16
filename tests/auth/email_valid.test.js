function ValidateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false
  }
}
let userEmail = 'number2@gmail.com'
test('is email valid', () => {
  expect(ValidateEmail(userEmail)).toBe(true);
});