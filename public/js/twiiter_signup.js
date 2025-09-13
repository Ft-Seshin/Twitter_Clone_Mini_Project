// Enhanced Signup Form with Modern JavaScript
let current_fs, next_fs, previous_fs;
let left, opacity, scale;
let animating = false;

$(document).ready(function() {
    // Initialize the signup form
    initializeSignupForm();
    
    // Add form validation
    initializeFormValidation();
    
    // Add UI enhancements
    initializeUIEnhancements();
});

function initializeSignupForm() {
    // Store original button text
    $('.action-button').each(function() {
        $(this).attr('data-original-text', $(this).val());
    });
    
    // Add progress tracking
    updateProgressBar();
    
    // Add smooth animations
    addSmoothAnimations();
}

function initializeFormValidation() {
    // Real-time validation for each field
    $('input, textarea').on('input blur', function() {
        validateField($(this));
    });
    
    // Form submission validation
    $('.next, .submit').on('click', function(e) {
        e.preventDefault();
        
        const currentFieldset = $(this).closest('fieldset');
        const isValid = validateCurrentStep(currentFieldset);
        
        if (isValid) {
            if ($(this).hasClass('next')) {
                nextStep();
            } else if ($(this).hasClass('submit')) {
                submitForm();
            }
        }
    });
}

function validateField($field) {
    const fieldName = $field.attr('name');
    const fieldValue = $field.val().trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous validation
    $field.removeClass('error success');
    $field.siblings('.error-message').remove();
    
    // Required field validation
    if ($field.attr('required') && fieldValue === '') {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'email':
            if (fieldValue && !isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            break;
            
        case 'pass':
            if (fieldValue && fieldValue.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long.';
            } else if (fieldValue && !hasUpperCase(fieldValue)) {
                isValid = false;
                errorMessage = 'Password must contain at least one uppercase letter.';
            } else if (fieldValue && !hasLowerCase(fieldValue)) {
                isValid = false;
                errorMessage = 'Password must contain at least one lowercase letter.';
            } else if (fieldValue && !hasNumber(fieldValue)) {
                isValid = false;
                errorMessage = 'Password must contain at least one number.';
            }
            break;
            
        case 'cpass':
            const password = $('input[name="pass"]').val();
            if (fieldValue && fieldValue !== password) {
                isValid = false;
                errorMessage = 'Passwords do not match.';
            }
            break;
            
        case 'fname':
        case 'lname':
            if (fieldValue && fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            } else if (fieldValue && !/^[a-zA-Z\s]+$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Name can only contain letters and spaces.';
            }
            break;
            
        case 'phone':
            if (fieldValue && !isValidPhone(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
            break;
    }
    
    // Show validation result
    if (fieldValue !== '') {
        if (isValid) {
            $field.addClass('success');
            showFieldSuccess($field, 'Looks good!');
        } else {
            $field.addClass('error');
            showFieldError($field, errorMessage);
        }
    }
    
    return isValid;
}

function validateCurrentStep(fieldset) {
    let isValid = true;
    const fields = fieldset.find('input[required], textarea[required]');
    
    fields.each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    
    // Special validation for password confirmation
    if (fieldset.find('input[name="cpass"]').length > 0) {
        const password = fieldset.find('input[name="pass"]').val();
        const confirmPassword = fieldset.find('input[name="cpass"]').val();
        
        if (password !== confirmPassword) {
            isValid = false;
            showFieldError(fieldset.find('input[name="cpass"]'), 'Passwords do not match.');
        }
    }
    
    if (!isValid) {
        showNotification('Please fix the errors before continuing.', 'error');
        // Scroll to first error
        const firstError = fieldset.find('.error').first();
        if (firstError.length) {
            $('html, body').animate({
                scrollTop: firstError.offset().top - 100
            }, 500);
        }
    }
    
    return isValid;
}

function showFieldError($field, message) {
    const errorElement = $(`<div class="error-message">${message}</div>`);
    $field.after(errorElement);
    $field.addClass('error');
}

function showFieldSuccess($field, message) {
    const successElement = $(`<div class="success-message">${message}</div>`);
    $field.after(successElement);
    
    // Remove success message after 2 seconds
    setTimeout(() => {
        successElement.fadeOut(300, function() {
            $(this).remove();
        });
    }, 2000);
}

function getFieldLabel(fieldName) {
    const labels = {
        'email': 'Email',
        'pass': 'Password',
        'cpass': 'Confirm Password',
        'twitter': 'Twitter',
        'facebook': 'Facebook',
        'gplus': 'Google Plus',
        'fname': 'First Name',
        'lname': 'Last Name',
        'phone': 'Phone',
        'address': 'Address'
    };
    return labels[fieldName] || fieldName;
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function hasUpperCase(str) {
    return /[A-Z]/.test(str);
}

function hasLowerCase(str) {
    return /[a-z]/.test(str);
}

function hasNumber(str) {
    return /\d/.test(str);
}

// Enhanced step navigation
$(".next").click(function() {
    if (animating) return false;
    
    const currentFieldset = $(this).closest('fieldset');
    if (!validateCurrentStep(currentFieldset)) {
        return false;
    }
    
    animating = true;
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    // Update progress bar
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    updateProgressBar();

    next_fs.show();

    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            scale = 1 - (1 - now) * 0.2;
            left = (now * 50) + "%";
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({'left': left, 'opacity': opacity});
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
            // Focus on first input of next step
            next_fs.find('input, textarea').first().focus();
        },
        easing: 'easeInOutBack'
    });
});

$(".previous").click(function() {
    if (animating) return false;
    
    animating = true;
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    
    // Update progress bar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    updateProgressBar();
    
    previous_fs.show();
    
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            scale = 0.8 + (1 - now) * 0.2;
            left = ((1 - now) * 50) + "%";
            opacity = 1 - now;
            current_fs.css({'left': left});
            previous_fs.css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
            // Focus on first input of previous step
            previous_fs.find('input, textarea').first().focus();
        },
        easing: 'easeInOutBack'
    });
});

