function openApp(app) {
    switch(app) {
        case "My Files":
            window.location.href = "../index.html";  
            break;
        case "Windows":
            alert("Opening Windows Settings...");
            break;
        case "Internet Explorer":
            window.open("https://google.com", "_blank"); 
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
