// =========================================
// DEVICE CHECK
// =========================================

const mobile = window.innerWidth < 768;

const weakDevice =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// =========================================
// CURSOR GLOW
// =========================================

if (!mobile && !reduceMotion) {

    const glow = document.querySelector(".cursor-glow");

    if (glow) {

        let raf = null;

        document.addEventListener("mousemove", e => {

            if (raf) return;

            raf = requestAnimationFrame(() => {

                glow.style.transform =
                    `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;

                raf = null;

            });

        });

    }

}

// =========================================
// PARTICLES
// =========================================

if (!reduceMotion) {

    document.addEventListener("DOMContentLoaded", () => {

        const container = document.createElement("div");

        Object.assign(container.style, {
            position: "fixed",
            inset: "0",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: "-1"
        });

        document.body.appendChild(container);

        const colors = [
            "#ff00cc",
            "#8a2be2",
            "#ccff00"
        ];

        const MAX_PARTICLES = weakDevice ? 14 : 28;

        const INTERVAL = weakDevice ? 1200 : 700;

        let active = true;
        let scrolling = false;

        document.addEventListener("visibilitychange", () => {

            active = !document.hidden;

        });

        window.addEventListener("scroll", () => {

            scrolling = true;

            clearTimeout(window.scrollTimer);

            window.scrollTimer = setTimeout(() => {

                scrolling = false;

            }, 700);

        });

        function createParticle(type) {

            if (!active) return;

            if (scrolling) return;

            if (container.childElementCount >= MAX_PARTICLES) return;

            const el = document.createElement("div");

            const size =
                type === "petal"
                    ? Math.random() * 12 + 8
                    : Math.random() * 3 + 2;

            const duration =
                Math.random() * 7 + 7;

            const color =
                colors[Math.floor(Math.random() * colors.length)];

            Object.assign(el.style, {

                position: "absolute",
                left: Math.random() * 100 + "vw",
                top: "-30px",
                width: size + "px",
                height: type === "petal"
                    ? size * 1.5 + "px"
                    : size + "px",
                background: type === "petal"
                    ? `linear-gradient(135deg,${color},transparent)`
                    : color,
                borderRadius: type === "petal"
                    ? "60% 40% 60% 0%"
                    : "50%",
                opacity: ".35",
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${duration}s linear forwards`
            });

            if (type !== "petal" && !weakDevice) {
                el.style.boxShadow = `0 0 8px ${color}`;
            }

            container.appendChild(el);
            el.addEventListener("animationend", () => {
                el.remove();
            });
        }

        setInterval(() => {
            createParticle(
                Math.random() > .55
                    ? "petal"
                    : "pollen"
            );
        }, INTERVAL);
    });

}

// =========================================
// KEYFRAMES
// =========================================

const style = document.createElement("style");

style.textContent = `
@keyframes fall{

0%{
transform:translateY(0) rotate(0deg);
opacity:0;
}

10%{
opacity:.7;
}

100%{
transform:translateY(110vh) rotate(360deg);
opacity:0;
}

}
`;

document.head.appendChild(style);


// 👉 Scroll animation

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });

}, {
    threshold: .15
});

document.querySelectorAll(".animate").forEach(el => {
    observer.observe(el);
});

// test
const slider=document.querySelector(".services");
const cards=[...document.querySelectorAll(".services .card")];

function updateCards(){

    cards.forEach(card=>{
        card.classList.remove("edge");
        card.classList.remove("center");
    });

    const left=slider.scrollLeft;
    const right=left+slider.clientWidth;

    cards.forEach(card=>{

        const cardLeft=card.offsetLeft;
        const cardRight=cardLeft+card.offsetWidth;

        if(cardRight>left&&cardLeft<right){
            card.classList.add("center");
        }

    });

    const visible=cards.filter(card=>card.classList.contains("center"));

    if(visible.length){
        visible[0].classList.add("edge");
        visible[visible.length-1].classList.add("edge");
    }

}

slider.addEventListener("scroll",updateCards);
window.addEventListener("load",updateCards);
window.addEventListener("resize",updateCards);