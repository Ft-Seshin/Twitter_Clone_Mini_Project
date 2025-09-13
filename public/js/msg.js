// Global chat history storage
let chatHistory = {};
let currentChatId = null;

$(document).ready(function() {
    // Initialize the messages page
    initializeMessagesPage();
    
    // Initialize category switching
    initializeCategorySwitching();
    
    // Initialize search functionality
    initializeMessageSearch();
    
    // Initialize message interactions
    initializeMessageInteractions();
    
    // Initialize new message modal
    initializeNewMessageModal();
    
    // Initialize chat functionality
    initializeChatFunctionality();
    
    // Load saved chat history from localStorage
    loadChatHistoryFromStorage();
});

function initializeMessagesPage() {
    // Fix layout first
    fixLayout();
    
    // Set initial active category
    $('.category-tab[data-category="primary"]').addClass('active');
    $('#primaryMessages').addClass('active').show();
    
    // Ensure all message categories are properly initialized
    $('.message-category').each(function() {
        if ($(this).hasClass('active')) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    
    // Update unread counts
    updateUnreadCounts();
    
    // Add smooth transitions
    addSmoothTransitions();
    
    // Debug: Log message items
    console.log('Primary messages found:', $('#primaryMessages .message-item').length);
    console.log('General messages found:', $('#generalMessages .message-item').length);
    console.log('Request messages found:', $('#requestsMessages .message-item').length);
}

// Fix layout function
function fixLayout() {
    // Ensure proper container layout
    $('.messages-container').css({
        'display': 'flex',
        'flex-direction': 'row',
        'height': '100vh',
        'width': '100vw',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '1000'
    });
    
    // Fix sidebar
    $('.messages-sidebar').css({
        'width': '350px',
        'min-width': '350px',
        'max-width': '350px',
        'height': '100vh',
        'position': 'relative',
        'flex-shrink': '0',
        'overflow': 'hidden'
    });
    
    // Fix chat container
    $('.chat-container').css({
        'flex': '1',
        'height': '100vh',
        'position': 'relative',
        'overflow': 'hidden',
        'min-width': '0'
    });
    
    console.log('Layout fixed');
}

function initializeCategorySwitching() {
    $('.category-tab').on('click', function() {
        const category = $(this).data('category');
        
        console.log('Switching to category:', category);
        
        // Update active tab
        $('.category-tab').removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding messages
        $('.message-category').removeClass('active').hide();
        const $targetCategory = $(`#${category}Messages`);
        $targetCategory.addClass('active').show();
        
        console.log('Target category element:', $targetCategory.length);
        console.log('Messages in target category:', $targetCategory.find('.message-item').length);
        
        // Clear any active message selection
        $('.message-item').removeClass('active');
        
        // Show placeholder
        showChatPlaceholder();
        
        // Update unread counts
        updateUnreadCounts();
    });
}

function initializeMessageSearch() {
    $('#messageSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all messages in current category
            $('.message-item').show();
        } else {
            // Filter messages based on search term
            $('.message-item').each(function() {
                const $message = $(this);
                const userName = $message.find('h5').text().toLowerCase();
                const userHandle = $message.data('handle').toLowerCase();
                const messagePreview = $message.find('.message-preview').text().toLowerCase();
                
                if (userName.includes(searchTerm) || 
                    userHandle.includes(searchTerm) || 
                    messagePreview.includes(searchTerm)) {
                    $message.show();
                } else {
                    $message.hide();
                }
            });
        }
    });
}

