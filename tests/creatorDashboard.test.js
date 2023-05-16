function getAllNumberOfCourses(user) {
    return user.createdCourses.length
}
function getAllNumberOfStudents(user) {
    return user.studentsIds.length
}

let user = {
    id: "689302482jva141",
    fullName: "johnDoe",
    email: "test1@gmail.com",
    admin: true,
    createdCourses: ["49545jnfb904w", "ijrwgefb9t83", "839hvb8ghvg"],
    studentsIds: ["cecef89f32f", "efch7321d1n", '27ehnb83ff']
}
test('user created courses is valid', () => {
    expect(typeof getAllNumberOfCourses(user)).toEqual("number");
});
test('Number of students', () => {
    expect(typeof getAllNumberOfCourses(user)).toEqual("number");
});