class PhotoGallery {
    constructor() {
        this.photos = this.loadPhotos();
        this.shufflePhotos(); // Panggil fungsi acak di sini
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderGallery();
        this.updateStats();
    }

    bindEvents() {
        // Lightbox events
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox' || e.target.id === 'closeLightbox') {
                this.closeLightbox();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }

    renderGallery() {
        const gallery = document.getElementById('gallery');
        const emptyState = document.getElementById('emptyState');

        if (this.photos.length === 0) {
            gallery.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        gallery.style.display = 'block';
        emptyState.style.display = 'none';

        // Clear existing photos
        gallery.innerHTML = '';

        // Add photos
        this.photos.forEach((photo) => {
            const photoElement = this.createPhotoElement(photo);
            gallery.appendChild(photoElement);
        });
    }

    createPhotoElement(photo) {
        const div = document.createElement('div');
        div.className = 'masonry-item bg-white rounded-lg overflow-hidden shadow-md relative cursor-pointer';
        
        // Generate random height for Pinterest-like layout
        const randomHeight = Math.floor(Math.random() * 200) + 200;
        
        div.innerHTML = `
            <div class="relative group">
                <img 
                    src="${photo.src}" 
                    alt="${photo.name}"
                    class="w-full object-cover loading-skeleton"
                    style="height: ${randomHeight}px;"
                    loading="lazy"
                >
                <div class="photo-overlay"></div>
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        class="delete-btn bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-sm"
                        onclick="event.stopPropagation(); gallery.deletePhoto(${photo.id})"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p class="text-white text-sm font-medium truncate">${photo.name}</p>
                    <p class="text-white/80 text-xs">${this.formatFileSize(photo.size)}</p>
                </div>
            </div>
        `;

        // Add click event for lightbox
        div.addEventListener('click', () => {
            this.openLightbox(photo.src, photo.name);
        });

        // Remove loading skeleton when image loads
        const img = div.querySelector('img');
        img.addEventListener('load', () => {
            img.classList.remove('loading-skeleton');
        });

        return div;
    }

    deletePhoto(photoId) {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        this.savePhotos();
        this.renderGallery();
        this.updateStats();
    }

    openLightbox(src, alt) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        
        img.src = src;
        img.alt = alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateStats() {
        document.getElementById('photoCount').textContent = this.photos.length;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    loadPhotos() {
        // Default photos for the demo
        return [
            {
        "id": 1,
        "src": "img/evoks.jpeg",
        "name": "website E-Voting",
        "size": 245760
        },
        {
            "id": 2,
            "src": "img/ujicoba.jpeg",
            "name": "Uji coba traffic website E-Voting",
            "size": 245760
        },
        {
            "id": 3,
            "src": "img/presentasi.jpeg",
            "name": "Presentasi Hasil website E-Voting",
            "size": 245760
        },
        {
            "id": 4,
            "src": "img/17an.jpeg",
            "name": "Kegiatan 17 Agustusan",
            "size": 245760
        },
        {
            "id": 5,
            "src": "img/17ann.jpeg",
            "name": "Kegiatan 17 Agustusan (2)",
            "size": 245760
        },
        {
            "id": 6,
            "src": "img/17.jpeg",
            "name": "Kegiatan 17 Agustusan (3)",
            "size": 245760
        },
        {
            "id": 7,
            "src": "img/apel.jpeg",
            "name": "Apel Pagi",
            "size": 245760
        },
        {
            "id": 8,
            "src": "img/bukutamu.jpeg",
            "name": "Pengecekan Buku Tamu",
            "size": 245760
        },
        {
            "id": 9,
            "src": "img/cap.jpeg",
            "name": "Kegiatan Pengecapan",
            "size": 245760
        },
        {
            "id": 10,
            "src": "img/flyer.jpeg",
            "name": "Pemasangan Flyer di RPP",
            "size": 245760
        },
        {
            "id": 11,
            "src": "img/kevin.jpeg",
            "name": "Kevin main gitar",
            "size": 245760
        },
        {
            "id": 12,
            "src": "img/menang.jpeg",
            "name": "Foto Kemenangan",
            "size": 245760
        },
        {
            "id": 13,
            "src": "img/monitoring.jpeg",
            "name": "Kegiatan Monitoring",
            "size": 245760
        },
        {
            "id": 14,
            "src": "img/nando.jpeg",
            "name": "Foto Nando menang",
            "size": 245760
        },
        {
            "id": 15,
            "src": "img/pkstmik.jpeg",
            "name": "Kegiatan PKS STMIK",
            "size": 245760
        },
        {
            "id": 16,
            "src": "img/pksuin.jpeg",
            "name": "Kegiatan PKS UIN",
            "size": 245760
        },
        {
            "id": 17,
            "src": "img/senam.jpeg",
            "name": "Kegiatan Senam Pagi",
            "size": 245760
        }
        ];
    }
    
    // Fungsi untuk mengacak array foto
    shufflePhotos() {
        let currentIndex = this.photos.length, randomIndex;
        
        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // And swap it with the current element.
            [this.photos[currentIndex], this.photos[randomIndex]] = [this.photos[randomIndex], this.photos[currentIndex]];
        }
    }
}

// Initialize gallery
const gallery = new PhotoGallery();

// Make delete function globally accessible
window.gallery = gallery;