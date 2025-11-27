// Variables globales
let currentUser = null;
let userGenres = [];
let posts = [];
let projects = [];
let trendingSongs = [];
let ratings = [];
let recommendations = [];

// Elementos del DOM
const userCreationScreen = document.getElementById('user-creation-screen');
const genreSelectionScreen = document.getElementById('genre-selection-screen');
const mainAppScreen = document.getElementById('main-app-screen');
const userNameInput = document.getElementById('user-name-input');
const createUserBtn = document.getElementById('create-user-btn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const genreOptions = document.querySelectorAll('.genre-option');
const saveGenresBtn = document.getElementById('save-genres');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
const processLinkBtn = document.getElementById('process-link');
const processFileBtn = document.getElementById('process-file');
const processingStatus = document.getElementById('processing-status');
const sheetMusicContainer = document.getElementById('sheet-music-container');
const downloadPdfBtn = document.getElementById('download-pdf');
const submitPostBtn = document.getElementById('submit-post');
const postContent = document.getElementById('post-content');
const postsContainer = document.getElementById('posts-container');
const submitProjectBtn = document.getElementById('submit-project');
const projectsContainer = document.getElementById('projects-container');
const trendingList = document.getElementById('trending-list');
const ratingsList = document.getElementById('ratings-list');
const recommendationsContainer = document.getElementById('recommendations-container');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay un usuario guardado
    const savedUser = localStorage.getItem('currentUser');
    const savedGenres = localStorage.getItem('userGenres');
    
    if (savedUser && savedGenres) {
        currentUser = JSON.parse(savedUser);
        userGenres = JSON.parse(savedGenres);
        showMainApp();
    } else if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showGenreSelection();
    }
    // Si no hay usuario guardado, se muestra la pantalla de creación de usuario
});

// Crear usuario
createUserBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    
    if (!name) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    
    if (name.length < 2) {
        alert('El nombre de usuario debe tener al menos 2 caracteres');
        return;
    }
    
    // Crear usuario
    currentUser = {
        id: Date.now().toString(),
        name: name,
        avatar: generateAvatar(name)
    };
    
    // Guardar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Mostrar selección de géneros
    showGenreSelection();
});

// Generar avatar basado en el nombre
function generateAvatar(name) {
    // En una implementación real, esto podría generar un avatar único
    // Por ahora, usaremos un color basado en el nombre
    const colors = [
        '#6a11cb', '#2575fc', '#ff6b6b', '#4ecdc4', '#45b7d1', 
        '#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c', '#7ed6df'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

// Función para mostrar la pantalla de selección de géneros
function showGenreSelection() {
    userCreationScreen.classList.add('hidden');
    genreSelectionScreen.classList.remove('hidden');
    mainAppScreen.classList.add('hidden');
}

// Función para mostrar la aplicación principal
function showMainApp() {
    userCreationScreen.classList.add('hidden');
    genreSelectionScreen.classList.add('hidden');
    mainAppScreen.classList.remove('hidden');
    
    // Actualizar información del usuario
    userName.textContent = currentUser.name;
    
    // Actualizar avatar
    const avatarPlaceholder = document.querySelector('.user-avatar-placeholder');
    if (avatarPlaceholder) {
        avatarPlaceholder.style.backgroundColor = currentUser.avatar;
        avatarPlaceholder.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    
    // Cargar datos iniciales
    loadInitialData();
}

// Manejar selección de géneros
genreOptions.forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('selected');
    });
});

// Guardar géneros seleccionados
saveGenresBtn.addEventListener('click', () => {
    const selectedGenres = Array.from(document.querySelectorAll('.genre-option.selected'))
        .map(el => el.getAttribute('data-genre'));
    
    if (selectedGenres.length === 0) {
        alert('Por favor selecciona al menos un género musical');
        return;
    }
    
    userGenres = selectedGenres;
    
    // Guardar en localStorage
    localStorage.setItem('userGenres', JSON.stringify(userGenres));
    
    showMainApp();
});

// Navegación entre secciones
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover clase activa de todos los enlaces
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Agregar clase activa al enlace clickeado
        link.classList.add('active');
        
        // Ocultar todas las secciones
        sections.forEach(section => section.classList.remove('active'));
        
        // Mostrar la sección correspondiente
        const sectionId = link.getAttribute('data-section') + '-section';
        document.getElementById(sectionId).classList.add('active');
        
        // Cargar datos específicos de la sección si es necesario
        if (sectionId === 'community-section') {
            loadCommunityPosts();
        } else if (sectionId === 'projects-section') {
            loadProjects();
        } else if (sectionId === 'trending-section') {
            loadTrendingAndRatings();
        } else if (sectionId === 'recommendations-section') {
            loadRecommendations();
        }
    });
});

