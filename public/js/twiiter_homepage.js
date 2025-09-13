$(document).ready(function() {
    // Initialize the homepage
    initializeHomepage();
    
    // Tweet functionality
    initializeTweetFeatures();
    
    // Like and retweet functionality
    initializeInteractionFeatures();
    
    // Comment functionality
    initializeCommentFeatures();
    
    // Search functionality
    initializeSearchFeatures();
    
    // Friend request functionality
    initializeFriendRequestFeatures();
});

function initializeHomepage() {
    // Hide all tweets initially
    $(".tweet").addClass("none");
    
    // Add smooth scrolling
    $('html').css('scroll-behavior', 'smooth');
    
    // Add loading animation
    showLoadingAnimation();
    
    // Initialize tooltips
    initializeTooltips();
}

function initializeTweetFeatures() {
    // Tweet input functionality
    $("#inp").on('input keyup', function() {
        const tweetText = $(this).val().trim();
        const tweetButton = $(".mid-tweet");
        
        if (tweetText.length > 0) {
            tweetButton.addClass("active");
            tweetButton.css("opacity", "1");
            tweetButton.css("cursor", "pointer");
        } else {
            tweetButton.removeClass("active");
            tweetButton.css("opacity", "0.5");
            tweetButton.css("cursor", "default");
        }
        
        // Character counter
        updateCharacterCounter(tweetText.length);
    });

    // Post tweet functionality
    $(".mid-tweet").click(function() {
        const tweetText = $("#inp").val().trim();
        
        if (tweetText.length === 0) {
            showNotification("Please enter some text to tweet!", "error");
            return;
        }
        
        if (tweetText.length > 280) {
            showNotification("Tweet is too long! Maximum 280 characters.", "error");
            return;
        }
        
        postTweet(tweetText);
    });

    // Enter key to post tweet
    $("#inp").keypress(function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $(".mid-tweet").click();
        }
    });
}

function postTweet(tweetText) {
    // Show loading state
    const tweetButton = $(".mid-tweet");
    const originalText = tweetButton.text();
    tweetButton.text("Posting...").prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Create new tweet
        const newTweet = createTweetElement(tweetText);
        
        // Add to timeline
        $(".mid").append(newTweet);
        
        // Update trending
        updateTrending(tweetText);
        
        // Clear input
        $("#inp").val("");
        $(".mid-tweet").removeClass("active").css("opacity", "0.5");
        
        // Reset button
        tweetButton.text(originalText).prop('disabled', false);
        
        // Show success notification
        showNotification("Tweet posted successfully!", "success");
        
        // Scroll to new tweet
        $('html, body').animate({
            scrollTop: newTweet.offset().top - 100
        }, 500);
        
    }, 1000);
}

function createTweetElement(tweetText) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const tweetId = 'tweet_' + Date.now();
    
    return $(`
        <div class="tweet flx" id="${tweetId}">
            <div class="tweet-1">
                <img src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg" alt="Profile" style="height: 50px; width: 50px; border-radius: 150px;">
            </div>
            <div class="tweet-2">
                <div class="t-1">
                    <span class="name">You</span>
                    <span class="uname">@yourusername</span>
                    <span class="uname">• ${currentTime}</span>
                </div>
                <div class="t-2">
                    <span class="content-2">${escapeHtml(tweetText)}</span>
                </div>
                <div class="t-3">
                    <i class="far fa-comment" title="Reply"></i>
                    <i class="far fa-retweet" title="Retweet"></i>
                    <i class="far fa-heart fav" title="Like"></i>
                    <i class="far fa-share" title="Share"></i>
                </div>
                <div class="comment-section">
                    <textarea placeholder="Tweet your reply..." rows="3"></textarea>
                    <button class="reply-btn">Reply</button>
                    <ul class="comment-list"></ul>
                </div>
            </div>
        </div>
    `);
}

