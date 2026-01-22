const modelMain = document.querySelector('#bracelet');
const modelCloser = document.querySelector('#closer-look-model');
const stage = document.getElementById('carousel-stage');
const productName = document.getElementById('product-name');
const productDesc = document.getElementById('product-desc');
const mainStage = document.querySelector('#main-stage');
const storySequence = document.querySelector('.story-section'); 
const closerLookSection = document.querySelector('.closer-look-section');
const techSection = document.getElementById('tech-trigger');
const techModel = document.getElementById('tech-model');
const techText = document.getElementById('tech-text');
const highlightsSection = document.querySelector('.highlights-section');
const splitBlocks = document.querySelectorAll('.split-block');
const splitImages = document.querySelectorAll('.split-img');

// --- DATA: YOUR PRODUCTS ---
// Inside script.js

const products = [
    { 
        name: "Lava Stone", 
        sub: "Classic Edition", 
        file: "assets/models/bracelet.glb",
        orbit: "0deg 75deg 105%", 
        scale: "1 1 1",
        views: [
            { label: "OVERVIEW", angle: "0deg 75deg 105%", desc: "The classic silhouette, designed for everyday wear." },
            { label: "TEXTURE", angle: "-90deg 90deg 60%", desc: "Rough volcanic lava stone provides a unique tactile experience." },
            { label: "PROFILE", angle: "45deg 0deg 80%", desc: "Low profile fit that sits comfortably on the wrist." }
        ]
    },
   { 
        name: "The Brain", 
        sub: "Sphere Dock", 
        file: "assets/models/cpu.glb", // ชื่อไฟล์โมเดลของคุณ
        orbit: "0deg 80deg 100%",  // มุมกล้องเริ่มต้น
        scale: "0.01 0.01 0.01",   // สเกลโมเดล (ปรับตามความเหมาะสม)
        views: [
            { 
                label: "THE VAULT", 
                angle: "0deg 75deg 100%", 
                desc: "Your personal AI server. Beautifully silent. Powerfully private. It holds your memories locally, not in the cloud." 
            },
            { 
                label: "TEXTURE", 
                angle: "-45deg 60deg 70%", // ซูมเข้าไปดูพื้นผิว
                desc: "Wrapped in premium acoustic fabric. Designed to breathe and blend seamlessly into your home decor." 
            },
            { 
                label: "LINK", 
                angle: "180deg 85deg 80%", // หมุนไปด้านหลังดูพอร์ต
                desc: "Simplicity itself. Just plug in the USB-C and connect your phone. The intelligence arrives instantly. No setup, no waiting." 
            }
        ]
    },
];
let currentProductIndex = 0;

// 1. Intro Animation
if (modelMain) {
    modelMain.addEventListener('load', () => {
        setTimeout(() => { modelMain.cameraOrbit = "0deg 75deg 105%"; }, 100);
    });
}

// 2. Scroll Logic
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Story Sequence Scroll
    if (storySequence && closerLookSection && mainStage) {
        const storyHeight = storySequence.offsetHeight;
        const highlightsTop = highlightsSection.offsetTop;

        if (scrollY < highlightsTop - 100) {
            mainStage.style.opacity = 1;
        } else {
            mainStage.style.opacity = 0;
        }

        if (scrollY < storyHeight) {
            const zoom = 105 + (scrollY / storyHeight) * 40;
            if(modelMain) {
                modelMain.cameraOrbit = `0deg 75deg ${zoom}%`;
            }
        }
    }

    // Innovation Section Rotation
    if (techSection && techModel && techText) {
        const rect = techSection.getBoundingClientRect();
        const sectionHeight = techSection.offsetHeight;
        const windowHeight = window.innerHeight;

        if (rect.top <= 0 && rect.bottom >= 0) {
            let progress = (rect.top * -1) / (sectionHeight - windowHeight);
            progress = Math.max(0, Math.min(1, progress));
            const currentAngle = 180 - (90 * progress);
            techModel.cameraOrbit = `${currentAngle}deg 75deg 105%`;

            if (progress > 0.1) {
                techText.style.opacity = 1 - ((progress - 0.1) * 2);
            } else {
                techText.style.opacity = 1;
            }
        }
    }
});

