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
          window.location.href = "room.html"; // next page
        }, 1000);
      } else {
        attempts++;
        message.style.color = "#ff4444";
        message.textContent = `Incorrect Code (${attempts}/2)`;

        if (attempts >= 2) {
          secretLink.style.display = "block"; // show the hidden link
          message.textContent = "Access Denied.";
        }
      }

    }

