function checkUserIsCourseOwner(course, user) {
    if (course.authorId === user.id) {
        return true
    } else {
        return false
    }
}
let course = {
    id: "64h145hdv66f9",
    title: "Learning today",
    authorId: "232nrvk08722"
}
let user = {
    id: "232nrvk08722",
    name: "John Doe"
}
test('is user course owner', () => {
    expect(checkUserIsCourseOwner(course, user)).toBe(true);
});