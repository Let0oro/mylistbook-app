(() => {
// Book class: represents a Book

class Book {
    constructor(title, author, isbn, status) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.status = status;
    }
}

// UI class: Handle UI tasks

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        const { title, author, isbn, status, rate = 'normal' } = book;
        row.innerHTML = `
        <td class="align-baseline" >${title}</td>
        <td class="align-baseline">${author}</td>
        <td class="align-baseline">
            <select value="${status}" class="form-select form-select-sm fs-xs">
                <option value="unreaded">Unreaded</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
            </select>
        </td>
        <td class="align-baseline">
            <select value="${rate}" class="form form-select-sm fs-xs" disabled>
                <option value="bad">😒</option>
                <option value="normal">🤷‍♀️</option>
                <option value="good">😄</option>
                <option value="best_seller">😎</option>
            </select>
        </td>
        <td class="align-baseline"><a href="#" class="btn btn-danger btn-sm delete fs-sm fw-bold">x</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
        document.querySelector("#status").value = "";
        document.querySelector("#rate").value = "";
    }

    static showAlert(message, title = "New Message") {
        const toastAlert = document.getElementById("liveToast");
        const toastBody = document.querySelector(".toast-body");
        const toastTitle = document.querySelector(".me-auto");

        toastBody.innerText = message;
        toastTitle.innerText = title;
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastAlert);
        toastBootstrap.show();
    }

    static deleteBook(elementBook) {
        elementBook.parentElement.parentElement.remove();
    }
}

// Store class: Handles Storage

class Store {
    static getBooks() {
        let books;
        if (!!!localStorage.getItem("books")) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    const status = document.querySelector("#status").value;

    // Validation

    // if (!!!title || !!!author || !!!isbn || !!!status) {
    //     UI.showAlert("Please, fill in all fields", "danger");
    //     return;
    // }

    const book = new Book(title, author, isbn, status);

    UI.addBookToList(book);

    Store.addBook(book);

    UI.showAlert("Book Added!");

    UI.clearFields();
});

// Event: Remove a Book

document.querySelector("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        // Remove book from UI
        UI.deleteBook(e.target);

        // Remove book from LocalStorage
        Store.removeBook(
            e.target.parentElement.previousElementSibling.textContent
        );

        // Show the alert
        UI.showAlert("Book removed");
    }
});
})();
