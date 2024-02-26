export function sortArrayBasedOnLetters(arr) {
  return arr.sort((a, b) => {
    // Convert both strings to lowercase to ensure case-insensitive sorting
    let stringA = a.toLowerCase();
    let stringB = b.toLowerCase();

    if (stringA < stringB) {
      return -1; // If stringA should come before stringB, return a negative value
    }
    if (stringA > stringB) {
      return 1; // If stringA should come after stringB, return a positive value
    }
    return 0; // If stringA and stringB are equal
  });
}
