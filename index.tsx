
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// --- TYPE DEFINITIONS ---
interface Task {
    title: string;
    icon: string;
    description: string;
    image: string;
}

type Slide = {
    type: 'intro' | 'impact' | 'conclusion';
    backgroundUrl: string;
} | {
    type: 'task';
    taskIndex: number;
    backgroundUrl: string;
} & Task;

// --- DATA & CONFIG ---
const PRESENTATION_DATE = "July 03, 2025, 2:10 PM CDT";
const TASKS: Task[] = [
    { title: "Delivering Documents", icon: 'file-text', description: "Automated point-to-point delivery of sensitive documents, contracts, and internal memos, ensuring speed and confidentiality.", image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Distributing Incoming Mail", icon: 'mail', description: "Sorting and delivering incoming mail and small parcels directly to employee desks or department mailboxes.", image: "https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Restocking Office Supplies", icon: 'printer', description: "Monitoring supply levels in printers, copy rooms, and kitchens, and automatically fetching and restocking items as needed.", image: "https://images.pexels.com/photos/5797991/pexels-photo-5797991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Visitor & New Hire Guidance", icon: 'users', description: "Greeting and guiding visitors to their meeting rooms or escorting new employees on their first-day office tour.", image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Serving Refreshments", icon: 'coffee', description: "Serving coffee, water, or other refreshments to guests and employees during meetings.", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Recycling & Trash Pickup", icon: 'trash-2', description: "Scheduled pickup of recycling and trash from bins around the office, promoting a clean workspace.", image: "https://images.pexels.com/photos/3850634/pexels-photo-3850634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "AV Equipment Transport", icon: 'cpu', description: "Safely moving projectors, speakers, and other AV equipment between meeting rooms as needed.", image: "https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Hybrid Worker Desk Setup", icon: 'users', description: "Preparing 'hot desks' for hybrid workers with requested equipment like keyboards, monitors, and docking stations.", image: "https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "IT Hardware Transport", icon: 'cpu', description: "Transporting laptops, monitors, and other IT hardware to and from the IT department for setup or repair.", image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Meeting Room Setup", icon: 'layers', description: "Arranging chairs, tables, and other physical aspects of a meeting room according to a specific layout.", image: "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Inter-departmental Sample Transport", icon: 'package', description: "Transporting product samples, lab specimens, or engineering prototypes between departments like R&D, quality assurance, and marketing.", image: "https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Catering Delivery", icon: 'coffee', description: "Distributing catered lunches or snacks from a central drop-off point to different team areas or meeting rooms.", image: "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Secure Document Shredding", icon: 'shield', description: "Collecting documents from secure shredding bins and transporting them to a central shredder location.", image: "https://images.pexels.com/photos/6863261/pexels-photo-6863261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Equipment Check-in/Check-out", icon: 'clipboard', description: "Managing a library of shared equipment (laptops, tablets, projectors) by delivering them to and retrieving them from employees.", image: "https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Office Plant Watering", icon: 'sparkles', description: "Navigating a programmed route to water office plants, ensuring they stay healthy and improve the office ambiance.", image: "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "End-of-Day Workspace Cleanup", icon: 'briefcase', description: "Running a patrol at the end of the day to collect stray mugs, plates, and notebooks from common areas and hot desks.", image: "https://images.pexels.com/photos/3747488/pexels-photo-3747488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Running Urgent Errands", icon: 'zap', description: "Delivering a forgotten laptop charger or important file from one end of the campus to another on-demand.", image: "https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "IT Peripherals Delivery", icon: 'monitor', description: "Delivering new keyboards, mice, or headsets from IT storage to employee desks.", image: "https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Archiving & File Retrieval", icon: 'folder', description: "Transporting boxes of documents to and from on-site archive rooms based on retrieval requests.", image: "https://images.pexels.com/photos/733255/pexels-photo-733255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Setting up for Events", icon: 'layers', description: "Assisting with the setup for office events by distributing swag, placing signage, or arranging materials.", image: "https://images.pexels.com/photos/154147/pexels-photo-154147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Internal Audit Support", icon: 'shield', description: "Transporting sensitive financial documents or case files between auditors and employees in a secure, trackable manner.", image: "https://images.pexels.com/photos/7551631/pexels-photo-7551631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
];
const SLIDES: Slide[] = [
    { type: 'intro', backgroundUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    ...TASKS.map((task, index) => ({ type: 'task' as const, ...task, taskIndex: index, backgroundUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" })),
    { type: 'impact', backgroundUrl: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { type: 'conclusion', backgroundUrl: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
];

// --- STATE ---
let currentSlide = 0;
let isSpeaking = false;
let ai: GoogleGenAI | null = null;

// --- DOM ELEMENTS ---
const presentationContainer = document.getElementById('presentation-container') as HTMLDivElement;
const geminiModalContainer = document.getElementById('gemini-modal-container') as HTMLDivElement;
const prevButton = document.getElementById('prev-slide') as HTMLButtonElement;
const nextButton = document.getElementById('next-slide') as HTMLButtonElement;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
const slideCounter = document.getElementById('slide-counter') as HTMLDivElement;

// --- ICON HELPER ---
const ICONS: { [key: string]: string } = {
    'file-text': `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>`,
    'package': `<line x1="16.5" y1="9.4" x2="7.5" y2="4.2"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
    'mail': `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
    'printer': `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>`,
    'layers': `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
    'zap': `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    'users': `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    'coffee': `<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
    'monitor': `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
    'sparkles': `<path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"/><path d="M5 22v-5"/><path d="m19 22 v-5"/><path d="M22 5h-5"/><path d="M22 19h-5"/>`,
    'trash-2': `<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>`,
    'cpu': `<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>`,
    'shield': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>`,
    'clipboard': `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>`,
    'briefcase': `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>`,
    'folder': `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>`,
};
function getIconHTML(name: string, classes = ''): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${classes}">${ICONS[name] || ''}</svg>`;
}

// --- GEMINI SERVICE ---
function initializeAi() {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API_KEY environment variable not found.");
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("AI Service disabled:", e instanceof Error ? e.message : String(e));
        ai = null;
    }
}

async function generateImage(prompt: string): Promise<string | null> {
     if (!ai) {
        console.warn("AI service not available for image generation.");
        return null;
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Gemini image generation error:", error);
        return null;
    }
}

async function callGeminiAPI(prompt: string): Promise<string> {
    if (!ai) {
        return "AI features are currently unavailable. Please ensure the API_KEY is configured correctly.";
    }
    openGeminiModal({ isLoading: true });
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call error:", error);
        return `An error occurred while contacting the AI assistant. Details: ${error instanceof Error ? error.message : String(error)}`;
    }
}

// --- MODAL & CONTENT RENDERING ---
function parseAndFormatContent(text: string): string {
    const lines = text.split('\n');
    let html = '';
    let listType: 'ul' | 'ol' | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        const isUListItem = trimmed.startsWith('* ') || trimmed.startsWith('- ');
        const isOListItem = /^\d+\.\s/.test(trimmed);

        if (!isUListItem && !isOListItem && listType) {
            html += `</${listType}>`;
            listType = null;
        }

        if (isUListItem) {
            if (listType !== 'ul') {
                html += `<ul>`;
                listType = 'ul';
            }
            html += `<li>${trimmed.substring(2)}</li>`;
        } else if (isOListItem) {
            if (listType !== 'ol') {
                html += `<ol>`;
                listType = 'ol';
            }
            html += `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
        } else if (trimmed) {
            html += `<p>${line}</p>`;
        }
    }
    if (listType) html += `</${listType}>`;
    return html.replace(/<p><\/p>/g, '');
}

function openGeminiModal({ title = '✨ AI Assistant', content = '', isLoading = false, showCopy = false }) {
    let contentHtml: string;
    if (isLoading) {
        contentHtml = `<div class="flex items-center justify-center h-full min-h-[150px]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300"></div></div>`;
    } else {
        contentHtml = `<div class="prose prose-invert max-w-none">${parseAndFormatContent(content)}</div>`;
    }

    geminiModalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in" id="gemini-modal-overlay">
            <div class="relative w-full max-w-2xl p-4" id="gemini-modal-content-area">
                 <div class="bg-slate-800 border border-cyan-500/50 rounded-lg shadow-2xl text-white">
                    <div class="p-6 border-b border-cyan-500/50 flex justify-between items-center">
                        <h3 class="text-2xl font-bold text-cyan-300 flex items-center gap-3">${title}</h3>
                        <button id="gemini-close-btn" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    <div class="p-6 min-h-[200px] max-h-[60vh] overflow-y-auto">${contentHtml}</div>
                    ${!isLoading && content ? `
                    <div class="p-4 bg-slate-900/50 border-t border-cyan-500/50 flex justify-end gap-4">
                       <button id="speak-btn" class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                          ${isSpeaking ? '⏹️ Stop' : '🔊 Speak'}
                       </button>
                       ${showCopy ? `<button id="copy-btn" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-32 justify-center">📋 Copy</button>` : ''}
                    </div>` : ''}
                 </div>
            </div>
        </div>`;
    
    document.getElementById('gemini-close-btn')?.addEventListener('click', closeGeminiModal);
    document.getElementById('gemini-modal-overlay')?.addEventListener('click', closeGeminiModal);
    document.getElementById('gemini-modal-content-area')?.addEventListener('click', e => e.stopPropagation());
    
    if (!isLoading && content) {
        document.getElementById('speak-btn')?.addEventListener('click', () => handleSpeak(content, title, showCopy));
        if (showCopy) {
            document.getElementById('copy-btn')?.addEventListener('click', () => copyToClipboard(content));
        }
    }
}

function closeGeminiModal() {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    isSpeaking = false;
    geminiModalContainer.innerHTML = '';
}

function handleSpeak(text: string, title: string, showCopy: boolean) {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
    } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => { isSpeaking = false; openGeminiModal({ title, content: text, showCopy }); };
        utterance.onerror = () => { isSpeaking = false; openGeminiModal({ title, content: text, showCopy }); };
        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
    }
    openGeminiModal({ title, content: text, showCopy });
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        if(copyBtn) {
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => { 
                if (copyBtn) copyBtn.textContent = '📋 Copy';
             }, 2000);
        }
    });
}

// --- SLIDE RENDERING & NAVIGATION ---
function renderSlides() {
    presentationContainer.innerHTML = SLIDES.map((slide) => {
        let content: string;
        switch (slide.type) {
            case 'intro':
                content = `<div class="relative z-10 text-center">
                            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-cyan-300 mb-4">The 10-Minute Advantage</h1>
                            <p class="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8">Automating Office Tasks with Physical Robotics</p>
                            <div class="bg-white/10 backdrop-blur-lg rounded-lg px-6 py-4 inline-block"><p class="text-lg md:text-xl text-gray-300">${PRESENTATION_DATE}</p></div>
                         </div>`;
                break;
            case 'task':
                content = `<div class="absolute top-8 right-8 text-cyan-300/20 font-bold text-9xl animate-float z-0">10</div>
                           <div class="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4">
                              <div>
                                  <div class="flex items-center mb-4">
                                      <div class="p-3 bg-cyan-400/20 rounded-full mr-4 text-cyan-300">${getIconHTML(slide.icon, 'w-12 h-12')}</div>
                                      <h2 class="text-3xl md:text-4xl font-bold text-cyan-300">${slide.title}</h2>
                                  </div>
                                  <p class="text-lg md:text-xl text-gray-200 mb-6">${slide.description}</p>
                                  <div class="flex flex-col sm:flex-row gap-4">
                                      <div class="bg-green-500/20 border border-green-400 text-green-300 rounded-lg p-4 flex items-center">
                                          ${getIconHTML('zap', 'mr-3 w-6 h-6 flex-shrink-0')} <p class="font-semibold">Time Saved: Contributes to 10 mins/day.</p>
                                      </div>
                                      <button class="generate-points-btn bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-300 rounded-lg p-4 flex items-center transition-colors font-semibold" data-task-index="${slide.taskIndex}">
                                          ${getIconHTML('sparkles', 'mr-3 w-6 h-6')} <span>Generate Talking Points</span>
                                      </button>
                                  </div>
                              </div>
                              <div class="relative">
                                  <img id="task-image-${slide.taskIndex}" src="${slide.image}" alt="${slide.title}" class="rounded-lg shadow-2xl w-full h-auto object-cover border-4 border-cyan-500/50 bg-slate-800 aspect-video transition-all duration-300">
                                  <div id="image-loader-${slide.taskIndex}" class="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center rounded-lg" style="display: none;">
                                       <div class="flex flex-col items-center gap-2 text-white">
                                          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-300"></div>
                                          <p class="text-sm font-medium">Generating image...</p>
                                       </div>
                                  </div>
                                  <button class="generate-image-btn absolute bottom-4 right-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors z-10 shadow-lg" data-task-index="${slide.taskIndex}">
                                      ${getIconHTML('sparkles', 'w-5 h-5')} Generate with AI
                                  </button>
                              </div>
                           </div>`;
                break;
            case 'impact':
                content = `<div class="relative z-10 text-center w-full max-w-5xl px-4">
                            <h2 class="text-4xl md:text-5xl font-bold text-cyan-300 mb-4">Customize Your Impact</h2>
                            <p class="text-xl text-gray-200 mb-8">Enter your team size to see the potential savings.</p>
                            <div class="mb-8 flex justify-center items-center gap-4">
                                <label for="employeeCount" class="text-lg text-gray-200">Number of Employees:</label>
                                <input type="number" id="employeeCount" value="20" class="bg-white/20 text-white text-center font-bold text-xl w-28 p-2 rounded-lg border-2 border-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:outline-none">
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-left">
                                    <h3 class="text-2xl font-bold text-cyan-400 mb-4">Annual Time Savings</h3>
                                    <div id="yearly-savings" class="text-6xl font-bold text-white mb-2">833</div> <p class="text-xl text-gray-300">Hours Saved Per Year</p>
                                </div>
                                <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-left">
                                    <h3 class="text-2xl font-bold text-cyan-400 mb-4">Projected Annual ROI</h3>
                                    <div id="roi-value" class="text-6xl font-bold text-green-400 mb-2">$4,373</div> <p class="text-xl text-gray-300">Potential Value Unlocked</p>
                                </div>
                            </div>
                         </div>`;
                break;
            case 'conclusion':
                content = `<div class="relative z-10 text-center px-4">
                            <h2 class="text-4xl md:text-5xl font-bold text-cyan-300 mb-6">Shape the Future of Your Workplace</h2>
                            <p class="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">Embrace automation to unlock human potential, boost efficiency, and create a smarter office environment.</p>
                            <div class="flex flex-col md:flex-row items-center justify-center gap-6">
                                <button id="generate-ideas-btn" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg flex items-center gap-2">${getIconHTML('sparkles', 'w-5 h-5')} Suggest More Ideas</button>
                                <button id="draft-email-btn" class="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg flex items-center gap-2">${getIconHTML('mail', 'w-5 h-5')} Draft Follow-up Email</button>
                            </div>
                            <p class="mt-8 text-gray-400">Contact: apost@cricketsus.com | <a href="https://p4photel.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-cyan-300">CRICKETS Global</a></p>
                         </div>`;
                break;
        }
        return `<div class="slide justify-center items-center text-white overflow-hidden" style="background-image: url('${slide.backgroundUrl}'); background-size: cover; background-position: center;">
                    <div class="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
                    ${content}
                </div>`;
    }).join('');
    
    addDynamicEventListeners();
}

function updateSlide() {
    document.querySelectorAll('.slide').forEach((slideEl, index) => {
        slideEl.classList.toggle('active', index === currentSlide);
    });
    progressBar.style.width = `${((currentSlide + 1) / SLIDES.length) * 100}%`;
    slideCounter.textContent = `${currentSlide + 1} / ${SLIDES.length}`;
}

function updateImpact() {
    const countInput = document.getElementById('employeeCount') as HTMLInputElement | null;
    if (!countInput) return;
    const employeeCount = parseInt(countInput.value, 10) || 0;
    const yearlySavings = Math.round(employeeCount * 10 * 250 / 60);
    const roiValue = Math.round(yearlySavings * 35 * 0.15);
    const yearlySavingsEl = document.getElementById('yearly-savings');
    const roiValueEl = document.getElementById('roi-value');
    if (yearlySavingsEl) yearlySavingsEl.textContent = yearlySavings.toLocaleString();
    if (roiValueEl) roiValueEl.textContent = `$${roiValue.toLocaleString()}`;
}

// --- EVENT HANDLERS ---
async function handleGenerateImage(e: Event) {
    if (!ai) {
        openGeminiModal({ title: '⚠️ AI Error', content: 'AI service not available for image generation. Please ensure API Key is set.' });
        return;
    }

    const target = e.currentTarget as HTMLButtonElement;
    target.disabled = true;

    const taskIndex = parseInt(target.dataset.taskIndex || '0', 10);
    const imageElement = document.getElementById(`task-image-${taskIndex}`) as HTMLImageElement | null;
    const loaderElement = document.getElementById(`image-loader-${taskIndex}`) as HTMLDivElement | null;

    if (!imageElement || !loaderElement) return;

    loaderElement.style.display = 'flex';
    target.innerHTML = `${getIconHTML('sparkles', 'w-5 h-5 animate-pulse')} Generating...`;

    const task = TASKS[taskIndex];
    const prompt = `A photorealistic, bright, and optimistic image of a friendly, sleek, white and cyan office robot performing the task: '${task.title}'. The robot is in a modern, clean, well-lit office environment. The image should be high-resolution, professional, and suitable for a corporate presentation. No people in the image. Focus on the robot and the task.`;
    
    const imageUrl = await generateImage(prompt);

    loaderElement.style.display = 'none';

    if (imageUrl) {
        const img = new Image();
        img.onload = () => {
            imageElement.src = imageUrl;
            target.style.display = 'none'; // Hide button on success
        };
        img.onerror = () => {
            openGeminiModal({ title: '⚠️ Image Generation Failed', content: 'Could not load the generated image. Please try again.' });
            target.disabled = false;
            target.innerHTML = `${getIconHTML('sparkles', 'w-5 h-5')} Generate with AI`;
        };
        img.src = imageUrl;
    } else {
        // This case handles API call errors from within generateImage
        openGeminiModal({ title: '⚠️ Image Generation Failed', content: 'The AI service failed to generate an image. This may be due to rate limits or a network issue. Please try again later.' });
        target.disabled = false;
        target.innerHTML = `${getIconHTML('sparkles', 'w-5 h-5')} Generate with AI`;
    }
}

async function handleGenerateTalkingPoints(e: Event) {
    const target = e.currentTarget as HTMLButtonElement;
    const taskIndex = parseInt(target.dataset.taskIndex || '0', 10);
    const task = TASKS[taskIndex];
    const title = `✨ AI Talking Points: ${task.title}`;
    const prompt = `You are an expert in office automation. Generate 3-4 concise talking points for a presentation about using a robot for "${task.title}". Highlight benefits like time savings, efficiency, and employee satisfaction. The task is: "${task.description}". Format as a bulleted list.`;
    openGeminiModal({ title, isLoading: true });
    const result = await callGeminiAPI(prompt);
    openGeminiModal({ title, content: result });
}

async function handleGenerateIdeas() {
    const title = "✨ AI-Suggested Automation Ideas";
    const taskTitles = TASKS.map(t => t.title).join(', ');
    const prompt = `Based on these automated tasks: ${taskTitles}, suggest 5 new, innovative tasks an office robot could do. Present as a numbered list with brief explanations. Keep the explanations concise.`;
    openGeminiModal({ title, isLoading: true });
    const result = await callGeminiAPI(prompt);
    openGeminiModal({ title, content: result });
}

async function handleDraftEmail() {
    const title = "✨ AI-Drafted Follow-up Email";
    const prompt = `Draft a professional, enthusiastic follow-up email to a stakeholder after a presentation on robotic office automation. Include key benefits (saving 10 mins/employee/day), mention ROI, and suggest a follow-up. Sign off with contact info: apost@cricketsus.com and a link to p4photel.com. Format it as a ready-to-send email with a subject line.`;
    openGeminiModal({ title, isLoading: true, showCopy: true });
    const result = await callGeminiAPI(prompt);
    openGeminiModal({ title, content: result, showCopy: true });
}

function navigate(direction: 1 | -1) {
    currentSlide = (currentSlide + direction + SLIDES.length) % SLIDES.length;
    updateSlide();
}

// --- INITIALIZATION ---
function addDynamicEventListeners() {
    document.querySelectorAll('.generate-points-btn').forEach(btn => btn.addEventListener('click', handleGenerateTalkingPoints));
    document.querySelectorAll('.generate-image-btn').forEach(btn => btn.addEventListener('click', handleGenerateImage));
    document.getElementById('generate-ideas-btn')?.addEventListener('click', handleGenerateIdeas);
    document.getElementById('draft-email-btn')?.addEventListener('click', handleDraftEmail);
    const employeeCountInput = document.getElementById('employeeCount');
    if (employeeCountInput) {
        employeeCountInput.addEventListener('input', updateImpact);
        updateImpact();
    }
}

function init() {
    initializeAi();
    renderSlides();
    updateSlide();
    
    nextButton?.addEventListener('click', () => navigate(1));
    prevButton?.addEventListener('click', () => navigate(-1));
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'Escape') closeGeminiModal();
    });
}

init();
