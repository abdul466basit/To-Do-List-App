class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a  href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
            `;

        list.appendChild(row);
    }

    static showAlert(message, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        const textN = document.createTextNode(message);
        div.appendChild(textN);
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        //---------------------Remove Alert Message after 3 sec---------------//
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);

    }

    static clearFields(){
        document.querySelector("#title").value = " ";
        document.querySelector("#author").value = " ";
        document.querySelector("#isbn").value = " ";
    }  

    static deleteBook(el){
        if (el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }
}

class Store{
    static getBooks(){
        let books;
        if (localStorage.getItem("books") === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) =>{
            if (book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books))
    }
};


//-------------------------------ADD A NEW BOOK IN THE LIST-----------------//

document.addEventListener("DOMContentLoaded", UI.displayBooks);
document.querySelector("#book-form").addEventListener("submit", (e) =>{
    e.preventDefault();

    //---------------Get form Values------------------//
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    //------------------Validate Form------------------//
    if ( title === "" || author === "" || isbn ===""){
        UI.showAlert("Please first fill all the fields", "danger")
    }
    else{
    //------------------Add New book Object--------------// 
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);

    //------------------Add Book to Store Class----------//
    Store.addBook(book);

    //------------------Show Success ALert-----------//
    UI.showAlert("Successfully Added", "success")

    //--------------Clear Field----------------------//
    UI.clearFields();
    }

});


//----------------------------REMOVE A BOOK FROM THE LIST---------------------//

document.querySelector("#book-list").addEventListener("click", (e)=>{

    //---------------Remove Book From User Interface-------------//
    UI.deleteBook(e.target)

    //--------------Remove Book From local Storage------------------//
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //------------------Show Success ALert-----------//
    UI.showAlert("Successfully Removed", "success")
});






