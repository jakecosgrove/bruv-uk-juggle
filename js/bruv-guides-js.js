// BRUV.UK Juggle - Guides Page
const SPACE_ID = '580251rmw49s';
const DELIVERY_TOKEN = 'uy1OK3vdmQXP2YHWiQySRP2MDN04fbCiPR8WLB3g-7U';

const contentDiv = document.getElementById('content');

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const guideSlug = urlParams.get('guide');

/**
 * Fetch guides from Contentful
 */
async function fetchGuides() {
    try {
        const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=guide&include=2`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${DELIVERY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            if (guideSlug) {
                // Show specific guide
                const guide = data.items.find(g => g.fields.slug === guideSlug);
                if (guide) {
                    const sections = extractGuideSections(data, guide);
                    renderGuide(guide, sections);
                } else {
                    showError(`Guide "${guideSlug}" not found.`);
                }
            } else {
                // Show list of all guides
                renderGuideList(data.items);
            }
        } else {
            showError('No guides found. Please create Guide entries in Contentful.');
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError(`Unable to load guides: ${err.message}`);
    }
}

/**
 * Extract guide sections from included entries
 */
function extractGuideSections(data, guide) {
    if (!guide.fields.guideSections || !data.includes?.Entry) {
        return [];
    }

    const sections = guide.fields.guideSections
        .map(sectionRef => {
            const sectionId = sectionRef.sys.id;
            return data.includes.Entry.find(entry => entry.sys.id === sectionId);
        })
        .filter(section => section && section.fields);
    
    // Sort by order field
    return sections.sort((a, b) => {
        const orderA = a.fields.order || 0;
        const orderB = b.fields.order || 0;
        return orderA - orderB;
    });
}

/**
 * Render list of all guides
 */
function renderGuideList(guides) {
    let html = `
        <h1 class="bruv-heading-xl">Guides</h1>
        <p class="bruv-body-l">Step-by-step guides to help you use BRUV.UK Juggle.</p>
    `;
    
    guides.forEach(guide => {
        const slug = guide.fields.slug || guide.sys.id;
        
        html += `
            <div class="bruv-section-break bruv-section-break--l bruv-section-break--visible"></div>
            <h2 class="bruv-heading-m">
                <a href="guides.html?guide=${escapeHtml(slug)}" class="bruv-link">
                    ${escapeHtml(guide.fields.title)}
                </a>
            </h2>
        `;
        
        if (guide.fields.summary) {
            html += `<p class="bruv-body">${escapeHtml(guide.fields.summary)}</p>`;
        }
    });
    
    html += `
        <div class="bruv-inset-text" style="margin-top: 60px;">
            <p><strong>For content designers:</strong> Create Guide entries in Contentful and link them to Guide Sections to build comprehensive guides.</p>
        </div>
    `;
    
    contentDiv.innerHTML = html;
}

/**
 * Render a specific guide with its sections
 */
function renderGuide(guide, sections) {
    const fields = guide.fields;
    
    let html = `
        <a href="guides.html" class="bruv-back-link">Back to all guides</a>
        
        <h1 class="bruv-heading-xl">${escapeHtml(fields.title)}</h1>
    `;
    
    if (fields.summary) {
        html += `<p class="bruv-body-l">${escapeHtml(fields.summary)}</p>`;
    }
    
    // Table of contents
    if (sections.length > 1) {
        html += `
            <div class="bruv-guide-nav">
                <h2 class="bruv-guide-nav__heading">Contents</h2>
                <ol class="bruv-guide-nav__list bruv-list--number">
        `;
        
        sections.forEach((section, index) => {
            html += `
                <li>
                    <a href="#section-${index + 1}" class="bruv-guide-nav__link">
                        ${escapeHtml(section.fields.sectionTitle)}
                    </a>
                </li>
            `;
        });
        
        html += `
                </ol>
            </div>
        `;
    }
    
    // Render sections
    sections.forEach((section, index) => {
        html += `
            <div id="section-${index + 1}">
                <h2 class="bruv-heading-m">${escapeHtml(section.fields.sectionTitle)}</h2>
                ${renderRichText(section.fields.content)}
            </div>
        `;
    });
    
    // Last updated
    if (fields.lastUpdated) {
        const date = new Date(fields.lastUpdated);
        const formatted = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        html += `
            <div class="bruv-section-break bruv-section-break--xl bruv-section-break--visible"></div>
            <p class="bruv-body-s" style="color: #505a5f;">
                Last updated: ${formatted}
            </p>
        `;
    }
    
    contentDiv.innerHTML = html;
}

/**
 * Render rich text content from Contentful
 */
function renderRichText(richText) {
    if (!richText || !richText.content) return '';

    let html = '';

    richText.content.forEach(node => {
        if (node.nodeType === 'paragraph') {
            const text = node.content?.map(n => {
                if (n.nodeType === 'text') {
                    let content = escapeHtml(n.value || '');
                    if (n.marks) {
                        n.marks.forEach(mark => {
                            if (mark.type === 'bold') {
                                content = `<strong>${content}</strong>`;
                            } else if (mark.type === 'italic') {
                                content = `<em>${content}</em>`;
                            } else if (mark.type === 'code') {
                                content = `<code>${content}</code>`;
                            }
                        });
                    }
                    return content;
                }
                return '';
            }).join('');
            
            if (text) {
                html += `<p class="bruv-body">${text}</p>`;
            }
        } else if (node.nodeType === 'unordered-list') {
            html += '<ul class="bruv-list bruv-list--bullet">';
            node.content?.forEach(listItem => {
                const text = listItem.content?.[0]?.content?.map(n => escapeHtml(n.value || '')).join('') || '';
                if (text) {
                    html += `<li>${text}</li>`;
                }
            });
            html += '</ul>';
        } else if (node.nodeType === 'ordered-list') {
            html += '<ol class="bruv-list bruv-list--number">';
            node.content?.forEach(listItem => {
                const text = listItem.content?.[0]?.content?.map(n => escapeHtml(n.value || '')).join('') || '';
                if (text) {
                    html += `<li>${text}</li>`;
                }
            });
            html += '</ol>';
        } else if (node.nodeType === 'heading-2') {
            const text = node.content?.map(n => escapeHtml(n.value || '')).join('');
            if (text) {
                html += `<h3 class="bruv-heading-s">${text}</h3>`;
            }
        } else if (node.nodeType === 'heading-3') {
            const text = node.content?.map(n => escapeHtml(n.value || '')).join('');
            if (text) {
                html += `<h3 class="bruv-heading-s">${text}</h3>`;
            }
        }
    });

    return html;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message
 */
function showError(message) {
    let html = '<a href="guides.html" class="bruv-back-link">Back to all guides</a>';
    html += `
        <div class="bruv-error-box">
            <h2>Error loading guides</h2>
            <p class="bruv-body">${escapeHtml(message)}</p>
            <div class="bruv-inset-text">
                <p><strong>For content designers:</strong> Create Guide entries in Contentful with the content type "guide".</p>
            </div>
        </div>
    `;
    contentDiv.innerHTML = html;
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', fetchGuides);