
        // Sample course data
        const courses = {
            1: {
                title: "Web Development Fundamentals",
                instructor: "Sarah Johnson",
                lessons: [
                    { title: "Introduction to HTML", duration: "12:34", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
                    { title: "HTML Structure and Elements", duration: "18:45", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
                    { title: "CSS Basics", duration: "22:17", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
                    { title: "CSS Layout Techniques", duration: "15:32", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
                    { title: "JavaScript Introduction", duration: "20:08", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
                ]
            }
        };

        let currentCourse = null;
        let currentLesson = 1;
        let completedLessons = new Set([1, 2, 3]); // Track completed lessons

        // Navigation
        function showPage(pageId, courseId = null) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Update nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update active nav link
            if (pageId !== 'course-detail') {
                const activeLink = document.querySelector(`[onclick*="${pageId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
            
            // Handle course detail page
            if (pageId === 'course-detail' && courseId) {
                currentCourse = courseId;
                loadCourse(courseId);
            }
        }

        // Load course content
        function loadCourse(courseId) {
            const course = courses[courseId];
            if (!course) return;
            
            // Update lesson list
            const lessonList = document.getElementById('lesson-list');
            lessonList.innerHTML = '';
            
            course.lessons.forEach((lesson, index) => {
                const isCompleted = completedLessons.has(index + 1);
                const isActive = currentLesson === index + 1;
                
                const lessonItem = document.createElement('li');
                lessonItem.className = `lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
                lessonItem.onclick = () => playLesson(index + 1);
                lessonItem.innerHTML = `
                    <div class="lesson-number">${index + 1}${isCompleted ? ' ✓' : ''}</div>
                    <div>
                        <div>${lesson.title}</div>
                        <small>${lesson.duration}</small>
                    </div>
                `;
                lessonList.appendChild(lessonItem);
            });
            
            // Load first lesson
            playLesson(1);
        }

        // Play lesson
        function playLesson(lessonNumber) {
            const course = courses[currentCourse];
            if (!course || !course.lessons[lessonNumber - 1]) return;
            
            currentLesson = lessonNumber;
            const lesson = course.lessons[lessonNumber - 1];
            
            // Update video and title
            document.getElementById('lesson-title').textContent = lesson.title;
            document.getElementById('lesson-video').src = lesson.video;
            
            // Update active lesson in sidebar
            document.querySelectorAll('.lesson-item').forEach((item, index) => {
                item.classList.toggle('active', index + 1 === lessonNumber);
            });
            
            // Update progress
            updateProgress();
        }

        // Mark lesson as complete
        function markLessonComplete() {
            completedLessons.add(currentLesson);
            
            // Update lesson item to show completion
            const lessonItems = document.querySelectorAll('.lesson-item');
            const currentItem = lessonItems[currentLesson - 1];
            currentItem.classList.add('completed');
            
            // Update lesson number to show checkmark
            const lessonNumber = currentItem.querySelector('.lesson-number');
            lessonNumber.innerHTML = `${currentLesson} ✓`;
            
            // Update progress
            updateProgress();
            
            // Show completion animation
            showCompletionMessage();
            
            // Auto-advance to next lesson if available
            setTimeout(() => {
                const nextLesson = currentLesson + 1;
                if (courses[currentCourse].lessons[nextLesson - 1]) {
                    playLesson(nextLesson);
                }
            }, 2000);
        }

        // Update progress bars
        function updateProgress() {
            const course = courses[currentCourse];
            if (!course) return;
            
            const totalLessons = course.lessons.length;
            const completedCount = Array.from(completedLessons).filter(lesson => lesson <= totalLessons).length;
            const progressPercentage = (completedCount / totalLessons) * 100;
            
            // Update course detail progress
            const progressBar = document.querySelector('#course-detail .progress-fill');
            if (progressBar) {
                progressBar.style.width = `${progressPercentage}%`;
            }
            
            const progressText = document.querySelector('#course-detail .course-progress + p');
            if (progressText) {
                progressText.textContent = `${Math.round(progressPercentage)}% Complete (${completedCount}/${totalLessons} lessons)`;
            }
        }

        // Show completion message
        function showCompletionMessage() {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 2rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                text-align: center;
                animation: slideIn 0.5s ease-out;
            `;
            message.innerHTML = `
                <h3>🎉 Lesson Completed!</h3>
                <p>Great job! You're making excellent progress.</p>
            `;
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 2000);
        }

        // Search functionality
        function searchCourses(query) {
            const courseCards = document.querySelectorAll('#all-courses .course-card');
            const searchTerm = query.toLowerCase();
            
            courseCards.forEach(card => {
                const title = card.getAttribute('data-title');
                const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || instructor.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Smooth scrolling for better UX
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth transitions to all clickable elements
            const clickableElements = document.querySelectorAll('.course-card, .stat-card, .lesson-item, .btn');
            clickableElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                element.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            
            // Add ripple effect to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                    `;
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
            
            // Add ripple animation
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        });

        // Video player enhancements
        document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('lesson-video');
            
            // Auto-mark lesson as complete when video ends
            video.addEventListener('ended', function() {
                if (!completedLessons.has(currentLesson)) {
                    markLessonComplete();
                }
            });
            
            // Save video progress (simulate)
            video.addEventListener('timeupdate', function() {
                const progress = (this.currentTime / this.duration) * 100;
                // In a real application, you would save this to a database
                console.log(`Video progress: ${Math.round(progress)}%`);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (document.getElementById('course-detail').classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (currentLesson > 1) {
                            playLesson(currentLesson - 1);
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        const course = courses[currentCourse];
                        if (course && currentLesson < course.lessons.length) {
                            playLesson(currentLesson + 1);
                        }
                        break;
                    case ' ':
                        e.preventDefault();
                        const video = document.getElementById('lesson-video');
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                        break;
                }
            }
        });

        // Progressive loading animation
        function addLoadingAnimation() {
            const style = document.createElement('style');
            style.textContent = `
                .loading {
                    opacity: 0;
                    animation: loadIn 0.6s ease-out forwards;
                }
                
                @keyframes loadIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add loading class to course cards
            const courseCards = document.querySelectorAll('.course-card');
            courseCards.forEach((card, index) => {
                card.classList.add('loading');
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            addLoadingAnimation();
            
            // Simulate loading delay for better UX
            setTimeout(() => {
                console.log('EduPlatform loaded successfully!');
            }, 1000);
        });

        // Mobile menu toggle (for responsive design)
        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        }

        // Add notification system
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #f44336, #da190b)'};
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = message;
            
            const slideInStyle = document.createElement('style');
            slideInStyle.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(slideInStyle);
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Enhanced course card interactions
        document.addEventListener('DOMContentLoaded', function() {
            const courseCards = document.querySelectorAll('.course-card');
            courseCards.forEach(card => {
                card.addEventListener('click', function() {
                    showNotification('Loading course...', 'success');
                });
            });
        });
