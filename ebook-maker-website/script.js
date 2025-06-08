// Global variables
let books = [];
let currentBook = null;
let currentChapter = 0;
let currentFilter = 'all';
let bookmarks = [];
let currentUser = null;
let users = [];
let comments = [];
let currentQuoteIndex = 0;
let currentRating = 0;

// Sample data for demonstration
const sampleBooks = [
    {
        id: 1,
        title: "The Digital Odyssey",
        author: "Sarah Chen",
        genre: "sci-fi",
        description: "A thrilling journey through virtual worlds and digital consciousness.",
        collaborative: true,
        chapters: [
            {
                title: "The Beginning",
                content: "<p>In the year 2045, the world had changed dramatically. Virtual reality was no longer just entertainment—it had become a second life for most of humanity.</p><p>Maya stepped into her neural interface pod, ready to embark on another day in the digital realm. Little did she know that today would change everything.</p>"
            },
            {
                title: "The Discovery",
                content: "<p>As Maya navigated through the crystalline corridors of the virtual city, she noticed something strange. The usual NPCs were behaving differently, almost as if they were... aware.</p><p>She approached one of them cautiously. 'Excuse me,' she said, her voice echoing in the digital space.</p>"
            }
        ],
        published: true,
        createdAt: new Date('2024-01-15')
    },
    {
        id: 2,
        title: "Whispers in the Wind",
        author: "Marcus Rodriguez",
        genre: "romance",
        description: "A heartwarming tale of love found in unexpected places.",
        collaborative: false,
        chapters: [
            {
                title: "Chapter 1: The Café",
                content: "<p>The small café on the corner of Fifth and Main had always been Elena's sanctuary. Every morning at 7:30 AM, she would order the same lavender latte and sit by the window, watching the world wake up.</p><p>But this Tuesday was different. A stranger sat at her usual table.</p>"
            }
        ],
        published: true,
        createdAt: new Date('2024-02-01')
    },
    {
        id: 3,
        title: "The Collaborative Chronicles",
        author: "Community Project",
        genre: "fantasy",
        description: "An epic fantasy adventure written by multiple authors from around the world.",
        collaborative: true,
        chapters: [
            {
                title: "The Gathering Storm",
                content: "<p>Dark clouds gathered over the kingdom of Aethermoor as the ancient prophecy began to unfold. The chosen ones would soon emerge from the shadows to face their destiny.</p>"
            }
        ],
        published: true,
        createdAt: new Date('2024-01-20')
    }
];

// Initialize the application
function init() {
    // Load data from localStorage or use sample data
    const savedBooks = localStorage.getItem('ebookmaker_books');
    const savedBookmarks = localStorage.getItem('ebookmaker_bookmarks');
    const savedUsers = localStorage.getItem('ebookmaker_users');
    const savedUser = localStorage.getItem('ebookmaker_currentUser');
    const savedComments = localStorage.getItem('ebookmaker_comments');
    
    if (savedBooks) {
        books = JSON.parse(savedBooks);
    } else {
        books = [...sampleBooks];
        saveBooks();
    }
    
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
    }
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    if (savedComments) {
        comments = JSON.parse(savedComments);
    }
    
    // Load the home section by default
    showSection('home');
    loadBooks();
    loadMyBooks();
    
    // Initialize quotes carousel
    startQuotesCarousel();
    
    // Setup star rating click handlers
    setupStarRating();
}

// Save data to localStorage
function saveBooks() {
    localStorage.setItem('ebookmaker_books', JSON.stringify(books));
}

function saveBookmarks() {
    localStorage.setItem('ebookmaker_bookmarks', JSON.stringify(bookmarks));
}

function saveUsers() {
    localStorage.setItem('ebookmaker_users', JSON.stringify(users));
}

function saveCurrentUser() {
    localStorage.setItem('ebookmaker_currentUser', JSON.stringify(currentUser));
}

function saveComments() {
    localStorage.setItem('ebookmaker_comments', JSON.stringify(comments));
}

