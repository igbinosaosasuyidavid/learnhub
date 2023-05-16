
function validateSession(session) {
  if (session) {
    return true
  } else {
    return false
  }
}


let session = {
  id: "673902bedv3493nvv",
  user: {
    name: "John Doe",
    admin: false,
    email: "johndoe@gmail.com"
  }
}

test('is user authenticated', () => {
  expect(validateSession(session)).toBe(true);
});