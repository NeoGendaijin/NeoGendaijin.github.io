/**
 * Main JavaScript file for personal website
 * Handles smooth scrolling, navigation highlighting, and content loading
 */

// Global content data
let contentData = null;
let currentLang = 'ja'; // Default language

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Initialize the application
 */
async function initApp() {
  // Get language from localStorage or use default
  currentLang = localStorage.getItem('language') || 'ja';
  
  // Set up language switch button
  const languageSwitchBtn = document.getElementById('language-switch');
  if (languageSwitchBtn) {
    languageSwitchBtn.addEventListener('click', toggleLanguage);
  }
  
  // Set up smooth scrolling for navigation links
  setupSmoothScrolling();
  
  // Set up scroll spy to highlight active navigation links
  setupScrollSpy();
  
  // Load content data
  await loadContentData();
}

/**
 * Load content data
 */
async function loadContentData() {
  return new Promise((resolve, reject) => {
    // Use XMLHttpRequest for better compatibility with local file access
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'data/content.json?ts=' + Date.now(), true); // Cache busting
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) { // 0 for local files
          try {
            contentData = JSON.parse(xhr.responseText);
            updatePageContent();
            resolve();
          } catch (e) {
            console.error('Error parsing content.json:', e);
            reject(e);
          }
        } else {
          console.error('Failed to load content.json. Status:', xhr.status);
          reject(new Error('Failed to load content.json'));
        }
      }
    };
    
    xhr.onerror = function() {
      console.error('Request error while loading content.json');
      reject(new Error('Request error'));
    };
    
    xhr.send(null);
  });
}

/**
 * Toggle between Japanese and English
 */
function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('language', currentLang);
  
  // Update page content with new language
  updatePageContent();
}

/**
 * Update page content based on current language
 */
function updatePageContent() {
  if (!contentData) return;
  
  // Update page title
  document.title = `${contentData.profile.name[currentLang]} - UTokyo`;
  document.getElementById('page-title').textContent = `${contentData.profile.name[currentLang]} - UTokyo`;
  
  // Update language switch button text
  const languageSwitchBtn = document.getElementById('language-switch');
  if (languageSwitchBtn) {
    languageSwitchBtn.textContent = contentData.ui.languageSwitch[currentLang];
  }
  
  // Update navigation menu
  updateNavigationMenu();
  
  // Update section titles
  updateSectionTitles();
  
  // Update profile information
  updateProfileInfo();
  
  // Update education section
  updateEducation();
  
  // Update skills section
  updateSkills();
  
  // Update experience section
  updateExperience();
  
  // Update publications section
  updatePublications();
  
  // Update awards section
  updateAwards();
  
  // Update footer
  updateFooter();
}

/**
 * Update section titles with translated text
 */
function updateSectionTitles() {
  const sections = contentData.ui.sections;
  
  // Update main section titles
  if (document.getElementById('education-title')) {
    document.getElementById('education-title').textContent = sections.education[currentLang];
  }
  
  if (document.getElementById('skills-title')) {
    document.getElementById('skills-title').textContent = sections.skills[currentLang];
  }
  
  if (document.getElementById('experience-title')) {
    document.getElementById('experience-title').textContent = sections.experience[currentLang];
  }
  
  if (document.getElementById('publications-title')) {
    document.getElementById('publications-title').textContent = contentData.ui.menu.publications[currentLang];
  }
  
  if (document.getElementById('awards-title')) {
    document.getElementById('awards-title').textContent = sections.awards[currentLang];
  }
  
  if (document.getElementById('scholarships-title')) {
    document.getElementById('scholarships-title').textContent = sections.scholarships[currentLang];
  }
  
  // Update sub-section titles
  if (document.getElementById('programming-title')) {
    document.getElementById('programming-title').textContent = sections.programming[currentLang];
  }
  
  if (document.getElementById('tools-title')) {
    document.getElementById('tools-title').textContent = sections.tools[currentLang];
  }
  
  if (document.getElementById('certificates-title')) {
    document.getElementById('certificates-title').textContent = sections.certificates[currentLang];
  }
  
  if (document.getElementById('domestic-title')) {
    document.getElementById('domestic-title').textContent = sections.domesticConferences[currentLang];
  }
  
  if (document.getElementById('international-title')) {
    document.getElementById('international-title').textContent = sections.internationalConferences[currentLang];
  }
  
  if (document.getElementById('journals-title')) {
    document.getElementById('journals-title').textContent = sections.journals[currentLang];
  }
}

/**
 * Update navigation menu with translated text
 */
function updateNavigationMenu() {
  const menuData = contentData.ui.menu;
  
  // Update menu items
  document.querySelectorAll('[data-nav]').forEach(element => {
    const key = element.getAttribute('data-nav');
    if (menuData[key]) {
      element.textContent = menuData[key][currentLang];
    }
  });
}

/**
 * Update profile information
 */
function updateProfileInfo() {
  const profileData = contentData.profile;
  
  // Update name
  document.getElementById('name').textContent = profileData.name[currentLang];
  document.getElementById('profile-name').textContent = profileData.name[currentLang];
  
  // Update affiliation
  document.getElementById('profile-affiliation').textContent = profileData.affiliation[currentLang];

  // Update lab link (always set, never as a link)
  const labLinkElem = document.getElementById('profile-lab-link');
  if (labLinkElem) {
    labLinkElem.textContent = (profileData.labLinkText && profileData.labLinkText[currentLang]) ? profileData.labLinkText[currentLang] : "";
  }
  
  // Update field
  document.getElementById('profile-field').textContent = profileData.field[currentLang];
  
  // Update contact
  document.getElementById('profile-contact').textContent = profileData.contact[currentLang];
  
  // Social links are now hardcoded in HTML
  // We'll keep the existing social links
  // document.getElementById('social-links').innerHTML = '';
}

