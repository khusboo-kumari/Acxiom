import React, { useContext, useEffect, useState } from 'react';
import "../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from '../../../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';

function AddBook() {
    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const [bookName, setBookName] = useState("");
    const [alternateTitle, setAlternateTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCountAvailable, setBookCountAvailable] = useState("");
    const [language, setLanguage] = useState("");
    const [publisher, setPublisher] = useState("");
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [recentAddedBooks, setRecentAddedBooks] = useState([]);

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}api/categories/allcategories`);
                const all_categories = response.data.map(category => ({
                    value: category._id,
                    text: category.categoryName
                }));
                setAllCategories(all_categories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        getAllCategories();
    }, [API_URL]);

    const resetForm = () => {
        setBookName("");
        setAlternateTitle("");
        setAuthor("");
        setBookCountAvailable("");
        setLanguage("");
        setPublisher("");
        setSelectedCategories([]);
    };

    const addBook = async (e) => {
        e.preventDefault();
        
        if (!bookName.trim() || !author.trim() || !bookCountAvailable || selectedCategories.length === 0) {
            alert("Please fill all required fields.");
            return;
        }

        setIsLoading(true);
        const bookData = {
            bookName,
            alternateTitle,
            author,
            bookCountAvailable: parseInt(bookCountAvailable),
            language,
            publisher,
            categories: selectedCategories,
            isAdmin: user.isAdmin
        };

        try {
            const response = await axios.post(`${API_URL}api/books/addbook`, bookData);
            setRecentAddedBooks(prevBooks => [response.data, ...prevBooks.slice(0, 4)]);
            resetForm();
            alert("Book Added Successfully 🎉");
        } catch (err) {
            console.error("Error adding book:", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const getAllBooks = async () => {
            try {
                const response = await axios.get(`${API_URL}api/books/allbooks`);
                setRecentAddedBooks(response.data.slice(0, 5));
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        getAllBooks();
    }, [API_URL]);

    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>
                <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label>
                <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
                
                <label className="addbook-form-label" htmlFor="alternateTitle">Alternate Title</label>
                <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => setAlternateTitle(e.target.value)} />
                
                <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label>
                <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                
                <label className="addbook-form-label" htmlFor="language">Language</label>
                <input className="addbook-form-input" type="text" name="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
                
                <label className="addbook-form-label" htmlFor="publisher">Publisher</label>
                <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                
                <label className="addbook-form-label" htmlFor="copies">No. of Copies Available<span className="required-field">*</span></label>
                <input className="addbook-form-input" type="number" name="copies" value={bookCountAvailable} onChange={(e) => setBookCountAvailable(e.target.value)} required />
                
                <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label>
                <Dropdown
                    placeholder='Category'
                    fluid
                    multiple
                    search
                    selection
                    options={allCategories}
                    value={selectedCategories}
                    onChange={(event, data) => setSelectedCategories(data.value)}
                />
                
                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading} />
            </form>
            
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Book Name</th>
                            <th>Added Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentAddedBooks.length === 0 ? (
                            <tr><td colSpan="3">No Books Added</td></tr>
                        ) : (
                            recentAddedBooks.map((book, index) => (
                                book && book.createdAt ? (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{book.bookName}</td>
                                        <td>{book.createdAt.substring(0, 10)}</td>
                                    </tr>
                                ) : null
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddBook;
