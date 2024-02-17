const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Get the book list available in the shop
function getAllBooks() {
    return Promise.resolve(books);
  }
  
  public_users.get('/', async function (req, res) {
    try {
      const booksList = await getAllBooks();
      res.json(booksList);
    } catch (error) {
      res.status(500).send({ message: 'Failed to fetch books' });
    }
  });

// Get book details based on ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject('Book not found');
      }
    });
  }
  
  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await getBookByISBN(isbn);
      res.json(book);
    } catch (error) {
      res.status(404).send({ message: error });
    }
  });

  
// Get book details based on author
function getBooksByAuthor(author) {
    return new Promise((resolve) => {
      const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      resolve(filteredBooks);
    });
  }
  
  public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const booksByAuthor = await getBooksByAuthor(author);
      if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
      } else {
        res.status(404).send({ message: 'No books found by the given author' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Failed to fetch books' });
    }
  });


// Get all books based on title
function getBooksByTitle(title) {
    return new Promise((resolve) => {
      const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      resolve(filteredBooks);
    });
  }
  
  public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const booksByTitle = await getBooksByTitle(title);
      if (booksByTitle.length > 0) {
        res.json(booksByTitle);
      } else {
        res.status(404).send({ message: 'No books found with the given title' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Failed to fetch books' });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; 
    if (books[isbn] && books[isbn].reviews) {
        res.json(books[isbn].reviews); 
    } else if (books[isbn] && !books[isbn].reviews) {
        // If the book exists but has no reviews, send a message indicating so
        res.status(404).send({ message: 'No reviews found for this book' });
    } else {
        // If no book is found with the given ISBN, send a 404 Not Found response
        res.status(404).send({ message: 'Book not found' });
    }
});


module.exports.general = public_users;
