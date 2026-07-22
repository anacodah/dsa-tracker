// Function to scrape problem details
function getProblemDetails() {
  let name = document.title.split(' - ')[0] || 'Unknown Problem';
  let difficulty = 'Medium'; // default
  
  // Try to find difficulty
  const diffEls = document.querySelectorAll('div');
  for (const el of diffEls) {
    if (el.innerText === 'Easy' || el.innerText === 'Medium' || el.innerText === 'Hard') {
      difficulty = el.innerText;
      break;
    }
  }

  const url = window.location.href.split('?')[0];

  return { name, difficulty, url };
}

// Add the floating button
function addButton() {
  if (document.getElementById('dsa-tracker-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'dsa-tracker-btn';
  btn.className = 'dsa-tracker-btn';
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
    Log to DSA Tracker
  `;

  btn.addEventListener('click', () => {
    const details = getProblemDetails();
    
    // Edit this URL to match your deployed Vercel URL
    const TRACKER_URL = 'http://localhost:5173/log';
    
    const targetUrl = new URL(TRACKER_URL);
    targetUrl.searchParams.set('name', details.name);
    targetUrl.searchParams.set('url', details.url);
    targetUrl.searchParams.set('difficulty', details.difficulty);
    
    window.open(targetUrl.toString(), '_blank');
  });

  document.body.appendChild(btn);
}

// Check repeatedly since LeetCode is an SPA
setInterval(() => {
  if (window.location.href.includes('/problems/') && !document.getElementById('dsa-tracker-btn')) {
    addButton();
  }
}, 2000);