// 3. Camera View Logic
function changeView(btn, viewIndex) {
    const product = products[currentProductIndex];
    if (!product || !product.views || !product.views[viewIndex]) return;

    const view = product.views[viewIndex];

    if(modelCloser) {
        modelCloser.cameraOrbit = view.angle;
    }
    
    const infoBox = document.getElementById('info-box');
    if (infoBox) {
        infoBox.style.opacity = 0;
        setTimeout(() => {
            const infoLabel = document.getElementById('info-label');
            const infoDesc = document.getElementById('info-desc');
            if (infoLabel) infoLabel.innerText = view.label;
            if (infoDesc) infoDesc.innerText = view.desc;
            infoBox.style.opacity = 1;
        }, 300);
    }

    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// 4. NEXT / PREV LOGIC
function nextProduct() {
    currentProductIndex = (currentProductIndex + 1) % products.length;
    updateCarousel('right');
}

function prevProduct() {
    currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
    updateCarousel('left');
}

// Inside script.js - Replace the old updateCarousel function with this:

function updateCarousel(direction) {
    if (stage) {
        // 1. Start Animation
        if (direction === 'right') {
            stage.classList.add('fade-out-left');
        } else {
            stage.classList.add('fade-out-right');
        }

        setTimeout(() => {
            const product = products[currentProductIndex];
            
            // 2. Update Text
            if (productName) productName.innerText = product.name;
            if (productDesc) productDesc.innerText = product.sub;
            
            // 3. Update Model File & Position
            if (modelCloser) {
                modelCloser.src = product.file;
                modelCloser.scale = product.scale || "1 1 1";
                if (product.orbit) modelCloser.cameraOrbit = product.orbit;
                
                // 4. Update Button Labels based on Product
                const buttons = document.querySelectorAll('.menu-btn');
                buttons.forEach((btn, index) => {
                    const labelSpan = btn.querySelector('.btn-label');
                    if (labelSpan && product.views[index]) {
                        // Title case formatting
                        const labelText = product.views[index].label.toLowerCase().charAt(0).toUpperCase() + product.views[index].label.toLowerCase().slice(1);
                        labelSpan.textContent = labelText;
                    }
                });

                // 5. Trigger Overview View Automatically
                changeView(buttons[0], 0);
            }
            
            // 6. End Animation
            stage.classList.remove('fade-out-left');
            stage.classList.remove('fade-out-right');
        }, 500);
    }
}
// 5. Intersection Observers

// Story Block Observer
const storyBlockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.story-block').forEach((block) => {
    storyBlockObserver.observe(block);
});

// Split Section Observer
const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(splitBlocks) {
                splitBlocks.forEach(b => b.classList.remove('active'));
            }
            entry.target.classList.add('active');

            const targetId = entry.target.getAttribute('data-target');
            if(splitImages) {
                splitImages.forEach(img => {
                    img.classList.remove('active');
                    if (img.id === targetId) {
                        img.classList.add('active');
                    }
                });
            }
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: "-10% 0px -10% 0px"
});

if (splitBlocks) {
    splitBlocks.forEach(block => splitObserver.observe(block));
}

// Text Block / Image Wrapper Observer (for split-scroll section)
const textBlocks = document.querySelectorAll('.text-block');
const imageWrappers = document.querySelectorAll('.image-wrapper');

const textBlockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const imageIndex = entry.target.dataset.image;
            
            // Update text blocks
            textBlocks.forEach(block => {
                block.classList.remove('active');
            });
            entry.target.classList.add('active');
            
            // Update images
            imageWrappers.forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            if (imageWrappers[imageIndex]) {
                imageWrappers[imageIndex].classList.add('active');
            }
        }
    });
}, {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
});

textBlocks.forEach(block => {
    textBlockObserver.observe(block);
});

