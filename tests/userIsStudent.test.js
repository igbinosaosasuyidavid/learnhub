
function userIsStudent(user) {
    return !user.admin
}

let user = {
    id: "689302482jva141",
    fullName: "johnDoe",
    email: "test1@gmail.com",
    admin: true
}

test('user is student', () => {
    expect(userIsStudent(user)).toBe(false);
});
