// ========================================
// DATA LOADER - CV Portfolio Website
// ========================================

// Global variables
let currentLang = 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Interest icons mapping
const interestIcons = {
  'Artificial Intelligence': '🤖',
  'Data Science & Analysis': '📊',
  'Software Engineering': '💻',
  'Cybersecurity Fundamentals': '🔒',
  'System Monitoring & Automation': '⚙️',
  'Applied Engineering Solutions': '🔧',
  'Machine Learning': '🧠',
  'Web Development': '🌐',
  'Mobile Development': '📱',
  'Cloud Computing': '☁️',
  'DevOps': '🔄',
  'Blockchain': '⛓️',
  'Game Development': '🎮',
  'UI/UX Design': '🎨',
  'Database Management': '🗄️',
  'Networking': '📡',
  'Embedded Systems': '🔌',
  'Robotics': '🤖',
  'IoT': '📶',
  'Quantum Computing': '⚛️'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('dir', 'ltr');
  
  // Load all data
  loadData();
  
  // Setup event listeners
  setupEventListeners();
});

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
  // Language toggle button
  const langToggle = document.getElementById('language-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
  
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
}

// ========================================
// LANGUAGE TOGGLE
// ========================================
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  
  // Update HTML attributes
  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  
  // Update button text
  const langToggle = document.getElementById('language-toggle');
  if (langToggle) {
    const langText = langToggle.querySelector('.lang-text');
    if (langText) {
      langText.textContent = currentLang === 'en' ? 'EN' : 'العربية';
    }
  }
  
  // Reload data with new language
  loadData();
}

// ========================================
// THEME TOGGLE
// ========================================
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  
  // Update button icon
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
  }
}

