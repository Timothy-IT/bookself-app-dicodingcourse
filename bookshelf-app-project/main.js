const INCOMPLETE_BOOK_LIST = 'incompleteBookList';
const COMPLETE_BOOK_LIST = 'completeBookList';
const BOOK_ITEMID = 'data-bookid';

let books = [];

document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');
    
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchBooks();
    });

    document.getElementById('searchBookTitle').addEventListener('input', function(e) {
        searchBooks();
    });

  
    document.getElementById('bookFormIsComplete').addEventListener('change', function(e) {
        const submitButton = document.getElementById('bookFormSubmit');
        const submitSpan = submitButton.querySelector('span');
        submitSpan.textContent = e.target.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
    });
});

function addBook() {
    const titleInput = document.getElementById('bookFormTitle');
    const authorInput = document.getElementById('bookFormAuthor');
    const yearInput = document.getElementById('bookFormYear');
    const isCompleteInput = document.getElementById('bookFormIsComplete');
    
    if (!titleInput.value.trim()) {
        showNotification('Judul buku tidak boleh kosong!', 'error');
        return;
    }

    const book = {
        id: `book-${+new Date()}`,
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        year: parseInt(yearInput.value),
        isComplete: isCompleteInput.checked
    };
    
    books.push(book);
    saveData();
    updateBookList();
    resetForm();
    showNotification('Buku berhasil ditambahkan!', 'success');
}

function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
    bookItem.className = 'p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50';
    
    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.className = 'text-lg font-semibold text-gray-800';
    title.innerText = book.title;
    
    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.className = 'text-gray-600';
    author.innerText = `Penulis: ${book.author}`;
    
    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.className = 'text-gray-600 mb-3';
    year.innerText = `Tahun: ${book.year}`;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex space-x-2';
    
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.className = `px-3 py-1 rounded-md text-sm ${book.isComplete ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`;
    toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.onclick = () => toggleBookStatus(book.id);
    
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.className = 'px-3 py-1 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white';
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.onclick = () => deleteBook(book.id);
    
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.className = 'px-3 py-1 rounded-md text-sm bg-blue-500 hover:bg-blue-600 text-white';
    editButton.innerText = 'Edit Buku';
    editButton.onclick = () => editBook(book.id);
    
    buttonContainer.append(toggleButton, deleteButton, editButton);
    bookItem.append(title, author, year, buttonContainer);
    
    return bookItem;
}

function toggleBookStatus(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveData();
        updateBookList();
        showNotification(`Buku dipindahkan ke rak ${book.isComplete ? 'Selesai' : 'Belum Selesai'} dibaca`, 'success');
    }
}

function deleteBook(bookId) {
    const book = books.find(book => book.id === bookId);
    const confirmDelete = confirm(`Apakah anda yakin ingin menghapus buku "${book.title}"?`);
    if (confirmDelete) {
        const bookIndex = books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            saveData();
            updateBookList();
            showNotification('Buku berhasil dihapus!', 'success');
        }
    }
}

function editBook(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        
        const submitButton = document.getElementById('bookFormSubmit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = 'Update Buku';
        
        document.getElementById('bookForm').scrollIntoView({ behavior: 'smooth' });
        
        const submitHandler = function(e) {
            e.preventDefault();
            
            const newTitle = document.getElementById('bookFormTitle').value.trim();
            if (!newTitle) {
                showNotification('Judul buku tidak boleh kosong!', 'error');
                return;
            }
            
            book.title = newTitle;
            book.author = document.getElementById('bookFormAuthor').value.trim();
            book.year = parseInt(document.getElementById('bookFormYear').value);
            book.isComplete = document.getElementById('bookFormIsComplete').checked;
            
            saveData();
            updateBookList();
            resetForm();
            
            submitButton.innerHTML = originalText;
            bookForm.removeEventListener('submit', submitHandler);
            showNotification('Buku berhasil diperbarui!', 'success');
        };
        
        const bookForm = document.getElementById('bookForm');
        bookForm.addEventListener('submit', submitHandler);
    }
}

function searchBooks() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const filteredBooks = searchTitle 
        ? books.filter(book => book.title.toLowerCase().includes(searchTitle))
        : books;
    
    updateBookList(filteredBooks);
}