function initializeMessageInteractions() {
    // Message item click
    $(document).on('click', '.message-item', function() {
        const $message = $(this);
        const messageId = $message.data('id');
        const userName = $message.data('user');
        const userHandle = $message.data('handle');
        const userPhoto = $message.find('img').attr('src');
        const isOnline = $message.find('.active').length > 0;
        
        // Update active message
        $('.message-item').removeClass('active');
        $message.addClass('active');
        
        // Open chat
        openChat(messageId, userName, userHandle, userPhoto, isOnline);
        
        // Mark as read
        $message.find('.unread-indicator').remove();
        updateUnreadCounts();
    });
    
    // Request message actions
    $(document).on('click', '.accept-btn', function(e) {
        e.stopPropagation();
        const $message = $(this).closest('.message-item');
        const userName = $message.data('user');
        
        // Show loading state
        $(this).text('Accepting...').prop('disabled', true);
        
        // Simulate API call
        setTimeout(() => {
            $message.fadeOut(300, function() {
                $(this).remove();
                updateUnreadCounts();
            });
            
            showNotification(`Friend request from ${userName} accepted!`, 'success');
        }, 1000);
    });
    
    $(document).on('click', '.decline-btn', function(e) {
        e.stopPropagation();
        const $message = $(this).closest('.message-item');
        const userName = $message.data('user');
        
        // Show loading state
        $(this).text('Declining...').prop('disabled', true);
        
        // Simulate API call
        setTimeout(() => {
            $message.fadeOut(300, function() {
                $(this).remove();
                updateUnreadCounts();
            });
            
            showNotification(`Friend request from ${userName} declined`, 'info');
        }, 1000);
    });
}

function initializeNewMessageModal() {
    // Open new message modal
    $('#newMessageBtn').on('click', function() {
        $('#newMessageModal').addClass('show');
        loadSuggestedContacts();
    });
    
    // Close new message modal
    $('#closeNewMessageModal').on('click', function() {
        $('#newMessageModal').removeClass('show');
    });
    
    // Close modal when clicking outside
    $('#newMessageModal').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('show');
        }
    });
    
    // Search in new message modal
    $('#newMessageSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        filterSuggestedContacts(searchTerm);
    });
}

function initializeChatFunctionality() {
    // Send message
    $('#sendMessageBtn').on('click', function() {
        sendMessage();
    });
    
    // Send message on Enter key
    $('#messageInput').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Typing indicator
    let typingTimer;
    $('#messageInput').on('input', function() {
        clearTimeout(typingTimer);
        showTypingIndicator();
        
        typingTimer = setTimeout(() => {
            hideTypingIndicator();
        }, 1000);
    });
}

function openChat(messageId, userName, userHandle, userPhoto, isOnline) {
    // Set current chat ID
    currentChatId = messageId;
    
    // Update chat header
    $('#chatUserPhoto').attr('src', userPhoto);
    $('#chatUserName').text(userName);
    $('#chatUserHandle').text(userHandle);
    
    if (isOnline) {
        $('#chatUserStatus').addClass('active');
    } else {
        $('#chatUserStatus').removeClass('active');
    }
    
    // Show chat interface
    $('.chat-placeholder').hide();
    $('#activeChat').show();
    
    // Load chat messages from history or create new
    loadChatMessages(messageId);
    
    // Focus on input
    $('#messageInput').focus();
}

function loadChatMessages(messageId) {
    const $chatMessages = $('#chatMessages');
    $chatMessages.empty();
    
    // Check if we have existing chat history for this messageId
    if (chatHistory[messageId] && chatHistory[messageId].length > 0) {
        // Load existing chat history
        chatHistory[messageId].forEach(message => {
            const messageHtml = createMessageBubble(message);
            $chatMessages.append(messageHtml);
        });
    } else {
        // Initialize with sample messages if no history exists
        const sampleMessages = getSampleMessages(messageId);
        chatHistory[messageId] = [...sampleMessages]; // Create a copy
        
        sampleMessages.forEach(message => {
            const messageHtml = createMessageBubble(message);
            $chatMessages.append(messageHtml);
        });
        
        // Save to localStorage
        saveChatHistoryToStorage();
    }
    
    // Scroll to bottom
    $chatMessages.scrollTop($chatMessages[0].scrollHeight);
}