// ========================================
// LOAD ALL DATA
// ========================================
async function loadData() {
  try {
    // Load all JSON files concurrently
    const [
      personalData,
      educationData,
      projectData,
      summaryData,
      coursesData
    ] = await Promise.all([
      loadJSON('personal.json'),
      loadJSON('education.json'),
      loadJSON('project.json'),
      loadJSON('summary.json'),
      loadJSON('courses.json')
    ]);
    
    // Render all sections
    renderPersonalInfo(personalData);
    renderEducation(educationData);
    renderSummary(summaryData);
    renderProjects(projectData);
    renderSkills(summaryData);
    renderCertifications(coursesData);
    
  } catch (error) {
    console.error('Error loading data:', error);
    showError('Failed to load CV data. Please try again later.');
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return await response.json();
}

function showError(message) {
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="container">
        <div class="card" style="text-align: center; padding: 60px;">
          <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
          <h2 style="color: var(--accent-primary); margin-bottom: 20px; font-size: 32px;">Loading Error</h2>
          <p style="color: var(--text-secondary); font-size: 18px; margin-bottom: 30px; line-height: 1.6;">${message}</p>
          <button onclick="location.reload()" class="btn-submit" style="margin-top: 20px;">
            <i class="fas fa-redo btn-icon"></i>
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}

function sanitizeText(text) {
  if (!text) return '';
  return text.toString().trim();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getLocalizedText(obj, lang = currentLang) {
  if (!obj) return '';
  
  // If it's a string, return it
  if (typeof obj === 'string') return sanitizeText(obj);
  
  // If it's an object with language keys
  if (typeof obj === 'object') {
    if (obj[lang]) return sanitizeText(obj[lang]);
    if (obj.en) return sanitizeText(obj.en);
    if (obj.ar) return sanitizeText(obj.ar);
    
    // If it's an array, return first element
    if (Array.isArray(obj)) return sanitizeText(obj[0]);
    
    // If it's an object without language keys, return first value
    return sanitizeText(Object.values(obj)[0] || '');
  }
  
  return sanitizeText(obj);
}

// ========================================
// AGE CALCULATION FUNCTIONS
// ========================================
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  
  // If birthday hasn't occurred yet this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return age;
}

function formatAge(age, lang = currentLang) {
  if (lang === 'ar') {
    // Arabic formatting
    if (age === 1) {
      return `${age} سنة`;
    } else if (age === 2) {
      return `${age} سنتين`;
    } else if (age >= 3 && age <= 10) {
      return `${age} سنوات`;
    } else {
      return `${age} سنة`;
    }
  } else {
    // English formatting
    return `${age} years old`;
  }
}

// ========================================
// RENDER PERSONAL INFO
// ========================================
function renderPersonalInfo(data) {
  if (!data || !data.personal) return;
  
  const personal = data.personal;
  
  // Profile image - FIXED PATH
  const profileImage = document.getElementById('profile-image');
  if (profileImage && personal.profile_image) {
    // Check if image exists, otherwise use fallback
    const imgSrc = personal.profile_image.src || 'images/profile_picture.png';
    profileImage.src = imgSrc;
    profileImage.onerror = function() {
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a1a2f"/><text x="50" y="50" font-family="Arial" font-size="40" fill="%236c63ff" text-anchor="middle" dy=".3em">👤</text></svg>';
      this.alt = 'Profile picture not found';
    };
    profileImage.alt = getLocalizedText(personal.profile_image.alt) || 'Profile Picture';
  }
  
  // Full name
  const profileName = document.getElementById('profile-name');
  if (profileName && personal.full_name) {
    profileName.textContent = getLocalizedText(personal.full_name);
  }
  
  // Location
  const profileLocation = document.getElementById('profile-location');
  if (profileLocation && personal.location) {
    const city = getLocalizedText(personal.location.city);
    const country = getLocalizedText(personal.location.country);
    profileLocation.textContent = `${city}, ${country}`;
  }
  
  // Age (NEW)
  const profileAge = document.getElementById('profile-age');
  if (profileAge && personal.birth_date) {
    const age = calculateAge(personal.birth_date);
    const ageText = formatAge(age);
    profileAge.textContent = ageText;
  }
  
  // Status (Gender)
  const profileStatus = document.getElementById('profile-status');
  if (profileStatus && personal.gender) {
    profileStatus.textContent = getLocalizedText(personal.gender);
  }
  
  // Contact information
  const contactPhone = document.getElementById('contact-phone');
  if (contactPhone && personal.contact && personal.contact.phone) {
    contactPhone.textContent = personal.contact.phone.trim();
  }
  
  const contactEmailPrimary = document.getElementById('contact-email-primary');
  const contactEmailSecondary = document.getElementById('contact-email-secondary');
  if (personal.contact && personal.contact.emails && Array.isArray(personal.contact.emails)) {
    if (contactEmailPrimary && personal.contact.emails[0]) {
      const email1 = personal.contact.emails[0].trim();
      contactEmailPrimary.innerHTML = `<a href="mailto:${email1}">${email1}</a>`;
    }
    if (contactEmailSecondary && personal.contact.emails[1]) {
      const email2 = personal.contact.emails[1].trim();
      contactEmailSecondary.innerHTML = `<a href="mailto:${email2}">${email2}</a>`;
    }
  }
  
  // Contact location
  const contactLocation = document.getElementById('contact-location');
  if (contactLocation && personal.location) {
    const city = getLocalizedText(personal.location.city);
    const country = getLocalizedText(personal.location.country);
    contactLocation.textContent = `${city}, ${country}`;
  }
  
  // Contact age (NEW)
  const contactAge = document.getElementById('contact-age');
  if (contactAge && personal.birth_date) {
    const age = calculateAge(personal.birth_date);
    const ageText = formatAge(age);
    contactAge.textContent = ageText;
  }
  
  // Social links
  const linkedinLink = document.getElementById('linkedin-link');
  if (linkedinLink && personal.social_links && personal.social_links.linkedin) {
    linkedinLink.href = personal.social_links.linkedin;
  }
  
  const githubLink = document.getElementById('github-link');
  if (githubLink && personal.social_links && personal.social_links.github) {
    githubLink.href = personal.social_links.github;
  }
  
  const credlyLink = document.getElementById('credly-link');
  if (credlyLink && personal.social_links && personal.social_links.credly && Array.isArray(personal.social_links.credly)) {
    credlyLink.href = personal.social_links.credly[0];
  }
}

// ========================================
// RENDER EDUCATION
// ========================================
function renderEducation(data) {
  if (!data || !data.education) return;
  
  const education = data.education;
  
  const educationDegree = document.getElementById('education-degree');
  if (educationDegree && education.degree) {
    educationDegree.textContent = getLocalizedText(education.degree);
  }
  
  const educationUniversity = document.getElementById('education-university');
  if (educationUniversity && education.university) {
    educationUniversity.textContent = `🏛️ University: ${getLocalizedText(education.university)}`;
  }
  
  const educationFaculty = document.getElementById('education-faculty');
  if (educationFaculty && education.faculty) {
    educationFaculty.textContent = `🏢 Faculty: ${getLocalizedText(education.faculty)}`;
  }
  
  const educationLevel = document.getElementById('education-level');
  if (educationLevel && education.level) {
    educationLevel.textContent = `📚 Level: ${getLocalizedText(education.level)}`;
  }
  
  const educationEnrollment = document.getElementById('education-enrollment');
  if (educationEnrollment && education.enrollment) {
    const month = getLocalizedText(education.enrollment.month);
    const year = education.enrollment.year;
    educationEnrollment.textContent = `📅 Enrolled: ${month} ${year}`;
  }
  
  const educationGPA = document.getElementById('education-gpa');
  if (educationGPA && education.gpa) {
    const value = education.gpa.value;
    const scale = education.gpa.scale;
    educationGPA.textContent = `📈 GPA: ${value.toFixed(2)}/${scale}`;
  }
  
  const educationStatus = document.getElementById('education-status');
  if (educationStatus && education.status) {
    educationStatus.textContent = `✅ Status: ${getLocalizedText(education.status)}`;
  }
}

// ========================================
// RENDER SUMMARY & INTERESTS WITH BETTER ICONS
// ========================================
function renderSummary(data) {
  if (!data || !data.about) return;
  
  const about = data.about;
  
  // Headline
  const profileHeadline = document.getElementById('profile-headline');
  if (profileHeadline && about.headline) {
    profileHeadline.textContent = about.headline.trim();
  }
  
  // About summary
  const aboutSummary = document.getElementById('about-summary');
  if (aboutSummary && about.summary) {
    aboutSummary.textContent = about.summary.trim();
  }
  
  // Interests with specific icons
  const interestsGrid = document.getElementById('interests-grid');
  if (interestsGrid && Array.isArray(about.interests)) {
    interestsGrid.innerHTML = about.interests.map(interest => {
      const interestName = sanitizeText(interest);
      // Get icon from mapping or use default
      const icon = interestIcons[interestName] || '🌟';
      return `
        <div class="interest-card">
          <div class="interest-icon">${icon}</div>
          <div class="interest-name">${interestName}</div>
        </div>
      `;
    }).join('');
  }
}

// ========================================
// RENDER PROJECTS
// ========================================
function renderProjects(data) {
  if (!data || !data.software_projects) return;
  
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  
  const projects = data.software_projects;
  
  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="card" style="text-align: center; padding: 60px;">
        <div style="font-size: 80px; margin-bottom: 20px;">📁</div>
        <h3 style="color: var(--accent-primary); margin-bottom: 15px;">No Projects Available</h3>
        <p style="color: var(--text-secondary); font-size: 17px;">Check back soon for new projects!</p>
      </div>
    `;
    return;
  }
  
  projectsGrid.innerHTML = projects.map(project => {
    const projectName = sanitizeText(project.name);
    const projectType = getLocalizedText(project.type);
    const projectDescription = getLocalizedText(project.description);
    const projectStatus = getLocalizedText(project.status);
    const projectUrl = project.url ? project.url.trim() : null;
    
    // Technology tags
    const techTags = Array.isArray(project.technologies)
      ? project.technologies.map(t => {
          const tech = sanitizeText(t);
          return `<span class="tech-tag">${tech}</span>`;
        }).join('')
      : '';
    
    // Choose icon based on project type
    let projectIcon = '🚀';
    if (projectType.includes('Web')) projectIcon = '🌐';
    if (projectType.includes('Desktop')) projectIcon = '💻';
    if (projectType.includes('Mobile')) projectIcon = '📱';
    if (projectName.includes('AI') || projectName.includes('Artificial')) projectIcon = '🤖';
    if (projectName.includes('Security') || projectName.includes('Crypt')) projectIcon = '🔒';
    
    return `
      <div class="project-card">
        <div class="project-header">
          <div class="project-name">${projectIcon} ${projectName}</div>
          <div class="project-type">${projectType}</div>
        </div>
        <div class="project-description">${projectDescription}</div>
        <div class="project-technologies">
          ${techTags}
        </div>
        <div class="project-footer">
          <div class="project-status">${projectStatus}</div>
          ${projectUrl ? `
            <a href="${projectUrl}" target="_blank" class="project-link">
              <span>🔗</span> View Project
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ========================================
// RENDER SKILLS
// ========================================
function renderSkills(data) {
  if (!data || !data.skills) return;
  
  const skills = data.skills;
  
  // Programming Languages
  const programmingLanguagesGrid = document.getElementById('programming-languages-grid');
  if (programmingLanguagesGrid && Array.isArray(skills.programming_languages)) {
    programmingLanguagesGrid.innerHTML = skills.programming_languages.map(skill => {
      const skillName = sanitizeText(skill);
      // Add emoji based on skill
      let emoji = '💻';
      if (skillName.includes('Python')) emoji = '🐍';
      if (skillName.includes('JavaScript')) emoji = '📜';
      if (skillName.includes('HTML')) emoji = '🌐';
      if (skillName.includes('CSS')) emoji = '🎨';
      return `<div class="skill-item">${emoji} ${skillName}</div>`;
    }).join('');
  }
  
  // Frameworks & Libraries
  const frameworksGrid = document.getElementById('frameworks-grid');
  if (frameworksGrid && Array.isArray(skills.frameworks_libraries)) {
    frameworksGrid.innerHTML = skills.frameworks_libraries.map(skill => {
      const skillName = sanitizeText(skill);
      let emoji = '⚡';
      if (skillName.includes('PyQt5')) emoji = '🖥️';
      if (skillName.includes('NumPy')) emoji = '🧮';
      if (skillName.includes('Cryptography')) emoji = '🔐';
      if (skillName.includes('Matplotlib')) emoji = '📊';
      if (skillName.includes('Pandas')) emoji = '🐼';
      return `<div class="skill-item">${emoji} ${skillName}</div>`;
    }).join('');
  }
  
  // Domains
  const domainsGrid = document.getElementById('domains-grid');
  if (domainsGrid && Array.isArray(skills.domains)) {
    domainsGrid.innerHTML = skills.domains.map(skill => {
      const skillName = sanitizeText(skill);
      let emoji = '🎯';
      if (skillName.includes('Desktop')) emoji = '💻';
      if (skillName.includes('Web')) emoji = '🌐';
      if (skillName.includes('Data')) emoji = '📈';
      if (skillName.includes('AI')) emoji = '🤖';
      if (skillName.includes('Cybersecurity')) emoji = '🛡️';
      if (skillName.includes('Linux')) emoji = '🐧';
      return `<div class="skill-item">${emoji} ${skillName}</div>`;
    }).join('');
  }
  
  // Tools & Platforms
  const toolsGrid = document.getElementById('tools-grid');
  if (toolsGrid && Array.isArray(skills.tools_platforms)) {
    toolsGrid.innerHTML = skills.tools_platforms.map(skill => {
      const skillName = sanitizeText(skill);
      let emoji = '🛠️';
      if (skillName.includes('Linux')) emoji = '🐧';
      if (skillName.includes('Git')) emoji = '📦';
      if (skillName.includes('GitHub')) emoji = '🐙';
      if (skillName.includes('Cisco')) emoji = '🔌';
      if (skillName.includes('IBM')) emoji = '💡';
      if (skillName.includes('HP')) emoji = '💻';
      return `<div class="skill-item">${emoji} ${skillName}</div>`;
    }).join('');
  }
  
  // Soft Skills
  const softSkillsGrid = document.getElementById('soft-skills-grid');
  if (softSkillsGrid && Array.isArray(skills.soft_skills)) {
    softSkillsGrid.innerHTML = skills.soft_skills.map(skill => {
      const skillName = sanitizeText(skill);
      let emoji = '🌟';
      if (skillName.includes('Problem')) emoji = '🧩';
      if (skillName.includes('Analytical')) emoji = '🔍';
      if (skillName.includes('Learning')) emoji = '📚';
      if (skillName.includes('Documentation')) emoji = '📝';
      if (skillName.includes('Detail')) emoji = '✨';
      return `<div class="skill-item">${emoji} ${skillName}</div>`;
    }).join('');
  }
}

// ========================================
// RENDER CERTIFICATIONS
// ========================================
function renderCertifications(data) {
  if (!data || !data.certifications) return;
  
  const certificationsList = document.getElementById('certifications-list');
  if (!certificationsList) return;
  
  const certifications = data.certifications;
  
  if (certifications.length === 0) {
    certificationsList.innerHTML = `
      <div class="card" style="text-align: center; padding: 60px;">
        <div style="font-size: 80px; margin-bottom: 20px;">📜</div>
        <h3 style="color: var(--accent-primary); margin-bottom: 15px;">No Certifications Yet</h3>
        <p style="color: var(--text-secondary); font-size: 17px;">Working on earning new certifications!</p>
      </div>
    `;
    return;
  }
  
  certificationsList.innerHTML = certifications.map(cert => {
    const title = sanitizeText(cert.title);
    const provider = sanitizeText(cert.provider);
    const category = sanitizeText(cert.category);
    const completionDate = cert.completion_date ? formatDate(cert.completion_date) : 'N/A';
    const badgeUrl = cert.badge_url ? cert.badge_url.trim() : null;
    
    // Choose icon based on category
    let certIcon = '📜';
    if (category.includes('Programming')) certIcon = '💻';
    if (category.includes('Data')) certIcon = '📊';
    if (category.includes('AI') || category.includes('Artificial')) certIcon = '🤖';
    if (category.includes('Networking')) certIcon = '🔌';
    if (category.includes('Cybersecurity')) certIcon = '🔒';
    if (category.includes('Professional')) certIcon = '👔';
    
    return `
      <div class="certification-card">
        <div class="certification-title">${certIcon} ${title}</div>
        <div class="certification-provider">${provider} - ${category}</div>
        <div class="certification-date">Completed: ${completionDate}</div>
        ${badgeUrl ? `
          <a href="${badgeUrl}" target="_blank" class="certification-badge">
            🏅 View Badge
          </a>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ========================================
// CONTACT FORM HANDLER
// ========================================
async function handleContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const payload = {
    name: formData.get('form-name'),
    email: formData.get('form-email'),
    message: formData.get('form-message'),
    timestamp: new Date().toISOString(),
    source: 'CV Portfolio Website'
  };
  
  // Show success message with animation
  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = `
    <i class="fas fa-check btn-icon"></i>
    Message Sent!
  `;
  submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
  
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = '';
  }, 3000);
  
  // Reset form
  form.reset();
}
