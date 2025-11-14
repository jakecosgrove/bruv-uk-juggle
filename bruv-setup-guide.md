# BRUV.UK Juggle - Setup Guide

A realistic GOV.UK-style service website for content designers to learn Contentful.

## Overview

BRUV.UK Juggle is a fictional government service (inspired by GOV.UK Pay, Notify, and One Login) that teaches content designers how to build and manage internal service websites using a headless CMS.

---

## Content Types to Create in Contentful

### 1. Landing Page

**API Identifier:** `landingPage`

| Field Name | Field Type | Required | Help Text |
|------------|------------|----------|-----------|
| Page Title | Short text | ✅ | Main title for the landing page |
| Hero Heading | Short text | ✅ | Large heading in the hero section |
| Hero Description | Long text | | Supporting text under the hero heading |
| Primary CTA Text | Short text | | Button text (e.g., "Get started") |
| Primary CTA URL | Short text | | Where the button links to (e.g., "get-started.html") |
| Feature Section Heading | Short text | | Heading above the features |
| Features | References (many) | | Link to Feature entries |
| Slug | Short text | ✅ | URL identifier (e.g., "home") |

### 2. Feature

**API Identifier:** `feature`

| Field Name | Field Type | Required | Help Text |
|------------|------------|----------|-----------|
| Title | Short text | ✅ | Feature title |
| Description | Long text | ✅ | What this feature does |
| Icon Name | Short text | | For future icon support (optional) |

### 3. Content Page

**API Identifier:** `contentPage`

| Field Name | Field Type | Required | Help Text |
|------------|------------|----------|-----------|
| Page Title | Short text | ✅ | Page heading |
| Summary | Long text | | Introductory paragraph |
| Body Content | Rich text | ✅ | Main page content |
| Page Type | Short text | ✅ | Values: "get-started" or "support" |
| Slug | Short text | ✅ | URL identifier |

### 4. Guide

**API Identifier:** `guide`

| Field Name | Field Type | Required | Help Text |
|------------|------------|----------|-----------|
| Title | Short text | ✅ | Guide title |
| Summary | Long text | | Brief description of the guide |
| Guide Sections | References (many) | | Link to Guide Section entries |
| Last Updated | Date and time | | When the guide was last updated |
| Slug | Short text | ✅ | URL identifier |

### 5. Guide Section

**API Identifier:** `guideSection`

| Field Name | Field Type | Required | Help Text |
|------------|------------|----------|-----------|
| Section Title | Short text | ✅ | Section heading |
| Content | Rich text | ✅ | Section content |
| Order | Number | | For sequencing (1, 2, 3...) |

---

## Sample Content to Create

### Landing Page Entry

**Content Type:** Landing Page

- **Page Title:** BRUV.UK Juggle
- **Hero Heading:** Manage internal services with ease
- **Hero Description:** BRUV.UK Juggle helps government teams orchestrate and coordinate their digital services. Built for reliability and simplicity.
- **Primary CTA Text:** Get started
- **Primary CTA URL:** get-started.html
- **Feature Section Heading:** Why use Juggle?
- **Features:** (Create 3-4 Feature entries and link them)
- **Slug:** home

### Feature Entries (Create 3-4)

**Feature 1:**
- **Title:** Quick to integrate
- **Description:** Add Juggle to your service in minutes. Our straightforward API and comprehensive documentation get you up and running fast.

**Feature 2:**
- **Title:** Secure and compliant
- **Description:** Built with security at its core. Meets all government digital service standards and regularly audited.

**Feature 3:**
- **Title:** Always available
- **Description:** 99.9% uptime SLA. Our infrastructure is designed for resilience with automatic failover and 24/7 monitoring.

**Feature 4:**
- **Title:** Expert support
- **Description:** Dedicated support team available to help you integrate and maintain your service.

### Get Started Page

**Content Type:** Content Page

- **Page Title:** Get started with Juggle
- **Summary:** Everything you need to start using BRUV.UK Juggle in your service.
- **Body Content:** (Use rich text with headings, lists, etc.)
  ```
  Before you start
  
  To use Juggle, you'll need:
  - A BRUV.UK account
  - Access to your service's codebase
  - Basic understanding of REST APIs
  
  1. Create an account
  
  Sign up for a Juggle account and create your first service.
  
  2. Get your API keys
  
  Generate API keys from your dashboard. Keep these secure - never commit them to version control.
  
  3. Install the library
  
  Add the Juggle library to your project using your package manager.
  
  4. Make your first request
  
  Test your integration with a simple API call.
  
  Next steps
  
  Once you're set up, explore our guides to learn about advanced features.
  ```
