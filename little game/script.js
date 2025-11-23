function openApp(app) {
    switch(app) {
        case "My Files":
            window.location.href = "../index.html";  
            break;
        case "Windows":
            alert("Opening Windows Settings...");
            break;
        case "Internet Explorer":
            window.open("internet.html", "_blank"); 
            break;
        case "Games":
            window.location.href = "games.html";  
            break;
        case "Command Prompt":
            window.location.href = "../index.html";  
            break;
        case "Recycle Bin":
            alert("Opening Recycle Bin...");
            break;
        default:
            alert("Opening: " + app);
    }
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

//blue screen
window.addEventListener("DOMContentLoaded", () => {
    const winIcon = document.querySelector(".windows-desktop-icon");
    const bsod = document.getElementById("bsod");

    if (!winIcon || !bsod) return;

    winIcon.addEventListener("click", () => {
        document.body.classList.add("glitch");

        // optional glitch beep
        const audio = new Audio("data:audio/wav;base64,UklGRl4AAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0Yc4AAAABAQEBAQEBAQEBAQEB");
        audio.play();

        // REDUCE delay to 300ms (or even 100ms)
        setTimeout(() => {
            document.body.classList.remove("glitch");
            bsod.style.display = "block";
        }, 300); // <--- faster appearance
    });

    const closeBSOD = () => (bsod.style.display = "none");
    bsod.addEventListener("click", closeBSOD);
    document.addEventListener("keydown", closeBSOD);
});

//folder
window.addEventListener("DOMContentLoaded", () => {
    const explorerWindow = document.getElementById("explorerWindow");
    const fileArea = document.getElementById("fileArea");
    const explorerTitle = document.getElementById("explorerTitle");
    const closeBtn = document.getElementById("closeExplorer");
    const myFilesIcon = document.querySelector(".my-files-icon");

    if (!explorerWindow || !fileArea || !explorerTitle || !closeBtn || !myFilesIcon) {
        console.error("Missing required elements for XP Explorer!");
        return;
    }

    const fileSystem = {
        "My Documents": {
            "Projects": { "HTML": {}, "CSS": {}, "JS": {} },
            "Pictures": { "Vacation": {}, "Family": {} },
            "Music": { "Rock": {}, "Jazz": {} }
        }
    };

    let currentPath = ["My Documents"];

    function renderFolder(path) {
        fileArea.innerHTML = "";
        let folder = fileSystem;
        path.forEach(p => folder = folder[p]);
        explorerTitle.textContent = path[path.length-1];

        for (const name in folder) {
            const div = document.createElement("div");
            div.className = "folder";
            div.innerHTML = `<img src="https://icons.iconarchive.com/icons/wwalczyszyn/ilive/256/Windows-Live-Gallery-icon.png"><span>${name}</span>`;
            div.addEventListener("click", () => {
                currentPath.push(name);
                renderFolder(currentPath);
            });
            fileArea.appendChild(div);
        }
    }

    function openExplorer() {
        explorerWindow.style.display = "flex";
        renderFolder(currentPath);
    }

    function closeWindow() {
        explorerWindow.style.display = "none";
        currentPath = ["My Documents"];
    }

    // Attach XP explorer to My Files icon
    myFilesIcon.addEventListener("click", () => {
        openExplorer();
    });

    // Attach close button listener
    closeBtn.addEventListener("click", closeWindow);
});
