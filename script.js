import * as framerMotion from 'https://esm.run/framer-motion';

const { animate, stagger } = framerMotion;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const loader = document.getElementById('loader');
    const mainContentContainer = document.getElementById('mainContent');

    const sectionMappings = {
        "1. 欢迎致辞与项目概览": "welcome-content",
        "2. 重要的日期和里程碑": "important-dates-content",
        "3. 入学注册流程": "registration-content",
        "4. 完成入学前手续": "pre-enrollment-content",
        "5. 迎新日、课程开始与时间表": "orientation-schedule-content",
        "6. 学费缴纳": "fees-content",
        "7. 笔记本电脑要求": "laptop-requirements-content",
        "8. 校内班车服务与停车信息": "campus-services-content",
        "9. 国际学生须知": "international-students-content",
        "10. 2025-2026学年详细课程时间表": "course-timetable-content",
    };

    async function loadContent() {
        try {
            const response = await fetch('nus_ebac_guide.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const markdownText = await response.text();
            const htmlContent = marked.parse(markdownText);

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            const pageTitleEl = tempDiv.querySelector('h1');
            if (pageTitleEl) {
                document.getElementById('page-title-container').innerHTML = `<h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2 text-center">${pageTitleEl.textContent}</h1>`;
                let introPara = pageTitleEl.nextElementSibling;
                if (introPara && introPara.tagName === 'P') {
                     document.getElementById('page-title-container').innerHTML += `<p class="text-center text-slate-600 mb-6 text-lg">${introPara.textContent}</p>`;
                }
            }

            const h2Elements = Array.from(tempDiv.querySelectorAll('h2'));
            h2Elements.forEach(h2 => {
                let sectionId = null;
                const h2Text = h2.textContent.trim();

                for (const titlePrefix in sectionMappings) {
                    if (h2Text.startsWith(titlePrefix)) {
                        sectionId = sectionMappings[titlePrefix];
                        break;
                    }
                }

                if (sectionId) {
                    const targetDiv = document.getElementById(sectionId);
                    if (targetDiv) {
                        let currentElement = h2;
                        let contentForSection = '';
                        while (currentElement && currentElement.tagName !== 'H1') {
                            if (currentElement.tagName === 'H2' && currentElement !== h2) {
                                break; 
                            }
                            contentForSection += currentElement.outerHTML;
                            currentElement = currentElement.nextElementSibling;
                        }
                        targetDiv.innerHTML = contentForSection;
                    }
                }
            });
            
            buildContactSection();
            enhanceContent();
            setupAccordions();
            setupNavigation();
            setupSearch();
            setupMobileMenu();

            loader.style.display = 'none';
            animateContentSections();

        } catch (error) {
            console.error("Failed to load or parse Markdown:", error);
            mainContentContainer.innerHTML = `<p class="text-red-500 text-center">内容加载失败，请稍后重试。</p>`;
            loader.style.display = 'none';
        }
    }
    
    function buildContactSection() {
        const contactContent = `
            <div class="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <h4 class="font-semibold text-slate-700 mb-1">项目与招生咨询</h4>
                    <p class="text-sm">邮箱: <a href="mailto:iss-admissions@nus.edu.sg">iss-admissions@nus.edu.sg</a></p>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-700 mb-1">课程退出</h4>
                    <p class="text-sm">邮箱: <a href="mailto:ask-iss@nus.edu.sg">ask-iss@nus.edu.sg</a></p>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-700 mb-1">大学保健中心 (UHC)</h4>
                    <p class="text-sm">邮箱: <a href="mailto:uhc_health@nus.edu.sg">uhc_health@nus.edu.sg</a></p>
                    <p class="text-sm">网站: <a href="https://uhc.nus.edu.sg/" target="_blank" rel="noopener noreferrer">uhc.nus.edu.sg</a></p>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-700 mb-1">IT支持</h4>
                    <p class="text-sm">NUS IT eGuides: <a href="https://nusit.nus.edu.sg/eguides/" target="_blank" rel="noopener noreferrer">nusit.nus.edu.sg/eguides/</a></p>
                    <p class="text-sm">Alca (NUS IT Care Chatbot) - <i>请通过NUS门户访问</i></p>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-700 mb-1">停车场管理 (Kent Ridge)</h4>
                    <p class="text-sm">Re Sustainability Solutions Pte Ltd</p>
                    <p class="text-sm">电话: 6775-8241, 6876-5408 (24小时)</p>
                    <p class="text-sm">邮箱: <a href="mailto:nusparking@resustainability.com.sg">nusparking@resustainability.com.sg</a></p>
                </div>
                 <div>
                    <h4 class="font-semibold text-slate-700 mb-1">学生财务查询</h4>
                    <p class="text-sm">网站: <a href="https://nus.edu.sg/finance/students/student-finance-matters.html" target="_blank" rel="noopener noreferrer">学生财务事项</a></p>
                    <p class="text-sm"><i>入学后通过 OFN NUService Hub 提交查询。</i></p>
                </div>
            </div>
        `;
        const contactContainer = document.getElementById('contact-support-content');
        if (contactContainer) {
            contactContainer.innerHTML = contactContent;
        }
    }

    function enhanceContent() {
        document.querySelectorAll('.prose a[href^="http"]').forEach(link => {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            if (!link.querySelector('i[data-lucide="external-link"]')) {
                 link.innerHTML += ' <i data-lucide="external-link" class="inline-block h-4 w-4 opacity-70 ml-1"></i>';
            }
        });
        document.querySelectorAll('table').forEach(table => {
            if (!table.closest('.overflow-x-auto')) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('overflow-x-auto', 'my-4');
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
                table.classList.add('min-w-full');
            }
        });
        
        // 为重要日期部分创建时间轴
        createTimelineForImportantDates();
        
        lucide.createIcons();
    }

    function createTimelineForImportantDates() {
        const importantDatesSection = document.getElementById('important-dates-content');
        if (!importantDatesSection) return;

        const ul = importantDatesSection.querySelector('ul');
        if (!ul) return;

        const listItems = Array.from(ul.querySelectorAll('li'));
        if (listItems.length === 0) return;

        // 解析日期和事件
        const timelineEvents = [];
        listItems.forEach(li => {
            const strongElement = li.querySelector('strong');
            if (strongElement) {
                const dateText = strongElement.textContent.replace(':', '').trim();
                const eventText = li.textContent.replace(strongElement.textContent, '').trim();
                
                // 处理嵌套的子事件
                const subList = li.querySelector('ul');
                let subEvents = [];
                if (subList) {
                    subEvents = Array.from(subList.querySelectorAll('li')).map(subLi => 
                        subLi.textContent.trim()
                    );
                }
                
                timelineEvents.push({
                    date: dateText,
                    event: eventText,
                    subEvents: subEvents,
                    originalElement: li
                });
            }
        });

        if (timelineEvents.length === 0) return;

        // 创建时间轴HTML
        const timelineHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">2. 重要的日期和里程碑</h2>
                <p class="text-slate-600 mb-6">以下是入学前需要关注的关键日期：</p>
                
                <div class="timeline-container relative">
                    <div class="timeline-line absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                    ${timelineEvents.map((event, index) => `
                        <div class="timeline-item relative flex items-start mb-8 pl-20" data-index="${index}">
                            <div class="timeline-marker absolute left-6 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-125"></div>
                            <div class="timeline-content bg-white rounded-lg shadow-md p-6 flex-1 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="timeline-date text-sm font-semibold text-blue-600 mb-2 flex items-center">
                                    <i data-lucide="calendar" class="w-4 h-4 mr-2"></i>
                                    ${event.date}
                                </div>
                                <div class="timeline-event text-slate-700 font-medium mb-2">
                                    ${event.event}
                                </div>
                                ${event.subEvents.length > 0 ? `
                                    <div class="timeline-sub-events mt-3 pl-4 border-l-2 border-slate-200">
                                        ${event.subEvents.map(subEvent => `
                                            <div class="text-sm text-slate-600 mb-1 flex items-start">
                                                <i data-lucide="arrow-right" class="w-3 h-3 mr-2 mt-0.5 text-slate-400"></i>
                                                ${subEvent}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center mb-2">
                        <i data-lucide="info" class="w-5 h-5 text-blue-600 mr-2"></i>
                        <span class="font-semibold text-blue-800">重要提醒</span>
                    </div>
                    <p class="text-blue-700 text-sm">
                        请务必关注这些关键日期，及时完成相关手续。建议将重要日期添加到您的日历中，并设置提醒。
                    </p>
                </div>
            </div>
        `;

        // 替换原有内容
        importantDatesSection.innerHTML = timelineHTML;
        
        // 添加时间轴动画
        setTimeout(() => {
            animateTimeline();
        }, 100);
    }

    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length === 0) return;

        // 创建观察器来触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const index = parseInt(item.dataset.index);
                    
                    // 延迟动画，创建连续效果
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        
                        // 标记点动画
                        const marker = item.querySelector('.timeline-marker');
                        if (marker) {
                            marker.style.transform = 'scale(1)';
                            marker.style.borderColor = getMarkerColor(index);
                        }
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.3
        });

        // 初始化样式并观察元素
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.6s ease-out';
            
            const marker = item.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'scale(0)';
                marker.style.transition = 'all 0.4s ease-out';
            }
            
            observer.observe(item);
        });
    }

    function getMarkerColor(index) {
        const colors = [
            '#3b82f6', // blue-500
            '#8b5cf6', // violet-500
            '#06b6d4', // cyan-500
            '#10b981', // emerald-500
            '#f59e0b', // amber-500
            '#ef4444', // red-500
            '#8b5cf6', // violet-500
            '#06b6d4', // cyan-500
            '#10b981', // emerald-500
            '#f59e0b', // amber-500
        ];
        return colors[index % colors.length];
    }

    function setupAccordions() {
        const contentSections = document.querySelectorAll('.content-section .prose');
        contentSections.forEach(section => {
            const h3s = Array.from(section.querySelectorAll('h3'));
            h3s.forEach(h3 => {
                if (h3.classList.contains('accordion-button')) return;

                let contentToWrap = [];
                let sibling = h3.nextElementSibling;
                let hasSubstantialContent = false;

                while (sibling && sibling.tagName !== 'H2' && sibling.tagName !== 'H3') {
                    contentToWrap.push(sibling);
                    if (sibling.tagName === 'UL' || sibling.tagName === 'OL' || sibling.tagName === 'TABLE' || (sibling.tagName === 'P' && sibling.textContent.trim().length > 50)) {
                        hasSubstantialContent = true;
                    }
                    sibling = sibling.nextElementSibling;
                }

                if (hasSubstantialContent && contentToWrap.length > 0) {
                    const accordionContent = document.createElement('div');
                    accordionContent.classList.add('accordion-content', 'hidden');
                    contentToWrap.forEach(el => accordionContent.appendChild(el.cloneNode(true))); // Clone to avoid issues if elements were already processed
                    contentToWrap.forEach(el => el.remove());


                    const accordionButton = document.createElement('button');
                    accordionButton.classList.add('accordion-button');
                    accordionButton.innerHTML = `${h3.innerHTML} <i data-lucide="chevron-down" class="accordion-icon"></i>`;
                    
                    h3.replaceWith(accordionButton);
                    accordionButton.after(accordionContent);
                    lucide.createIcons({ parentNode: accordionButton });


                    accordionButton.addEventListener('click', () => {
                        const isHidden = accordionContent.classList.contains('hidden');
                        const icon = accordionButton.querySelector('.accordion-icon');
                        if (isHidden) {
                             accordionContent.classList.remove('hidden');
                             animate(accordionContent, { height: 'auto', opacity: 1, paddingTop: '1rem', paddingBottom: '1rem' }, { duration: 0.3 }).then(() => {
                                accordionContent.style.height = 'auto'; // Ensure it stays auto after animation
                             });
                             if(icon) icon.classList.add('rotate-180');
                        } else {
                             animate(accordionContent, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }, { duration: 0.3 }).then(() => {
                                accordionContent.classList.add('hidden');
                             });
                             if(icon) icon.classList.remove('rotate-180');
                        }
                    });
                }
            });
        });
        lucide.createIcons();
    }
    
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
        const sections = document.querySelectorAll('.content-section, #page-title-container'); // Ensure page-title-container is a section or has an ID
        const header = document.querySelector('header');
        let headerOffset = header ? header.offsetHeight : 70; // Fallback if header not found

        window.addEventListener('resize', () => { // Update offset on resize
            headerOffset = header ? header.offsetHeight : 70;
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20; 

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    if(link.classList.contains('nav-link-mobile')) {
                        document.getElementById('mobileMenu').classList.add('hidden');
                        const menuButtonIcon = document.getElementById('mobileMenuButton').querySelector('i');
                        menuButtonIcon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons({ parentNode: menuButtonIcon.parentElement });
                    }
                }
            });
        });

        function onScroll() {
            headerOffset = header ? header.offsetHeight : 70; // Update offset in case it changes dynamically
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerOffset - 50; 
                if (window.pageYOffset >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            if (['orientation-schedule-content'].includes(currentSectionId)) {
                currentSectionId = 'academic-info';
            }
            if (['laptop-requirements-content'].includes(currentSectionId)) {
                currentSectionId = 'equipment';
            }
             if (['campus-services-content'].includes(currentSectionId)) {
                currentSectionId = 'campus-life';
            }
            if (['course-timetable-content'].includes(currentSectionId)) {
                currentSectionId = 'course-timetable';
            }


            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
        window.addEventListener('scroll', onScroll);
        onScroll(); 
    }

    let originalContentState = new Map();

    function storeOriginalState(element) {
        if (!originalContentState.has(element)) {
            originalContentState.set(element, element.innerHTML);
        }
    }
    
    function performSearch(searchTerm) {
        const contentContainer = document.getElementById('mainContent');
        
        originalContentState.forEach((html, el) => {
            if (el && el.parentNode) { // Check if element is still in DOM
                 el.innerHTML = html;
            }
        });
        originalContentState.clear();

        if (searchTerm.trim() === '') {
            lucide.createIcons(); 
            setupAccordions(); 
            return;
        }

        let firstMatchElement = null;
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&'), 'gi');

        const textNodes = [];
        function getTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim() !== '') {
                    let currentParent = node.parentNode;
                    let allowHighlight = true;
                    const forbiddenTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'BUTTON', 'A', 'SELECT', 'INPUT'];
                    const forbiddenClasses = ['highlight', 'accordion-button', 'accordion-icon'];

                    while(currentParent && currentParent !== contentContainer) {
                        if (forbiddenTags.includes(currentParent.tagName) || forbiddenClasses.some(cls => currentParent.classList.contains(cls))) {
                            allowHighlight = false;
                            break;
                        }
                        currentParent = currentParent.parentNode;
                    }
                    if(allowHighlight) textNodes.push(node);
                }
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }

        getTextNodes(contentContainer);

        textNodes.forEach(node => {
            const parent = node.parentNode;
            if (!parent) return;
            storeOriginalState(parent); 
            const matches = Array.from(node.nodeValue.matchAll(regex));
            if (matches.length > 0) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                matches.forEach(match => {
                    fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex, match.index)));
                    const mark = document.createElement('mark');
                    mark.className = 'highlight';
                    mark.textContent = match[0];
                    fragment.appendChild(mark);
                    if (!firstMatchElement) firstMatchElement = mark;
                    lastIndex = match.index + match[0].length;
                });
                fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex)));
                parent.replaceChild(fragment, node);
            }
        });

        if (firstMatchElement) {
            const headerOffset = document.querySelector('header').offsetHeight + 20;
            const elementPosition = firstMatchElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        lucide.createIcons(); 
        setupAccordions(); 
    }


    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        let debounceTimer;

        function handleSearchInput(event) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(event.target.value);
            }, 300);
        }
        if (searchInput) searchInput.addEventListener('input', handleSearchInput);
        if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearchInput);
    }

    function setupMobileMenu() {
        const menuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        if(!menuButton || !mobileMenu) return;

        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = menuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons({parentNode: menuButton});
        });
    }

    function animateContentSections() {
        const sections = document.querySelectorAll('.content-section');
        animate(sections, 
            { opacity: [0, 1], y: [20, 0] }, 
            { duration: 0.5, delay: stagger(0.1, { startDelay: 0.2 }) }
        );
    }

    loadContent();
});

