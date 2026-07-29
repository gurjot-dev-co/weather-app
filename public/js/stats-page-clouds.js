document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    if (!body) return; 
    function createCloud() {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");   

        const sizes = ["small", "large"]; 
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        if(Math.random() < 0.4) cloud.classList.add(randomSize);

// scrollHeight is the total height of an element’s content, including the part hidden 
// beyond the visible area (i.e., the full scrollable height).
        const bottom = Math.random() * (body.scrollHeight * 0.92);
        cloud.style.bottom = `${bottom}px`;
        
        const duration = 20 + Math.random() * 20;
        cloud.style.animationDuration = `${duration}s`;

        body.appendChild(cloud);
        setTimeout(() => cloud.remove(), duration * 1000);
    }
    setInterval(createCloud, 4000);
     for (let i = 0; i < 5; i++) createCloud();
})