function initializeInteractionFeatures() {
    // Like functionality
    $(document).on('click', '.fav', function() {
        const $this = $(this);
        const isLiked = $this.hasClass('fas');
        
        if (isLiked) {
            $this.removeClass('fas').addClass('far');
            $this.css("color", "");
            showNotification("Tweet unliked", "info");
        } else {
            $this.removeClass('far').addClass('fas');
            $this.css("color", "rgb(238, 24, 95)");
            showNotification("Tweet liked!", "success");
            
            // Add like animation
            $this.addClass('like-animation');
            setTimeout(() => $this.removeClass('like-animation'), 600);
        }
    });

    // Retweet functionality
    $(document).on('click', '.fa-retweet', function() {
        const $this = $(this);
        const isRetweeted = $this.hasClass('retweeted');
        
        if (isRetweeted) {
            $this.removeClass('retweeted');
            $this.css("color", "");
            showNotification("Retweet removed", "info");
        } else {
            $this.addClass('retweeted');
            $this.css("color", "rgb(48, 185, 48)");
            showNotification("Tweet retweeted!", "success");
            
            // Add retweet animation
            $this.addClass('retweet-animation');
            setTimeout(() => $this.removeClass('retweet-animation'), 600);
        }
    });

    // Follow functionality
    $(document).on('click', '.follow', function() {
        const $this = $(this);
        const isFollowing = $this.text().trim() === 'Following';
        
        if (isFollowing) {
            $this.css("background", "").css("color", "").text("Follow");
            showNotification("Unfollowed", "info");
        } else {
            $this.css("background", "#00acee").css("color", "white").text("Following");
            showNotification("Following!", "success");
        }
    });
}

function initializeCommentFeatures() {
    // Reply functionality
    $(document).on('click', '.reply-btn', function() {
        const $this = $(this);
        const $textarea = $this.siblings('textarea');
        const $commentList = $this.siblings('.comment-list');
        const commentText = $textarea.val().trim();
        
        if (commentText.length === 0) {
            showNotification("Please enter a reply!", "error");
            return;
        }
        
        if (commentText.length > 280) {
            showNotification("Reply is too long! Maximum 280 characters.", "error");
            return;
        }
        
        // Add comment
        const commentElement = $(`
            <li class="comment-item">
                <div class="comment-content">
                    <strong>You:</strong> ${escapeHtml(commentText)}
                </div>
                <div class="comment-time">${new Date().toLocaleTimeString()}</div>
            </li>
        `);
        
        $commentList.append(commentElement);
        $textarea.val('');
        
        showNotification("Reply posted!", "success");
    });

    // Enter key to reply
    $(document).on('keypress', 'textarea', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $(this).siblings('.reply-btn').click();
        }
    });
}

function initializeSearchFeatures() {
    // Enhanced search functionality
    const $searchInput = $('.search');
    const $searchResults = $('<div class="search-results"></div>');
    const $searchDropdown = $('<div class="search-dropdown"></div>');
    
    // Add search results container
    $('.mid').prepend($searchResults);
    $('.r-inp').append($searchDropdown);
    
    // Search input functionality
    $searchInput.on('input focus', function() {
        const searchTerm = $(this).val().trim().toLowerCase();
        
        if (searchTerm.length > 0) {
            performSearch(searchTerm);
            showSearchDropdown();
        } else {
            hideSearchDropdown();
            clearSearchResults();
        }
    });
    
    // Hide dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.r-inp, .search-dropdown').length) {
            hideSearchDropdown();
        }
    });
    
    // Search on Enter key
    $searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            const searchTerm = $(this).val().trim();
            if (searchTerm.length > 0) {
                performAdvancedSearch(searchTerm);
            }
        }
    });
}

