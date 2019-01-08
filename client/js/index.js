let addedCovers = [];
var prevSearchLength = 1;
$(document).ready(function () {
  $.ajax({
      url: "http://localhost:3000/books",
      type: "GET",
    })
    .done(loadBooks)
    .fail(function (res) {
      console.log(res);
      showError('Unable of get Books from server');
    });

  if(localStorage.getItem('username')){
    $(".login-div").hide();
    $(".book-shelf").delay(300).fadeIn(300);
    $.ajax({
      url: `http://localhost:3000/login/${localStorage.getItem('username')}`,
      type: "GET",
    })
    .done(loginUser)
    .fail(function (response) {
      if (response.status == 404) {
        showError("User not Found!");
      }
    });
  }else{
    $(".login-div").fadeIn(300);
  }

  $(".reg-text-button").click(function () {
    $(".login-div").fadeOut(300);
    $(".reg-div").delay(300).fadeIn();
  });
  $(".login-text-button").click(function () {
    $(".reg-div").fadeOut(300);
    $(".login-div").delay(300).fadeIn();
  });

  $(".login-form").submit(function (e) {
    e.preventDefault();
    let loginForm = $(".login-form").serializeArray();
    $.ajax({
        url: `http://localhost:3000/login/${loginForm[0].value}`,
        type: "GET",
      })
      .done(loginUser)
      .fail(function (response) {
        if (response.status == 404) {
          showError("User not Found!");
        }
      });
  });

  $(".reg-form").submit(function (e) {
    e.preventDefault();
    let loginForm = $(".reg-form").serializeArray();
    $.ajax({
        url: `http://localhost:3000/register`,
        type: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          [loginForm[0].name]: `${loginForm[0].value}`,
          [loginForm[1].name]: `${loginForm[1].value}`,
          [loginForm[2].name]: `${loginForm[2].value}`
        }),
      })
      .done(function(){
        $(".reg-div").fadeOut(200);
        $(".login-div").fadeIn(300);
        setTimeout(function(){
          alert("You registered successfully. Please login!");
        },200);
      })
      .fail(function (response) {
        let errors = response.responseJSON.errors
        if(errors.userName){
          if(errors.userName.message.indexOf("Path")!=-1){
            errors.userName.message = errors.userName.message.splice(5);
          }
          showError(errors.userName.message);
        }else if (errors.email){
          if(errors.email.message.indexOf("Path")!=-1){
            errors.email.message = errors.email.message.splice(5);
          }
          showError(errors.email.message);
        }else if (errors.name){
          if(errors.name.message.indexOf("Path")!=-1){
            errors.name.message = errors.name.message.slice(5);
          }
          showError(errors.name.message);
        }
      });
  });

  $(".search-text").on('keyup', function (e) {
    let searchedBooks = searchBooks($(".search-text").val());
    if(searchedBooks.length != 0){
      prevSearchLength = searchedBooks.length;
      $('.book-item').hide();
      loadBooks(searchedBooks)
    }else if(prevSearchLength!=0){
      prevSearchLength = searchedBooks.length;
      $('.book-item').hide();
      loadBooks(JSON.parse(localStorage.getItem('books')));
    }
  });

  $('.logout').click(function(){
    localStorage.clear();
    location.reload();
  })

});

function loadBooks(response, section) {
  if(response.books){
    localStorage.setItem('books', JSON.stringify(response.books));
  }
  let books = response.books || response;
  console.log(books);
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
      "background": "url('./images/cover" + randomNumber(22) + ".jpg')",
      "background-size": "170px 230px",
    });
    let bookmarkDiv = $(`<div class='bookmark-list ${book.isbn}'></div>`);
    bookmarkDiv.append(`<p class='bookmark-list-item want-to-read-book-click' data-value='${book.isbn}' data-section='want-to-read'> Want-to-read</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item reading-book-click' data-value='${book.isbn}' data-section='reading'>Reading</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item read-book-click' data-value='${book.isbn}' data-section='read'>Read</p>`);
    bookmarkDiv.append(`<p class='bookmark-list-item none-book-click' data-value='${book.isbn}' data-section='none'>None</p>`);
    $(bookDiv).append(bookmarkDiv);
  });
  loadBookmarkOptions();
  $('.want-to-read-book-click').click(bookClickAction);
  $('.reading-book-click').click(bookClickAction);
  $('.read-book-click').click(bookClickAction);
  $('.none-book-click').click(function () {
    $(this).parent().delay(150).slideUp(400);
  });
}

function searchBooks(searchText){
  let books = JSON.parse(localStorage.getItem('books'));
  var options = {
    shouldSort: true,
    findAllMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    keys: [
      "title",
    ]
  };
  var fuse = new Fuse(books, options);
  return fuse.search(searchText);
}

