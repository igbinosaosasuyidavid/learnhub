function userIsStudent(user, course) {
  if (course.studentsIds.some(e => e === user.id)) {
    return true
  } else {
    return false
  }
}
let course = {
  id: "64h145hdv66f9",
  title: "Learning today",
  authorId: "232nrvk08722",
  studentsIds: ["232nrvk08722"]
}
let user = {
  id: "232nrvk08722",
  name: "John Doe"
}
test('if user is a student in the course', () => {
  expect(userIsStudent(user, course)).toBe(true);
});