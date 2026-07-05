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
