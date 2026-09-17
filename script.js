document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('.section');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== SUBMISSION COUNTER =====
    let submissionCount = 0;
    const submissionCounter = document.getElementById('submissionCount');
    const submissionList = document.getElementById('submissionList');

    // ===== MODAL FUNCTIONS =====
    window.openSubmitModal = function(subject, professor) {
        const modal = document.getElementById('submitModal');
        const modalSubject = document.getElementById('modalSubject');
        const modalProfessor = document.getElementById('modalProfessor');
        const modalStatus = document.getElementById('modalStatus');
        
        modalSubject.textContent = subject;
        modalProfessor.textContent = professor || 'Professor';
        modalStatus.style.display = 'none';
        modalStatus.textContent = '';
        
        // Clear previous file input
        document.getElementById('modalFileInput').value = '';
        
        modal.style.display = 'block';
    };

    window.closeSubmitModal = function() {
        document.getElementById('submitModal').style.display = 'none';
    };

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('submitModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ===== SUBMIT FROM MODAL =====
    window.submitFromModal = function() {
        const fileInput = document.getElementById('modalFileInput');
        const subject = document.getElementById('modalSubject').textContent;
        const professor = document.getElementById('modalProfessor').textContent;
        const modalStatus = document.getElementById('modalStatus');
        const files = fileInput.files;

        if (files.length === 0) {
            modalStatus.style.display = 'block';
            modalStatus.textContent = '⚠️ Please select at least one file.';
            modalStatus.style.background = '#fce4e4';
            modalStatus.style.color = '#a12b2b';
            return;
        }

        // Get current date/time
        const now = new Date();
        const dateTime = now.toLocaleString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Process each file
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fileNames.push(file.name);

            // Add to submission list
            const listItem = document.createElement('li');
            listItem.className = 'submission-item';
            listItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span style="font-size: 0.7rem; color: #7a8fa8;">(${(file.size / 1024).toFixed(1)} KB)</span>
                    <span class="file-subject">${subject}</span>
                </div>
                <span class="file-date">${dateTime}</span>
            `;

            // Remove "No submissions yet" if it exists
            const emptyMsg = submissionList.querySelector('li[style]');
            if (emptyMsg && emptyMsg.style.color === '#aab9d9') {
                submissionList.innerHTML = '';
            }

            submissionList.prepend(listItem);
        }

        // Increment counter
        submissionCount += files.length;
        submissionCounter.textContent = submissionCount;

        // Show success message in modal
        modalStatus.style.display = 'block';
        modalStatus.textContent = '✅ Successfully submitted ' + files.length + ' file(s) to ' + professor;
        modalStatus.style.background = '#e1ebf9';
        modalStatus.style.color = '#1a3a6b';

        // Reset file input
        fileInput.value = '';

        // Close modal after 2 seconds
        setTimeout(function() {
            closeSubmitModal();
        }, 2000);
    };

    // ===== REGULAR SUBMIT (from docs section) =====
    const fileInputMain = document.getElementById('fileInput');
    const submitBtnMain = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
    const subjectSelect = document.getElementById('subjectSelect');

    submitBtnMain.addEventListener('click', function() {
        const files = fileInputMain.files;
        const subject = subjectSelect.value;

        if (files.length === 0) {
            showStatus('⚠️ Pumili ka muna ng file!', '#fce4e4', '#a12b2b');
            return;
        }

        if (subject === '') {
            showStatus('⚠️ Please select a subject first!', '#fce4e4', '#a12b2b');
            return;
        }

        // Get current date/time
        const now = new Date();
        const dateTime = now.toLocaleString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Process each file
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fileNames.push(file.name);

            // Add to submission list
            const listItem = document.createElement('li');
            listItem.className = 'submission-item';
            listItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span style="font-size: 0.7rem; color: #7a8fa8;">(${(file.size / 1024).toFixed(1)} KB)</span>
                    <span class="file-subject">${subject}</span>
                </div>
                <span class="file-date">${dateTime}</span>
            `;

            // Remove "No submissions yet" if it exists
            const emptyMsg = submissionList.querySelector('li[style]');
            if (emptyMsg && emptyMsg.style.color === '#aab9d9') {
                submissionList.innerHTML = '';
            }

            submissionList.prepend(listItem);
        }

        // Increment counter
        submissionCount += files.length;
        submissionCounter.textContent = submissionCount;

        showStatus(
            '✅ Submitted ' + files.length + ' file(s) for ' + subject,
            '#e1ebf9',
            '#1a3a6b'
        );

        // Reset file input
        fileInputMain.value = '';
    });

    fileInputMain.addEventListener('change', function() {
        const count = this.files.length;
        if (count > 0) {
            showStatus(
                '📎 ' + count + ' file(s) selected. Click "Submit to Professor" to pass.',
                '#eaf0fc',
                '#1a3a6b'
            );
        }
    });

    function showStatus(message, bgColor, textColor) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = message;
        statusDiv.style.background = bgColor;
        statusDiv.style.color = textColor;
        statusDiv.style.padding = '10px 20px';
        statusDiv.style.borderRadius = '30px';

        clearTimeout(window.statusTimeout);
        window.statusTimeout = setTimeout(function() {
            statusDiv.style.display = 'none';
        }, 5000);
    }

    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('✅ Message sent! Your professor will get back to you.');
            this.reset();
        });
    }
});