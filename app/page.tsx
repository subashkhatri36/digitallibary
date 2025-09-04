import Link from 'next/link';
import { Suspense } from 'react';

// Mock supabase client for now
const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      limit: (count: number) => ({ data: [] })
    })
  })
};

interface Book {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  average_rating?: number;
  authors?: { name: string };
  genres?: { name: string };
}

interface User {
  email?: string;
}

export default async function HomePage() {
  // Mock user for now
  const user: User | null = null;

  // Mock featured books for now
  const featuredBooks: Book[] = [
    {
      id: '1',
      title: 'The Great Adventure',
      description: 'An epic tale of courage and discovery that will captivate readers from start to finish.',
      cover_image: '/placeholder-book.jpg',
      average_rating: 4.5,
      authors: { name: 'John Smith' },
      genres: { name: 'Adventure' }
    },
    {
      id: '2',
      title: 'Mystery of the Lost City',
      description: 'A thrilling mystery that unravels ancient secrets and modern conspiracies.',
      cover_image: '/placeholder-book.jpg',
      average_rating: 4.2,
      authors: { name: 'Jane Doe' },
      genres: { name: 'Mystery' }
    },
    {
      id: '3',
      title: 'Science Fiction Chronicles',
      description: 'Journey to distant worlds and explore the possibilities of tomorrow.',
      cover_image: '/placeholder-book.jpg',
      average_rating: 4.8,
      authors: { name: 'Alex Johnson' },
      genres: { name: 'Sci-Fi' }
    }
  ];

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
                <Link href="/browse" className="nav-link text-white/80 hover:text-white transition-colors duration-300 relative group">
                  Browse
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
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
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Discover Your Next
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore thousands of books, create your personal library, and embark on endless literary adventures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/browse" className="btn btn-primary btn-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg">
                Start Exploring
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/subscription" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8 py-4 text-lg">
                View Plans
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up delay-300">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-white/70">Books Available</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div className="text-white/70">Active Readers</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/70">Genres</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Books
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover our handpicked selection of must-read books across all genres
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="skeleton skeleton-card mb-4"></div>
                  <div className="skeleton skeleton-text mb-2"></div>
                  <div className="skeleton skeleton-text mb-4"></div>
                  <div className="skeleton skeleton-button"></div>
                </div>
              ))}
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks?.map((book: Book, index: number) => (
                <div key={book.id} className={`book-card group animate-fade-in-up delay-${index * 100}`}>
                  <div className="glass-card p-6 h-full flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={book.cover_image || '/placeholder-book.jpg'} 
                        alt={book.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {book.title}
                      </h3>
                      <p className="text-white/70 mb-2">
                        by {book.authors?.name || 'Unknown Author'}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="chip chip-primary text-xs">
                          {book.genres?.name || 'Fiction'}
                        </span>
                        <div className="rating rating-readonly">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`rating-star ${i < Math.floor(book.average_rating ? Number(book.average_rating) : 4.5) ? 'filled' : ''}`}>
                              ⭐
                            </span>
                          ))}
                          <span className="text-white/60 text-sm ml-2">
                            {book.average_rating ? Number(book.average_rating).toFixed(1) : '4.5'}
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
                        <Link href={`/read/${book.id}`} className="btn btn-outline btn-sm border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                          Read Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
          
          <div className="text-center mt-12 animate-fade-in-up delay-600">
            <Link href="/browse" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8 py-4">
              View All Books
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black/20 to-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Our Library?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience the future of digital reading with our cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-100">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📖
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                Vast Collection
              </h3>
              <p className="text-white/70 leading-relaxed">
                Access over 10,000 books across all genres, from bestsellers to hidden gems waiting to be discovered.
              </p>
            </div>
            
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-200">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🎧
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                Audio Books
              </h3>
              <p className="text-white/70 leading-relaxed">
                Enjoy premium audiobooks with professional narration, perfect for your commute or workout sessions.
              </p>
            </div>
            
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
                Cross-Platform
              </h3>
              <p className="text-white/70 leading-relaxed">
                Read seamlessly across all your devices with automatic sync and offline reading capabilities.
              </p>
            </div>
            
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-400">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                AI Recommendations
              </h3>
              <p className="text-white/70 leading-relaxed">
                Get personalized book recommendations powered by AI that learns your reading preferences.
              </p>
            </div>
            
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors duration-300">
                Reading Community
              </h3>
              <p className="text-white/70 leading-relaxed">
                Connect with fellow readers, share reviews, and discover books through our vibrant community.
              </p>
            </div>
            
            <div className="feature-card glass-card p-8 text-center group animate-fade-in-up delay-600">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
                Reading Analytics
              </h3>
              <p className="text-white/70 leading-relaxed">
                Track your reading progress, set goals, and celebrate your achievements with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black/40 to-black/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Reading Journey?
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of readers who have already discovered their next favorite book. Start your free trial today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn btn-primary btn-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/subscription" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8 py-4 text-lg">
                View Pricing
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-6">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
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
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/browse" className="text-white/70 hover:text-white transition-colors duration-300">Browse Books</Link></li>
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
