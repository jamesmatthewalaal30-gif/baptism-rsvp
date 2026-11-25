import './styles.css';

const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim() || '';
const app = document.querySelector('#app');
const state = {
  busy: false,
  submitted: false,
  message: '',
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function eventMarkup() {
  return `
    <header class="topbar"><a href="#" class="brand" aria-label="Kinri's celebration home">K<span>✝</span></a><a class="top-link" href="#rsvp">RSVP <span aria-hidden="true">↗</span></a></header>
    <main>
      <section class="hero" aria-labelledby="event-title">
        <div class="arch">
          <div class="arch-inner">
            <p class="eyebrow">WITH GRATEFUL HEARTS, WE INVITE YOU</p>
            <div class="ornament-rule" aria-hidden="true"><span>✦</span></div>
            <span class="cross" aria-hidden="true">✝</span>
            <h1 id="event-title">Kinri’s</h1>
            <p class="event-type">Holy Baptism</p>
            <p class="and">and</p>
            <p class="birthday">1st Birthday<br />Celebration</p>
            <div class="date-ribbon"><span>28</span><span>January</span><span>2027</span></div>
            <p class="hero-note">A day of faith, love, and little beginnings</p>
            <a class="primary-button hero-button" href="#rsvp">Kindly respond <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section class="details section" aria-labelledby="details-title">
        <p class="eyebrow">PLEASE JOIN US</p>
        <div class="ornament-divider" aria-hidden="true"><span>✦</span></div>
        <h2 id="details-title">A joyful day together</h2>
        <p class="section-intro">We would be delighted to celebrate this special milestone with you.</p>
        <div class="event-cards">
          <article class="event-card">
            <span class="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2v5m-2.5-2.5h5M5 21h14V10l-7-3-7 3v11Zm4 0v-5a3 3 0 0 1 6 0v5m-7-9h.01M16 12h.01" /></svg></span>
            <p class="card-label">The Holy Baptism</p>
            <h3>11:30 in the morning</h3>
            <p>St Agatha’s Catholic Church</p>
            <p class="event-address">20 Boundary Rd, Pennant Hills NSW 2120</p>
            <a class="map-link" href="https://www.google.com/maps/search/?api=1&amp;query=St+Agatha%27s+Catholic+Church%2C+20+Boundary+Rd%2C+Pennant+Hills+NSW+2120" target="_blank" rel="noopener noreferrer">View on Google Maps <span aria-hidden="true">↗</span></a>
          </article>
          <article class="event-card">
            <span class="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 14h.01M15 14h.01M10 21v-4h4v4M12 2v3m-2-1h4" /></svg></span>
            <p class="card-label">Reception to follow</p>
            <h3>West Pennant Hills</h3>
            <p>Valley Community Centre</p>
            <p class="event-address">42 Hill Rd, West Pennant Hills NSW 2125</p>
            <a class="map-link" href="https://www.google.com/maps/search/?api=1&amp;query=Valley+Community+Centre%2C+42+Hill+Rd%2C+West+Pennant+Hills+NSW+2125" target="_blank" rel="noopener noreferrer">View on Google Maps <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <section class="rsvp section" id="rsvp" aria-labelledby="rsvp-title">
        <div class="rsvp-heading">
          <p class="eyebrow">YOUR PRESENCE IS A GIFT</p>
          <div class="ornament-divider" aria-hidden="true"><span>✦</span></div>
          <h2 id="rsvp-title">Kindly reply</h2>
          <p class="section-intro">Please RSVP by <strong>18 December 2026</strong>, and let us know if you can join us.</p>
        </div>
        <div id="rsvp-panel" class="rsvp-panel"></div>
      </section>
    </main>
    <footer><span class="footer-cross" aria-hidden="true">✝</span><div class="footer-divider" aria-hidden="true"><span>✦</span></div><p>With love, in celebration of Kinri</p><p class="footer-date">28 January 2027 · St Agatha’s Church</p></footer>`;
}

function showPanel() {
  const panel = document.querySelector('#rsvp-panel');
  if (state.submitted) {
    panel.innerHTML = `
      <div class="form-card confirmation-card" role="status" aria-live="polite">
        <span class="confirmation-mark" aria-hidden="true">✓</span>
        <p class="eyebrow">RSVP RECEIVED</p>
        <h3>Thank you!</h3>
        <p class="confirmation-message">${escapeHtml(state.message)}</p>
      </div>
      <button class="text-button another-response" type="button">Submit another response</button>`;
    panel.querySelector('.another-response').addEventListener('click', () => {
      state.submitted = false;
      state.message = '';
      showPanel();
    });
    return;
  }

  panel.innerHTML = `
    <div class="form-card"><p class="eyebrow">YOUR RSVP</p><h3>Kindly reply</h3><p class="help">Please enter your name and response below.</p>
      <form id="response-form" class="form">
        <div class="contact-field"><label for="guest-name">Full name</label><input id="guest-name" name="guest_name" type="text" minlength="2" maxlength="120" autocomplete="name" placeholder="Enter your full name" required /></div>
        <fieldset><legend>Will you be joining us?</legend>
          <div class="choice-row">
            <label class="radio-choice"><input type="radio" name="attendance" value="attending" required /><span>Joyfully accepts</span></label>
            <label class="radio-choice"><input type="radio" name="attendance" value="declined" /><span>Regretfully declines</span></label>
          </div>
        </fieldset>
        <div class="contact-field"><label for="contact-number">Mobile number</label><input id="contact-number" name="contact_number" type="tel" maxlength="40" autocomplete="tel" placeholder="Your contact number" /></div>
        <p class="form-error" id="form-error" role="alert"></p>
        <button class="primary-button full-button" type="submit" ${state.busy ? 'disabled' : ''}>${state.busy ? 'Sending…' : 'Confirm RSVP'}</button>
      </form>
    </div>
    ${!endpoint ? '<p class="setup-note">The RSVP form is awaiting its Google Apps Script URL. Please contact the event organizers to respond.</p>' : ''}`;
  panel.querySelector('#response-form').addEventListener('submit', submitResponse);
}

async function request(url, options) {
  if (!endpoint) throw new Error('The RSVP service is not configured. Please contact the event organizers.');
  let response;
  try {
    response = await fetch(url, { ...options, redirect: 'follow' });
  } catch {
    throw new Error('Could not reach the RSVP service. Check your connection, then verify the Apps Script web app allows access to Anyone and Render uses its full /exec URL.');
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The RSVP service returned an unexpected response. Please try again later.');
  }
  if (!response.ok || !result?.ok) throw new Error(result?.error || 'Something went wrong. Please try again.');
  return result.data;
}

function post(payload) {
  return request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ payload: JSON.stringify(payload) }),
  });
}

async function submitResponse(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const error = form.querySelector('#form-error');
  error.textContent = '';
  const data = new FormData(form);
  const guestName = data.get('guest_name').trim();
  const attendance = data.get('attendance');
  const contactNumber = data.get('contact_number').trim();
  if (attendance === 'attending' && !contactNumber) {
    error.textContent = 'Please enter your mobile number so the organizers can reach you.';
    return;
  }

  state.busy = true;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  try {
    await post({
      action: 'submit_open_rsvp',
      guest_name: guestName,
      attendance_status: attendance,
      contact_number: contactNumber,
    });
    state.message = attendance === 'attending'
      ? `Thank you, ${guestName}! Your RSVP is confirmed. We look forward to celebrating with you.`
      : `Thank you, ${guestName}. Your response has been recorded. You'll be missed.`;
    state.submitted = true;
    state.busy = false;
    showPanel();
  } catch (requestError) {
    state.busy = false;
    error.textContent = requestError.message;
    submitButton.disabled = false;
    submitButton.textContent = 'Confirm RSVP';
  }
}

app.innerHTML = eventMarkup();
showPanel();
