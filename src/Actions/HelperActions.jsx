export const emailEmpty = "Please enter your email";
export const passwordEmpty = "Please enter your password";
export const valEmpty = "Please enter your password";
export const invalidPassword =
  "Must contain uppercase & lowercase letters and a number";
export const passwordsNotMatch = "Passwords do not match";

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
