
const contacts = [
  { id: 'barangay', label: 'BARANGAY', type: 'Barangay', phone: '+639569461181' },
  { id: 'fire', label: 'FIRE STATION', type: 'Fire', phone: '911' },
  { id: 'hospital', label: 'HOSPITAL', type: 'Hospital', phone: '(02) 8426 8888' },
  { id: 'police', label: 'POLICE', type: 'Police', phone: '(02) 8936 3624' },
];

const screens = {
  splash: document.getElementById('screen-splash'),
  contacts: document.getElementById('screen-contacts'),
  call: document.getElementById('screen-call'),
};
const sosBtn = document.getElementById('sosBtn');
const backFromContacts = document.getElementById('backFromContacts');
const contactsList = document.getElementById('contactsList');
const nativeTelLink = document.getElementById('nativeTelLink');
const endCallBtn = document.getElementById('endCallBtn');
const callNameEl = document.getElementById('callName');
const callNumberEl = document.getElementById('callNumber');
const callTimerEl = document.getElementById('callTimer');
const logoEl = document.querySelector('.logo');

let callTimerInterval = null;

function showScreen(name) {
  Object.keys(screens).forEach(k => {
    const el = screens[k];
    if (!el) return;
    const show = (k === name);
    el.style.display = show ? '' : 'none';
    el.setAttribute('aria-hidden', show ? 'false' : 'true');
  });
}

function buildContactsList() {
  if (!contactsList) return;
  contactsList.innerHTML = '';
  contacts.forEach(c => {
    const item = document.createElement('div');
    item.className = 'contact';
    item.tabIndex = 0;
    item.innerHTML = `
      <div class="avatar">${(c.label && c.label[0]) || (c.type && c.type[0]) || '?'}</div>
      <div class="meta">
        <div class="cname">${c.label}</div>
        <div class="ctype">${c.phone}</div>
      </div>
    `;

    item.addEventListener('click', () => startCall(c));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') startCall(c); });
    contactsList.appendChild(item);
  });
}

function startCall(contact) {
  if (!contact) return;
  if (callTimerInterval) clearInterval(callTimerInterval);

  callNameEl.textContent = contact.label;
  callNumberEl.textContent = contact.phone || '';
  nativeTelLink.href = 'tel:' + (contact.phone || '');
 
  nativeTelLink.style.display = 'none';

  showScreen('call');

  setTimeout(() => {
    try {
      nativeTelLink.click();
    } catch (err) {

    }
  }, 200);

  let seconds = 0;
  callTimerEl.textContent = 'Calling...';
  callTimerInterval = setInterval(() => {
    seconds++;
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    callTimerEl.textContent = `${mm}:${ss}`;
  }, 1000);
}

function endCall() {
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
  }
  callTimerEl.textContent = '00:00';
  showScreen('splash');
}

if (sosBtn) sosBtn.addEventListener('click', () => {
  buildContactsList();
  showScreen('contacts');
});

if (backFromContacts) backFromContacts.addEventListener('click', () => {
  showScreen('splash');
});

if (endCallBtn) endCallBtn.addEventListener('click', endCall);

if (logoEl) logoEl.addEventListener('click', () => showScreen('splash'));

showScreen('splash');
