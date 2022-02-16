const startingObj = {first: "Ethan", last: "Wager"}
imaginaryFetch = ["1", "2", "3"] 
​
// Part one: Combining Objects 
// We can combine objects using the spread syntax
​
const newObj = {...startingObj, ...{favoriteNumbers:imaginaryFetch} 
//result => {firstName: "Ethan", lastName: "Wager", favoriteNumbers: ["1", "2", "3"] 
​
// Great, but sometimes favorite numbers is null, and I only want the favoriteNumbers key added to the new object if there is data. How could I conditionally do that? Like so... 
​
const newObj = {...startingObj, ...(favoriteNumbers?.length && {favoriteNumbers:imaginaryFetch}