// BRUV.UK Juggle - Content Page (Get Started, Support, etc.)
const SPACE_ID = '580251rmw49s';
const DELIVERY_TOKEN = 'uy1OK3vdmQXP2YHWiQySRP2MDN04fbCiPR8WLB3g-7U';

const contentDiv = document.getElementById('content');

/**
 * Fetch content page from Contentful
 */
async function fetchContentPage() {
    const pageType = window.BRUV_PAGE_TYPE || 'get-started';
    
    try {
        const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=contentPage&fields.pageType=${pageType}`;

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
            renderContentPage(data.items[0]);
        } else {
            showError(`No content page found for "${pageType}". Please create a Content Page entry in Contentful with pageType="${pageType}".`);
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError(`Unable to load content: ${err.message}`);
    }
}

/**
 * Render the content page
 */
function renderContentPage(page) {
    const fields = page.fields;
    
    let html = `
        <a href="index.html" class="bruv-back-link">Back to home</a>
        
        <h1 class="bruv-heading-xl">${escapeHtml(fields.pageTitle)}</h1>
    `;
    
    if (fields.summary) {
        html += `<p class="bruv-body-l">${escapeHtml(fields.summary)}</p>`;
    }
    
    if (fields.bodyContent) {
        html += renderRichText(fields.bodyContent);
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
                    // Apply marks (bold, italic, etc.)
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
                html += `<h2 class="bruv-heading-m">${text}</h2>`;
            }
        } else if (node.nodeType === 'heading-3') {
            const text = node.content?.map(n => escapeHtml(n.value || '')).join('');
            if (text) {
                html += `<h3 class="bruv-heading-s">${text}</h3>`;
            }
        } else if (node.nodeType === 'blockquote') {
            const text = node.content?.map(n => {
                return n.content?.map(t => escapeHtml(t.value || '')).join('') || '';
            }).join('<br>');
            if (text) {
                html += `<div class="bruv-inset-text">${text}</div>`;
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
    contentDiv.innerHTML = `
        <div class="bruv-error-box">
            <h2>Error loading content</h2>
            <p class="bruv-body">${escapeHtml(message)}</p>
            <div class="bruv-inset-text">
                <p><strong>For content designers:</strong> Create a Content Page entry in Contentful with the appropriate page type.</p>
            </div>
        </div>
    `;
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', fetchContentPage);