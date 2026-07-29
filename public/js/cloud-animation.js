document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    if (!body) return;  // prevents the script from crashing if <body> is missing on some page or loads later.
    
    function createCloud() {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");

        const sizes = ["small", "large"];  // Randomly assign size 
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        if(Math.random() < 0.4) cloud.classList.add(randomSize); //else the base size

        // Random vertical placement (bottom position within bottom half of body)        
        const bottom = Math.random() * (body.scrollHeight * 0.85);
        cloud.style.bottom = `${bottom}px`;

        const duration = 20 + Math.random() * 20;  // Speed b/w 20s-40s
        cloud.style.animationDuration = `${duration}s`;

        body.appendChild(cloud);

        // Remove the cloud element after it finishes drifting to prevent memory buildup
        setTimeout(() => cloud.remove() , duration * 1000);
    }
    // Create a new cloud every 4 seconds for continuous motion
    setInterval(createCloud, 4000);
    // Add a few clouds at the beginning so it doesn’t start empty
     for (let i = 0; i < 5; i++) createCloud();
})