// Cambiar usuario
logoutBtn.addEventListener('click', () => {
    // Limpiar datos de sesión
    currentUser = null;
    userGenres = [];
    
    // Eliminar del localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userGenres');
    
    // Mostrar pantalla de creación de usuario
    userCreationScreen.classList.remove('hidden');
    genreSelectionScreen.classList.add('hidden');
    mainAppScreen.classList.add('hidden');
    
    // Limpiar campo de nombre
    userNameInput.value = '';
});

// Procesar enlace de música
processLinkBtn.addEventListener('click', () => {
    const musicLink = document.getElementById('music-link').value;
    
    if (!musicLink) {
        alert('Por favor ingresa un enlace de música');
        return;
    }
    
    processAudio(musicLink, 'link');
});

// Procesar archivo de audio
processFileBtn.addEventListener('click', () => {
    const audioFile = document.getElementById('audio-file').files[0];
    
    if (!audioFile) {
        alert('Por favor selecciona un archivo de audio');
        return;
    }
    
    processAudio(audioFile, 'file');
});

// Función para procesar audio (simulación)
function processAudio(audioSource, type) {
    // Mostrar estado de procesamiento
    processingStatus.classList.remove('hidden');
    sheetMusicContainer.classList.add('hidden');
    
    // Simular procesamiento con IA (en un caso real, aquí se haría una llamada a una API)
    setTimeout(() => {
        // Ocultar estado de procesamiento
        processingStatus.classList.add('hidden');
        
        // Mostrar partituras generadas
        displaySheetMusic();
        sheetMusicContainer.classList.remove('hidden');
        
        // Agregar a canciones procesadas recientemente
        addToTrending('Canción procesada');
    }, 3000);
}

