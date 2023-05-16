function addToWishlist(data, wishlist) {
    if (wishlist.some(e => e.id === data.id)) {
    } else {
        wishlist = [...wishlist.filter(c => c.id !== data.id), data]

    }
    return wishlist
}

function removeCourseFromWishlist(id, wishlist) {
    return wishlist.filter((data) => data.id !== id)
}

let course = {
    id: "64h145hdv66f9",
    title: "Learning today",
    authorId: "232nrvk08722"
}

var wishlist = []
wishlist = addToWishlist(course, wishlist)

// if the course was succesfully added to wishlist 
// but will be false until you remove the removeCourseFromWishlist function from removing thee course 
test('if course is in user wishlist', () => {
    expect(wishlist.some(e => e.id === course.id)).toBe(false);
});


wishlist = removeCourseFromWishlist(course.id, wishlist)
test('if course is not user wishlist', () => {
    expect(!wishlist.some(e => se.id === course.id)).toBe(true);
});

