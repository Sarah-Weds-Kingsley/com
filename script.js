document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const specialMessage = document.getElementById('special-message');
    const photoUpload = document.getElementById('photo-upload');
    const filePreview = document.getElementById('file-preview');
    
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
    
    // Photo upload preview functionality
    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            filePreview.innerHTML = '';
            
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file (JPG, PNG, GIF, etc.)');
                    photoUpload.value = '';
                    return;
                }
                
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size too large. Please select an image under 5MB.');
                    photoUpload.value = '';
                    return;
                }
                
                // Create FileReader to preview image
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Create image preview
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Uploaded photo preview';
                    
                    // Create remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove Photo';
                    removeBtn.className = 'remove-photo-btn';
                    removeBtn.type = 'button';
                    removeBtn.onclick = function() {
                        photoUpload.value = '';
                        filePreview.classList.remove('active');
                        filePreview.innerHTML = '';
                    };
                    
                    // Add elements to preview container
                    filePreview.appendChild(img);
                    filePreview.appendChild(document.createElement('br'));
                    filePreview.appendChild(removeBtn);
                    filePreview.classList.add('active');
                };
                
                reader.onerror = function() {
                    alert('Error reading file. Please try another image.');
                    photoUpload.value = '';
                };
                
                reader.readAsDataURL(file);
            } else {
                filePreview.classList.remove('active');
            }
        });
    }
    
    // Handle form submission with photo attachment
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const plusOne = document.querySelector('input[name="plusOne"]:checked').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const photoUpload = document.getElementById('photo-upload');
        
        // Validate form
        if (!name) {
            alert('Please enter your name');
            return;
        }
        
        if (!attendance) {
            alert('Please let us know if you can attend');
            return;
        }
        
        // Create loading indicator
        const sendBtn = rsvpForm.querySelector('.send-btn');
        const originalBtnText = sendBtn.textContent;
        sendBtn.innerHTML = '<div class="loading-spinner"></div> Preparing RSVP...';
        sendBtn.disabled = true;
        
        try {
            // Create email content
            const subject = `Wedding RSVP from ${name}`;
            
            let body = `Hello Ify & Kingsley,\n\n`;
            body += `This is ${name} responding to your wedding invitation.\n\n`;
            body += `Will I be attending? ${attendance === 'yes' ? 'Yes, I will be there!' : 'Sorry, I cannot make it.'}\n`;
            body += `Plus one? ${plusOne === 'yes' ? 'Yes' : 'No'}\n\n`;
            
            if (photoUpload && photoUpload.files.length > 0) {
                body += `I've attached a special photo with my RSVP!\n\n`;
            }
            
            body += `Looking forward to celebrating with you!\n\n`;
            body += `Best regards,\n${name}`;
            
            // Encode for mailto link
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);
            
            // Create mailto link
            let mailtoLink = `mailto:kingsley@dreysonglobal.online?subject=${encodedSubject}&body=${encodedBody}`;
            
            // Check if there's a photo
            const hasPhoto = photoUpload && photoUpload.files.length > 0;
            
            // Use different approach for photos
            if (hasPhoto) {
                setTimeout(() => {
                    // For files, we need to provide clear instructions
                    alert(`🎉 Thank you for your RSVP!\n\nPlease:\n\n1. An email draft will open with your RSVP details\n2. You need to MANUALLY attach your photo in the email that opens\n3. Review the email and click SEND\n\nWe appreciate you taking the extra step to share your photo so that its easy for security to recognise you as a special guest! ❤️`);
                    
                    // Open email client
                    window.open(mailtoLink, '_blank');
                    
                    // Reset form
                    resetForm();
                }, 500);
                
            } else {
                setTimeout(() => {
                    // No photo - open email client directly
                    window.location.href = mailtoLink;
                    
                    // Show confirmation
                    alert('Thank you for your RSVP! An email draft has opened. Please review and send it to confirm your attendance.');
                    
                    // Reset form
                    resetForm();
                }, 500);
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your RSVP. Please try again.');
            resetButton();
        }
        
        // Helper function to reset form
        function resetForm() {
            rsvpForm.reset();
            specialMessage.classList.add('hidden');
            if (filePreview) {
                filePreview.classList.remove('active');
                filePreview.innerHTML = '';
            }
            resetButton();
        }
        
        // Helper function to reset button state
        function resetButton() {
            sendBtn.innerHTML = originalBtnText;
            sendBtn.disabled = false;
        }
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
        heart.style.color = Math.random() > 0.5 ? '#ffb6c1' : '#87ceeb';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            if (heart.parentNode === heartsContainer) {
                heart.remove();
            }
        }, 5000);
    }
    
    // Add CSS for floating hearts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
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
            overflow: hidden;
        }
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #87ceeb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .send-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    // Create hearts periodically
    setInterval(createHeart, 500);
    
    // Create initial hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 100);
    }
});

// Social Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Join me in celebrating Ify & Kingsley's wedding! #KingIfy2026 🎉");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Join me in celebrating Ify & Kingsley's wedding! #KingIfy2026 🎉");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=KingIfy2026,Wedding`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("You're invited to Ify & Kingsley's wedding! 🎊 #KingIfy2026");
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank', 'width=600,height=600');
}

function shareOnInstagram() {
    const text = encodeURIComponent("Check out Ify & Kingsley's beautiful wedding invitation! #KingIfy2026");
    alert('To share on Instagram:\n1. Take a screenshot of this page\n2. Open Instagram\n3. Share the screenshot as a Story or Post\n4. Tag #KingIfy2026');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('📋 Link copied to clipboard!');
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

// Add function to trigger photo upload from label
function triggerPhotoUpload() {
    document.getElementById('photo-upload').click();
}