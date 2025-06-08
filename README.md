# online-ebook-maker-
# EbookMaker - Online Collaborative Ebook Platform

A user-friendly web application that allows authors to create, write, edit, and publish books online while enabling collaborative editing and reading features.

## Features

### For Authors (Writers)
- **Easy Book Creation**: Simple form to create new books with title, author, genre, and description
- **Rich Text Editor**: Full-featured editor with formatting tools (bold, italic, underline, lists)
- **Chapter Management**: Add, edit, and organize chapters with ease
- **Auto-save**: Automatic saving of work every 2 seconds while editing
- **Collaborative Options**: Allow other users to edit and contribute to your books
- **Publishing Control**: Publish books when ready or keep them as drafts
- **My Books Dashboard**: Manage all your created books in one place

### For Readers
- **Browse Books**: Search and filter books by genre, title, or author
- **Clean Reading Experience**: Distraction-free reading interface
- **Chapter Navigation**: Easy navigation between chapters
- **Bookmarks**: Double-click any text to create bookmarks for later reference
- **Progress Tracking**: See which chapter you're on and total chapters
- **Collaborative Reading**: Request edit access for collaborative books

### Collaborative Features
- **Real-time Editing**: Multiple authors can contribute to the same book
- **Permission System**: Authors can enable/disable collaborative editing
- **Edit Requests**: Readers can request permission to edit collaborative books
- **Community Projects**: Books marked as collaborative are open for community contributions

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The website loads with sample books for demonstration
3. Navigate using the top menu: Home, Browse Books, Create Book, My Books

### For Writers

#### Creating a New Book
1. Click "Create Book" in the navigation or "Start Writing" on the home page
2. Fill in the book details:
   - **Title**: Your book's title
   - **Author**: Your name
   - **Genre**: Select from available genres
   - **Description**: Brief summary of your book
   - **Collaborative**: Check if you want others to be able to edit
3. Click "Create Book" to start writing

#### Writing and Editing
1. The editor opens automatically after creating a book
2. Use the chapter list on the left to navigate between chapters
3. Click "Add Chapter" to create new chapters
4. Use the formatting toolbar for text styling:
   - Bold, Italic, Underline
   - Bullet and numbered lists
   - Undo/Redo
5. Your work auto-saves every 2 seconds
6. Click "Save" to manually save
7. Click "Publish" to make your book available to readers

#### Managing Your Books
1. Go to "My Books" to see all your created books
2. Books show as "Draft" or "Published" status
3. Click "Edit" to continue writing
4. Click "View" to read your book as a reader would

### For Readers

#### Browsing Books
1. Click "Browse Books" in the navigation
2. Use the search bar to find books by title, author, or keywords
3. Filter by genre using the filter tabs:
   - All Books, Fiction, Non-Fiction, Poetry, Collaborative
4. Click on any book card to start reading

#### Reading Experience
1. Books open in a clean reading interface
2. Use the chapter list on the left to jump between chapters
3. Use "Previous" and "Next" buttons at the bottom to navigate
4. Track your progress with the chapter indicator

#### Using Bookmarks
1. While reading, double-click on any text to create a bookmark
2. Click the "Bookmarks" button to view all your bookmarks
3. Click on any bookmark to jump to that location
4. Bookmarks are saved automatically

#### Collaborative Editing
1. If a book is marked as "Collaborative", you'll see a "Request Edit" button
2. Click it to request editing permissions
3. For demo purposes, access is granted automatically after a few seconds
4. You'll be redirected to the editor where you can contribute

## Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: All data is saved in your browser's local storage
- **No Backend Required**: Pure client-side application
- **Cross-browser Compatible**: Works in all modern browsers
- **Offline Capable**: Works without internet connection once loaded

## File Structure

```
ebook-maker-website/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Sample Data

The website comes with 3 sample books to demonstrate features:
1. **The Digital Odyssey** (Sci-Fi, Collaborative)
2. **Whispers in the Wind** (Romance)
3. **The Collaborative Chronicles** (Fantasy, Collaborative)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

You can customize the website by:
- Modifying colors in `styles.css`
- Adding new genres in the book creation form
- Extending functionality in `script.js`
- Adding new sample books in the `sampleBooks` array

## Future Enhancements

Potential features for future development:
- User authentication and profiles
- Real-time collaborative editing
- Comments and reviews
- Book ratings
- Export to PDF/EPUB
- Advanced search filters
- Social features (following authors, sharing)
- Version control for collaborative books

## License

This project is open source and available under the MIT License.

---

**Enjoy creating and sharing your stories with EbookMaker!**

