let addedCovers = [];
$(document).ready(function(){
  $.ajax( {
    url: "http://localhost:3000/books",
    type: "GET",
  })
  .done(loadBooks)
  .fail(function() {
  });

  $(".reg-text-button").click(function(){
    $(".login-div").fadeOut(300);
    $(".reg-div").delay(300).fadeIn();
  });
  $(".login-text-button").click(function(){
    $(".reg-div").fadeOut(300);
    $(".login-div").delay(300).fadeIn();
  });

  $(".login-form").submit(function(e){
    e.preventDefault();
    let loginForm = $(".login-form").serializeArray();
    $.ajax( {
      url: `http://localhost:3000/login/${loginForm[0].value}`,
      type: "GET",
    })
    .done(loginUser)
    .fail(function(response) {
      if(response.status==404){
        console.error("user not Found!");
      }
    });
  });
  
});

function loadBooks(response, section){
  let books = response.books;
  $.each(books, (key, book) => {
    let bookDiv = $(`<div class='book-item' value='${book.isbn}'></div>`);
    $(".books-display").append(bookDiv);
    bookDiv.append(`<div class='book-title'"><p>${book.title}</p></div>`);
    $(bookDiv).append(`<div class='book-subtitle'><p>${book.subtitle}</p></div>`);
  bookDiv.append(`<div class='book-author'><p>${book.author}<p></div>`);
    bookDiv.append(`<div class='book-publisher'><p>${book.publisher}<p></div>`);    
    bookDiv.append("<div class='book-graphic'></div>");
    bookDiv.append(`<img class="bookmark" src="./images/bookmark.png">`);
    $(bookDiv).css({
      "background": "url('./images/cover"+randomNumber(22)+".jpg')",
      "background-size": "170px 230px",
    });
    let bookmarkDiv = $(`<div class='bookmark-list ${book.isbn}'></div>`);
    bookmarkDiv.append(`<p class='bookmark-list-item want-to-read-book-click' data-value='${book.isbn}' data-section='wantToRead'> Want-to-read</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item reading-book-click' data-value='${book.isbn}' data-section='reading'>Reading</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item read-book-click' data-value='${book.isbn}' data-section='read'>Read</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item none-book-click' data-value='${book.isbn}' data-section='none'>None</p>`);
    $(bookDiv).append(bookmarkDiv);
  });
  
  loadBookmarkOptions();
  $('.want-to-read-book-click').click(bookClickAction);
  $('.reading-book-click').click(bookClickAction);
  $('.read-book-click').click(bookClickAction);
  $('.none-book-click').click(function(){
  $(this).parent().delay(150).slideUp(400);
  });
}
function loadBookmarkOptions(){
  $('.bookmark').click(function(){
    let bookmarkPops = document.getElementsByClassName('bookmark-list');
    [...bookmarkPops].forEach((bookmarkPop) => {
      if(bookmarkPop!=this.parentNode.getElementsByClassName(this.parentNode.getAttribute('value'))[0]) {
        $(bookmarkPop).slideUp(400);
      }
    });
    $('.'+$(this).parent().attr('value')).slideToggle(450);
  });
}

async function bookClickAction(e){
  let isbn = $(this).data('value');
  let section = $(this).data('section');
  let bookObject = {
    [section]: [isbn],
  }

  $(this).parent().delay(150).slideUp(400);
  loadBooksInSection(bookObject, section);
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
function loginUser(response){
  $(".login-div").fadeOut(300);
  $(".book-shelf").delay(300).fadeIn(300);
  localStorage.setItem('username', response.userName);
  loadBooksInSection(response, 'wantToRead');
  loadBooksInSection(response, 'reading');
  loadBooksInSection(response, 'read');
}
async function loadBooksInSection(response, section){
  let sectionClassName = 'want-to-read';
  if(section=='reading' || section=='read' ) sectionClassName = section;
  response[section].forEach(async(isbn) => {
    let book = await getBookByISBN(isbn);
    let bookDiv = $("<div class='section-book-item'></div>");
    bookDiv.append(`<div class='section-book-title'><p>${book.title}</p></div>`);
    $(bookDiv).append(`<div class='section-book-subtitle'><p>${book.subtitle}</p></div>`);
    bookDiv.append(`<div class='section-book-author'><p>${book.author}<p></div>`);
    bookDiv.append(`<div class='section-book-publisher'><p>${book.publisher}<p></div>`);    
    bookDiv.append(`<div class='section-book-graphic'></div>`);
    bookDiv.append(`<img class="section-bookmark" src="./images/bookmark.png">`);
    $(bookDiv).css({
      "background": "url('./images/cover"+randomNumber(22)+".jpg')",
      "background-size": "130px 170px",
    });
    // $(`.${sectionClassName}`).append(bookDiv);
    $(bookDiv).hide().appendTo(`.${sectionClassName}`).fadeIn(200);
  });
}

function getBookByISBN(isbn){
  return new Promise((resolve, reject)=>{
    $.ajax( {
      url: "http://localhost:3000/books/"+isbn,
      type: "GET",
    })
    .done(res => {
      resolve(res.book);
    })
    .fail(err => {
      reject(err);
    });
  });
}
