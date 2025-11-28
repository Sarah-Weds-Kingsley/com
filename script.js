document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const specialMessage = document.getElementById('special-message');
    
    // Music element
    const backgroundMusic = document.getElementById('background-music');
    
    // Auto-play music when page loads
    function autoPlayMusic() {
        // Set volume to 30% for pleasant background level
        backgroundMusic.volume = 0.3;
        
        // Try to play music automatically
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Music started automatically');
            }).catch(error => {
                console.log('Auto-play failed, waiting for user interaction:', error);
                // If auto-play fails, set up a one-time click listener to start music
                document.body.addEventListener('click', function startMusicOnClick() {
                    backgroundMusic.play().then(() => {
                        console.log('Music started after user interaction');
                    }).catch(e => {
                        console.log('Music play failed:', e);
                    });
                    document.body.removeEventListener('click', startMusicOnClick);
                }, { once: true });
            });
        }
    }
    
    // Start music when page is loaded
    window.addEventListener('load', autoPlayMusic);
    
    // Show special message when "Yes" is selected for attendance
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                specialMessage.classList.remove('hidden');
            } else {
                specialMessage.classList.add('hidden');
            }
        });
    });
    
    // Handle form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const plusOne = document.querySelector('input[name="plusOne"]:checked').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        
        // Validate form
        if (!name) {
            alert('Please enter your name');
            return;
        }
        
        if (!attendance) {
            alert('Please let us know if you can attend');
            return;
        }
        
        // Create email content
        const subject = `Wedding RSVP from ${name}`;
        
        let body = `Hello Kingsley & Sarah,\n\n`;
        body += `This is ${name} responding to your wedding invitation.\n\n`;
        body += `Will I be attending? ${attendance === 'yes' ? 'Yes, I will be there!' : 'Sorry, I cannot make it.'}\n`;
        body += `Plus one? ${plusOne === 'yes' ? 'Yes' : 'No'}\n\n`;
        body += `Looking forward to celebrating with you!\n\n`;
        body += `Best regards,\n${name}`;
        
        // Encode for mailto link
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        
        // Create mailto link
        const mailtoLink = `mailto:kingsley@dreysonglobal.online?subject=${encodedSubject}&body=${encodedBody}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation message
        setTimeout(() => {
            alert('Thank you for your RSVP! Please make sure to send the email that opened.');
            
            // Reset form
            rsvpForm.reset();
            specialMessage.classList.add('hidden');
        }, 1000);
    });
    
    // Add some romantic animations
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'hearts-container';
    document.body.appendChild(heartsContainer);
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.5;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '-1';
        heart.style.animation = `floatUp ${Math.random() * 3 + 3}s linear forwards`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
    
    // Add CSS for floating hearts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        .hearts-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
    
    // Create hearts periodically
    setInterval(createHeart, 500);
});

// Social Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Join me in celebrating Kingsley & Sarah's wedding!");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Join me in celebrating Kingsley & Sarah's wedding! 🎉");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("You're invited to Kingsley & Sarah's wedding! 🎊");
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank', 'width=600,height=600');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy link');
    });
}

function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}