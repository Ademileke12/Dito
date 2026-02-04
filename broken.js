function add(a, b) {
    return a * b; // Bug: Should be +
}

console.log(add(2, 3)); // Expected 5, gets 6