function getSampleMessages(messageId) {
    const messageData = {
        1: [ // Shri
            { type: 'received', text: 'Hey! How are you doing today?', time: '2:30 PM' },
            { type: 'sent', text: 'I\'m doing great! Just working on some new projects. How about you?', time: '2:32 PM' },
            { type: 'received', text: 'That sounds exciting! I\'ve been working on some art pieces lately.', time: '2:35 PM' },
            { type: 'sent', text: 'I\'d love to see them sometime!', time: '2:36 PM' }
        ],
        2: [ // Himika
            { type: 'received', text: 'Hey! Check out this amazing photo I took!', time: '3:15 PM' },
            { type: 'sent', text: 'Wow, that\'s beautiful! Where did you take it?', time: '3:17 PM' },
            { type: 'received', text: 'At the beach during sunset. The colors were incredible!', time: '3:20 PM' }
        ],
        3: [ // Alex Johnson
            { type: 'received', text: 'Thanks for the help with the JavaScript project!', time: '1:45 PM' },
            { type: 'sent', text: 'No problem! Happy to help. How did it turn out?', time: '1:47 PM' },
            { type: 'received', text: 'It works perfectly now! The code is much cleaner.', time: '1:50 PM' }
        ],
        4: [ // Sarah Wilson
            { type: 'received', text: 'Beautiful sunset today!', time: '4:30 PM' },
            { type: 'sent', text: 'I saw it too! The sky was amazing.', time: '4:32 PM' }
        ],
        5: [ // Mike Chen
            { type: 'received', text: 'AI is revolutionizing everything!', time: '2:00 PM' },
            { type: 'sent', text: 'Absolutely! It\'s incredible how fast it\'s advancing.', time: '2:02 PM' }
        ]
    };
    
    return messageData[messageId] || [];
}

function createMessageBubble(message) {
    return $(`
        <div class="message-bubble ${message.type}" data-timestamp="${message.timestamp || Date.now()}">
            <div class="message-content-bubble">
                ${message.text}
            </div>
            <div class="message-time-bubble">
                ${message.time}
            </div>
        </div>
    `);
}

function sendMessage() {
    const messageText = $('#messageInput').val().trim();
    
    if (messageText === '' || !currentChatId) {
        return;
    }
    
    // Create message object
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sentMessage = {
        type: 'sent',
        text: messageText,
        time: currentTime,
        timestamp: Date.now()
    };
    
    // Add to chat history
    if (!chatHistory[currentChatId]) {
        chatHistory[currentChatId] = [];
    }
    chatHistory[currentChatId].push(sentMessage);
    
    // Create and add message bubble
    const messageBubble = createMessageBubble(sentMessage);
    $('#chatMessages').append(messageBubble);
    
    // Clear input
    $('#messageInput').val('');
    
    // Scroll to bottom
    const $chatMessages = $('#chatMessages');
    $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    
    // Save to localStorage
    saveChatHistoryToStorage();
    
    // Update message preview in sidebar
    updateMessagePreview(currentChatId, messageText, currentTime);
    
    // Simulate received message after delay
    setTimeout(() => {
        const responses = [
            "That's interesting!",
            "I see what you mean.",
            "Thanks for sharing!",
            "I agree with you.",
            "That makes sense.",
            "Tell me more about that.",
            "I hadn't thought of it that way.",
            "That's a great point!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const receivedMessage = {
            type: 'received',
            text: randomResponse,
            time: responseTime,
            timestamp: Date.now()
        };
        
        // Add to chat history
        chatHistory[currentChatId].push(receivedMessage);
        
        // Create and add response bubble
        const responseBubble = createMessageBubble(receivedMessage);
        $('#chatMessages').append(responseBubble);
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
        
        // Save to localStorage
        saveChatHistoryToStorage();
        
        // Update message preview in sidebar
        updateMessagePreview(currentChatId, randomResponse, responseTime);
        
    }, 1000 + Math.random() * 2000);
}