// Navigation functions
function showSection(sectionName) {
    // Check authentication for protected sections
    if ((sectionName === 'create' || sectionName === 'my-books') && !currentUser) {
        showNotification('Please log in to access this section.', 'error');
        showAuthModal('login');
        return;
    }
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show the selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionName === 'browse') {
        loadBooks();
    } else if (sectionName === 'my-books') {
        loadMyBooks();
    } else if (sectionName === 'create' && currentUser) {
        // Populate author name
        const authorInput = document.getElementById('book-author');
        if (authorInput && !authorInput.value) {
            authorInput.value = currentUser.name;
        }
    }
}

// Book creation and management
function createBook() {
    if (!currentUser) {
        showNotification('Please log in to create a book.', 'error');
        showAuthModal('login');
        return;
    }
    
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const genre = document.getElementById('book-genre').value;
    const description = document.getElementById('book-description').value.trim();
    const collaborative = document.getElementById('allow-collaboration').checked;
    
    if (!title || !author || !description) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    const newBook = {
        id: Date.now(),
        title,
        author,
        genre,
        description,
        collaborative,
        chapters: [{
            title: "Chapter 1",
            content: ""
        }],
        published: false,
        archived: false,
        createdAt: new Date(),
        authorId: currentUser.id
    };
    
    books.push(newBook);
    saveBooks();
    
    // Clear the form
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('book-description').value = '';
    document.getElementById('allow-collaboration').checked = false;
    
    showNotification('Book created successfully!');
    
    // Open the editor
    openEditor(newBook.id);
}

// Book display functions
function loadBooks() {
    const booksGrid = document.getElementById('books-grid');
    const filteredBooks = filterBooksByGenre(books.filter(book => book.published));
    
    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;"><p>No books found. Be the first to create one!</p></div>';
        return;
    }
    
    booksGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');
}

function loadMyBooks() {
    if (!currentUser) {
        return;
    }
    
    showLibraryTab('published'); // Default to published tab
}

