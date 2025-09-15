import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ApiService, MovieDto, OmdbSearchResult } from '../../services/api.service';
import { DialogService } from '../../services/dialog.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  // Search functionality
  searchQuery = '';
  searchResults: OmdbSearchResult[] = [];
  isSearching = false;
  
  // Batch operations
  selectedMovies: Set<number> = new Set();
  isBatchMode = false;
  
  // Prevent duplicate operations
  isDeletingMovie = false;
  
  // Database movies
  dbMovies: MovieDto[] = [];
  isLoadingMovies = false;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMoviesFromDB();
    this.testApiConnection();
  }

  testApiConnection(): void {
    console.log('=== TESTING API CONNECTION ===');
    console.log('API URL:', 'http://localhost:8081');
    
    // Test with a simple GET request
    this.apiService.getAllMovies().subscribe({
      next: (movies) => {
        console.log('✅ API connection successful');
        console.log('Movies loaded:', movies.length);
      },
      error: (error) => {
        console.error('❌ API connection failed');
        console.error('Error:', error);
        if (error.status === 0) {
          console.error('Network error - Backend might not be running');
        }
      }
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  searchMovies(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.apiService.searchMoviesFromOmdb(this.searchQuery).subscribe({
      next: (movies) => {
        this.searchResults = movies;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searchResults = [];
        this.isSearching = false;
        this.notificationService.error('Search Error', 'Error searching movies. Please try again.');
      }
    });
  }

  addMovieToDB(movie: OmdbSearchResult): void {
    this.apiService.importMovieFromOmdb(movie.imdbID).subscribe({
      next: (addedMovie) => {
        this.notificationService.success('Success!', 'Movie added to database successfully!');
        this.loadMoviesFromDB();
        // Remove from search results
        this.searchResults = this.searchResults.filter(m => m.imdbID !== movie.imdbID);
      },
      error: (error) => {
        console.error('Add movie error:', error);
        if (error.message.includes('already exists')) {
          this.notificationService.warning('Duplicate Movie', 'Movie already exists in database!');
        } else {
          this.notificationService.error('Error', 'Error adding movie to database. Please try again.');
        }
      }
    });
  }

  removeMovieFromDB(movieId: number): void {
    // Prevent duplicate calls
    if (this.isDeletingMovie) {
      return;
    }
    
    console.log('=== DELETE MOVIE DEBUG ===');
    console.log('Movie ID:', movieId);
    console.log('Movie ID type:', typeof movieId);
    console.log('Is movieId truthy:', !!movieId);
    
    if (!movieId || movieId === 0) {
      this.dialogService.showAlert('Invalid Input', 'Error: Movie ID is missing or invalid. Cannot remove movie.', 'error');
      console.error('Invalid movie ID:', movieId);
      return;
    }

    this.dialogService.showConfirm(
      'Confirm Deletion', 
      'Are you sure you want to remove this movie from the database?',
      'Delete',
      'Cancel'
    ).subscribe(result => {
      if (result.confirmed) {
        this.isDeletingMovie = true;
        console.log('User confirmed deletion, calling API...');
        console.log('API URL will be:', `http://localhost:8081/api/movies/${movieId}`);
        
        this.apiService.removeMovie(movieId).subscribe({
        next: (response) => {
          console.log('✅ Movie removed successfully!');
          console.log('Response status:', response.status);
          console.log('Full response:', response);
          
          if (response.status >= 200 && response.status < 300) {
            this.notificationService.success('Success!', 'Movie removed from database successfully!');
            this.loadMoviesFromDB();
          } else {
            console.warn('Unexpected response status:', response.status);
            this.notificationService.warning('Warning', 'Movie removal completed with unexpected status.');
            this.loadMoviesFromDB();
          }
          this.isDeletingMovie = false;
        },
        error: (error) => {
          console.error('❌ DELETE ERROR:');
          console.error('Error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error name:', error.name);
          console.error('Error stack:', error.stack);
          
          // Check if it's a network error
          if (error.name === 'HttpErrorResponse') {
            console.error('HTTP Error Response details:');
            console.error('Status:', error.status);
            console.error('Status Text:', error.statusText);
            console.error('URL:', error.url);
            console.error('Headers:', error.headers);
            console.error('Error body:', error.error);
          }
          
          let errorMessage = 'Unknown error occurred';
          if (error.status === 0) {
            errorMessage = 'Network error - is your backend running?';
          } else if (error.status === 404) {
            errorMessage = 'Movie not found (404)';
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred (500)';
          } else if (error.status === 403) {
            errorMessage = 'Access forbidden (403)';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized (401)';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.notificationService.error('Error', `Error removing movie from database: ${errorMessage}`);
          this.isDeletingMovie = false;
        }
      });
      } else {
        // User cancelled, reset the flag
        this.isDeletingMovie = false;
      }
    });
  }

  loadMoviesFromDB(): void {
    this.isLoadingMovies = true;
    this.apiService.getAllMovies().subscribe({
      next: (movies) => {
        console.log('Loaded movies from database:', movies);
        this.dbMovies = movies;
        this.totalPages = Math.ceil(movies.length / this.itemsPerPage);
        this.isLoadingMovies = false;
      },
      error: (error) => {
        console.error('Load movies error:', error);
        this.isLoadingMovies = false;
        this.notificationService.error('Error', 'Error loading movies from database.');
      }
    });
  }

  get paginatedMovies(): MovieDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.dbMovies.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Batch operations
  toggleBatchMode(): void {
    this.isBatchMode = !this.isBatchMode;
    this.selectedMovies.clear();
  }

  toggleMovieSelection(movieId: number): void {
    if (this.selectedMovies.has(movieId)) {
      this.selectedMovies.delete(movieId);
    } else {
      this.selectedMovies.add(movieId);
    }
  }

  isMovieSelected(movieId: number): boolean {
    return this.selectedMovies.has(movieId);
  }

  batchDeleteMovies(): void {
    if (this.selectedMovies.size === 0) {
      this.dialogService.showAlert('No Selection', 'Please select movies to delete.', 'warning');
      return;
    }

    this.dialogService.showConfirm(
      'Confirm Batch Deletion', 
      `Are you sure you want to delete ${this.selectedMovies.size} selected movies?`,
      'Delete All',
      'Cancel'
    ).subscribe(result => {
      if (result.confirmed) {
      const movieIds = Array.from(this.selectedMovies);
      this.apiService.removeMovies(movieIds).subscribe({
        next: () => {
          this.notificationService.success('Success!', `${movieIds.length} movies deleted successfully!`);
          this.loadMoviesFromDB();
          this.selectedMovies.clear();
          this.isBatchMode = false;
        },
        error: (error) => {
          console.error('Batch delete error:', error);
          this.notificationService.error('Error', 'Error deleting movies. Please try again.');
        }
      });
      }
    });
  }

  batchAddMovies(): void {
    if (this.searchResults.length === 0) {
      this.dialogService.showAlert('No Movies', 'No movies to add. Please search for movies first.', 'warning');
      return;
    }

    const imdbIds = this.searchResults.map(movie => movie.imdbID);
    this.apiService.importMoviesFromOmdb(imdbIds).subscribe({
      next: (result) => {
        let message = `Import completed!\n`;
        message += `Imported: ${result.imported.length}\n`;
        message += `Skipped: ${result.skipped.length}\n`;
        message += `Errors: ${result.errors.length}`;
        
        this.notificationService.success('Import Complete', message);
        this.loadMoviesFromDB();
        this.searchResults = [];
        this.searchQuery = '';
      },
      error: (error) => {
        console.error('Batch import error:', error);
        this.notificationService.error('Error', 'Error importing movies. Please try again.');
      }
    });
  }
}