/**
 * Update education section
 */
function updateEducation() {
  const educationData = contentData.education;
  const educationList = document.getElementById('education-list');
  
  if (educationList && educationData.items) {
    educationList.innerHTML = '';
    
    educationData.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item[currentLang];
      educationList.appendChild(li);
    });
  }
}

/**
 * Update skills section
 */
function updateSkills() {
  const skillsData = contentData.skills;
  
  // Update programming skills
  document.getElementById('programming-skills').textContent = skillsData.programming[currentLang];
  
  // Update tools skills
  document.getElementById('tools-skills').textContent = skillsData.tools[currentLang];
  
  // Update certificates
  document.getElementById('certificates-skills').textContent = skillsData.certificates[currentLang];
}

/**
 * Update experience section
 */
function updateExperience() {
  const experienceData = contentData.experience;
  const experienceContainer = document.getElementById('experience-container');
  
  if (experienceContainer && experienceData.items) {
    experienceContainer.innerHTML = '';
    
    experienceData.items.forEach(item => {
      const experienceItem = document.createElement('div');
      experienceItem.className = 'experience-item';
      
      const header = document.createElement('div');
      header.className = 'experience-header';
      
      const period = document.createElement('div');
      period.className = 'experience-period';
      period.textContent = currentLang === 'ja' ? item.period_ja : item.period_en;
      
      const place = document.createElement('div');
      place.className = 'experience-place';
      place.textContent = currentLang === 'ja' ? item.place_ja : item.place_en;
      
      const contentsList = document.createElement('ul');
      const contents = currentLang === 'ja' ? item.contents.ja : item.contents.en;
      
      contents.forEach(content => {
        const li = document.createElement('li');
        li.textContent = content;
        contentsList.appendChild(li);
      });
      
      header.appendChild(period);
      experienceItem.appendChild(header);
      experienceItem.appendChild(place);
      experienceItem.appendChild(contentsList);
      
      experienceContainer.appendChild(experienceItem);
    });
  }
}

/**
 * Update publications section
 */
function updatePublications() {
  const publicationsData = contentData.publications;
  
  // Update domestic conferences
  const domesticList = document.getElementById('domestic-list');
  if (domesticList && publicationsData.domesticConferences) {
    domesticList.innerHTML = '';
    
    publicationsData.domesticConferences.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'publication-item';
      
      // Create text with underlined author name
      const text = item[currentLang];
      const highlightedText = text.replace(/Ilya Horiguchi|堀口\s?維里優/g, '<u>$&</u>');
      
      li.innerHTML = highlightedText;
      domesticList.appendChild(li);
    });
  }
  
  // Update international conferences
  const internationalList = document.getElementById('international-list');
  if (internationalList && publicationsData.internationalConferences) {
    internationalList.innerHTML = '';
    
    publicationsData.internationalConferences.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'publication-item';
      
      // Create text with underlined author name
      const text = item[currentLang];
      const highlightedText = text.replace(/Ilya Horiguchi|堀口\s?維里優/g, '<u>$&</u>');
      
      li.innerHTML = highlightedText;
      internationalList.appendChild(li);
    });
  }
  
  // Update journals
  const journalsList = document.getElementById('journals-list');
  if (journalsList && publicationsData.journals) {
    journalsList.innerHTML = '';
    
    publicationsData.journals.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'publication-item';
      
      // Create text with underlined author name
      const text = item[currentLang];
      const highlightedText = text.replace(/Ilya Horiguchi|堀口\s?維里優/g, '<u>$&</u>');
      
      li.innerHTML = highlightedText;
      journalsList.appendChild(li);
    });
  }
}

/**
 * Update awards section
 */
function updateAwards() {
  const awardsData = contentData.awards;
  const awardsList = document.getElementById('awards-list');
  const scholarshipsList = document.getElementById('scholarships-list');
  
  // Update awards
  if (awardsList && awardsData.awards) {
    awardsList.innerHTML = '';
    
    awardsData.awards.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'award-item';
      li.textContent = `${item[currentLang]}`;
      awardsList.appendChild(li);
    });
  }
  
  // Update scholarships
  if (scholarshipsList && awardsData.scholarships) {
    scholarshipsList.innerHTML = '';
    
    awardsData.scholarships.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'award-item';
      li.textContent = `${item[currentLang]}`;
      scholarshipsList.appendChild(li);
    });
  }
}

/**
 * Update footer content
 */
function updateFooter() {
  const footerData = contentData.ui.footer;
  
  // Update copyright text
  document.getElementById('copyright').textContent = footerData.copyright[currentLang];
}

/**
 * Set up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate position to scroll to (with offset for fixed header)
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Set up scroll spy to highlight active navigation links
 */
function setupScrollSpy() {
  // Get all sections that have an ID defined
  const sections = document.querySelectorAll('section[id]');
  
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    // Get current scroll position
    const scrollY = window.pageYOffset;
    
    // Loop through sections to find the one in view
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100; // Offset for header
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Remove active class from all navigation links
        document.querySelectorAll('nav a').forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to corresponding navigation link
        const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  });
  
  // Trigger scroll event on page load to set initial active state
  window.dispatchEvent(new Event('scroll'));
}
