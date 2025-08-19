// ---- State helpers ----
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const builder = $('#builder');
const projectsWrap = $('#projectsWrap');
const expWrap = $('#expWrap');

const out = {
  name: $('#outName'),
  role: $('#outRole'),
  bio: $('#outBio'),
  skills: $('#outSkills'),
  links: $('#outLinks'),
  projects: $('#outProjects'),
  exp: $('#outExp'),
  avatar: $('#outAvatar'),
  name2: $('#outName2'),
};

// Loader animation
window.addEventListener('load', ()=>{
  const loader=document.getElementById('loader');
  loader.style.opacity='0';
  setTimeout(()=>loader.style.display='none',500);
});

// Default avatar (initials)
function drawInitialsAvatar(name=''){
  const initials = (name.trim().split(/\s+/).map(s => s[0] || '').join('').slice(0,2) || '?').toUpperCase();
  const canvas = document.createElement('canvas');
  canvas.width = 224; canvas.height = 224;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0,0,224,224);
  g.addColorStop(0, getComputedStyle(document.body).getPropertyValue('--accent').trim());
  g.addColorStop(1, getComputedStyle(document.body).getPropertyValue('--accent-2').trim());
  ctx.fillStyle = g; ctx.fillRect(0,0,224,224);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.font = 'bold 110px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(initials, 112, 120);
  return canvas.toDataURL('image/png');
}

function updatePreview(){
  const fd = new FormData(builder);
  const name = fd.get('name')?.toString().trim();
  const role = fd.get('role')?.toString().trim();
  const bio = fd.get('bio')?.toString().trim();
  const skills = fd.get('skills')?.toString().split(',').map(s=>s.trim()).filter(Boolean);
  const links = [
    ['Website', fd.get('website')],
    ['GitHub', fd.get('github')],
    ['LinkedIn', fd.get('linkedin')],
    ['Twitter', fd.get('twitter')],
    ['Instagram', fd.get('instagram')],
    ['Email', fd.get('email') ? 'mailto:'+fd.get('email') : ''],
    ['Location', fd.get('location') ? 'https://www.google.com/maps/search/'+encodeURIComponent(fd.get('location')) : '']
  ].filter(([,v]) => v && v.toString().trim());

  out.name.textContent = name || 'Your Name';
  out.name2.textContent = name || 'Your Name';
  out.role.textContent = role || 'Role / Tagline';
  out.bio.textContent = bio || 'Write a brief introduction about yourself.';

  // Skills tags
  out.skills.innerHTML = '';
  (skills || []).forEach(txt => {
    const span = document.createElement('span');
    span.className = 'tag'; span.textContent = txt; out.skills.appendChild(span);
  });

  // Links
  out.links.innerHTML = '';
  for (const [label, url] of links){
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'link-item';
    a.innerHTML = `${iconFor(label)} <span>${label}</span>`;
    out.links.appendChild(a);
  }

  // Projects
  out.projects.innerHTML = '';
  const projects = $$('[name="projTitle"]', projectsWrap).map((input, i) => {
    const root = input.closest('.cardish');
    return {
      title: input.value.trim(),
      link: $('[name="projLink"]', root)?.value.trim(),
      desc: $('[name="projDesc"]', root)?.value.trim(),
    };
  }).filter(p => p.title || p.desc || p.link);

  projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'cardish';
    const titleHtml = p.link ? `<a href="${p.link}" target="_blank" rel="noopener"><strong>${escapeHtml(p.title || 'Untitled Project')}</strong></a>`
                             : `<strong>${escapeHtml(p.title || 'Untitled Project')}</strong>`;
    div.innerHTML = `<h4>${titleHtml}</h4><p class="muted">${escapeHtml(p.desc || '')}</p>`;
    out.projects.appendChild(div);
  });

  // Experience
  out.exp.innerHTML = '';
  const exps = $$('[name="expCompany"]', expWrap).map((input, i) => {
    const root = input.closest('.cardish');
    return {
      company: input.value.trim(),
      role: $('[name="expRole"]', root)?.value.trim(),
      start: $('[name="expStart"]', root)?.value.trim(),
      end: $('[name="expEnd"]', root)?.value.trim(),
      desc: $('[name="expDesc"]', root)?.value.trim(),
    };
  }).filter(e => e.company || e.role || e.desc);

  exps.forEach(e => {
    const div = document.createElement('div');
    div.className = 'cardish';
    const when = [e.start, e.end].filter(Boolean).join(' – ');
    div.innerHTML = `<strong>${escapeHtml(e.role || 'Role')}</strong> · ${escapeHtml(e.company || 'Company')}<br><span class="small">${escapeHtml(when)}</span><p class="muted" style="margin:.4rem 0 0">${escapeHtml(e.desc || '')}</p>`;
    out.exp.appendChild(div);
  });
}