// 6. Countdown Timer to May 16, 2026
const launchDate = new Date('May 16, 2026 00:00:00').getTime();

function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Check if elements exist
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }
    
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    if (distance < 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
}


// === DESKTOP APP SHOWCASE - DISABLED (Only 1 text block) ===
// Commented out because we only have one text block now
/*
const appSection = document.getElementById('desktop-app-showcase');
const appTextBlocks = document.querySelectorAll('.app-text-block');
const appZoomImages = document.querySelectorAll('.app-zoom-img');

const totalImages = appZoomImages.length;
const BASE_SCALE = 0.8;
const MAX_SCALE = 1.0;

// Desktop App Scroll Observer
window.addEventListener('scroll', () => {
    if (!appSection || totalImages === 0) return;
    
    const rect = appSection.getBoundingClientRect();
    const sectionHeight = appSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // คำนวณ scroll progress ใน section นี้ (0 = บนสุด, 1 = ล่างสุด)
    let scrollProgress = (rect.top * -1) / (sectionHeight - viewportHeight);
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));
    
    // แบ่ง progress ออกเป็น N ช่วง (N = จำนวนรูป)
    const progressPerPhase = 1 / totalImages;
    
    // หา phase ปัจจุบัน (0, 1, 2, ...)
    let currentPhase = Math.floor(scrollProgress / progressPerPhase);
    currentPhase = Math.min(currentPhase, totalImages - 1);
    
    // คำนวณ progress ภายใน phase นั้น (0.0 - 1.0)
    const phaseProgress = (scrollProgress - (currentPhase * progressPerPhase)) / progressPerPhase;
    
    // คำนวณ scale: เริ่ม 0.8 → จบ 1.0
    const scale = BASE_SCALE + (phaseProgress * (MAX_SCALE - BASE_SCALE));
    
    // อัพเดตรูปภาพ
    appZoomImages.forEach((img, index) => {
        if (index === currentPhase) {
            img.classList.add('active');
            img.style.transform = `scale(${scale})`;
        } else {
            img.classList.remove('active');
            img.style.transform = `scale(${BASE_SCALE})`; // Reset ตัวอื่น
        }
    });
    
    // อัพเดตสีพื้นหลัง
    appSection.setAttribute('data-theme', currentPhase.toString());
    
    // อัพเดต text blocks
    appTextBlocks.forEach((block, index) => {
        if (index === currentPhase) {
            block.classList.add('active');
        } else {
            block.classList.remove('active');
        }
    });
});
*/


// 7. Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Handle waitlist form submission
    const form = document.getElementById('waitlist-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('.email-input');
            const submitBtn = form.querySelector('.submit-btn');
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            // Disable button and show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Joining...';
            
            try {
                const response = await fetch('http://localhost:5000/api/waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('🎉 Success! You\'re on the waitlist. We\'ll notify you at ' + email);
                    form.reset();
                } else {
                    // Handle specific error cases
                    if (response.status === 409) {
                        alert('This email is already registered on our waitlist!');
                    } else if (response.status === 400) {
                        alert('Please enter a valid email address');
                    } else {
                        alert('Something went wrong. Please try again later.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to server. Please make sure the backend is running and try again.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

});

// --- PRIVACY POPUP LOGIC ---
const pModal = document.getElementById('privacy-modal');
const pCards = document.querySelectorAll('.privacy-card');
const mIcon = document.getElementById('m-icon');
const mTitle = document.getElementById('m-title');
const mSubtitle = document.getElementById('m-subtitle');
const mBody = document.getElementById('m-body');

// Open Modal
if (pCards) {
    pCards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Get data from the clicked card
            const icon = card.querySelector('.card-icon').innerHTML;
            const title = card.querySelector('h3').innerHTML;
            const subtitle = card.querySelector('p.white-text').innerText;
            const detail = card.getAttribute('data-detail'); // This is the hidden text!

            // 2. Put data into the modal
            mIcon.innerHTML = icon;
            mTitle.innerHTML = title;
            mSubtitle.innerText = subtitle;
            mBody.innerText = detail || "More details coming soon.";

            // 3. Show the modal
            pModal.classList.add('active');
        });
    });
}