function showLibraryTab(tab) {
    if (!currentUser) {
        return;
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event?.target?.classList.add('active') || document.querySelector(`[onclick="showLibraryTab('${tab}')"]`)?.classList.add('active');
    
    // Hide all tab contents
    document.querySelectorAll('.library-tab-content').forEach(content => content.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(`${tab}-books`).classList.add('active');
    
    // Filter books based on tab and current user
    const myBooks = books.filter(book => book.authorId === currentUser.id);
    let filteredBooks;
    
    switch(tab) {
        case 'published':
            filteredBooks = myBooks.filter(book => book.published && !book.archived);
            break;
        case 'drafts':
            filteredBooks = myBooks.filter(book => !book.published && !book.archived);
            break;
        case 'archived':
            filteredBooks = myBooks.filter(book => book.archived);
            break;
        default:
            filteredBooks = myBooks;
    }
    
    const gridId = `${tab}-books-grid`;
    const grid = document.getElementById(gridId);
    
    if (filteredBooks.length === 0) {
        const emptyMessage = tab === 'published' ? 'No published books yet.' : 
                            tab === 'drafts' ? 'No draft books yet.' : 
                            'No archived books yet.';
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;"><p>${emptyMessage}</p></div>`;
        return;
    }
    
    grid.innerHTML = filteredBooks.map(book => createMyBookCard(book, tab)).join('');
}

function createBookCard(book) {
    const collaborativeBadge = book.collaborative ? '<div class="collaborative-badge">Collaborative</div>' : '';
    
    return `
        <div class="book-card" onclick="openReader(${book.id})">
            <div class="book-cover">
                ${collaborativeBadge}
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-genre">${book.genre}</div>
                <div class="book-description">${book.description}</div>
                <div class="book-stats">
                    <span><i class="fas fa-file-alt"></i> ${book.chapters.length} chapters</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(book.createdAt)}</span>
                </div>
            </div>
        </div>
    `;
}

function createMyBookCard(book, tab = 'published') {
    const statusClass = book.published ? 'btn-success' : 'btn-secondary';
    const statusText = book.archived ? 'Archived' : (book.published ? 'Published' : 'Draft');
    const statusIcon = book.archived ? 'fas fa-archive' : (book.published ? 'fas fa-check' : 'fas fa-edit');
    
    let actionButtons = '';
    
    if (tab === 'archived') {
        actionButtons = `
            <button class="btn btn-secondary" onclick="restoreBook(${book.id})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-undo"></i> Restore
            </button>
            <button class="btn-delete" onclick="deleteBook(${book.id})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
    } else {
        actionButtons = `
            <button class="btn btn-primary" onclick="openEditor(${book.id})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-secondary" onclick="openReader(${book.id})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-archive" onclick="archiveBook(${book.id})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                <i class="fas fa-archive"></i> Archive
            </button>
        `;
    }
    
    return `
        <div class="book-card">
            <div class="book-cover">
                ${book.collaborative ? '<div class="collaborative-badge">Collaborative</div>' : ''}
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-genre">${book.genre}</div>
                <div class="book-description">${book.description}</div>
                <div class="book-stats">
                    <span><i class="fas fa-file-alt"></i> ${book.chapters.length} chapters</span>
                    <span class="${statusClass}" style="background: none; color: inherit; padding: 0;"><i class="${statusIcon}"></i> ${statusText}</span>
                </div>
                <div class="book-actions">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
}

// Search and filter functions
function searchBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const booksGrid = document.getElementById('books-grid');
    
    let filteredBooks = books.filter(book => 
        book.published && (
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        )
    );
    
    filteredBooks = filterBooksByGenre(filteredBooks);
    
    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;"><p>No books found matching your search.</p></div>';
        return;
    }
    
    booksGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');
}

function filterBooks(genre) {
    currentFilter = genre;
    
    // Update filter button states
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadBooks();
}

function filterBooksByGenre(booksList) {
    if (currentFilter === 'all') {
        return booksList;
    } else if (currentFilter === 'collaborative') {
        return booksList.filter(book => book.collaborative);
    } else {
        return booksList.filter(book => book.genre === currentFilter);
    }
}

// Editor functions
function openEditor(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    currentBook = book;
    currentChapter = 0;
    
    document.getElementById('editing-book-title').textContent = book.title;
    
    showSection('editor');
    loadChaptersList();
    loadChapterEditor();
}

function closeEditor() {
    currentBook = null;
    currentChapter = 0;
    showSection('my-books');
}

function loadChaptersList() {
    const chaptersList = document.getElementById('chapters-list');
    
    chaptersList.innerHTML = currentBook.chapters.map((chapter, index) => `
        <div class="chapter-item ${index === currentChapter ? 'active' : ''}" onclick="selectChapter(${index})">
            <div class="chapter-number">Chapter ${index + 1}</div>
            <div class="chapter-title">${chapter.title || 'Untitled'}</div>
        </div>
    `).join('');
}

function selectChapter(chapterIndex) {
    saveCurrentChapter();
    currentChapter = chapterIndex;
    loadChaptersList();
    loadChapterEditor();
}

function loadChapterEditor() {
    const chapter = currentBook.chapters[currentChapter];
    document.getElementById('chapter-title').value = chapter.title || '';
    document.getElementById('chapter-content').innerHTML = chapter.content || '';
}

function saveCurrentChapter() {
    if (!currentBook) return;
    
    const title = document.getElementById('chapter-title').value;
    const content = document.getElementById('chapter-content').innerHTML;
    
    currentBook.chapters[currentChapter] = {
        title: title,
        content: content
    };
}

function addChapter() {
    if (!currentBook) return;
    
    saveCurrentChapter();
    
    const newChapter = {
        title: `Chapter ${currentBook.chapters.length + 1}`,
        content: ""
    };
    
    currentBook.chapters.push(newChapter);
    currentChapter = currentBook.chapters.length - 1;
    
    loadChaptersList();
    loadChapterEditor();
    
    showNotification('New chapter added!');
}

function saveBook() {
    if (!currentBook) return;
    
    saveCurrentChapter();
    saveBooks();
    
    showNotification('Book saved successfully!');
}

function publishBook() {
    if (!currentBook) return;
    
    saveCurrentChapter();
    currentBook.published = true;
    saveBooks();
    
    showNotification('Book published successfully!');
}

// Text formatting functions
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('chapter-content').focus();
}