// Función para mostrar partituras (simulación)
function displaySheetMusic() {
    const instrumentTabs = document.getElementById('instrument-tabs');
    const sheetMusicDisplay = document.getElementById('sheet-music-display');
    
    // Limpiar contenido anterior
    instrumentTabs.innerHTML = '';
    sheetMusicDisplay.innerHTML = '';
    
    // Instrumentos detectados (simulación)
    const detectedInstruments = ['Guitarra', 'Bajo', 'Batería', 'Piano'];
    
    // Crear pestañas para cada instrumento
    detectedInstruments.forEach((instrument, index) => {
        const tab = document.createElement('div');
        tab.className = `tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = instrument;
        tab.addEventListener('click', () => {
            // Remover clase activa de todas las pestañas
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            // Agregar clase activa a la pestaña clickeada
            tab.classList.add('active');
            // Mostrar partitura del instrumento seleccionado
            showInstrumentSheet(instrument);
        });
        instrumentTabs.appendChild(tab);
    });
    
    // Mostrar partitura del primer instrumento por defecto
    showInstrumentSheet(detectedInstruments[0]);
}

// Función para mostrar partitura de un instrumento específico
function showInstrumentSheet(instrument) {
    const sheetMusicDisplay = document.getElementById('sheet-music-display');
    
    // Simulación de partitura (en un caso real, aquí se mostraría la partitura real)
    sheetMusicDisplay.innerHTML = `
        <div style="text-align: center; width: 100%;">
            <h3>Partitura de ${instrument}</h3>
            <div style="margin: 20px 0; font-size: 1.2rem;">
                [Partitura estilo Songsterr para ${instrument}]
            </div>
            <p>Esta es una simulación. En una implementación real, aquí se mostraría la partitura real generada por IA.</p>
        </div>
    `;
}

// Descargar PDF (simulación)
downloadPdfBtn.addEventListener('click', () => {
    alert('En una implementación real, aquí se descargaría un PDF con todas las partituras generadas.');
});

// Publicar en el foro
submitPostBtn.addEventListener('click', () => {
    const content = postContent.value.trim();
    
    if (!content) {
        alert('Por favor escribe un mensaje');
        return;
    }
    
    // Filtrar contenido ofensivo
    if (containsOffensiveLanguage(content)) {
        alert('Tu mensaje contiene lenguaje inapropiado y no puede ser publicado.');
        return;
    }
    
    // Crear nuevo post
    const newPost = {
        id: Date.now(),
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: content,
        date: new Date().toLocaleDateString('es-ES'),
        timestamp: Date.now()
    };
    
    // Agregar a la lista de posts
    posts.unshift(newPost);
    
    // Limpiar el campo de texto
    postContent.value = '';
    
    // Actualizar la visualización
    loadCommunityPosts();
    
    // Guardar en localStorage (simulación)
    localStorage.setItem('communityPosts', JSON.stringify(posts));
});

// Función para detectar lenguaje ofensivo (simulación)
function containsOffensiveLanguage(text) {
    const offensiveWords = [
        'palabra1', 'palabra2', 'insulto', 'odio', 'violencia', 'amenaza'
        // En una implementación real, esta lista sería mucho más extensa
    ];
    
    const lowerText = text.toLowerCase();
    return offensiveWords.some(word => lowerText.includes(word));
}

// Cargar posts de la comunidad
function loadCommunityPosts() {
    // Cargar posts desde localStorage (simulación)
    const storedPosts = localStorage.getItem('communityPosts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    } else {
        // Posts de ejemplo
        posts = [
            {
                id: 1,
                author: 'Usuario Ejemplo',
                authorAvatar: '#6a11cb',
                content: '¡Hola a todos! Estoy buscando recomendaciones de canciones de jazz para transcribir. ¿Alguna sugerencia?',
                date: '15/03/2023',
                timestamp: 1678838400000
            },
            {
                id: 2,
                author: 'Músico Pro',
                authorAvatar: '#2575fc',
                content: 'Acabo de descubrir esta plataforma y me parece increíble. La IA detectó perfectamente los instrumentos de mi última composición.',
                date: '14/03/2023',
                timestamp: 1678752000000
            }
        ];
    }
    
    // Mostrar posts
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        // Crear avatar para el autor
        const avatarStyle = `style="background-color: ${post.authorAvatar}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;"`;
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar" ${avatarStyle}>${post.author.charAt(0).toUpperCase()}</div>
                <div class="post-author">${post.author}</div>
                <div class="post-date">${post.date}</div>
            </div>
            <div class="post-content">${post.content}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Subir proyecto
submitProjectBtn.addEventListener('click', () => {
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const audioFile = document.getElementById('project-audio').files[0];
    
    if (!title || !description || !audioFile) {
        alert('Por favor completa todos los campos y selecciona un archivo de audio');
        return;
    }
    
    // Crear nuevo proyecto
    const newProject = {
        id: Date.now(),
        title: title,
        description: description,
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        date: new Date().toLocaleDateString('es-ES')
    };
    
    // Agregar a la lista de proyectos
    projects.unshift(newProject);
    
    // Limpiar formulario
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-audio').value = '';
    
    // Actualizar la visualización
    loadProjects();
    
    // Guardar en localStorage (simulación)
    localStorage.setItem('userProjects', JSON.stringify(projects));
});

// Cargar proyectos
function loadProjects() {
    // Cargar proyectos desde localStorage (simulación)
    const storedProjects = localStorage.getItem('userProjects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    } else {
        // Proyectos de ejemplo
        projects = [
            {
                id: 1,
                title: 'Composición en Re menor',
                description: 'Una pieza melancólica para guitarra y piano que compuse inspirado en el otoño.',
                author: 'Compositor Anónimo',
                authorAvatar: '#4ecdc4',
                date: '10/03/2023'
            },
            {
                id: 2,
                title: 'Ritmo Urbano Experimental',
                description: 'Fusión de hip hop con elementos de música electrónica y samples de sonidos urbanos.',
                author: 'Beatmaker Pro',
                authorAvatar: '#f0932b',
                date: '08/03/2023'
            }
        ];
    }
    
    // Mostrar proyectos
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        
        // Crear avatar para el autor
        const avatarStyle = `style="background-color: ${project.authorAvatar}; color: white;"`;
        
        projectElement.innerHTML = `
            <div class="project-image">
                <span>Proyecto Musical</span>
            </div>
            <div class="project-info">
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <div class="project-author">
                    <div class="user-avatar-placeholder" ${avatarStyle}>${project.author.charAt(0).toUpperCase()}</div>
                    ${project.author} - ${project.date}
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectElement);
    });
}

