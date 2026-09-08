// State management
let state = {
    selectedDate: null,
    userEmail: null,
    currentPage: 'page1'
};

const adminEmail = 'Kenan.ghandour.7@gmail.com';

// Get elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const confirmDateBtn = document.getElementById('confirmDateBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const homeBtn = document.getElementById('homeBtn');
const backToCalendarBtn = document.getElementById('backToCalendarBtn');
const emailInput = document.getElementById('emailInput');

// Page navigation
function goToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(pageId).classList.add('active');
    state.currentPage = pageId;
    
    if (pageId === 'page2') {
        initializeCalendar();
    }
}

// Yes button - Go to calendar
yesBtn.addEventListener('click', () => {
    goToPage('page2');
});

// No button - Move randomly
noBtn.addEventListener('click', (e) => {
    const randomX = Math.random() * (window.innerWidth - 100);
    const randomY = Math.random() * (window.innerHeight - 50);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = 10;
});

// Back buttons
backBtn.addEventListener('click', () => goToPage('page1'));
backToCalendarBtn.addEventListener('click', () => goToPage('page2'));
homeBtn.addEventListener('click', () => {
    state.selectedDate = null;
    state.userEmail = null;
    goToPage('page1');
});

// Generate calendar
function initializeCalendar() {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';
    
    const today = new Date();
    const weeks = 4;
    const occupiedDays = [1, 2, 3, 4]; // Monday to Thursday (0=Sunday, 1=Monday)
    const eventDates = new Set();
    
    // Create calendar for 4 weeks
    for (let week = 0; week < weeks; week++) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() + (week * 7));
        
        if (week === 0) {
            // For the first week, start from today
            const dayOfWeek = weekStart.getDay();
            weekStart.setDate(weekStart.getDate() - dayOfWeek);
        }
        
        // Create month header if needed
        if (week === 0 || weekStart.getDate() <= 7) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'calendar-month';
            monthDiv.style.gridColumn = '1 / -1';
            
            const monthName = weekStart.toLocaleString('nl-NL', { month: 'long', year: 'numeric' });
            monthDiv.innerHTML = `<h3>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h3>`;
            calendarDiv.appendChild(monthDiv);
        }
        
        // Day headers
        if (week === 0) {
            const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
            days.forEach(day => {
                const header = document.createElement('div');
                header.className = 'day-header';
                header.textContent = day;
                calendarDiv.appendChild(header);
            });
        }
        
        // Create week days
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(currentDate.getDate() + day);
            
            const dateBtn = document.createElement('button');
            dateBtn.className = 'date-btn';
            
            const dayOfWeek = currentDate.getDay();
            const isOccupied = occupiedDays.includes(dayOfWeek) && (dayOfWeek !== 0 && dayOfWeek !== 6);
            const isBefore = currentDate < today && currentDate.toDateString() !== today.toDateString();
            
            if (isBefore) {
                dateBtn.classList.add('disabled');
                dateBtn.disabled = true;
                dateBtn.textContent = currentDate.getDate();
            } else if (isOccupied && dayOfWeek !== 5) { // Friday is free
                dateBtn.classList.add('occupied');
                dateBtn.disabled = true;
                dateBtn.textContent = currentDate.getDate();
            } else {
                dateBtn.textContent = currentDate.getDate();
                dateBtn.addEventListener('click', () => selectDate(currentDate, dateBtn));
            }
            
            calendarDiv.appendChild(dateBtn);
        }
    }
}

function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.date-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Store selected date
    state.selectedDate = date;
    
    // Enable confirm button
    confirmDateBtn.disabled = false;
}

// Confirm date
confirmDateBtn.addEventListener('click', () => {
    if (state.selectedDate) {
        const dateString = state.selectedDate.toLocaleDateString('nl-NL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('selectedDateDisplay').textContent = `📅 Datum: ${dateString}`;
        goToPage('page3');
    }
});

// Submit email and send emails
submitBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    state.userEmail = email;
    
    const dateString = state.selectedDate.toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Send emails via EmailJS or similar service
    await sendEmails(email, dateString);
    
    // Show success page
    document.getElementById('successText').textContent = `Je date is ingepland voor ${dateString}!`;
    goToPage('page4');
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function sendEmails(userEmail, dateString) {
    // Using EmailJS service (you need to set this up)
    // For now, we'll use a simple fetch to a backend or FormSubmit
    
    try {
        // Send to user
        await fetch('https://formspree.io/f/xnqygdvr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                subject: '🎉 Your Date is Confirmed! 💕',
                message: `
Hooray! Your date has been confirmed! 🎉

Date: ${dateString}

Get ready for an amazing time! 💕

Made with ❤️
                `
            })
        });
        
        // Send to admin
        await fetch('https://formspree.io/f/xnqygdvr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: adminEmail,
                subject: '📋 New Date Scheduled!',
                message: `
A new date has been scheduled!

User Email: ${userEmail}
Date: ${dateString}

Made with ❤️
                `
            })
        });
    } catch (error) {
        console.error('Error sending emails:', error);
        // Continue anyway - user still sees success page
    }
}

// Initialize
window.addEventListener('load', () => {
    goToPage('page1');
});