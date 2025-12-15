/**
 * Modern Gita - Final Logic
 * Features: Local JSON fetch, SPA navigation, Sanskrit/English Chapter Titles
 * Updates: Auto-detects data format (Raw vs Cleaned)
 */

let gitaData = [];

// ==========================================
// 1. CONSTANTS (Chapter Titles)
// ==========================================

const chapterTitlesEnglish = [
    "The Distress of Arjuna",
    "The Path of Knowledge",
    "The Path of Selfless Action",
    "Wisdom in Action",
    "The Path of Renunciation",
    "The Path of Meditation",
    "Knowledge and Realization",
    "The Imperishable Eternal",
    "The Royal Secret",
    "The Divine Splendor",
    "The Vision of the Cosmic Form",
    "The Path of Devotion",
    "Nature, the Enjoyer, and Consciousness",
    "The Three Modes of Material Nature",
    "The Supreme Divine Personality",
    "The Divine and Demoniac Natures",
    "The Three Divisions of Faith",
    "Liberation and Renunciation"
];

const chapterTitlesSanskrit = [
    "अर्जुनविषादयोग", "सांख्ययोग", "कर्मयोग", "ज्ञानकर्मसंन्यासयोग",
    "कर्मसंन्यासयोग", "ध्यानयोग", "ज्ञानविज्ञानयोग", "अक्षरब्रह्मयोग",
    "राजविद्याराजगुह्ययोग", "विभूतियोग", "विश्वरूपदर्शनयोग", "भक्तियोग",
    "क्षेत्रक्षेत्रज्ञविभागयोग", "गुणत्रयविभागयोग", "पुरुषोत्तमयोग",
    "दैवासुरसंपद्विभागयोग", "श्रद्धात्रयविभागयोग", "मोक्षसंन्यासयोग"
];


// ==========================================
// 2. INITIALIZATION & DATA LOADING
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('gita.json');

        if (!response.ok) throw new Error("File not found");

        const rawData = await response.json();

        // CLEAN & MAP DATA (Universal Handler)
        // This handles both the 'Cleaned' file and the 'Raw' file you pasted
        gitaData = rawData.map(item => {
            
            // 1. Determine Sanskrit Text
            let rawSanskrit = item.sanskrit || item.text || item.shloka || "";
            // Clean it: Remove newlines and trailing numbers like ||1.1||
            let cleanSanskrit = rawSanskrit
                .replace(/\n/g, " ")       
                .replace(/[0-9.|]+$/g, '') 
                .trim();
            // Only add danda if not empty
            if(cleanSanskrit) cleanSanskrit += " ।।";

            // 2. Determine English Text
            // We check 'translation' first. If missing, we fall back to 'transliteration'
            // or 'word_meanings' so the UI is never empty.
            let rawEnglish = item.translation || 
                             item.meaning || 
                             item.english_meaning || 
                             item.transliteration || 
                             item.word_meanings || 
                             "Translation unavailable.";
                             
            let cleanEnglish = rawEnglish.replace(/\n/g, " ").trim();

            return {
                chapter: item.chapter || item.chapter_number || item.chapter_id,
                verse: item.verse || item.verse_number || item.verse_id,
                sanskrit: cleanSanskrit,
                translation: cleanEnglish
            };
        });

        // SORT (Ensure Chapter 1, Verse 1 is first)
        gitaData.sort((a, b) => {
            if (a.chapter === b.chapter) return a.verse - b.verse;
            return a.chapter - b.chapter;
        });

        // LOAD APP
        initApp();

    } catch (error) {
        console.error("Error loading Gita data:", error);
        document.getElementById('loading').innerHTML =
            `<span style="color:red">Error loading text.</span><br>
             <small style="color:#666">Make sure <b>gita.json</b> is in the same folder.</small>`;
    }
});

function initApp() {
    showRandomVerse();
    renderChapterList();
}


// ==========================================
// 3. NAVIGATION & VIEW SWITCHING
// ==========================================

const views = {
    home: document.getElementById('view-home'),
    chapters: document.getElementById('view-chapters'),
    reader: document.getElementById('view-reader')
};