// Reader functions
function openReader(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    currentBook = book;
    currentChapter = 0;
    
    document.getElementById('reading-book-title').textContent = book.title;
    document.getElementById('reading-book-author').textContent = `by ${book.author}`;
    
    // Show edit button for collaborative books
    const editBtn = document.getElementById('edit-book-btn');
    if (book.collaborative) {
        editBtn.style.display = 'block';
    } else {
        editBtn.style.display = 'none';
    }
    
    showSection('reader');
    loadReaderChaptersList();
    loadReaderChapter();
}

function closeReader() {
    currentBook = null;
    currentChapter = 0;
    showSection('browse');
}

function loadReaderChaptersList() {
    const chaptersList = document.getElementById('reader-chapters-list');
    
    chaptersList.innerHTML = currentBook.chapters.map((chapter, index) => `
        <div class="reader-chapter-item ${index === currentChapter ? 'active' : ''}" onclick="selectReaderChapter(${index})">
            <div class="chapter-number">Chapter ${index + 1}</div>
            <div class="chapter-title">${chapter.title || 'Untitled'}</div>
        </div>
    `).join('');
}

function selectReaderChapter(chapterIndex) {
    currentChapter = chapterIndex;
    loadReaderChaptersList();
    loadReaderChapter();
}

function loadReaderChapter() {
    const chapter = currentBook.chapters[currentChapter];
    document.getElementById('reader-chapter-title').textContent = chapter.title || `Chapter ${currentChapter + 1}`;
    document.getElementById('reader-chapter-content').innerHTML = chapter.content || '<p>This chapter is empty.</p>';
    
    updateChapterProgress();
}

function updateChapterProgress() {
    document.getElementById('chapter-progress').textContent = 
        `Chapter ${currentChapter + 1} of ${currentBook.chapters.length}`;
}

function previousChapter() {
    if (currentChapter > 0) {
        currentChapter--;
        loadReaderChaptersList();
        loadReaderChapter();
    }
}

function nextChapter() {
    if (currentChapter < currentBook.chapters.length - 1) {
        currentChapter++;
        loadReaderChaptersList();
        loadReaderChapter();
    }
}

function requestEdit() {
    if (!currentBook || !currentBook.collaborative) return;
    
    // In a real application, this would send a request to the book owner
    showNotification('Edit request sent to the book author!');
    
    // For demo purposes, allow direct editing
    setTimeout(() => {
        showNotification('Edit access granted! Redirecting to editor...');
        setTimeout(() => {
            openEditor(currentBook.id);
        }, 1000);
    }, 2000);
}

// Bookmark functions
function toggleBookmarks() {
    const bookmarksPanel = document.getElementById('bookmarks-panel');
    bookmarksPanel.classList.toggle('active');
    
    if (bookmarksPanel.classList.contains('active')) {
        loadBookmarks();
    }
}

function loadBookmarks() {
    const bookmarksList = document.getElementById('bookmarks-list');
    const bookBookmarks = bookmarks.filter(bookmark => bookmark.bookId === currentBook.id);
    
    if (bookBookmarks.length === 0) {
        bookmarksList.innerHTML = '<p style="color: #666; font-style: italic;">No bookmarks yet. Double-click on any paragraph to add a bookmark.</p>';
        return;
    }
    
    bookmarksList.innerHTML = bookBookmarks.map(bookmark => `
        <div class="bookmark-item" onclick="goToBookmark(${bookmark.chapterIndex})">
            <div class="bookmark-chapter">Chapter ${bookmark.chapterIndex + 1}</div>
            <div class="bookmark-text">${bookmark.text}</div>
        </div>
    `).join('');
}

