document.addEventListener("DOMContentLoaded", function () {
    // Initialize login page
    initializeLoginPage();
    
    // Form validation
    initializeFormValidation();
    
    // Enhanced UI interactions
    initializeUIEnhancements();
});

function initializeLoginPage() {
    // Add loading animation
    showPageLoading();
    
    // Initialize form elements
    const loginForm = document.querySelector('.LoginForm');
    const usernameInput = document.querySelector('.js-signin-email');
    const passwordInput = document.querySelector('input[name="session[password]"]');
    
    // Add focus effects
    addFocusEffects(usernameInput, passwordInput);
    
    // Add real-time validation
    addRealTimeValidation(usernameInput, passwordInput);
}

function initializeFormValidation() {
    const loginForm = document.querySelector('.LoginForm');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const username = document.querySelector('.js-signin-email').value.trim();
        const password = document.querySelector('input[name="session[password]"]').value.trim();
        
        // Clear previous errors
        clearValidationErrors();
        
        // Validate inputs
        const validation = validateLoginForm(username, password);
        
        if (!validation.isValid) {
            showValidationErrors(validation.errors);
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Simulate login process
        simulateLogin(username, password);
    });
}

function validateLoginForm(username, password) {
    const errors = [];
    
    // Username validation
    if (username === '') {
        errors.push({ field: 'username', message: 'Username is required.' });
    } else if (username.length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters long.' });
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push({ field: 'username', message: 'Username can only contain letters, numbers, and underscores.' });
    }
    
    // Password validation
    if (password === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    } else if (password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function showValidationErrors(errors) {
    errors.forEach(error => {
        const field = document.querySelector(`input[name="session[${error.field === 'username' ? 'username_or_email' : 'password']}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
}

function showFieldError(field, message) {
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Add shake animation
    field.classList.add('shake');
    setTimeout(() => field.classList.remove('shake'), 500);
}

function clearValidationErrors() {
    // Remove error classes
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

function addFocusEffects(usernameInput, passwordInput) {
    [usernameInput, passwordInput].forEach(input => {
        if (!input) return;
        
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value !== '') {
            input.parentNode.classList.add('focused');
        }
    });
}

function addRealTimeValidation(usernameInput, passwordInput) {
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // Remove previous error
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            // Real-time validation
            if (value.length > 0 && value.length < 3) {
                showFieldError(this, 'Username must be at least 3 characters long.');
            } else if (value.length > 0 && !/^[a-zA-Z0-9_]+$/.test(value)) {
                showFieldError(this, 'Username can only contain letters, numbers, and underscores.');
            } else if (value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value)) {
                this.classList.add('success');
                setTimeout(() => this.classList.remove('success'), 2000);
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const value = this.value;
            
            // Remove previous error
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            // Real-time validation
            if (value.length > 0 && value.length < 6) {
                showFieldError(this, 'Password must be at least 6 characters long.');
            } else if (value.length >= 6) {
                this.classList.add('success');
                setTimeout(() => this.classList.remove('success'), 2000);
            }
        });
    }
}

function showLoadingState() {
    const submitButton = document.querySelector('.submit');
    const originalText = submitButton.value;
    
    submitButton.value = 'Logging in...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    submitButton.appendChild(spinner);
}

function simulateLogin(username, password) {
    // Simulate API call delay
    setTimeout(() => {
        // Simulate successful login
        if (username === 'admin' && password === 'password') {
            showSuccessMessage('Login successful! Redirecting...');
            
            // Redirect to homepage after delay
            setTimeout(() => {
                window.location.href = 'twiiter_homepage.html';
            }, 1500);
        } else {
            // Simulate failed login
            showErrorMessage('Invalid username or password. Please try again.');
            resetLoginForm();
        }
    }, 2000);
}

function resetLoginForm() {
    const submitButton = document.querySelector('.submit');
    const originalText = submitButton.getAttribute('data-original-text') || 'Log in';
    
    submitButton.value = originalText;
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    
    // Remove loading spinner
    const spinner = submitButton.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: '600',
        transform: 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 400);
    }, type === 'success' ? 3000 : 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#00ba7c',
        error: '#e0245e',
        warning: '#ffc107',
        info: '#1d9bf0'
    };
    return colors[type] || '#1d9bf0';
}

function showPageLoading() {
    // Add loading animation to the page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function initializeUIEnhancements() {
    // Add smooth transitions
    addSmoothTransitions();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add accessibility features
    addAccessibilityFeatures();
}

function addSmoothTransitions() {
    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
        .LoginForm-input {
            transition: all 0.3s ease;
        }
        
        .LoginForm-input.focused {
            transform: translateY(-2px);
        }
        
        .error {
            animation: shake 0.5s ease-in-out;
        }
        
        .success {
            animation: successPulse 0.6s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-message {
            color: #e0245e;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function addKeyboardNavigation() {
    // Add Enter key support for form submission
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
}

function addAccessibilityFeatures() {
    // Add ARIA labels
    const usernameInput = document.querySelector('.js-signin-email');
    const passwordInput = document.querySelector('input[name="session[password]"]');
    
    if (usernameInput) {
        usernameInput.setAttribute('aria-label', 'Username or email address');
        usernameInput.setAttribute('aria-required', 'true');
    }
    
    if (passwordInput) {
        passwordInput.setAttribute('aria-label', 'Password');
        passwordInput.setAttribute('aria-required', 'true');
    }
    
    // Add live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);
    
    // Announce validation errors
    const originalShowFieldError = showFieldError;
    showFieldError = function(field, message) {
        originalShowFieldError(field, message);
        liveRegion.textContent = message;
    };
}

// Demo credentials for testing
console.log('Demo credentials: username: admin, password: password');