// Terminal boot typing effect
const terminal = document.getElementById("terminal");
const lines = [
  "BOOTING SECURE SYSTEM...",
  "LOADING KERNEL...",
  "CHECKING MEMORY... OK",
  "NETWORK INTERFACE... ONLINE",
  "SECURITY SUBSYSTEM... ACTIVE",
  "",
  "ENTERING PROTECTED MODE...",
  "",
  "SYSTEM READY.",
  ""
];

let line = 0, char = 0;
function type() {
  if (line < lines.length) {
    if (char < lines[line].length) {
      terminal.textContent += lines[line].charAt(char);
      char++;
      setTimeout(type, 45);
    } else {
      terminal.textContent += "\n";
      line++;
      char = 0;
      setTimeout(type, 180);
    }
  } else {
    // hide cursor and reveal code section when boot completes
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.display = 'none';
    const codeSection = document.getElementById('codeSection');
    if (codeSection) codeSection.style.display = 'block';
  }
}
// start typing after a short delay so page finishes rendering
setTimeout(type, 300);

// ----- Code lock logic -----
const correctCode = "5683"; // your secret code
let attempts = 0;

function checkCode() {
  const userCode = document.getElementById("codeInput").value;
  const message = document.getElementById("message");
  const secretLink = document.getElementById("secretLink");

  if (userCode === correctCode) {
      message.style.color = "#44ff44";
      message.textContent = "Access Granted.";
      setTimeout(() => {
        window.location.href = "little game/game.html"; // redirect to the game
      }, 1000);
  } else {
    attempts++;
    message.style.color = "#ff4444";
    message.textContent = `Incorrect Code (${attempts}/2)`;

    if (attempts >= 2) {
      if (secretLink) secretLink.style.display = "block"; // show the hidden link
      message.textContent = "Access Denied.";
    }
  }

}

