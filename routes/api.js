/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../models/models.js").Book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      try {
        const books = await Book.find();
        if (!books) {
          res.json([]);
          return;
        }
        const formattedData = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length,
          };
        });

        res.json(formattedData);
      } catch (error) {
        res.send({ error: "could not get the books" });
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({ title, comments: [] });
      try {
        const book = await newBook.save();
        res.json({ _id: book._id, title: book.title });
      } catch (error) {
        res.send({ error: "could not save a book" });
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const deleted = await Book.deleteMany();
        console.log("Books deleted: ", deleted);
        res.send("complete delete successful");
      } catch (error) {
        res.send("error deleting books");
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
          return;
        }
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        });
      } catch (error) {
        // console.log('no book exists')
        res.send("no book exists");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send(`missing required field comment`);
        return;
      }
      //json res format same as .get
      try {
        let book = await Book.findById(bookid);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        });
      } catch (error) {
        res.send("no book exists");
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;

      //if successful response will be 'delete successful'
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook){
          res.send("no book exists");
          return;
        }
        res.send("delete successful");
      } catch (error) {
        res.send("no book exists");
      }
    });
};