function performSearch(searchTerm) {
    const results = {
        tweets: [],
        profiles: [],
        hashtags: []
    };
    
    // Search tweets
    $('.tweet').each(function() {
        const $tweet = $(this);
        const tweetText = $tweet.find('.content, .content-2').text().toLowerCase();
        const userName = $tweet.find('.name').text().toLowerCase();
        const userHandle = $tweet.find('.uname').text().toLowerCase();
        const tweetTime = $tweet.find('.uname').last().text().trim();
        
        if (tweetText.includes(searchTerm) || userName.includes(searchTerm) || userHandle.includes(searchTerm)) {
            results.tweets.push({
                element: $tweet,
                text: tweetText,
                userName: userName,
                userHandle: userHandle,
                time: tweetTime,
                relevance: calculateRelevance(searchTerm, tweetText, userName, userHandle)
            });
        }
    });
    
    // Search profiles (from trending and friend requests)
    $('.g-content, .name').each(function() {
        const $profile = $(this);
        const profileName = $profile.text().toLowerCase();
        const $parent = $profile.closest('.g-div, .request');
        
        if (profileName.includes(searchTerm) && !$profile.closest('.tweet').length) {
            results.profiles.push({
                element: $parent,
                name: profileName,
                type: $profile.closest('.g-div').length ? 'trending' : 'friend'
            });
        }
    });
    
    // Search hashtags
    $('.content, .content-2').each(function() {
        const text = $(this).text();
        const hashtags = text.match(/#\w+/g);
        
        if (hashtags) {
            hashtags.forEach(hashtag => {
                if (hashtag.toLowerCase().includes(searchTerm)) {
                    results.hashtags.push({
                        hashtag: hashtag,
                        element: $(this).closest('.tweet')
                    });
                }
            });
        }
    });
    
    // Sort by relevance
    results.tweets.sort((a, b) => b.relevance - a.relevance);
    
    // Display search results
    displaySearchResults(searchTerm, results);
}

function calculateRelevance(searchTerm, tweetText, userName, userHandle) {
    let score = 0;
    
    // Exact matches get higher scores
    if (tweetText.includes(searchTerm)) score += 3;
    if (userName.includes(searchTerm)) score += 2;
    if (userHandle.includes(searchTerm)) score += 2;
    
    // Position-based scoring
    if (tweetText.indexOf(searchTerm) === 0) score += 2;
    if (userName.indexOf(searchTerm) === 0) score += 1;
    if (userHandle.indexOf(searchTerm) === 0) score += 1;
    
    return score;
}

function displaySearchResults(searchTerm, results) {
    const $dropdown = $('.search-dropdown');
    $dropdown.empty();
    
    if (results.tweets.length === 0 && results.profiles.length === 0 && results.hashtags.length === 0) {
        $dropdown.html(`
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${searchTerm}"</p>
            </div>
        `);
        return;
    }
    
    let html = `<div class="search-header">Search results for "${searchTerm}"</div>`;
    
    // Display tweets
    if (results.tweets.length > 0) {
        html += '<div class="search-section"><h4><i class="fas fa-comment"></i> Tweets</h4>';
        results.tweets.slice(0, 5).forEach(result => {
            const tweetPreview = result.text.substring(0, 100) + (result.text.length > 100 ? '...' : '');
            html += `
                <div class="search-item tweet-item" data-target="${result.element.attr('id') || 'tweet'}">
                    <div class="search-item-content">
                        <strong>${result.userName}</strong> <span class="search-handle">${result.userHandle}</span>
                        <p>${tweetPreview}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Display profiles
    if (results.profiles.length > 0) {
        html += '<div class="search-section"><h4><i class="fas fa-user"></i> Profiles</h4>';
        results.profiles.slice(0, 3).forEach(result => {
            const profileType = result.type === 'trending' ? 'Trending' : 'Friend';
            html += `
                <div class="search-item profile-item" data-target="${result.element.attr('class')}">
                    <div class="search-item-content">
                        <strong>${result.name}</strong>
                        <span class="search-type">${profileType}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Display hashtags
    if (results.hashtags.length > 0) {
        html += '<div class="search-section"><h4><i class="fas fa-hashtag"></i> Hashtags</h4>';
        const uniqueHashtags = [...new Set(results.hashtags.map(h => h.hashtag))];
        uniqueHashtags.slice(0, 3).forEach(hashtag => {
            html += `
                <div class="search-item hashtag-item">
                    <div class="search-item-content">
                        <strong>${hashtag}</strong>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    $dropdown.html(html);
    
    // Add click handlers for search items
    $dropdown.find('.search-item').on('click', function() {
        const $item = $(this);
        const target = $item.data('target');
        
        if ($item.hasClass('tweet-item')) {
            // Scroll to tweet
            const $targetTweet = $('#' + target);
            if ($targetTweet.length) {
                $('html, body').animate({
                    scrollTop: $targetTweet.offset().top - 100
                }, 500);
                
                // Highlight tweet temporarily
                $targetTweet.addClass('search-highlight');
                setTimeout(() => $targetTweet.removeClass('search-highlight'), 2000);
            }
        } else if ($item.hasClass('profile-item')) {
            // Handle profile click
            showNotification(`Viewing profile: ${$item.find('strong').text()}`, 'info');
        } else if ($item.hasClass('hashtag-item')) {
            // Filter by hashtag
            const hashtag = $item.find('strong').text();
            filterByHashtag(hashtag);
        }
        
        hideSearchDropdown();
    });
}

function performAdvancedSearch(searchTerm) {
    // Clear previous search results
    clearSearchResults();
    
    // Show search results section
    $('.search-results').html(`
        <div class="search-results-header">
            <h3>Search Results for "${searchTerm}"</h3>
            <button class="clear-search-btn">Clear Search</button>
        </div>
        <div class="search-results-content"></div>
    `);
    
    // Perform comprehensive search
    const results = {
        tweets: [],
        profiles: [],
        hashtags: []
    };
    
    // Search all tweets
    $('.tweet').each(function() {
        const $tweet = $(this);
        const tweetText = $tweet.find('.content, .content-2').text().toLowerCase();
        const userName = $tweet.find('.name').text().toLowerCase();
        const userHandle = $tweet.find('.uname').text().toLowerCase();
        
        if (tweetText.includes(searchTerm) || userName.includes(searchTerm) || userHandle.includes(searchTerm)) {
            results.tweets.push($tweet);
        }
    });
    
    // Display results
    const $resultsContent = $('.search-results-content');
    
    if (results.tweets.length > 0) {
        $resultsContent.html('<h4>Matching Tweets</h4>');
        results.tweets.forEach($tweet => {
            $tweet.clone().appendTo($resultsContent);
        });
    } else {
        $resultsContent.html(`
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>No tweets found</h4>
                <p>Try searching for different keywords or check your spelling.</p>
            </div>
        `);
    }
    
    // Add clear search functionality
    $('.clear-search-btn').on('click', function() {
        clearSearchResults();
        $('.search').val('');
    });
}

function filterByHashtag(hashtag) {
    $('.tweet').each(function() {
        const $tweet = $(this);
        const tweetText = $tweet.find('.content, .content-2').text();
        
        if (tweetText.includes(hashtag)) {
            $tweet.show();
        } else {
            $tweet.hide();
        }
    });
    
    showNotification(`Filtering by ${hashtag}`, 'info');
}

function showSearchDropdown() {
    $('.search-dropdown').addClass('show');
}

function hideSearchDropdown() {
    $('.search-dropdown').removeClass('show');
}

function clearSearchResults() {
    $('.search-results').empty();
    $('.tweet').show();
}

function initializeFriendRequestFeatures() {
    // Accept friend request
    $(document).on('click', '.btn-primary', function() {
        const $this = $(this);
        const $request = $this.closest('.request');
        
        $this.text('Accepted').css('background', '#00ba7c');
        $this.siblings('.btn').hide();
        
        setTimeout(() => {
            $request.fadeOut(300, function() {
                $(this).remove();
            });
        }, 1000);
        
        showNotification("Friend request accepted!", "success");
    });

    // Decline friend request
    $(document).on('click', '.btn:not(.btn-primary)', function() {
        const $this = $(this);
        const $request = $this.closest('.request');
        
        $this.text('Declined').css('background', '#e0245e');
        $this.siblings('.btn-primary').hide();
        
        setTimeout(() => {
            $request.fadeOut(300, function() {
                $(this).remove();
            });
        }, 1000);
        
        showNotification("Friend request declined", "info");
    });
}

function updateTrending(tweetText) {
    // Extract hashtags
    const hashtags = tweetText.match(/#\w+/g);
    
    if (hashtags) {
        hashtags.forEach(hashtag => {
            const cleanTag = hashtag.substring(1);
            const $existingTrend = $(`.g-content:contains("${cleanTag}")`);
            
            if ($existingTrend.length > 0) {
                // Update existing trend count
                const $count = $existingTrend.siblings('.sayi');
                const currentCount = parseInt($count.text().replace(/\D/g, ''));
                $count.text(`${currentCount + 1} Tweet`);
            } else {
                // Add new trend
                const newTrend = $(`
                    <div class="g-div">
                        <span class="tr">Trending now</span>
                        <span class="g-content">${cleanTag}</span>
                        <span class="sayi">1 Tweet</span>
                    </div>
                `);
                
                $('.gundem').append(newTrend);
            }
        });
    }
}

function updateCharacterCounter(length) {
    const maxLength = 280;
    const remaining = maxLength - length;
    
    // Remove existing counter
    $('.char-counter').remove();
    
    // Add new counter
    const counterClass = remaining < 20 ? 'warning' : remaining < 0 ? 'error' : 'normal';
    const counter = $(`<div class="char-counter ${counterClass}">${remaining}</div>`);
    
    $('.mid-icon').append(counter);
}

function showLoadingAnimation() {
    // Add loading animation to tweets
    $('.tweet').each(function(index) {
        $(this).css('animation-delay', `${index * 0.1}s`);
    });
}

function initializeTooltips() {
    // Add tooltips to interactive elements
    $('[title]').each(function() {
        $(this).hover(
            function() {
                const tooltip = $(`<div class="tooltip">${$(this).attr('title')}</div>`);
                $('body').append(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.css({
                    position: 'absolute',
                    top: rect.top - 35,
                    left: rect.left + (rect.width / 2) - (tooltip.width() / 2),
                    background: '#000',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000
                });
            },
            function() {
                $('.tooltip').remove();
            }
        );
    });
}

function showNotification(message, type = 'info') {
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
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Animate in
    setTimeout(() => {
        notification.css('transform', 'translateX(0)');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.css('transform', 'translateX(100%)');
        setTimeout(() => notification.remove(), 300);
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

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Add CSS for animations
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .like-animation {
            animation: likePulse 0.6s ease-in-out;
        }
        
        .retweet-animation {
            animation: retweetSpin 0.6s ease-in-out;
        }
        
        @keyframes likePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        
        @keyframes retweetSpin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
        
        .char-counter {
            font-size: 12px;
            font-weight: 600;
            margin-left: 8px;
        }
        
        .char-counter.warning {
            color: #ffc107;
        }
        
        .char-counter.error {
            color: #e0245e;
        }
        
        .char-counter.normal {
            color: #657786;
        }
        
        .comment-item {
            background: #f7f9fa;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            border-left: 3px solid #1d9bf0;
        }
        
        .comment-content {
            font-size: 14px;
            color: #14171a;
            margin-bottom: 4px;
        }
        
        .comment-time {
            font-size: 12px;
            color: #657786;
        }
    `)
    .appendTo('head');