window.headerOffset = 0;
//Get adminbar height
function getAdminBarHeight() {
  const adminBar = document.getElementById('wpadminbar');

  if (!adminBar) {
    return 0;
  }

  const style = window.getComputedStyle(adminBar);
  const isVisible = style.display !== 'none' &&
  style.visibility !== 'hidden' &&
  adminBar.offsetHeight > 0;

  return isVisible ? adminBar.offsetHeight : 0;
}

const initHeaderHeight = () => {
  const header = document.querySelector(".header-bottom");
  if (!header) return;

  const resizeHandler = () => {
    const adminBarOffset =
      document.querySelector("#wpadminbar")?.offsetHeight || 0;
    window.headerOffset = header.offsetHeight + adminBarOffset;
    document.body.style.setProperty("--offset", window.headerOffset + "px");
  };

  resizeHandler();
  window.addEventListener("resize", (e) => resizeHandler);
};

function smoothScrolling() {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]:not([href="#"]):not(.tab-link)');
    if (!link) return; // clicked not a smooth-scroll link

    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      const header = document.querySelector('.header-bottom');
      const headerHeight = header ? header.offsetHeight : 0;
      const adminBarHeight = getAdminBarHeight();
      const totalOffset = headerHeight + adminBarHeight;

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, targetPosition - totalOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
}

const initScrollAnimate = () => {
  gsap.registerPlugin(ScrollTrigger);
  let trigger;
  const resizeHandler = () => {
    const holders = document.querySelectorAll(".animate-block");
    if (!holders.length) return;
    holders.forEach((holder) => {
      if (trigger) trigger.scrollTrigger.kill();
      const wrap = holder.querySelector(".animate-wrap");
      const item = holder.querySelector(".animate-item");
      const container = document.querySelector(".container");
      const totalScrollWidth = wrap.scrollWidth + 50 - container.clientWidth;
      trigger = gsap.to(wrap, {
        x: () => -totalScrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: holder,
          start: "top top",
          end: () => "+=" + totalScrollWidth,
          scrub: true,
          markers: false,
          pin: true,
          anticipatePin: 1,
        },
      });
      ScrollTrigger.refresh();
    });
  };

  resizeHandler();
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeHandler();
    }, 250);
  });
};

const initStackAnimation = () => {
  const holders = document.querySelectorAll(".step-lists");
  if (!holders.length) return;
  holders.forEach((holder) => {
    const items = holder.querySelectorAll(".step-list");
    items.forEach((item, i) => {
      if (i == items.length - 1) return;
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          pin: false,
          markers: false,
          start: `top top+=${window.headerOffset + 30}`,
          end: `bottom top+=${window.headerOffset + 30}`,
          scrub: 1,
          onUpdate: (self) => {
            item.style.setProperty("--progress", self.progress);
          },
        },
      });
    });
  });
};

//Character
//1. split(' ') for word and split('') for individual characters
const initContentReading = () => {
  // Process each testimonial section independently
  const sections = document.querySelectorAll('.testimonials-block');
  sections.forEach((section, sectionIndex) => {
    const text = section.querySelector('.testimonial-text');
    // Split text into characters
    const chars = text.textContent.trim().split('');
    text.innerHTML = chars.map(char => `<span>${char}</span>`).join('');
    const spans = text.querySelectorAll('span');
    // console.log(`Section ${sectionIndex + 1}: Found ${spans.length} characters`);
    // Create the scroll-triggered animation for this section
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 60%',
      // markers: true,
      // scrub: true,
      onUpdate: (self) => {
        // const progress = self.progress;
        // const numChars = spans.length;
        // // Calculate exactly which character index we're at
        // const currentCharIndex = progress * numChars;
        // console.log({currentCharIndex})
        // // Add active class to all characters up to current index
        // spans.forEach((span, index) => {
        //   if (index < currentCharIndex) {
        //     if (!span.classList.contains('active')) {
        //       span.classList.add('active');
        //     }
        //   } else {
        //     if (span.classList.contains('active')) {
        //       span.classList.remove('active');
        //     }
        //   }
        // });

        const charsToShow = Math.floor(self.progress * spans.length);

        spans.forEach((span, index) => {
          // span.style.opacity = index < charsToShow ? 1 : 0.3;
          gsap.to(span, {
            opacity: index < charsToShow ? 1 : 0.5,
            // duration: 0.2,
            ease: "power2.out"
          });
        });
      }
    });
  });
}
window.addEventListener("DOMContentLoaded", (e) => {
  smoothScrolling();
  initHeaderHeight();
  initScrollAnimate();
  initStackAnimation();
  initContentReading();
});
