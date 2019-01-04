let addedCovers = [];
$(document).ready(function(){
  let ajax = $.ajax( {
    url: "http://localhost:3000/books",
    type: "GET",
  })
  .done(loadBooks)
  .fail(function() {
    
  })

});

function loadBooks(response){
  let books = response.books;
  $.each(books, (key, book) => {
    let bookDiv = $("<div class='book-item'></div>");
    $(".books-display").append(bookDiv);
    bookDiv.append(`<div class='book-title'><p>${book.title}</p></div>`);
    $(bookDiv).append(`<div class='book-subtitle'><p>${book.subtitle}</p></div>`);
  bookDiv.append(`<div class='book-author'><p>${book.author}<p></div>`);
    bookDiv.append(`<div class='book-publisher'><p>${book.publisher}<p></div>`);    
    bookDiv.append("<div class='book-graphic'></div>");
    bookDiv.append(`<img class="bookmark" src="./images/bookmark.png">`);
    $(bookDiv).css({
      "background": "url('./images/cover"+randomNumber(22)+".jpg')",
      "background-size": "170px 230px",
    });
  });
}

function randomNumber(range){
  let rand = Math.ceil((Math.random() * range));
  if(addedCovers.indexOf(rand) === -1){
    addedCovers.push(rand);
    return rand;
  }else{
    return randomNumber(range);
  }
  
  
}