function loadBookmarkOptions() {
  $('.bookmark').click(function () {
    let bookmarkPops = document.getElementsByClassName('bookmark-list');
    [...bookmarkPops].forEach((bookmarkPop) => {
      if (bookmarkPop != this.parentNode.getElementsByClassName(this.parentNode.getAttribute('value'))[0]) {
        $(bookmarkPop).slideUp(400);
      }
    });
    $('.' + $(this).parent().attr('value')).slideToggle(450);
  });
}

async function bookClickAction(e) {
  let isbn = $(this).data('value');
  let section = $(this).data('section');
  let JsonSectionName = 'wantToRead';
  if (section == 'reading' || section == 'read') JsonSectionName = section;
  let bookObject = {
    [section]: [isbn],
  }
  $.ajax({
      url: `http://localhost:3000/list/${section}`,
      type: "POST",
      headers: {
        'Content-Type': 'application/json',
        'username': localStorage.getItem('username'),
      },
      data: JSON.stringify({
        [JsonSectionName]: `${isbn}`
      }),
    })
    .done(function (res) {
      loadBooksInSection(bookObject, section);
    })
    .fail(function (res) {
      showError(res.responseJSON.errorMessage);
    });
  $(this).parent().delay(150).slideUp(400);
}
function randomNumber(range) {
  let rand = Math.ceil((Math.random() * range));
  // if (addedCovers.indexOf(rand) === -1) {
    // addedCovers.push(rand);
    return rand;
  // } else {
  //   return randomNumber(range);
  // }
}

function loginUser(response) {
  $(".login-div").fadeOut(300);
  $(".book-shelf").delay(300).fadeIn(300);
  localStorage.setItem('username', response.userName);
  loadBooksInSection(response, 'wantToRead');
  loadBooksInSection(response, 'reading');
  loadBooksInSection(response, 'read');
}
async function loadBooksInSection(response, section) {
  let sectionClassName = 'want-to-read';
  if (section == 'reading' || section == 'read') sectionClassName = section;
  response[section].forEach(async (isbn) => {
    let book = await getBookByISBN(isbn);
    let bookDiv = $(`<div class='section-book-item' value='${book.isbn}'></div>`);
    bookDiv.append(`<div class='section-book-title'><p>${book.title}</p></div>`);
    $(bookDiv).append(`<div class='section-book-subtitle'><p>${book.subtitle}</p></div>`);
    bookDiv.append(`<div class='section-book-author'><p>${book.author}<p></div>`);
    bookDiv.append(`<div class='section-book-publisher'><p>${book.publisher}<p></div>`);
    bookDiv.append(`<div class='section-book-graphic'></div>`);
    let bookmark = $(`<img class="section-bookmark" src="./images/bookmark.png">`);
    $(bookmark).click(loadSectionBookmarkOptions); /* adding event to async dynamic elements */
    bookDiv.append(bookmark);
    $(bookDiv).css({
      "background": "url('./images/cover" + randomNumber(22) + ".jpg')",
      "background-size": "130px 170px",
    });
    let bookmarkDiv = $(`<div class='section-bookmark-list section-${book.isbn}' data-value='${book.isbn}' data-section='${section}'></div>`);
    $(bookmarkDiv).click(sectionBookClickAction); /* adding event to async dynamic elements */
    $(bookDiv).append(bookmarkDiv);
    // $(`.${sectionClassName}`).append(bookDiv);
    $(bookDiv).hide().appendTo(`.${sectionClassName}`).fadeIn(200);
  });
}

function loadSectionBookmarkOptions() {
  let bookmarkPops = document.getElementsByClassName('section-bookmark-list');
  [...bookmarkPops].forEach((bookmarkPop) => {
    if (bookmarkPop != this.parentNode.getElementsByClassName('section-' + this.parentNode.getAttribute('value'))[0]) {
      $(bookmarkPop).fadeOut(300);
    }
  });
  $('.section-'+$(this).parent().attr('value')).fadeToggle(350);
}

function sectionBookClickAction(e) {
  let isbn = $(this).data('value');
  let section = $(this).data('section');
  let urlSectionName = 'want-to-read';
  if (section == 'reading' || section == 'read') urlSectionName = section;
  $.ajax({
      url: `http://localhost:3000/list/${urlSectionName}/${isbn}`,
      type: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'username': localStorage.getItem('username'),
      },
    })
    .done(function (res) {
      console.log($(e.target).parent().fadeOut(200).remove);
      console.log(res);
    })
    .fail(function (res) {
      console.log(res.responseJSON);
    });
  
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    $.ajax({
        url: "http://localhost:3000/books/" + isbn,
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

function showError(message) {
  alert(message);
}