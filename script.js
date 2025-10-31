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
    } else {
      terminal.textContent += "\n";
      line++;
      char = 0;
    }
    setTimeout(type, 55);
  } else {
    document.querySelector(".cursor").style.display = "none";
    document.getElementById("codeSection").style.display = "block";
  }
}
type();


const correctCode = "5683";
let attempts = 0;

function checkCode() {
  const userCode = document.getElementById("codeInput").value;
  const message = document.getElementById("message");
  const secretLink = document.getElementById("secretLink");

  if (userCode === correctCode) {
    message.style.color = "#00ff55";
    message.textContent = "ACCESS GRANTED...";
    setTimeout(() => { window.location.href = "room.html"; }, 1200);
  } else {
    attempts++;
    message.style.color = "#ff4444";
    message.textContent = `ACCESS DENIED (${attempts}/2)`;

    if (attempts >= 2) {
      secretLink.style.display = "block";
      message.textContent = "LOCKDOWN TRIGGERED.";
    }
  }
}