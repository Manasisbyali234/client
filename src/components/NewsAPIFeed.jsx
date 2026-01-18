import { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import styles from './NewsAPIFeed.module.css';

const NewsAPIFeed = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('general');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/user/external-news?category=${category}`);
                setArticles(data.articles || []);
            } catch (error) {
                console.error("Error fetching news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [category]);

    return (
        <div className={styles.feedContainer}>
            <div className={styles.header}>
                <h2>Latest Updates</h2>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                    <option value="general">General</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                </select>
            </div>

            {loading ? (
                <div>Loading updates...</div>
            ) : (
                <div className={styles.grid}>
                    {articles.map((article, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={article.urlToImage || 'https://placehold.co/300x200/4A90E2/ffffff?text=No+Image'} alt={article.title} />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.source}>{article.source.name}</span>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>Read More</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsAPIFeed;