function updateProgressBar() {
    const totalSteps = $("#progressbar li").length;
    const activeSteps = $("#progressbar li.active").length;
    const progressPercentage = (activeSteps / totalSteps) * 100;
    
    // Add progress bar if it doesn't exist
    if ($('.progress-bar').length === 0) {
        $('#progressbar').after('<div class="progress-bar"><div class="progress-fill"></div></div>');
    }
    
    $('.progress-fill').css('width', progressPercentage + '%');
}

function submitForm() {
    // Validate all steps
    let allValid = true;
    $('fieldset').each(function() {
        if (!validateCurrentStep($(this))) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        showNotification('Please fix all errors before submitting.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate form submission
    simulateFormSubmission(formData);
}

function collectFormData() {
    const data = {};
    $('input, textarea').each(function() {
        const name = $(this).attr('name');
        const value = $(this).val().trim();
        if (name && value) {
            data[name] = value;
        }
    });
    return data;
}

function simulateFormSubmission(formData) {
    // Show loading animation
    setTimeout(() => {
        // Simulate successful submission
        showSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Redirect to login page after delay
        setTimeout(() => {
            window.location.href = 'twiiter_login.html';
        }, 2000);
    }, 2000);
}

function showLoadingState() {
    const submitButton = $('.submit');
    const originalText = submitButton.attr('data-original-text');
    
    submitButton.val('Creating Account...').prop('disabled', true).addClass('loading');
    
    // Add loading spinner
    submitButton.append('<div class="loading-spinner"></div>');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.notification').remove();
    
    const notification = $(`
        <div class="notification ${type}">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `);
    
    $('body').append(notification);
    
    // Style and animate
    notification.css({
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
        maxWidth: '400px'
    });
    
    // Animate in
    setTimeout(() => {
        notification.css('transform', 'translateX(0)');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.css('transform', 'translateX(100%)');
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

function initializeUIEnhancements() {
    // Add smooth transitions
    addSmoothTransitions();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add password strength indicator
    addPasswordStrengthIndicator();
    
    // Add auto-save functionality
    addAutoSave();
}

function addSmoothTransitions() {
    const style = `
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
            display: inline-block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #e1e8ed;
            border-radius: 2px;
            margin: 20px 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #1d9bf0, #00ba7c);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
    `;
    
    $('<style>').prop('type', 'text/css').html(style).appendTo('head');
}

function addKeyboardNavigation() {
    // Enter key to go to next step
    $(document).on('keypress', 'input, textarea', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            const $nextButton = $(this).closest('fieldset').find('.next');
            if ($nextButton.length) {
                $nextButton.click();
            } else if ($(this).closest('fieldset').find('.submit').length) {
                $('.submit').click();
            }
        }
    });
}

function addPasswordStrengthIndicator() {
    $('input[name="pass"]').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator($(this), strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 5);
}

function updatePasswordStrengthIndicator($field, strength) {
    // Remove existing indicator
    $field.siblings('.password-strength').remove();
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#e0245e', '#ffc107', '#ffc107', '#1d9bf0', '#00ba7c'];
    
    const indicator = $(`
        <div class="password-strength">
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${(strength / 5) * 100}%; background: ${strengthColors[strength - 1] || '#e1e8ed'}"></div>
            </div>
            <span class="strength-text">${strengthLabels[strength - 1] || 'Very Weak'}</span>
        </div>
    `);
    
    $field.after(indicator);
    
    // Add CSS for strength indicator
    if (!$('#password-strength-css').length) {
        $('<style id="password-strength-css">')
            .html(`
                .password-strength {
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .strength-bar {
                    flex: 1;
                    height: 4px;
                    background: #e1e8ed;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .strength-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }
                .strength-text {
                    font-size: 12px;
                    font-weight: 600;
                    color: #657786;
                }
            `)
            .appendTo('head');
    }
}

function addAutoSave() {
    // Auto-save form data to localStorage
    $('input, textarea').on('input', function() {
        const formData = collectFormData();
        localStorage.setItem('signupFormData', JSON.stringify(formData));
    });
    
    // Restore form data on page load
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const $field = $(`[name="${key}"]`);
                if ($field.length) {
                    $field.val(formData[key]);
                    validateField($field);
                }
            });
        } catch (e) {
            console.log('Error restoring form data:', e);
        }
    }
    
    // Clear saved data on successful submission
    $(document).on('formSubmitted', function() {
        localStorage.removeItem('signupFormData');
    });
}

// Prevent form submission on Enter key in textarea
$('textarea').on('keypress', function(e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        // Add new line instead
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const value = $(this).val();
        $(this).val(value.substring(0, start) + '\n' + value.substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
    }
});