function addBookmark(chapterIndex, text) {
    const bookmark = {
        id: Date.now(),
        bookId: currentBook.id,
        chapterIndex: chapterIndex,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        createdAt: new Date()
    };
    
    bookmarks.push(bookmark);
    saveBookmarks();
    
    showNotification('Bookmark added!');
}

function goToBookmark(chapterIndex) {
    selectReaderChapter(chapterIndex);
    toggleBookmarks();
}

// Utility functions
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }
    
    // Add double-click event for bookmarks in reader
    document.addEventListener('dblclick', function(e) {
        if (e.target.closest('#reader-chapter-content') && currentBook) {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0) {
                addBookmark(currentChapter, selectedText);
            }
        }
    });
    
    // Auto-save in editor
    let saveTimeout;
    document.addEventListener('input', function(e) {
        if (e.target.closest('#editor') && currentBook) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveCurrentChapter();
                saveBooks();
            }, 2000); // Auto-save after 2 seconds of inactivity
        }
    });
    
    // Initialize the app
    init();
});

// Authentication functions
function showAuthModal(mode) {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'block';
    switchAuthMode(mode);
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function switchAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        saveCurrentUser();
        updateAuthUI();
        closeAuthModal();
        showNotification(`Welcome back, ${user.name}!`);
        
        // Clear form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        showNotification('Invalid email or password.', 'error');
    }
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists.', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date()
    };
    
    users.push(newUser);
    saveUsers();
    
    currentUser = newUser;
    saveCurrentUser();
    updateAuthUI();
    closeAuthModal();
    
    showNotification(`Welcome to Mystique Books, ${name}!`);
    
    // Clear form
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ebookmaker_currentUser');
    updateAuthUI();
    showSection('home');
    showNotification('You have been logged out.');
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const createLink = document.querySelector('[onclick="showSection(\'create\')"]');
    const libraryLink = document.querySelector('[onclick="showSection(\'my-books\')"]');
    
    if (currentUser) {
        authSection.style.display = 'none';
        userSection.style.display = 'flex';
        document.getElementById('user-name').textContent = currentUser.name;
        
        // Show authenticated navigation links
        if (createLink) createLink.style.display = 'flex';
        if (libraryLink) libraryLink.style.display = 'flex';
        
        // Populate author name in create form
        const authorInput = document.getElementById('book-author');
        if (authorInput && !authorInput.value) {
            authorInput.value = currentUser.name;
        }
    } else {
        authSection.style.display = 'flex';
        userSection.style.display = 'none';
        
        // Hide authenticated navigation links
        if (createLink) createLink.style.display = 'none';
        if (libraryLink) libraryLink.style.display = 'none';
    }
}

// Book management functions
function archiveBook(bookId) {
    if (!currentUser) return;
    
    const book = books.find(b => b.id === bookId && b.authorId === currentUser.id);
    if (book) {
        book.archived = true;
        saveBooks();
        showNotification('Book archived successfully.');
        loadMyBooks();
    }
}

function restoreBook(bookId) {
    if (!currentUser) return;
    
    const book = books.find(b => b.id === bookId && b.authorId === currentUser.id);
    if (book) {
        book.archived = false;
        saveBooks();
        showNotification('Book restored successfully.');
        loadMyBooks();
    }
}

function deleteBook(bookId) {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to permanently delete this book? This action cannot be undone.')) {
        const bookIndex = books.findIndex(b => b.id === bookId && b.authorId === currentUser.id);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            saveBooks();
            showNotification('Book deleted permanently.');
            loadMyBooks();
        }
    }
}

// Quotes carousel functions
function startQuotesCarousel() {
    setInterval(() => {
        nextQuote();
    }, 5000); // Change quote every 5 seconds
}

