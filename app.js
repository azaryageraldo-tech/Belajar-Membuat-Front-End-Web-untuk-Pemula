document.addEventListener("DOMContentLoaded", function() {
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const searchBookTitle = document.getElementById("searchBookTitle");

    const STORAGE_KEY = "BOOKSHELF_APPS";

    let books = [];

    function isStorageExist() {
        if (typeof(Storage) === undefined) {
            alert("Browser kamu tidak mendukung local storage");
            return false;
        }
        return true;
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event("ondatasaved"));
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null)
            return data;

        return [];
    }

    function findBook(bookId) {
        return books.find(book => book.id === bookId);
    }

    function refreshDataFromBooks() {
        for (let book of books) {
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            newBook.id = book.id;

            if (book.isComplete) {
                completeBookshelfList.append(newBook);
            } else {
                incompleteBookshelfList.append(newBook);
            }
        }
    }

    function composeBookObject(title, author, year, isComplete) {
        return {
            id: +new Date(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };
    }

    function makeBook(title, author, year, isComplete) {
        const textTitle = document.createElement("h3");
        textTitle.innerText = title;

        const textAuthor = document.createElement("p");
        textAuthor.innerText = "Penulis: " + author;

        const textYear = document.createElement("p");
        textYear.innerText = "Tahun: " + year;

        const action = document.createElement("div");
        action.classList.add("action");

        const btnMove = document.createElement("button");
        btnMove.innerText = isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
        btnMove.classList.add("green");
        btnMove.addEventListener("click", function(event) {
            moveBook(event.target.parentElement.parentElement);
        });

        const btnDelete = document.createElement("button");
        btnDelete.innerText = "Hapus buku";
        btnDelete.classList.add("red");
        btnDelete.addEventListener("click", function(event) {
            removeBook(event.target.parentElement.parentElement);
        });

        action.append(btnMove, btnDelete);

        const container = document.createElement("article");
        container.classList.add("book_item");
        container.append(textTitle, textAuthor, textYear, action);

        return container;
    }

    function addBook() {
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        const bookObject = composeBookObject(title, author, year, isComplete);

        books.push(bookObject);
        saveData();
        renderBooks();
    }

    function removeBook(bookElement) {
        const bookId = bookElement.id;
        const bookIndex = books.findIndex(book => book.id == bookId);

        books.splice(bookIndex, 1);
        bookElement.remove();

        saveData();
    }

    function moveBook(bookElement) {
        const bookId = bookElement.id;
        const bookIndex = books.findIndex(book => book.id == bookId);

        if (books[bookIndex].isComplete) {
            completeBookshelfList.removeChild(bookElement);
            incompleteBookshelfList.appendChild(bookElement);
            books[bookIndex].isComplete = false;
        } else {
            incompleteBookshelfList.removeChild(bookElement);
            completeBookshelfList.appendChild(bookElement);
            books[bookIndex].isComplete = true;
        }

        saveData();
    }

    function searchBook() {
        const keyword = searchBookTitle.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(keyword));

        renderBooks(filteredBooks);
    }

    function renderBooks(booksToRender = books) {
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        for (let book of booksToRender) {
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            newBook.id = book.id;

            if (book.isComplete) {
                completeBookshelfList.appendChild(newBook);
            } else {
                incompleteBookshelfList.appendChild(newBook);
            }
        }
    }

    document.getElementById("inputBook").addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    document.getElementById("searchBook").addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    });

    document.addEventListener("ondatasaved", () => {
        console.log("Data berhasil disimpan.");
    });

    document.addEventListener("ondataloaded", () => {
        refreshDataFromBooks();
    });

    if (isStorageExist()) {
        books = loadDataFromStorage();
        renderBooks();
    }

});