// Close Modal Function
function closeModal() {
    if(pModal) pModal.classList.remove('active');
}

// Close when clicking outside
if (pModal) {
    pModal.addEventListener('click', (e) => {
        if (e.target === pModal) closeModal();
    });
}

// --- ULTRA SMOOTH SCROLL EXPAND LOGIC ---
const expandTarget = document.getElementById('expand-target');

if (expandTarget) {
    document.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const rect = expandTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Find distance from element center to viewport center
            const elementCenter = rect.top + (rect.height / 2);
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(viewportCenter - elementCenter);
            
            // Define effect range
            const fadeRange = viewportHeight * 0.6; 
            
            // Calculate progress (0 = far away, 1 = perfectly centered)
            let progress = 1 - (distance / fadeRange);
            progress = Math.max(0, Math.min(1, progress));

            // Transform: Scale 0.6 to 1.0 (as defined in CSS)
            const scale = 0.6 + (progress * 0.4);
            
            // Radius: 40px to 0px
            const radius = 40 - (progress * 40);

            expandTarget.style.transform = `scale(${scale})`;
            expandTarget.style.borderRadius = `${radius}px`;
        });
    });
}

// --- HOVER TO PLAY VIDEO LOGIC ---
document.querySelectorAll('.hover-video-card').forEach(card => {
    const video = card.querySelector('video');
    if (video) {
        card.addEventListener('mouseenter', () => {
            video.play();
        });
        card.addEventListener('mouseleave', () => {
            video.pause();
            // Optional: Reset to start
            // video.currentTime = 0;
        });
    }
});

// --- DROP & GO VIDEO HOVER LOGIC ---
const dropGoCard = document.getElementById('drop-go-card');
const dropGoVideo = document.getElementById('drop-go-video');

if (dropGoCard && dropGoVideo) {
    dropGoCard.addEventListener('mouseenter', () => {
        dropGoVideo.play();
    });
    dropGoCard.addEventListener('mouseleave', () => {
        dropGoVideo.pause();
        dropGoVideo.currentTime = 0; // Reset to start
    });
}

// --- WAITLIST SECTION SCROLL ANIMATION ---
const waitlistSection = document.querySelector('.waitlist-section');

if (waitlistSection) {
    const waitlistObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the section is visible
    });
    
    waitlistObserver.observe(waitlistSection);
}

// --- WAITLIST POPUP LOGIC ---
const navbarJoinBtn = document.getElementById('navbar-join-btn');
const waitlistPopup = document.getElementById('waitlist-popup');
const waitlistPopupForm = document.getElementById('waitlist-popup-form');

// Open popup when navbar button is clicked
if (navbarJoinBtn) {
    navbarJoinBtn.addEventListener('click', () => {
        if (waitlistPopup) {
            waitlistPopup.classList.add('active');
        }
    });
}

// Close popup function
function closeWaitlistPopup() {
    if (waitlistPopup) {
        waitlistPopup.classList.remove('active');
    }
}

// Close when clicking outside the modal content
if (waitlistPopup) {
    waitlistPopup.addEventListener('click', (e) => {
        if (e.target === waitlistPopup) {
            closeWaitlistPopup();
        }
    });
}

// Handle form submission in popup
if (waitlistPopupForm) {
    waitlistPopupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = waitlistPopupForm.querySelector('.waitlist-popup-input');
        const submitBtn = waitlistPopupForm.querySelector('.waitlist-popup-btn');
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Disable button and show loading state
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';
        
        try {
            const response = await fetch('http://localhost:5000/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('🎉 Success! You\'re on the waitlist. We\'ll notify you at ' + email);
                waitlistPopupForm.reset();
                closeWaitlistPopup();
            } else {
                if (response.status === 409) {
                    alert('This email is already registered on our waitlist!');
                } else if (response.status === 400) {
                    alert('Please enter a valid email address');
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to connect to server. Please make sure the backend is running and try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