function currentQuote(index) {
    currentQuoteIndex = index - 1;
    showQuote();
}

function nextQuote() {
    const quotes = document.querySelectorAll('.quote-card');
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    showQuote();
}

function showQuote() {
    const quotes = document.querySelectorAll('.quote-card');
    const dots = document.querySelectorAll('.dot');
    
    quotes.forEach((quote, index) => {
        quote.classList.toggle('active', index === currentQuoteIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentQuoteIndex);
    });
}

// Comments system
function setupStarRating() {
    const stars = document.querySelectorAll('#rating-stars i');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
    });
    
    document.getElementById('rating-stars').addEventListener('mouseleave', () => {
        updateStarDisplay();
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#rating-stars i');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateStarDisplay() {
    highlightStars(currentRating);
}

function addComment() {
    if (!currentUser) {
        showNotification('Please log in to add a comment.', 'error');
        showAuthModal('login');
        return;
    }
    
    const commentText = document.getElementById('comment-text').value.trim();
    
    if (!commentText) {
        showNotification('Please enter a comment.', 'error');
        return;
    }
    
    if (currentRating === 0) {
        showNotification('Please select a rating.', 'error');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        bookId: currentBook.id,
        userId: currentUser.id,
        userName: currentUser.name,
        text: commentText,
        rating: currentRating,
        createdAt: new Date()
    };
    
    comments.push(newComment);
    saveComments();
    
    // Clear form
    document.getElementById('comment-text').value = '';
    currentRating = 0;
    updateStarDisplay();
    
    showNotification('Comment added successfully!');
    loadComments();
}

function loadComments() {
    if (!currentBook) return;
    
    const bookComments = comments.filter(comment => comment.bookId === currentBook.id);
    const commentsCount = document.getElementById('comments-count');
    const commentsList = document.getElementById('comments-list');
    
    commentsCount.textContent = `${bookComments.length} comment${bookComments.length !== 1 ? 's' : ''}`;
    
    if (bookComments.length === 0) {
        commentsList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No comments yet. Be the first to share your thoughts!</p>';
        return;
    }
    
    // Sort comments by date (newest first)
    bookComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    commentsList.innerHTML = bookComments.map(comment => {
        const commentDate = new Date(comment.createdAt);
        const timeAgo = getTimeAgo(commentDate);
        const initials = comment.userName.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-avatar">${initials}</div>
                        <div class="comment-name">${comment.userName}</div>
                    </div>
                    <div class="comment-meta">
                        <div class="comment-rating">
                            ${Array(5).fill().map((_, i) => 
                                `<i class="fas fa-star" style="color: ${i < comment.rating ? 'var(--accent-gold)' : 'var(--text-muted)'}"></i>`
                            ).join('')}
                        </div>
                        <span>${timeAgo}</span>
                    </div>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
}

// Update openReader to load comments
const originalOpenReader = openReader;
function openReader(bookId) {
    const result = originalOpenReader(bookId);
    loadComments();
    return result;
}

// Make functions globally available
window.showSection = showSection;
window.createBook = createBook;
window.searchBooks = searchBooks;
window.filterBooks = filterBooks;
window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.selectChapter = selectChapter;
window.addChapter = addChapter;
window.saveBook = saveBook;
window.publishBook = publishBook;
window.formatText = formatText;
window.openReader = openReader;
window.closeReader = closeReader;
window.selectReaderChapter = selectReaderChapter;
window.previousChapter = previousChapter;
window.nextChapter = nextChapter;
window.requestEdit = requestEdit;
window.toggleBookmarks = toggleBookmarks;
window.goToBookmark = goToBookmark;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.login = login;
window.register = register;
window.logout = logout;
window.showLibraryTab = showLibraryTab;
window.archiveBook = archiveBook;
window.restoreBook = restoreBook;
window.deleteBook = deleteBook;
window.currentQuote = currentQuote;
window.addComment = addComment;

