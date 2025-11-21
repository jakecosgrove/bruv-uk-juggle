// BRUV.UK Juggle - Landing Page
const SPACE_ID = '580251rmw49s';
const DELIVERY_TOKEN = 'uy1OK3vdmQXP2YHWiQySRP2MDN04fbCiPR8WLB3g-7U';

const contentDiv = document.getElementById('content');

/**
 * Fetch landing page content from Contentful
 */
async function fetchLandingPage() {
    console.log('Fetching landing page from Contentful...');
    console.log('Space ID:', SPACE_ID);
    
    try {
        const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=landingPage&include=2`;
        console.log('Fetch URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${DELIVERY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        console.log('Number of items:', data.items?.length || 0);

        if (data.items && data.items.length > 0) {
            console.log('Landing page found:', data.items[0]);
            const landingPage = data.items[0];
            const features = extractFeatures(data, landingPage);
            const featuredGuide = extractFeaturedGuide(data, landingPage);
            console.log('Features extracted:', features.length);
            console.log('Featured guide:', featuredGuide);
            renderLandingPage(landingPage, features, featuredGuide);
        } else {
            showError('No landing page found. Please create a Landing Page entry in Contentful with content type "landingPage".');
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
 * Extract featured guide from included entries
 */
function extractFeaturedGuide(data, landingPage) {
    if (!landingPage.fields.featuredGuide || !data.includes?.Entry) {
        return null;
    }

    const guideId = landingPage.fields.featuredGuide.sys.id;
    const guide = data.includes.Entry.find(entry => entry.sys.id === guideId);
    
    if (!guide || !guide.fields) {
        return null;
    }

    // Get the guide's image if it exists
    if (guide.fields.image && data.includes?.Asset) {
        const imageId = guide.fields.image.sys.id;
        const imageAsset = data.includes.Asset.find(asset => asset.sys.id === imageId);
        if (imageAsset) {
            guide.imageAsset = imageAsset;
        }
    }

    return guide;
}

/**
 * Render the landing page
 */
function renderLandingPage(landingPage, features, featuredGuide) {
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
        html += '<div class="bruv-feature-section">';
        
        if (fields.featureSectionHeading) {
            html += `<h2 class="bruv-heading-l bruv-feature-section__heading">${escapeHtml(fields.featureSectionHeading)}</h2>`;
        }
        
        html += '<div class="bruv-feature-grid">';
        
        features.forEach(feature => {
            const imageAlignment = feature.fields.imageAlignment || 'right';
            const alignmentClass = imageAlignment === 'left' ? 'bruv-feature-card--image-left' : 'bruv-feature-card--image-right';
            
            html += `
                <div class="bruv-feature-card ${alignmentClass}">
                    <div class="bruv-feature-card__content">
                        <h3 class="bruv-feature-card__heading">${escapeHtml(feature.fields.title)}</h3>
                        <p class="bruv-feature-card__description">${escapeHtml(feature.fields.description)}</p>
                    </div>
                    <div class="bruv-feature-card__image">
                        ${renderFeatureImage(feature)}
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    // Featured guide section
    if (featuredGuide) {
        html += renderFeaturedGuide(fields, featuredGuide);
    }
    
    html += `
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
}

/**
 * Render featured guide section
 */
function renderFeaturedGuide(landingPageFields, guide) {
    const guideFields = guide.fields;
    const heading = landingPageFields.featuredGuideSectionHeading || 'Featured guide';
    const guideUrl = `guides.html?slug=${guideFields.slug}`;
    
    let html = `
        <div class="bruv-featured-guide-section">
            <h2 class="bruv-featured-guide-section__heading">${escapeHtml(heading)}</h2>
            
            <div class="bruv-guide-card">
                <div class="bruv-guide-card__image">
                    ${renderGuideImage(guide)}
                </div>
                <div class="bruv-guide-card__content">
                    <p class="bruv-guide-card__label">Guide</p>
                    <h3 class="bruv-guide-card__title">
                        <a href="${escapeHtml(guideUrl)}" class="bruv-guide-card__title-link">
                            ${escapeHtml(guideFields.title)}
                        </a>
                    </h3>
                    ${guideFields.summary ? `<p class="bruv-guide-card__description">${escapeHtml(guideFields.summary)}</p>` : ''}
                </div>
            </div>
            
            <a href="guides.html" class="bruv-view-all-link">View all guides</a>
        </div>
    `;
    
    return html;
}

/**
 * Render guide image or placeholder
 */
function renderGuideImage(guide) {
    if (guide.imageAsset && guide.imageAsset.fields) {
        const imageUrl = guide.imageAsset.fields.file.url;
        const imageAlt = guide.imageAsset.fields.title || guide.fields.title;
        return `<img src="https:${imageUrl}" alt="${escapeHtml(imageAlt)}">`;
    }
    
    // Placeholder if no image - will stretch to full height of card
    return `
        <div style="width: 100%; height: 100%; background-color: #b1b4b6; display: flex; align-items: center; justify-content: center;">
            <span style="color: #505a5f; font-size: 16px;">Image placeholder</span>
        </div>
    `;
}

/**
 * Render feature image or placeholder
 */
function renderFeatureImage(feature) {
    if (feature.fields.image && feature.fields.image.fields) {
        const imageUrl = feature.fields.image.fields.file.url;
        const imageAlt = feature.fields.image.fields.title || feature.fields.title;
        return `
            <div class="bruv-feature-card__image-wrapper">
                <img src="https:${imageUrl}" alt="${escapeHtml(imageAlt)}">
            </div>
        `;
    }
    
    // Placeholder if no image
    return `
        <div class="bruv-feature-card__image-wrapper">
            <span style="color: #505a5f; font-size: 16px;">Image placeholder</span>
        </div>
    `;
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