// Cargar tendencias y valoraciones
function loadTrendingAndRatings() {
    // Datos de ejemplo para tendencias
    trendingSongs = [
        { rank: 1, title: 'Bohemian Rhapsody', artist: 'Queen', searches: 1245 },
        { rank: 2, title: 'Stairway to Heaven', artist: 'Led Zeppelin', searches: 987 },
        { rank: 3, title: 'Sweet Child O\'Mine', artist: 'Guns N\' Roses', searches: 856 },
        { rank: 4, title: 'Hotel California', artist: 'Eagles', searches: 743 },
        { rank: 5, title: 'Smells Like Teen Spirit', artist: 'Nirvana', searches: 689 }
    ];
    
    // Mostrar tendencias
    trendingList.innerHTML = '';
    trendingSongs.forEach(song => {
        const trendingItem = document.createElement('div');
        trendingItem.className = 'trending-item';
        trendingItem.innerHTML = `
            <div class="trending-rank">${song.rank}</div>
            <div class="trending-info">
                <div class="trending-title">${song.title}</div>
                <div class="trending-artist">${song.artist}</div>
            </div>
            <div class="trending-searches">${song.searches} búsquedas</div>
        `;
        trendingList.appendChild(trendingItem);
    });
    
    // Datos de ejemplo para valoraciones
    ratings = [
        { title: 'Imagine', artist: 'John Lennon', rating: 4.8 },
        { title: 'Yesterday', artist: 'The Beatles', rating: 4.7 },
        { title: 'Hallelujah', artist: 'Jeff Buckley', rating: 4.9 },
        { title: 'Wonderwall', artist: 'Oasis', rating: 4.5 },
        { title: 'Let It Be', artist: 'The Beatles', rating: 4.6 }
    ];
    
    // Mostrar valoraciones
    ratingsList.innerHTML = '';
    ratings.forEach(song => {
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';
        
        // Generar estrellas
        const stars = '★'.repeat(Math.floor(song.rating)) + '☆'.repeat(5 - Math.floor(song.rating));
        
        ratingItem.innerHTML = `
            <div class="rating-info">
                <div class="rating-title">${song.title}</div>
                <div class="rating-artist">${song.artist}</div>
            </div>
            <div class="rating-stars">${stars} (${song.rating})</div>
        `;
        ratingsList.appendChild(ratingItem);
    });
}

// Cargar recomendaciones basadas en géneros del usuario
function loadRecommendations() {
    if (userGenres.length === 0) {
        recommendationsContainer.innerHTML = '<p>Selecciona tus géneros favoritos para obtener recomendaciones personalizadas.</p>';
        return;
    }
    
    // Generar recomendaciones basadas en los géneros del usuario
    const genreRecommendations = {
        rock: [
            { title: 'Back In Black', artist: 'AC/DC', genre: 'Rock' },
            { title: 'Livin\' On A Prayer', artist: 'Bon Jovi', genre: 'Rock' },
            { title: 'Enter Sandman', artist: 'Metallica', genre: 'Rock' }
        ],
        pop: [
            { title: 'Bad Guy', artist: 'Billie Eilish', genre: 'Pop' },
            { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop' },
            { title: 'Dance Monkey', artist: 'Tones and I', genre: 'Pop' }
        ],
        jazz: [
            { title: 'Take Five', artist: 'Dave Brubeck', genre: 'Jazz' },
            { title: 'So What', artist: 'Miles Davis', genre: 'Jazz' },
            { title: 'My Favorite Things', artist: 'John Coltrane', genre: 'Jazz' }
        ],
        // ... más recomendaciones por género
    };
    
    // Combinar recomendaciones de todos los géneros seleccionados
    recommendations = [];
    userGenres.forEach(genre => {
        if (genreRecommendations[genre]) {
            recommendations = recommendations.concat(genreRecommendations[genre]);
        }
    });
    
    // Si no hay suficientes recomendaciones, agregar algunas generales
    if (recommendations.length < 3) {
        recommendations = recommendations.concat([
            { title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop' },
            { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk' },
            { title: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'Pop' }
        ]);
    }
    
    // Mostrar recomendaciones
    recommendationsContainer.innerHTML = '';
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-card';
        recElement.innerHTML = `
            <div class="recommendation-image">
                <span>Álbum</span>
            </div>
            <div class="recommendation-info">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-artist">${rec.artist}</div>
                <div class="recommendation-genre">${rec.genre}</div>
            </div>
        `;
        recommendationsContainer.appendChild(recElement);
    });
}

// Agregar a tendencias
function addToTrending(songTitle) {
    // En una implementación real, esto actualizaría las estadísticas de búsqueda
    console.log(`Canción "${songTitle}" agregada a las estadísticas de búsqueda`);
}

// Cargar datos iniciales
function loadInitialData() {
    loadCommunityPosts();
    loadProjects();
    loadTrendingAndRatings();
    loadRecommendations();
}

// Permitir enviar el formulario con Enter
userNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createUserBtn.click();
    }
});