// Event Listeners
document.getElementById('btn-home').addEventListener('click', () => switchView('home'));
document.getElementById('btn-chapters').addEventListener('click', () => switchView('chapters'));
document.getElementById('btn-shuffle').addEventListener('click', showRandomVerse);
document.getElementById('btn-back').addEventListener('click', () => switchView('chapters'));

function switchView(viewName) {
    // Hide all views
    Object.values(views).forEach(el => el.classList.add('hidden'));

    // Show target view
    views[viewName].classList.remove('hidden');

    // Update Nav UI (Active State)
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    if (viewName === 'home') {
        document.getElementById('btn-home').classList.add('active');
    } else if (viewName === 'chapters' || viewName === 'reader') {
        document.getElementById('btn-chapters').classList.add('active');
    }

    // Reset Scroll
    window.scrollTo(0, 0);
}


// ==========================================
// 4. FEATURE: RANDOM VERSE (HOME)
// ==========================================

function showRandomVerse() {
    if (gitaData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * gitaData.length);
    const verse = gitaData[randomIndex];

    // Hide Loader, Show Content
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('verse-content').classList.remove('hidden');

    // Inject Content
    document.getElementById('sanskrit-text').textContent = verse.sanskrit;
    document.getElementById('translation-text').textContent = verse.translation;
    document.getElementById('verse-reference').textContent = `Chapter ${verse.chapter} • Verse ${verse.verse}`;
}


// ==========================================
// 5. FEATURE: CHAPTER LIST (Sanskrit + English)
// ==========================================

function renderChapterList() {
    const grid = document.getElementById('chapter-grid');
    grid.innerHTML = ''; // Clear current list

    for (let i = 1; i <= 18; i++) {
        const card = document.createElement('div');
        card.className = 'chapter-card';

        const sanskrit = chapterTitlesSanskrit[i - 1];
        const english = chapterTitlesEnglish[i - 1];

        card.innerHTML = `
            <div style="font-size: 0.75rem; color: #C2410C; font-weight: 700; text-transform: uppercase; margin-bottom: 0.8rem; letter-spacing: 0.05em;">
                Chapter ${i}
            </div>
            
            <h3 style="font-family: 'Merriweather', serif; font-size: 1.3rem; color: #111827; margin-bottom: 0.3rem; font-weight: 700;">
                ${sanskrit}
            </h3>
            
            <p style="font-family: 'Inter', sans-serif; font-size: 0.95rem; color: #6B7280;">
                ${english}
            </p>
        `;

        card.onclick = () => openChapter(i);
        grid.appendChild(card);
    }
}


// ==========================================
// 6. FEATURE: FULL READER
// ==========================================

function openChapter(chapterNum) {
    const chapterVerses = gitaData.filter(v => v.chapter == chapterNum);
    const container = document.getElementById('reader-content');

    // Reader Header
    container.innerHTML = `
        <div style="text-align:center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #eee;">
            <span style="color: #C2410C; font-weight: bold; text-transform: uppercase; font-size: 0.8rem;">Chapter ${chapterNum}</span>
            <h2 style="font-family: 'Merriweather', serif; font-size: 2.2rem; margin-top: 0.5rem;">${chapterTitlesSanskrit[chapterNum - 1]}</h2>
            <p style="color: #666; margin-top: 0.5rem;">${chapterTitlesEnglish[chapterNum - 1]}</p>
        </div>
    `;

    // Loop Verses
    chapterVerses.forEach(v => {
        const verseBlock = document.createElement('div');

        // Styling for the verse block
        verseBlock.style.marginBottom = "4rem";
        verseBlock.style.borderBottom = "1px solid #f3f4f6";
        verseBlock.style.paddingBottom = "3rem";

        verseBlock.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <span style="background-color: #F3F4F6; color: #374151; font-weight: 600; font-size: 0.75rem; padding: 4px 12px; border-radius: 99px;">
                    Verse ${v.verse}
                </span>
            </div>

            <p style="font-family: 'Merriweather', serif; font-size: 1.5rem; line-height: 1.8; margin-bottom: 1.5rem; color: #111827;">
                ${v.sanskrit}
            </p>

            <p style="font-family: 'Inter', sans-serif; font-size: 1.1rem; color: #4B5563; line-height: 1.7;">
                ${v.translation}
            </p>
        `;
        container.appendChild(verseBlock);
    });

    switchView('reader');
}