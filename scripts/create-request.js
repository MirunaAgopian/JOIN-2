/**
 * Opens the Gmail compose window so the stakeholder can send an email
 * to the Issue‑Collector inbox. The incoming email triggers the n8n
 * workflow, which then creates a JOIN task and stores metadata in Firebase.
 */
function openGmail() {
  window.open(
    "https://mail.google.com/mail/?view=cm&fs=1&to=join.notification@gmail.com&su=Request&body=",
    "_blank",
  );
}

/**
 * Fetches the daily request counter from Firebase and resets it if needed.
 *
 * Retrieves the stored "requestsToday" and "date" values from the Realtime
 * Database, compares the saved date with today's date, and automatically
 * resets the counter to 0 when a new day begins. The resulting value is
 * forwarded to `updateSectionVisibility()` to update the UI.
 */
async function loadTicketCounter() {
  const res = await fetch(
    "https://join-e397a-default-rtdb.europe-west1.firebasedatabase.app/usage/daily.json"
  );
  const data = await res.json();
  const latestKey = Object.keys(data).sort().pop();
  const savedDate = data[latestKey].date;
  const requestsToday = data[latestKey].requestsToday;
  const today = new Date().toISOString().split("T")[0];
  const effectiveRequests = savedDate === today ? requestsToday : 0;
  updateSectionVisibility(effectiveRequests);
}

/**
 * Updates the UI based on the number of daily requests.
 *
 * Displays the correct counter value, toggles visibility between
 * the "limit reached" and "limit not reached" sections, and applies
 * warning styles when the daily limit (10 requests) is exceeded.
 *
 * @param {number} requests - The number of requests made today.
 */
function updateSectionVisibility(requests) {
  const counter = document.getElementById("daily_counter");
  const counterContainer = document.getElementById("counter_container");
  const limitNotReached = document.querySelector(
    ".middle-section:not(.limit-reached)",
  );
  const limitReached = document.querySelector(".middle-section.limit-reached");

  counter.textContent = requests;

  if (requests >= 10) {
    limitNotReached.classList.add("d-none");
    limitReached.classList.remove("d-none");
    counter.classList.add("warning-message");
    counterContainer.classList.add("warning-message");
  } else {
    limitNotReached.classList.remove("d-none");
    limitReached.classList.add("d-none");
  }
}
