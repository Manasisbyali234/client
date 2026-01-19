import { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import NewsAPIFeed from '../components/NewsAPIFeed';
import PDFThumbnail from '../components/PDFThumbnail';
import styles from './HomePage.module.css';

const HomePage = () => {
    const [newspapers, setNewspapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNewspapers = async () => {
            try {
                const { data } = await axios.get('/api/user/newspapers');
                setNewspapers(data.newspapers);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewspapers();
    }, []);

    const latestPaper = newspapers.length > 0 ? newspapers[0] : null;
    const remainingPapers = newspapers.slice(1);

    const filteredPapers = remainingPapers.filter(paper => 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(paper.date).toLocaleDateString().includes(searchTerm)
    );

    if (loading) return (
        <div className={styles.container}>
            <div className={styles.skeletonHero}></div>
            <div className={styles.galleryGrid}>
                {[1, 2, 3, 4].map(i => <div key={i} className={styles.skeletonCard}></div>)}
            </div>
        </div>
    );

    return (
        <div className={styles.homeContainer}>
            {/* Today's Edition Section */}
            {latestPaper && !searchTerm && (
                <section className={styles.todaySection}>
                    <div className={styles.todayHeader}>
                        <div className={styles.sectionTitle}>
                            <span>Today's Edition</span>
                            <h2>{new Date(latestPaper.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                        </div>
                        <Link to={`/newspaper/${latestPaper._id}`} className={styles.readTodayBtn}>
                            Open ePaper
                        </Link>
                    </div>
                    
                    <div className={styles.featuredPaper}>
                        <Link to={`/newspaper/${latestPaper._id}`} className={styles.featuredPreview}>
                            {latestPaper.coverImageUrl ? (
                                <img src={latestPaper.coverImageUrl} alt={latestPaper.title} />
                            ) : latestPaper.pdfUrl ? (
                                <PDFThumbnail pdfUrl={latestPaper.pdfUrl} alt={latestPaper.title} width={800} />
                            ) : null}
                            <div className={styles.previewOverlay}>
                                <span>Click to Read</span>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Archive / Previous Editions Section */}
            <div className={styles.archiveSection}>
                <div className={styles.archiveHeader}>
                    <h3>Previous Editions</h3>
                    <div className={styles.searchBox}>
                        <input 
                            type="text" 
                            placeholder="Search by date or title..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>

                <div className={styles.editionsGrid}>
                    {(searchTerm ? newspapers : remainingPapers).filter(paper => 
                        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        new Date(paper.date).toLocaleDateString().includes(searchTerm)
                    ).map((paper) => (
                        <div key={paper._id} className={styles.editionCard}>
                            <Link to={`/newspaper/${paper._id}`}>
                                <div className={styles.editionThumbnail}>
                                    {paper.coverImageUrl ? (
                                        <img src={paper.coverImageUrl} alt={paper.title} />
                                    ) : paper.pdfUrl ? (
                                        <PDFThumbnail pdfUrl={paper.pdfUrl} alt={paper.title} />
                                    ) : (
                                        <div className={styles.noThumb}>{paper.title}</div>
                                    )}
                                </div>
                                <div className={styles.editionInfo}>
                                    <span className={styles.editionDate}>
                                        {new Date(paper.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <h4 className={styles.editionTitle}>{paper.title}</h4>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {((searchTerm ? newspapers : remainingPapers).filter(paper => 
                    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    new Date(paper.date).toLocaleDateString().includes(searchTerm)
                ).length === 0) && !loading && (
                    <div className={styles.noResults}>
                        No editions found for your search.
                    </div>
                )}
            </div>

            <NewsAPIFeed />
        </div>
    );
};

export default HomePage;
