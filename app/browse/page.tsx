
import Link from 'next/link';
import { Suspense } from 'react';

interface SearchParams {
  search?: string;
  genre?: string;
  tag?: string;
  sort?: string;
  page?: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  price?: number;
  average_rating?: number;
  authors?: { name: string };
  genres?: { name: string };
}

interface Genre {
  name: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Mock data for now
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'The Great Adventure',
      description: 'An epic tale of courage and discovery that will captivate readers from start to finish.',
      cover_image: '/placeholder-book.jpg',
      price: 12.99,
      average_rating: 4.5,
      authors: { name: 'John Smith' },
      genres: { name: 'Adventure' }
    },
    {
      id: '2',
      title: 'Mystery of the Lost City',
      description: 'A thrilling mystery that unravels ancient secrets and modern conspiracies.',
      cover_image: '/placeholder-book.jpg',
      price: 14.99,
      average_rating: 4.2,
      authors: { name: 'Jane Doe' },
      genres: { name: 'Mystery' }
    },
    {
      id: '3',
      title: 'Science Fiction Chronicles',
      description: 'Journey to distant worlds and explore the possibilities of tomorrow.',
      cover_image: '/placeholder-book.jpg',
      price: 16.99,
      average_rating: 4.8,
      authors: { name: 'Alex Johnson' },
      genres: { name: 'Sci-Fi' }
    },
    {
      id: '4',
      title: 'Romance in Paris',
      description: 'A heartwarming love story set in the beautiful city of lights.',
      cover_image: '/placeholder-book.jpg',
      price: 11.99,
      average_rating: 4.3,
      authors: { name: 'Emily Rose' },
      genres: { name: 'Romance' }
    },
    {
      id: '5',
      title: 'Historical Chronicles',
      description: 'Dive deep into the fascinating events that shaped our world.',
      cover_image: '/placeholder-book.jpg',
      price: 18.99,
      average_rating: 4.6,
      authors: { name: 'Michael Brown' },
      genres: { name: 'History' }
    },
    {
      id: '6',
      title: 'Fantasy Realm',
      description: 'Enter a magical world filled with dragons, wizards, and epic quests.',
      cover_image: '/placeholder-book.jpg',
      price: 15.99,
      average_rating: 4.7,
      authors: { name: 'Sarah Wilson' },
      genres: { name: 'Fantasy' }
    }
  ];

  const mockGenres: Genre[] = [
    { name: 'Adventure' },
    { name: 'Mystery' },
    { name: 'Sci-Fi' },
    { name: 'Romance' },
    { name: 'History' },
    { name: 'Fantasy' },
    { name: 'Biography' },
    { name: 'Self-Help' }
  ];

  // Filter books based on search params
  let filteredBooks = mockBooks;
  if (params.search) {
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(params.search!.toLowerCase()) ||
      book.authors?.name.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  if (params.genre) {
    filteredBooks = filteredBooks.filter(book => book.genres?.name === params.genre);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                📚 DigitalLibrary
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/browse" className="nav-link text-white hover:text-blue-300 transition-colors duration-300 relative group">
                  Browse
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
                </Link>
                <Link href="/library" className="nav-link text-white/80 hover:text-white transition-colors duration-300 relative group">
                  My Library
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/subscription" className="nav-link text-white/80 hover:text-white transition-colors duration-300 relative group">
                  Subscription
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="btn btn-ghost text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  Login
                </Link>
                <Link href="/auth/register" className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Discover Amazing Books
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore our vast collection of books across all genres and find your next great read
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books, authors, or genres..."
                    className="input input-primary w-full pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    defaultValue={params.search || ''}
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Genre Filter */}
              <div className="lg:w-64">
                <select className="select select-primary w-full bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300">
                  <option value="" className="bg-slate-800 text-white">All Genres</option>
                  {mockGenres.map((genre) => (
                    <option key={genre.name} value={genre.name} className="bg-slate-800 text-white">
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort Filter */}
              <div className="lg:w-48">
                <select className="select select-primary w-full bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300">
                  <option value="created_at" className="bg-slate-800 text-white">Newest First</option>
                  <option value="title" className="bg-slate-800 text-white">Title A-Z</option>
                  <option value="rating" className="bg-slate-800 text-white">Highest Rated</option>
                  <option value="price" className="bg-slate-800 text-white">Price Low-High</option>
                </select>
              </div>
              
              {/* Search Button */}
              <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white px-8 transform hover:scale-105 transition-all duration-300">
                Search
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(params.search || params.genre) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {params.search && (
                <div className="chip chip-primary flex items-center gap-2">
                  Search: "{params.search}"
                  <button className="text-white/80 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {params.genre && (
                <div className="chip chip-secondary flex items-center gap-2">
                  Genre: {params.genre}
                  <button className="text-white/80 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 bg-gradient-to-b from-black/20 to-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBooks.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {params.search || params.genre ? 'Search Results' : 'All Books'}
                  </h2>
                  <p className="text-white/70">
                    {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="btn btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List View
                  </button>
                  <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid View
                  </button>
                </div>
              </div>
              
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="glass-card p-6 animate-pulse">
                      <div className="skeleton skeleton-card mb-4"></div>
                      <div className="skeleton skeleton-text mb-2"></div>
                      <div className="skeleton skeleton-text mb-4"></div>
                      <div className="skeleton skeleton-button"></div>
                    </div>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredBooks.map((book: Book, index: number) => (
                    <div key={book.id} className={`book-card group animate-fade-in-up delay-${index * 50}`}>
                      <div className="glass-card p-6 h-full flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <img 
                            src={book.cover_image || '/placeholder-book.jpg'} 
                            alt={book.title}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 right-2">
                            <span className="chip chip-primary text-xs font-semibold">
                              ${book.price?.toFixed(2) || '12.99'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-white/70 mb-2 text-sm">
                            by {book.authors?.name || 'Unknown Author'}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="chip chip-secondary text-xs">
                              {book.genres?.name || 'Fiction'}
                            </span>
                            <div className="rating rating-readonly text-xs">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`rating-star text-xs ${i < Math.floor(book.average_rating || 4.5) ? 'filled' : ''}`}>
                                  ⭐
                                </span>
                              ))}
                              <span className="text-white/60 text-xs ml-1">
                                {book.average_rating?.toFixed(1) || '4.5'}
                              </span>
                            </div>
                          </div>
                          <p className="text-white/60 text-sm mb-4 flex-1 line-clamp-3">
                            {book.description || 'A captivating story that will keep you turning pages...'}
                          </p>
                          <div className="flex gap-2 mt-auto">
                            <Link href={`/books/${book.id}`} className="btn btn-primary btn-sm flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white transform hover:scale-105 transition-all duration-300">
                              View Details
                            </Link>
                            <button className="btn btn-outline btn-sm border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Suspense>
              
              {/* Pagination */}
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white w-10 h-10">
                      1
                    </button>
                    <button className="btn btn-ghost text-white/80 hover:text-white hover:bg-white/10 w-10 h-10">
                      2
                    </button>
                    <button className="btn btn-ghost text-white/80 hover:text-white hover:bg-white/10 w-10 h-10">
                      3
                    </button>
                    <span className="text-white/60 px-2">...</span>
                    <button className="btn btn-ghost text-white/80 hover:text-white hover:bg-white/10 w-10 h-10">
                      10
                    </button>
                  </div>
                  <button className="btn btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                  📚
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No books found</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  We couldn't find any books matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <Link href="/browse" className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white transform hover:scale-105 transition-all duration-300">
                  Browse All Books
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                📚 DigitalLibrary
              </Link>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Your gateway to endless literary adventures. Discover, read, and connect with books and readers from around the world.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/browse" className="text-white hover:text-blue-300 transition-colors duration-300">Browse Books</Link></li>
                <li><Link href="/library" className="text-white/70 hover:text-white transition-colors duration-300">My Library</Link></li>
                <li><Link href="/subscription" className="text-white/70 hover:text-white transition-colors duration-300">Subscription</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors duration-300">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-white/70 hover:text-white transition-colors duration-300">Help Center</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors duration-300">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-white/70 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="divider divider-gradient my-8"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-white/60 text-sm">
              © 2024 DigitalLibrary. All rights reserved.
            </p>
            <p className="text-white/60 text-sm mt-2 md:mt-0">
              Made with ❤️ for book lovers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