function loadSuggestedContacts() {
    const suggestedContacts = [
        { name: 'Emma Davis', handle: '@emmadavis', photo: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708387200&semt=ais' },
        { name: 'David Brown', handle: '@davidbrown', photo: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' },
        { name: 'Lisa Wang', handle: '@lisawang', photo: 'https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg' },
        { name: 'John Smith', handle: '@johnsmith', photo: 'https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg' },
        { name: 'Maria Garcia', handle: '@mariagarcia', photo: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708387200&semt=ais' }
    ];
    
    const $suggestedContacts = $('#suggestedContacts');
    $suggestedContacts.empty();
    
    suggestedContacts.forEach(contact => {
        const contactHtml = $(`
            <div class="contact-item" data-name="${contact.name}" data-handle="${contact.handle}">
                <div class="profile-photo">
                    <img src="${contact.photo}" alt="Profile Photo">
                </div>
                <div class="user-details">
                    <h5>${contact.name}</h5>
                    <span>${contact.handle}</span>
                </div>
            </div>
        `);
        
        $suggestedContacts.append(contactHtml);
    });
    
    // Add click handler for contacts
    $('.contact-item').on('click', function() {
        const name = $(this).data('name');
        const handle = $(this).data('handle');
        const photo = $(this).find('img').attr('src');
        
        // Close modal
        $('#newMessageModal').removeClass('show');
        
        // Create new message
        createNewMessage(name, handle, photo);
        
        showNotification(`Starting conversation with ${name}`, 'success');
    });
}

function filterSuggestedContacts(searchTerm) {
    $('.contact-item').each(function() {
        const $contact = $(this);
        const name = $contact.data('name').toLowerCase();
        const handle = $contact.data('handle').toLowerCase();
        
        if (name.includes(searchTerm) || handle.includes(searchTerm)) {
            $contact.show();
        } else {
            $contact.hide();
        }
    });
}

function createNewMessage(name, handle, photo) {
    // Generate new message ID
    const messageId = Date.now();
    
    // Initialize empty chat history for new conversation
    chatHistory[messageId] = [];
    
    // Create new message item
    const messageHtml = $(`
        <div class="message-item" data-id="${messageId}" data-user="${name}" data-handle="${handle}">
            <div class="profile-photo">
                <img src="${photo}" alt="Profile Photo">
                <div class="active"></div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <h5>${name}</h5>
                    <span class="message-time">now</span>
                </div>
                <p class="message-preview">New conversation started</p>
                <div class="unread-indicator"></div>
            </div>
        </div>
    `);
    
    // Add to primary messages
    $('#primaryMessages').prepend(messageHtml);
    
    // Save to localStorage
    saveChatHistoryToStorage();
    
    // Open the chat
    openChat(messageId, name, handle, photo, true);
    
    // Update unread counts
    updateUnreadCounts();
}

// Save chat history to localStorage
function saveChatHistoryToStorage() {
    try {
        localStorage.setItem('seshgram_chat_history', JSON.stringify(chatHistory));
    } catch (e) {
        console.log('Could not save chat history to localStorage:', e);
    }
}

// Load chat history from localStorage
function loadChatHistoryFromStorage() {
    try {
        const saved = localStorage.getItem('seshgram_chat_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.log('Could not load chat history from localStorage:', e);
        chatHistory = {};
    }
}

// Update message preview in sidebar
function updateMessagePreview(messageId, lastMessage, time) {
    const $messageItem = $(`.message-item[data-id="${messageId}"]`);
    if ($messageItem.length) {
        $messageItem.find('.message-preview').text(lastMessage);
        $messageItem.find('.message-time').text(time);
        
        // Move to top of the list
        const $parent = $messageItem.parent();
        $messageItem.detach();
        $parent.prepend($messageItem);
    }
}

function showChatPlaceholder() {
    $('.chat-placeholder').show();
    $('#activeChat').hide();
}

function updateUnreadCounts() {
    // Count unread messages in each category
    const primaryUnread = $('#primaryMessages .unread-indicator').length;
    const generalUnread = $('#generalMessages .unread-indicator').length;
    const requestsUnread = $('#requestsMessages .unread-indicator').length;
    
    // Update counts
    $('#primaryCount').text(primaryUnread);
    $('#generalCount').text(generalUnread);
    $('#requestsCount').text(requestsUnread);
    
    // Hide count if 0
    $('.unread-count').each(function() {
        if ($(this).text() === '0') {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function showTypingIndicator() {
    // This would show a typing indicator in a real app
    // For now, we'll just show a subtle animation
    const $chatMessages = $('#chatMessages');
    if ($chatMessages.find('.typing-indicator').length === 0) {
        const typingHtml = $(`
            <div class="message-bubble received typing-indicator">
                <div class="message-content-bubble">
                    <span class="typing-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </div>
            </div>
        `);
        $chatMessages.append(typingHtml);
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    }
}

function hideTypingIndicator() {
    $('.typing-indicator').remove();
}

function addSmoothTransitions() {
    // Add CSS for smooth transitions
    const style = `
        .message-item {
            transition: all 0.2s ease;
        }
        
        .message-bubble {
            animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .typing-dots span {
            animation: typing 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                opacity: 0.3;
            }
            30% {
                opacity: 1;
            }
        }
    `;
    
    $('<style>').prop('type', 'text/css').html(style).appendTo('head');
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
    
    // Style the notification
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
    }, 3000);
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

// Clear all chat history (for testing purposes)
function clearAllChatHistory() {
    chatHistory = {};
    localStorage.removeItem('seshgram_chat_history');
    location.reload();
}

// Export chat history (for backup)
function exportChatHistory() {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seshgram_chat_history.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Add keyboard shortcuts
$(document).on('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        $('#messageSearch').focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        $('#newMessageModal').removeClass('show');
    }
});

// Force show messages (debugging function)
function forceShowMessages() {
    console.log('Forcing messages to show...');
    
    // Ensure proper layout
    $('.messages-container').css({
        'display': 'flex',
        'flex-direction': 'row',
        'height': '100vh',
        'width': '100vw',
        'position': 'fixed',
        'top': '0',
        'left': '0'
    });
    
    $('.messages-sidebar').css({
        'width': '350px',
        'min-width': '350px',
        'max-width': '350px',
        'height': '100vh',
        'position': 'relative',
        'flex-shrink': '0'
    });
    
    $('.chat-container').css({
        'flex': '1',
        'height': '100vh',
        'position': 'relative',
        'overflow': 'hidden'
    });
    
    // Show primary messages
    $('#primaryMessages').addClass('active').show().css('display', 'block');
    $('#generalMessages').removeClass('active').hide();
    $('#requestsMessages').removeClass('active').hide();
    
    // Ensure all message items are visible
    $('.message-item').show().css('display', 'flex');
    
    console.log('Primary messages visible:', $('#primaryMessages').is(':visible'));
    console.log('Message items visible:', $('.message-item').length);
    console.log('Container layout fixed');
}

// Initialize demo data
$(document).ready(function() {
    // Add some demo unread indicators
    setTimeout(() => {
        updateUnreadCounts();
        forceShowMessages(); // Force show messages
    }, 1000);
    
    // Add console commands for debugging
    window.clearChatHistory = clearAllChatHistory;
    window.exportChatHistory = exportChatHistory;
    window.chatHistory = chatHistory;
    window.forceShowMessages = forceShowMessages;
    
    console.log('Chat history loaded:', Object.keys(chatHistory).length, 'conversations');
    console.log('Available commands: clearChatHistory(), exportChatHistory(), forceShowMessages()');
});
