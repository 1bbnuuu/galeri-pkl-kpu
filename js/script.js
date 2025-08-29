class MediaGallery {
    constructor() {
        this.allMedia = this.loadMedia();
        this.filteredMedia = [...this.allMedia];
        this.currentFilter = 'all';
        this.shuffleMedia();
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });

        // Filter events
        document.getElementById('showAll').addEventListener('click', () => {
            this.filterMedia('all');
        });

        document.getElementById('showPhotos').addEventListener('click', () => {
            this.filterMedia('photo');
        });

        document.getElementById('showVideos').addEventListener('click', () => {
            this.filterMedia('video');
        });
    }

    filterMedia(type) {
        this.currentFilter = type;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        let activeBtn;
        switch(type) {
            case 'all':
                activeBtn = document.getElementById('showAll');
                this.filteredMedia = [...this.allMedia];
                break;
            case 'photo':
                activeBtn = document.getElementById('showPhotos');
                this.filteredMedia = this.allMedia.filter(media => media.type === 'photo');
                break;
            case 'video':
                activeBtn = document.getElementById('showVideos');
                this.filteredMedia = this.allMedia.filter(media => media.type === 'video');
                break;
        }

        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-blue-600', 'text-white');

        this.renderGallery();
    }

    renderGallery() {
        const gallery = document.getElementById('gallery');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredMedia.length === 0) {
            gallery.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        gallery.style.display = 'block';
        emptyState.style.display = 'none';

        gallery.innerHTML = '';

        this.filteredMedia.forEach((media) => {
            const mediaElement = this.createMediaElement(media);
            gallery.appendChild(mediaElement);
        });
    }

    createMediaElement(media) {
        const div = document.createElement('div');
        div.className = 'masonry-item bg-white rounded-lg overflow-hidden shadow-md relative cursor-pointer';
        
        const randomHeight = Math.floor(Math.random() * 200) + 200;
        
        let mediaHTML;
        if (media.type === 'video') {
            mediaHTML = `
                <video 
                    src="${media.src}" 
                    class="w-full object-cover loading-skeleton"
                    style="height: ${randomHeight}px;"
                    preload="metadata"
                    muted
                ></video>
                <div class="play-button">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="media-type-badge">VIDEO</div>
            `;
        } else {
            mediaHTML = `
                <img 
                    src="${media.src}" 
                    alt="${media.name}"
                    class="w-full object-cover loading-skeleton"
                    style="height: ${randomHeight}px;"
                    loading="lazy"
                >
                <div class="media-type-badge">FOTO</div>
            `;
        }
        
        div.innerHTML = `
            <div class="relative group">
                ${mediaHTML}
                <div class="media-overlay"></div>
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        class="delete-btn bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-sm"
                        onclick="event.stopPropagation(); gallery.deleteMedia(${media.id})"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p class="text-white text-sm font-medium truncate">${media.name}</p>
                    <p class="text-white/80 text-xs">${this.formatFileSize(media.size)}</p>
                </div>
            </div>
        `;

        div.addEventListener('click', () => {
            this.openLightbox(media);
        });

        const mediaEl = div.querySelector(media.type === 'video' ? 'video' : 'img');
        if (media.type === 'photo') {
            mediaEl.addEventListener('load', () => {
                mediaEl.classList.remove('loading-skeleton');
            });
        } else {
            mediaEl.addEventListener('loadedmetadata', () => {
                mediaEl.classList.remove('loading-skeleton');
            });
        }

        return div;
    }

    deleteMedia(mediaId) {
        this.allMedia = this.allMedia.filter(media => media.id !== mediaId);
        this.filterMedia(this.currentFilter); // Re-apply current filter
        this.updateStats();
    }

    openLightbox(media) {
        const lightbox = document.getElementById('lightbox');
        const content = document.getElementById('lightboxContent');
        
        if (media.type === 'video') {
            content.innerHTML = `
                <video controls autoplay style="max-width: 90%; max-height: 90%;">
                    <source src="${media.src}" type="video/mp4">
                    Browser Anda tidak mendukung video HTML5.
                </video>
            `;
        } else {
            content.innerHTML = `<img src="${media.src}" alt="${media.name}" style="max-width: 90%; max-height: 90%; object-fit: contain;">`;
        }
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const content = document.getElementById('lightboxContent');
        
        // Pause video if playing
        const video = content.querySelector('video');
        if (video) {
            video.pause();
        }
        
        content.innerHTML = '';
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateStats() {
        const photoCount = this.allMedia.filter(m => m.type === 'photo').length;
        const videoCount = this.allMedia.filter(m => m.type === 'video').length;
        
        // Update button text to show counts
        document.getElementById('showAll').textContent = `Semua Media (${this.allMedia.length})`;
        document.getElementById('showPhotos').textContent = `Foto Saja (${photoCount})`;
        document.getElementById('showVideos').textContent = `Video Saja (${videoCount})`;
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

    loadMedia() {
        return [
            // Foto yang sudah ada
            {
                "id": 1,
                "src": "img/evoks.jpeg",
                "name": "website E-Voting",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 2,
                "src": "img/ujicoba.jpeg",
                "name": "Uji coba traffic website E-Voting",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 3,
                "src": "img/presentasi.jpeg",
                "name": "Presentasi Hasil website E-Voting",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 4,
                "src": "img/17an.jpeg",
                "name": "Kegiatan 17 Agustusan",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 5,
                "src": "img/17ann.jpeg",
                "name": "Kegiatan 17 Agustusan (2)",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 6,
                "src": "img/17.jpeg",
                "name": "Kegiatan 17 Agustusan (3)",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 7,
                "src": "img/apel.jpeg",
                "name": "Apel Pagi",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 8,
                "src": "img/bukutamu.jpeg",
                "name": "Pengecekan Buku Tamu",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 9,
                "src": "img/cap.jpeg",
                "name": "Kegiatan Pengecapan",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 10,
                "src": "img/flyer.jpeg",
                "name": "Pemasangan Flyer di RPP",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 11,
                "src": "img/kevin.jpeg",
                "name": "Kevin main gitar",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 12,
                "src": "img/menang.jpeg",
                "name": "Foto Kemenangan",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 13,
                "src": "img/monitoring.jpeg",
                "name": "Kegiatan Monitoring",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 14,
                "src": "img/nando.jpeg",
                "name": "Foto Nando menang",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 15,
                "src": "img/pkstmik.jpeg",
                "name": "Kegiatan PKS STMIK",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 16,
                "src": "img/pksuin.jpeg",
                "name": "Kegiatan PKS UIN",
                "size": 245760,
                "type": "photo"
            },
            {
                "id": 17,
                "src": "img/senam.jpeg",
                "name": "Kegiatan Senam Pagi",
                "size": 245760,
                "type": "photo"
            },
            
            {
                "id": 18,
                "src": "vid/angkut.mp4",
                "name": "angkut pallete",
                "size": 5242880,
                "type": "video"
            },
            {
                "id": 19,
                "src": "vid/angkut2.mp4",
                "name": "angkut pallete",
                "size": 5242880,
                "type": "video"
            },
        ];
    }
    
    shuffleMedia() {
        let currentIndex = this.allMedia.length, randomIndex;
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            [this.allMedia[currentIndex], this.allMedia[randomIndex]] = [this.allMedia[randomIndex], this.allMedia[currentIndex]];
        }
        
        // Update filtered media as well
        this.filteredMedia = [...this.allMedia];
    }
}

const gallery = new MediaGallery();
window.gallery = gallery;