function updateBookList(booksToDisplay = books) {
    const incompleteBookList = document.getElementById(INCOMPLETE_BOOK_LIST);
    const completeBookList = document.getElementById(COMPLETE_BOOK_LIST);
    
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
        const message = document.createElement('p');
        message.className = 'text-gray-500 text-center py-4';
        message.textContent = 'Tidak ada buku yang ditemukan';
        incompleteBookList.appendChild(message.cloneNode(true));
        completeBookList.appendChild(message.cloneNode(true));
        return;
    }
    
    for (const book of booksToDisplay) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.append(bookElement);
        } else {
            incompleteBookList.append(bookElement);
        }
    }
}

function resetForm() {
    document.getElementById('bookForm').reset();
    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.querySelector('span').textContent = 'Belum selesai dibaca';
}

function saveData() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadDataFromStorage() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        updateBookList();
    }
}

function showNotification(message, type = 'info') {
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        type === 'error' 
            ? 'bg-red-500 text-white' 
            : type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, 3000);
}

function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('[data-testid="bookItem"]');
    const containers = [
        document.getElementById(INCOMPLETE_BOOK_LIST),
        document.getElementById(COMPLETE_BOOK_LIST)
    ];

    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'true');
        
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('opacity-50');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('opacity-50');
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            container.classList.add('bg-gray-100');
        });

        container.addEventListener('dragleave', () => {
            container.classList.remove('bg-gray-100');
        });

        container.addEventListener('drop', e => {
            e.preventDefault();
            container.classList.remove('bg-gray-100');
            
            const draggedBookId = e.dataTransfer.getData('text/plain');
            const book = books.find(b => b.id === draggedBookId);
            
            if (book) {
                const newIsComplete = container.id === COMPLETE_BOOK_LIST;
                if (book.isComplete !== newIsComplete) {
                    book.isComplete = newIsComplete;
                    saveData();
                    updateBookList();
                    showNotification(`Buku dipindahkan ke rak ${newIsComplete ? 'Selesai' : 'Belum Selesai'} dibaca`, 'success');
                }
            }
        });
    });
}

function updateStatistics() {
    const stats = {
        total: books.length,
        complete: books.filter(book => book.isComplete).length,
        incomplete: books.filter(book => !book.isComplete).length
    };

    let statsContainer = document.getElementById('stats-container');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';
        statsContainer.className = 'bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-3 gap-4 text-center';
        document.querySelector('main').insertBefore(statsContainer, document.querySelector('main').firstChild);
    }

    statsContainer.innerHTML = `
        <div class="stats-item">
            <h3 class="text-xl font-semibold text-blue-600">${stats.total}</h3>
            <p class="text-gray-600">Total Buku</p>
        </div>
        <div class="stats-item">
            <h3 class="text-xl font-semibold text-green-600">${stats.complete}</h3>
            <p class="text-gray-600">Selesai Dibaca</p>
        </div>
        <div class="stats-item">
            <h3 class="text-xl font-semibold text-yellow-600">${stats.incomplete}</h3>
            <p class="text-gray-600">Belum Selesai</p>
        </div>
    `;
}

function addSortingButtons() {
    const sortContainer = document.createElement('div');
    sortContainer.className = 'mb-4 flex justify-end space-x-2';
    sortContainer.innerHTML = `
        <button class="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600" onclick="sortBooks('title')">
            Sort by Title
        </button>
        <button class="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600" onclick="sortBooks('year')">
            Sort by Year
        </button>
    `;

    const searchSection = document.querySelector('#searchBook').parentElement;
    searchSection.appendChild(sortContainer);
}

function sortBooks(criteria) {
    books.sort((a, b) => {
        if (criteria === 'title') {
            return a.title.localeCompare(b.title);
        } else if (criteria === 'year') {
            return a.year - b.year;
        }
        return 0;
    });
    
    updateBookList();
    showNotification(`Buku diurutkan berdasarkan ${criteria === 'title' ? 'judul' : 'tahun'}`, 'success');
}


document.addEventListener('DOMContentLoaded', function() {
    addSortingButtons();
    updateStatistics();
    
    
    const originalSaveData = saveData;
    saveData = function() {
        originalSaveData();
        updateStatistics();
    };
});