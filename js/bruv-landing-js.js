// BRUV.UK Juggle - Landing Page
const SPACE_ID = '580251rmw49s';
const DELIVERY_TOKEN = 'uy1OK3vdmQXP2YHWiQySRP2MDN04fbCiPR8WLB3g-7U';

const contentDiv = document.getElementById('content');

/**
 * Fetch landing page content from Contentful
 */
async function fetchLandingPage() {
    try {
        const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=landingPage&include=2`;

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
            const landingPage = data.items[0];
            const features = extractFeatures(data, landingPage);
            renderLandingPage(landingPage, features);
        } else {
            showError('No landing page found. Please create a Landing Page entry in Contentful.');
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError(`Unable to load content: ${err.message}`);
    }
}

/**
 * Extract features from included entries
 */
function extractFeatures(data, landingPage) {
    if (!landingPage.fields.features || !data.includes?.Entry) {
        return [];
    }

    return landingPage.fields.features
        .map(featureRef => {
            const featureId = featureRef.sys.id;
            return data.includes.Entry.find(entry => entry.sys.id === featureId);
        })
        .filter(feature => feature && feature.fields);
}

/**
 * Render the landing page
 */
function renderLandingPage(landingPage, features) {
    const fields = landingPage.fields;
    
    let html = `
        <div class="bruv-hero">
            <div class="bruv-width-container">
                <h1 class="bruv-hero__heading">${escapeHtml(fields.heroHeading || fields.pageTitle)}</h1>
                ${fields.heroDescription ? `<p class="bruv-hero__description">${escapeHtml(fields.heroDescription)}</p>` : ''}
                ${renderCTA(fields)}
            </div>
        </div>
        
        <div class="bruv-width-container">
            <div class="bruv-main-wrapper">
    `;
    
    // Features section
    if (features.length > 0) {
        if (fields.featureSectionHeading) {
            html += `<h2 class="bruv-heading-l">${escapeHtml(fields.featureSectionHeading)}</h2>`;
        }
        
        html += '<div class="bruv-feature-grid">';
        
        features.forEach(feature => {
            html += `
                <div class="bruv-feature-card">
                    <h3 class="bruv-feature-card__heading">${escapeHtml(feature.fields.title)}</h3>
                    <p class="bruv-feature-card__description">${escapeHtml(feature.fields.description)}</p>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
}

/**
 * Render CTA button
 */
function renderCTA(fields) {
    if (!fields.primaryCtaText) return '';
    
    const ctaUrl = fields.primaryCtaUrl || 'get-started.html';
    
    return `
        <a href="${escapeHtml(ctaUrl)}" class="bruv-button bruv-button--large bruv-button--start">
            ${escapeHtml(fields.primaryCtaText)}
        </a>
    `;
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
        <div class="bruv-width-container" style="margin-top: 40px;">
            <div class="bruv-error-box">
                <h2>Error loading content</h2>
                <p class="bruv-body">${escapeHtml(message)}</p>
                <div class="bruv-inset-text">
                    <p><strong>For content designers:</strong> Make sure you have created and published a Landing Page entry in Contentful with the content type "landingPage".</p>
                </div>
            </div>
        </div>
    `;
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', fetchLandingPage);