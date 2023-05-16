// CHecking the database on register if an email already exists


var users = [
    {
        id: "22313ntntn",
        email: "test351@gmail.com",
    },
    {
        id: "64nvs3r323",
        email: "test582@gmail.com",
    },
    {
        id: "ntnt35bba3",
        email: "test458@gmail.com",
    },
    {
        id: "nrwh4442Ha",
        email: "test042@gmail.com",
    },
]

function checkIfEmailExists(user_email) {
    if (users.some(e => e.email === user_email)) {
        return true
    } else {
        return false
    }
}

test('is email exists in datbase', () => {
    expect(checkIfEmailExists("test042@gmail.com")).toBe(true);
});