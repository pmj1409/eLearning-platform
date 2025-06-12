  // Data model for courses and lessons
  const courses = [
    {
      id: 'js-basics',
      title: 'JavaScript Basics',
      description: 'Learn the fundamentals of JavaScript programming.',
      videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
      lessons: [
        { id: 'l1', title: 'Introduction to JavaScript' },
        { id: 'l2', title: 'Variables and Data Types' },
        { id: 'l3', title: 'Functions and Scope' },
        { id: 'l4', title: 'DOM Manipulation' }
      ]
    },
    {
      id: 'css-flexbox',
      title: 'CSS Flexbox Guide',
      description: 'Master layout design with CSS Flexbox.',
      videoUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc',
      lessons: [
        { id: 'l1', title: 'Flexbox Basics' },
        { id: 'l2', title: 'Flex Container Properties' },
        { id: 'l3', title: 'Flex Item Properties' },
        { id: 'l4', title: 'Advanced Flexbox Techniques' }
      ]
    },
    {
      id: 'react-intro',
      title: 'React Introduction',
      description: 'Get started with React, the popular UI library.',
      videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
      lessons: [
        { id: 'l1', title: 'What is React?' },
        { id: 'l2', title: 'JSX Syntax' },
        { id: 'l3', title: 'Components and Props' },
        { id: 'l4', title: 'State and Lifecycle' }
      ]
    }
  ];

  // State
  let currentPage = 'home'; // home, course-detail, progress
  let currentCourseId = null;
  let currentLessonId = null;

  // To store progress in localStorage using key 'courseProgress'
  // Structure: { courseId: { lessonId: true, ... }, ... }
  const storageKey = 'courseProgress';

  // Elements
  const pageHome = document.getElementById('page-home');
  const pageCourseDetail = document.getElementById('page-course-detail');
  const pageProgress = document.getElementById('page-progress');
  const navHome = document.getElementById('nav-home');
  const navProgress = document.getElementById('nav-progress');
  const courseListContainer = document.getElementById('course-list');
  const courseTitleEl = document.getElementById('course-title');
  const lessonListEl = document.getElementById('lesson-list');
  const courseVideoEl = document.getElementById('course-video');
  const progressOverviewEl = document.getElementById('progress-overview');
  const backToCoursesBtn = document.getElementById('back-to-courses');
  const appRoot = document.getElementById('app-root');
  const browseCoursesBtn = document.getElementById('browse-courses-btn');

  function safeFocus(element) {
    if (element) {
      element.focus({ preventScroll: true });
    }
  }

  // Load progress from localStorage
  function loadProgress() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // Save progress to localStorage
  function saveProgress(progress) {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }

  // Update navigation button states
  function updateNav() {
    const isHome = currentPage === 'home';
    const isProgress = currentPage === 'progress';
    navHome.classList.toggle('active', isHome);
    navHome.setAttribute('aria-selected', isHome);
    navHome.tabIndex = isHome ? 0 : -1;

    navProgress.classList.toggle('active', isProgress);
    navProgress.setAttribute('aria-selected', isProgress);
    navProgress.tabIndex = isProgress ? 0 : -1;
  }

  // Render course listing cards
  function renderCourseList() {
    courseListContainer.innerHTML = '';
    courses.forEach(course => {
      const card = document.createElement('article');
      card.className = 'course-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View course: ${course.title}`);
      card.innerHTML = `
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${course.description}</p>
      `;
      card.addEventListener('click', () => openCourseDetail(course.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCourseDetail(course.id);
        }
      });
      courseListContainer.appendChild(card);
    });
  }

  // Open course detail view
  function openCourseDetail(courseId) {
    currentPage = 'course-detail';
    currentCourseId = courseId;
    currentLessonId = null;
    renderPage();
    safeFocus(courseTitleEl);
  }

  // Render course detail page
  function renderCourseDetail() {
    const course = courses.find(c => c.id === currentCourseId);
    if (!course) return;

    courseTitleEl.textContent = course.title;
    // Embed video
    courseVideoEl.src = course.videoUrl + '?rel=0&modestbranding=1';

    // Load progress for this course
    const progress = loadProgress();
    const courseProgress = progress[course.id] || {};

    // Render lessons with completion state
    lessonListEl.innerHTML = '';
    course.lessons.forEach(lesson => {
      const li = document.createElement('li');
      li.textContent = lesson.title;
      li.tabIndex = 0;
      const completed = !!courseProgress[lesson.id];
      if (completed) li.classList.add('completed');
      li.addEventListener('click', () => toggleLessonComplete(course.id, lesson.id));
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleLessonComplete(course.id, lesson.id);
        }
      });
      lessonListEl.appendChild(li);
    });
  }

  // Toggle lesson completion state
  function toggleLessonComplete(courseId, lessonId) {
    const progress = loadProgress();
    if (!progress[courseId]) progress[courseId] = {};
    progress[courseId][lessonId] = !progress[courseId][lessonId];
    saveProgress(progress);
    renderCourseDetail();
  }

  // Render progress page
  function renderProgress() {
    const progress = loadProgress();
    progressOverviewEl.innerHTML = '';

    courses.forEach(course => {
      const courseProgress = progress[course.id] || {};
      const completedCount = Object.values(courseProgress).filter(v => v).length;
      const total = course.lessons.length;
      const percent = total ? Math.round((completedCount / total) * 100) : 0;

      const item = document.createElement('div');
      item.className = 'progress-item';
      item.innerHTML = `
        <div class="title">${course.title}</div>
        <div class="progress-bar" aria-label="Progress for ${course.title}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
          <div style="width: ${percent}%;"></div>
        </div>
        <div class="progress-percent">${percent}%</div>
      `;
      progressOverviewEl.appendChild(item);
    });

    if (progressOverviewEl.children.length === 0) {
      progressOverviewEl.textContent = 'No progress tracked yet.';
    }
  }

  // Render according to currentPage
  function renderPage() {
    pageHome.classList.toggle('hidden', currentPage !== 'home');
    pageHome.setAttribute('aria-hidden', currentPage !== 'home');
    pageCourseDetail.classList.toggle('hidden', currentPage !== 'course-detail');
    pageCourseDetail.setAttribute('aria-hidden', currentPage !== 'course-detail');
    pageProgress.classList.toggle('hidden', currentPage !== 'progress');
    pageProgress.setAttribute('aria-hidden', currentPage !== 'progress');

    updateNav();

    if (currentPage === 'home') {
      renderCourseList();
      safeFocus(pageHome);
    } else if (currentPage === 'course-detail') {
      renderCourseDetail();
    } else if (currentPage === 'progress') {
      renderProgress();
      safeFocus(pageProgress);
    }

    // Reset scroll position on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation event handlers
  navHome.addEventListener('click', () => {
    if (currentPage !== 'home') {
      currentPage = 'home';
      currentCourseId = null;
      renderPage();
    }
  });

  navProgress.addEventListener('click', () => {
    if (currentPage !== 'progress') {
      currentPage = 'progress';
      currentCourseId = null;
      renderPage();
    }
  });

  backToCoursesBtn.addEventListener('click', () => {
    currentPage = 'home';
    currentCourseId = null;
    renderPage();
    safeFocus(navHome);
  });

  browseCoursesBtn.addEventListener('click', () => {
    currentPage = 'home';
    renderPage();
    safeFocus(courseListContainer.firstChild);
  });

  // Initial render
  renderPage();