function escapeHtml(str=''){
  return str.replace(/[&<>\"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

function iconFor(label){
  const l = String(label).toLowerCase();
  const svg = (p)=>`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="${p}"/></svg>`
  if(l.includes('github')) return svg('M9 19c-4 1.5-4-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 3.77 5.07 5.07 0 0 0 17.91 0S16.73-.35 14 1.3a13.38 13.38 0 0 0-10 0C1.27-.35.09 0 .09 0A5.07 5.07 0 0 0 0 3.77 5.44 5.44 0 0 0 1.5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 7 19.13V23');
  if(l.includes('linkedin')) return svg('M16 8a6 6 0 0 1 6 6v8h-4v-8a2 2 0 1 0-4 0v8h-4v-14h4v2a4 4 0 0 1 2-2z M2 9h4v14H2z M4 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4');
  if(l.includes('twitter') || l.includes('x')) return svg('M22 5.7c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4.9C18 4 17 3.5 15.9 3.5c-2.1 0-3.8 1.8-3.8 4 0 .3 0 .7.1 1C8.5 8.4 5 6.6 2.7 3.8c-.4.7-.6 1.5-.6 2.4 0 1.4.7 2.6 1.7 3.4-.6 0-1.2-.2-1.7-.5v.1c0 2 1.3 3.6 3 4-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.7 2 2.9 3.8 3-1.3 1-3 1.6-4.7 1.6H3c1.7 1.1 3.7 1.7 5.9 1.7 7.1 0 11-6 11-11.2v-.5c.7-.6 1.4-1.2 2.1-2z');
  if(l.includes('instagram')) return svg('M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6.5-2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z');
  if(l.includes('email')) return svg('M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 0l8 7 8-7');
  if(l.includes('website') || l.includes('location')) return svg('M2 12a10 10 0 1 0 20 0A10 10 0 0 0 2 12zm0 0h20');
  return svg('M4 12h16');
}

// Theme switcher
const themeSelect = $('#themeSelect');
themeSelect.addEventListener('change', () => {
  document.body.className = themeSelect.value;
  // refresh avatar gradient if using initials
  if(out.avatar.dataset.initials === '1'){
    out.avatar.src = drawInitialsAvatar($('#name').value);
  }
});

// Add default one project & one experience row
function addProject(){
  const node = document.importNode($('#projectFields').content, true);
  projectsWrap.appendChild(node);
  bindRowEvents();
  updatePreview();
}
function addExp(){
  const node = document.importNode($('#expFields').content, true);
  expWrap.appendChild(node);
  bindRowEvents();
  updatePreview();
}
$('#addProject').addEventListener('click', addProject);
$('#addExp').addEventListener('click', addExp);

function bindRowEvents(){
  $$('.removeRow').forEach(btn => {
    if(!btn._bound){
      btn._bound = true;
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.cardish');
        row?.remove();
        updatePreview();
      });
    }
  });
  // Update on typing
  $$('input, textarea').forEach(el => {
    if(!el._bound){ el._bound = true; el.addEventListener('input', updatePreview); }
  });
}

// Avatar upload / initials fallback
const avatarInput = $('#avatar');
function setInitials(){
  out.avatar.src = drawInitialsAvatar($('#name').value);
  out.avatar.dataset.initials = '1';
}
setInitials();

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files?.[0];
  if(!file){ setInitials(); return; }
  const reader = new FileReader();
  reader.onload = e => { out.avatar.src = e.target.result; out.avatar.dataset.initials = '0'; };
  reader.readAsDataURL(file);
});
$('#name').addEventListener('input', () => { if(out.avatar.dataset.initials === '1') setInitials(); });

// Footer year
$('#year').textContent = new Date().getFullYear();

// Reset
$('#btnReset').addEventListener('click', () => {
  builder.reset(); projectsWrap.innerHTML=''; expWrap.innerHTML=''; setInitials(); addProject(); updatePreview();
});

// Download standalone HTML
$('#btnDownload').addEventListener('click', () => {
  const html = buildExportHtml();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  const name = ($('#name').value || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  a.download = `${name || 'portfolio'}.html`;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
});

function buildExportHtml(){
  // Inline styles from this document and the live preview content
  const style = document.querySelector('style').outerHTML;
  const themeClass = document.body.className || 'theme-dark';
  // Clone preview node
  const preview = document.querySelector('.portfolio').cloneNode(true);
  // Remove ARIA live attributes for static export
  preview.removeAttribute('aria-live');
  // Create minimal document
  return `<!DOCTYPE html><html lang="en"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>${escapeHtml($('#name').value || 'Portfolio')}</title>${style}</head><body class=\"${themeClass}\"><div style=\"max-width:1000px;margin:24px auto;padding:12px;\">${preview.outerHTML}</div></body></html>`;
}

// Initialize
addProject();
addExp();
bindRowEvents();
updatePreview();