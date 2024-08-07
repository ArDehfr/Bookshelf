document.addEventListener('DOMContentLoaded', function () {
 
    const inputBookForm = document.getElementById('inputBook');
    const inputBookTitle = document.getElementById('inputBookTitle');
    const inputBookAuthor = document.getElementById('inputBookAuthor');
    const inputBookYear = document.getElementById('inputBookYear');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
 
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
 
    function makeBookItem(id, title, author, year, isComplete) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');
        bookItem.setAttribute('data-id', id);
 
        const bookInfo = document.createElement('div');
        bookInfo.innerHTML = `
            <h3>${title}</h3>
            <p>Penulis: ${author}</p>
            <p>Tahun: ${year}</p>
        `;
        bookItem.appendChild(bookInfo);
 
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        const actionButton1 = document.createElement('button');
        const actionButton2 = document.createElement('button');
 
        if (isComplete) {
            actionButton1.textContent = 'Belum selesai di Baca';
            actionButton1.classList.add('green');
        } else {
            actionButton1.textContent = 'Selesai dibaca';
            actionButton1.classList.add('green');
        }
 
        actionButton2.textContent = 'Hapus buku';
        actionButton2.classList.add('red');
 
        actionButton1.addEventListener('click', function () {
            const currentBook = document.querySelector(`[data-id="${id}"]`);
            if (isComplete) {
                incompleteBookshelfList.appendChild(currentBook);
                actionButton1.textContent = 'Selesai dibaca';
                isComplete = false;
            } else {
                completeBookshelfList.appendChild(currentBook);
                actionButton1.textContent = 'Belum selesai di Baca';
                isComplete = true;
            }
            updateBookData();
        });
 
        actionButton2.addEventListener('click', function () {
            bookItem.remove();
            updateBookData();
        });
 
        actionContainer.appendChild(actionButton1);
        actionContainer.appendChild(actionButton2);
        bookItem.appendChild(actionContainer);
 
        return bookItem;
    }
 
    function addBookToShelf(id, title, author, year, isComplete) {
        year = parseInt(year, 10);
        const bookItem = makeBookItem(id, title, author, year, isComplete);
        if (isComplete) {
          completeBookshelfList.appendChild(bookItem);
        } else {
          incompleteBookshelfList.appendChild(bookItem);
        }
        updateBookData();
        console.log({ id, title, author, year, isComplete });
      }
 
    function getBookData() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }
 
    function saveBookData(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }
 
    function updateBookData() {
        const bookItems = document.querySelectorAll('.book_item');
        const books = [];
        bookItems.forEach(book => {
            const id = book.getAttribute('data-id');
            const title = book.querySelector('h3').textContent;
            const author = book.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const year = book.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];
            const isComplete = book.querySelector('button:nth-of-type(1)').textContent === 'Belum selesai di Baca';
            books.push({ id, title, author, year, isComplete });
        });
        saveBookData(books);
    }
 
    function renderBookData() {
        const books = getBookData();
        books.forEach(book => {
            addBookToShelf(book.id, book.title, book.author, book.year, book.isComplete);
        });
    }
 
    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = generateId();
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;
 
        addBookToShelf(id, title, author, year, isComplete);
 
        inputBookTitle.value = '';
        inputBookAuthor.value = '';
        inputBookYear.value = '';
        inputBookIsComplete.checked = false;
    });
 
    renderBookData();
 
    const searchBookForm = document.getElementById('searchBook');
    const searchBookTitleInput = document.getElementById('searchBookTitle');
 
    function searchBooks(title) {
        const allBooks = document.querySelectorAll('.book_item');
        
        allBooks.forEach(book => {
            const bookTitle = book.querySelector('h3').textContent.toLowerCase();
            if (bookTitle.includes(title.toLowerCase())) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    }
 
    searchBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTitle = searchBookTitleInput.value;
        searchBooks(searchTitle);
    });
});