- **Page Type:** get-started
- **Slug:** get-started

### Support Page

**Content Type:** Content Page

- **Page Title:** Support
- **Summary:** Get help with BRUV.UK Juggle.
- **Body Content:**
  ```
  Getting help
  
  Documentation
  
  Read our comprehensive guides covering all aspects of Juggle.
  
  Email support
  
  Contact our support team: support@juggle.service.bruv.uk
  
  We aim to respond within 1 working day.
  
  Slack community
  
  Join our Slack workspace to chat with other Juggle users and the team.
  
  Status updates
  
  Check the service status page for any ongoing incidents or maintenance.
  ```
- **Page Type:** support
- **Slug:** support

### Guide Entry

**Content Type:** Guide

- **Title:** Integrate Juggle into your service
- **Summary:** A step-by-step guide to integrating BRUV.UK Juggle into your digital service.
- **Guide Sections:** (Create 3-4 Guide Section entries and link them)
- **Last Updated:** (Select today's date)
- **Slug:** integration-guide

### Guide Section Entries (Create 3-4)

**Section 1:**
- **Section Title:** Set up your environment
- **Content:**
  ```
  First, you'll need to set up your development environment.
  
  Install the Juggle CLI:
  npm install -g @bruvuk/juggle-cli
  
  This gives you command-line tools to manage your Juggle integration.
  ```
- **Order:** 1

**Section 2:**
- **Section Title:** Configure your service
- **Content:**
  ```
  Create a configuration file in your project root:
  
  Add your API keys and service ID to the configuration.
  
  Never commit your API keys to version control - use environment variables instead.
  ```
- **Order:** 2

**Section 3:**
- **Section Title:** Test your integration
- **Content:**
  ```
  Run the test command to verify everything is working:
  
  If successful, you'll see a confirmation message with your service details.
  
  Common issues
  
  - Invalid API key: Check your keys are correct and not expired
  - Connection timeout: Verify your network settings
  - Rate limit exceeded: Wait a moment and try again
  ```
- **Order:** 3

---

## File Structure

Upload these files to your GitHub repository:

```
contentful-learning-test-3/
├── css/
│   └── bruv-styles.css       (BRUV.UK styling)
├── js/
│   ├── landing.js            (Landing page logic)
│   ├── content-page.js       (Get Started, Support logic)
│   └── guides.js             (Guides page logic)
├── index.html                (Landing page)
├── get-started.html          (Get Started page)
├── guides.html               (Guides page)
├── support.html              (Support page)
└── BRUV-SETUP-GUIDE.md       (This file)
```

---

## How It Works

### Landing Page (index.html)
- Fetches a `landingPage` entry from Contentful
- Displays hero section with heading, description, and CTA button
- Shows feature cards (linked from the Features field)

### Get Started & Support (get-started.html, support.html)
- Fetches `contentPage` entries filtered by `pageType`
- Displays title, summary, and rich text body content
- Uses the same template (content-page.js) with different page types

### Guides (guides.html)
- **List view:** Shows all published guides
- **Single guide view:** Shows guide with its sections
- Sections are linked entries, displayed in order
- Includes table of contents for multi-section guides

---

## Learning Objectives

Content designers will learn:

1. **Content Modeling** - Creating structured content types with relationships
2. **Content Relationships** - Linking Features to Landing Page, Sections to Guides
3. **Rich Text** - Using formatting, headings, lists in body content
4. **Multi-page Sites** - Managing content across multiple pages
5. **Navigation** - How content structure relates to site navigation
6. **Real-world Patterns** - Actual GOV.UK service patterns

---

## Next Steps

1. Create all content types in Contentful
2. Create and publish the sample content
3. Upload the files to GitHub
4. Enable GitHub Pages
5. Test each page to ensure content displays correctly
6. Invite content designers to experiment!

---

## Tips for Content Designers

- **Start simple:** Create the landing page first, then add other pages
- **Use Preview Mode:** Save drafts and preview before publishing
- **Link carefully:** Make sure Feature and Guide Section entries are published before linking
- **Keep slugs simple:** Use lowercase, hyphens, no spaces (e.g., "integration-guide")
- **Rich text formatting:** Use headings, lists, and bold text to structure content