const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: `User successfully registred. Now you can login` });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     res.send(JSON.stringify(books, null, 4));
// });

// Assuming books is a Promise
// const getBookList = () => {
//     return new Promise((resolve, reject) => {
//         // Simulating an asynchronous operation
//         setTimeout(() => {
//             resolve(books);
//         }, 1000);
//     });
// };

// Get the book list available in the shop asynchronously using Promise
// public_users.get('/', async function (req, res) {
//     try {
//         const bookList = await getBookList();
//         res.send(JSON.stringify(bookList, null, 4));
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Assuming books is a local object
const getBookList = async () => {
    try {
        // Simulating an asynchronous operation (optional)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(books);
            }, 1000);
        });
    } catch (error) {
        throw error;
    }
};

// Route to get the book list
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBookList();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// // Function to get book details based on ISBN asynchronously using Promise
// const getBookDetailsByISBN = (isbn) => {
//     return new Promise((resolve, reject) => {
//         // Simulating an asynchronous operation
//         setTimeout(() => {
//             if (books.hasOwnProperty(isbn)) {
//                 resolve(books[isbn]);
//             } else {
//                 reject(new Error('No book found for the given ISBN.'));
//             }
//         }, 1000); // Simulating a delay of 1 second
//     });
// };

// // Route to get book details based on ISBN
// public_users.get('/isbn/:isbn', (req, res) => {
//     const isbn = req.params.isbn;

//     // Using Promise callbacks to simulate an asynchronous process
//     getBookDetailsByISBN(isbn)
//         .then((bookDetails) => {
//             res.send(bookDetails);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(404).send('No book found for the given ISBN.');
//         });
// });

// Function to get book details based on ISBN asynchronously using async-await
const getBookDetailsByISBN = async (isbn) => {
    return new Promise((resolve, reject) => {
        // Simulating an asynchronous operation
        setTimeout(() => {
            if (books.hasOwnProperty(isbn)) {
                resolve(books[isbn]);
            } else {
                reject(new Error('No book found for the given ISBN.'));
            }
        }, 1000); // Simulating a delay of 1 second
    });
};

// Route to get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Using async-await to simulate an asynchronous process
        const bookDetails = await getBookDetailsByISBN(isbn);
        res.send(bookDetails);
    } catch (error) {
        console.error(error);
        res.status(404).send('No book found for the given ISBN.');
    }
});


// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;
//     const booksByAuthor = [];

//     for (const key in books) {
//         if (books.hasOwnProperty(key) && books[key].author === author) {
//             booksByAuthor.push(books[key]);
//         }
//     }

//     res.send(booksByAuthor);
// });


// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     const booksByTitle = [];

//     for (const key in books) {
//         if (books.hasOwnProperty(key) && books[key].title === title) {
//             booksByTitle.push(books[key]);
//         }
//     }

//     res.send(booksByTitle);
// });

// Function to get books based on title asynchronously using Promise
// const getBooksByTitle = (title) => {
//     return new Promise((resolve, reject) => {
//         // Simulating an asynchronous operation
//         setTimeout(() => {
//             const booksByTitle = [];
//             for (const key in books) {
//                 if (books.hasOwnProperty(key) && books[key].title === title) {
//                     booksByTitle.push(books[key]);
//                 }
//             }
//             resolve(booksByTitle);
//         }, 1000); // Simulating a delay of 1 second
//     });
// };

// // Route to get books based on title using Promise
// public_users.get('/title/:title', (req, res) => {
//     const title = req.params.title;

//     // Using the Promise to handle the asynchronous operation
//     getBooksByTitle(title)
//         .then((booksByTitle) => {
//             res.send(booksByTitle);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(404).send('No books found for the given title.');
//         });
// });

// Function to get books based on title asynchronously using async-await
const getBooksByTitle = async (title) => {
    return new Promise((resolve, reject) => {
        // Simulating an asynchronous operation
        setTimeout(() => {
            const booksByTitle = [];
            for (const key in books) {
                if (books.hasOwnProperty(key) && books[key].title === title) {
                    booksByTitle.push(books[key]);
                }
            }
            resolve(booksByTitle);
        }, 1000); // Simulating a delay of 1 second
    });
};

// Route to get books based on title using async-await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        // Using async-await to handle the asynchronous operation
        const booksByTitle = await getBooksByTitle(title);
        res.send(booksByTitle);
    } catch (error) {
        console.error(error);
        res.status(404).send('No books found for the given title.');
    }
});



// //  Get book review
// public_users.get('/review/:isbn', function (req, res) {
//     const isbn = req.params.isbn;

//     if (books.hasOwnProperty(isbn)) {
//         const matchingBook = books[isbn];
//         res.send(matchingBook);
//     } else {
//         res.status(404).send('No book found for the given ISBN.');
//     }
// });

// // Function to get book details based on author asynchronously using Promise
// const getBookDetailsByAuthor = (author) => {
//     return new Promise((resolve, reject) => {
//         // Simulating an asynchronous operation
//         setTimeout(() => {
//             const booksByAuthor = [];
//             for (const key in books) {
//                 if (books.hasOwnProperty(key) && books[key].author === author) {
//                     booksByAuthor.push(books[key]);
//                 }
//             }
//             resolve(booksByAuthor);
//         }, 1000); // Simulating a delay of 1 second
//     });
// };

// // Route to get book details based on author using Promise
// public_users.get('/author/:author', (req, res) => {
//     const author = req.params.author;

//     // Using Promise to simulate an asynchronous process
//     getBookDetailsByAuthor(author)
//         .then((booksByAuthor) => {
//             res.send(booksByAuthor);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(404).send('No books found for the given author.');
//         });
// });

// Function to get book details based on author asynchronously using async-await
const getBookDetailsByAuthor = async (author) => {
    return new Promise((resolve, reject) => {
        // Simulating an asynchronous operation
        setTimeout(() => {
            const booksByAuthor = [];
            for (const key in books) {
                if (books.hasOwnProperty(key) && books[key].author === author) {
                    booksByAuthor.push(books[key]);
                }
            }
            resolve(booksByAuthor);
        }, 1000); // Simulating a delay of 1 second
    });
};

// Route to get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        // Using async-await to handle the asynchronous operation
        const booksByAuthor = await getBookDetailsByAuthor(author);
        res.send(booksByAuthor);
    } catch (error) {
        console.error(error);
        res.status(404).send('No books found for the given author.');
    }
});



module.exports.general = public_users;
