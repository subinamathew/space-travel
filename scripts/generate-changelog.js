/**
 * RocketRun Automated Changelog Generator
 * Automatically extracts Git commits and tags, groups them by version & date,
 * sanitizes credentials, generates CHANGELOG.md, and compiles src/changelog.html.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read package.json version
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version || '3.2.0';
const repoUrl = 'https://github.com/subinamathew/space-travel';

// 2. Fetch git log with hash, short hash, author date (ISO), and subject
function getGitCommits() {
  try {
    const raw = execSync('git log --date=short --pretty=format:"%H|%h|%ad|%s"', { encoding: 'utf8' }).trim();
    if (!raw) return [];
    return raw.split('\n').map(line => {
      const parts = line.split('|');
      const hash = parts[0] || '';
      const shortHash = parts[1] || '';
      const date = parts[2] || '';
      let subject = parts.slice(3).join('|');

      // CRITICAL SECURITY RULE: Zero plain text passcodes in documentation or generated HTML
      subject = subject.replace(/gorocket/gi, '[SITE_PASSCODE]');

      return { hash, shortHash, date, subject };
    });
  } catch (err) {
    console.warn('Could not read git commits:', err.message);
    return [];
  }
}

// 3. Fetch git tags with commit hash and tag name
function getGitTags() {
  try {
    const raw = execSync('git show-ref --tags', { encoding: 'utf8' }).trim();
    if (!raw) return {};
    const map = {};
    raw.split('\n').forEach(line => {
      const parts = line.trim().split(' ');
      if (parts.length === 2) {
        const hash = parts[0];
        const tag = parts[1].replace('refs/tags/', '');
        map[hash] = tag;
      }
    });
    return map;
  } catch (_) {
    return {};
  }
}

const allCommits = getGitCommits();
const tagMap = getGitTags();

// 4. Group commits by version
const releaseGroups = [];
let currentGroup = {
  version: `v${currentVersion}`,
  date: allCommits.length > 0 ? allCommits[0].date : new Date().toISOString().split('T')[0],
  isCurrent: true,
  commits: []
};

for (const commit of allCommits) {
  if (tagMap[commit.hash]) {
    // We reached a tagged release boundary
    if (currentGroup.commits.length > 0) {
      releaseGroups.push(currentGroup);
    }
    const tag = tagMap[commit.hash];
    currentGroup = {
      version: tag,
      date: commit.date,
      isCurrent: false,
      commits: [commit]
    };
  } else {
    currentGroup.commits.push(commit);
  }
}
if (currentGroup.commits.length > 0) {
  releaseGroups.push(currentGroup);
}

// 5. Generate CHANGELOG.md
let mdContent = `# 🚀 RocketRun Changelog & Release Notes\n\n`;
mdContent += `All notable changes, continuous deployment milestones, and feature evolutions for [rocketrun.org](https://rocketrun.org) are documented below.\n\n`;

for (const group of releaseGroups) {
  mdContent += `## [${group.version}] - ${group.date}\n\n`;
  const feats = group.commits.filter(c => /^feat/i.test(c.subject));
  const fixes = group.commits.filter(c => /^fix/i.test(c.subject));
  const others = group.commits.filter(c => !/^feat/i.test(c.subject) && !/^fix/i.test(c.subject));

  if (feats.length > 0) {
    mdContent += `### ✨ Features & Missions\n`;
    feats.forEach(c => {
      mdContent += `- ${c.subject} ([${c.shortHash}](${repoUrl}/commit/${c.hash}))\n`;
    });
    mdContent += `\n`;
  }

  if (fixes.length > 0) {
    mdContent += `### 🐛 Fixes & Polishing\n`;
    fixes.forEach(c => {
      mdContent += `- ${c.subject} ([${c.shortHash}](${repoUrl}/commit/${c.hash}))\n`;
    });
    mdContent += `\n`;
  }

  if (others.length > 0) {
    mdContent += `### ⚙️ Maintenance & Refactoring\n`;
    others.forEach(c => {
      mdContent += `- ${c.subject} ([${c.shortHash}](${repoUrl}/commit/${c.hash}))\n`;
    });
    mdContent += `\n`;
  }
}

fs.writeFileSync(path.join(rootDir, 'CHANGELOG.md'), mdContent, 'utf8');
console.log('Generated: CHANGELOG.md');

// 6. Generate src/changelog.html
const buildDate = new Date().toISOString().split('T')[0];

let timelineHtml = '';
for (const group of releaseGroups) {
  const commitItems = group.commits.map(c => `
    <li class="changelog-item">
      <span class="commit-subject">${escapeHtml(c.subject)}</span>
      <a href="${repoUrl}/commit/${c.hash}" target="_blank" rel="noopener noreferrer" class="commit-tag-link" title="View commit on GitHub">
        <code>${c.shortHash}</code> ↗
      </a>
    </li>
  `).join('');

  timelineHtml += `
    <article class="roadmap-milestone-card ${group.isCurrent ? 'milestone-current' : ''}">
      <div class="milestone-header">
        <div class="milestone-date-wrap">
          <span class="milestone-badge-icon">${group.isCurrent ? '🚀' : '📦'}</span>
          <span class="milestone-date">${group.version}</span>
          <span class="changelog-release-date">(${group.date})</span>
        </div>
        <span class="milestone-status-badge ${group.isCurrent ? 'status-live' : 'status-completed'}">
          ${group.isCurrent ? 'Current Version' : 'Released'}
        </span>
      </div>
      <ul class="milestone-list changelog-list">
        ${commitItems}
      </ul>
    </article>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const changelogHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="robots" content="noindex, nofollow" />
    <title data-i18n="ui.changelog_title">Changelog & Version History — RocketRun</title>
    <meta name="description"
        content="RocketRun release notes, continuous commit tracking, and astrophysical gameplay feature milestones." />
    <link rel="canonical" href="https://rocketrun.org/changelog.html" />

    <!-- Synchronous Pre-Render Guard: Eliminates FOUC for Unauthenticated Visitors -->
    <script id="head-guard">
      (function(){
        try {
          var a = document.cookie.indexOf('site_auth=authenticated') !== -1 || localStorage.getItem('site_auth') === 'authenticated';
          if (!a) { document.documentElement.classList.add('site-locked'); }
        } catch(e) {}
      })();
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap"
        rel="stylesheet" />
    <link rel="stylesheet" href="css/style.css?v={{APP_VERSION}}" />
    <script src="js/script.min.js?v={{APP_VERSION}}" defer></script>
</head>

<body class="subpage-body features-page changelog-page">
    <canvas id="stars"></canvas>

    <!-- Top Navigation Links -->
    <div class="features-top-nav">
        <a id="back-btn" class="visible" href="credits.html" aria-label="Back to credits"
            data-i18n-attr="aria-label:ui.credits_btn">← Credits</a>
        <a class="features-solar-link" href="index.html" aria-label="Solar System" data-i18n="ui.back_btn"
            data-i18n-attr="aria-label:ui.back_btn">☀️ Solar System</a>
    </div>

    <!-- Top-Right HUD Stack: Settings & Cookie Icon -->
    <div class="hud-stack">
        <div id="settings-hud" class="in-stack visible" aria-label="Settings and Language">
            <div class="hud-header" role="button" tabindex="0" aria-label="Toggle Settings HUD"
                title="Language Settings" data-i18n-attr="aria-label:ui.toggle_settings,title:ui.toggle_settings">
                <div class="hud-header-title">
                    <span>⚙️</span>
                    <span data-i18n="ui.settings_title">Settings</span>
                </div>
            </div>
            <div class="hud-body" id="settings-hud-body" style="display: flex;">
                <div class="settings-row">
                    <label for="lang-select" class="settings-label" data-i18n="ui.language_label">Language:</label>
                    <select id="lang-select" class="hud-lang-select" aria-label="Select Language">
                        <option value="en">🇬🇧 English</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="it">🇮🇹 Italiano</option>
                        <option value="ja">🇯🇵 日本語</option>
                        <option value="zh">🇨🇳 中文</option>
                        <option value="ml">🇮🇳 മലയാളം</option>
                        <option value="ta">🇮🇳 தமிழ்</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Cookie & Privacy Settings Button -->
        <button type="button" id="cookie-btn" class="hud-circle-btn hud-cookie-btn in-stack"
            aria-label="Cookie & Storage Preferences" title="Cookie & Storage Preferences"
            data-i18n-attr="aria-label:ui.cookie_btn_aria,title:ui.cookie_btn_title">
            <span class="hud-cookie-icon">🍪</span>
        </button>
    </div>

    <!-- Main Features Stage -->
    <main class="features-container">
        <!-- Hero Header -->
        <header class="features-hero">
            <div class="features-badge-pill" data-i18n="ui.changelog_badge">VERSION HISTORY & COMMITS</div>
            <h1 class="features-title" data-i18n="ui.changelog_title">Changelog & Version History</h1>
            <p class="features-subtitle" data-i18n="ui.changelog_subtitle">
                Detailed changelog, continuous git releases, and mission logs.
            </p>
            <div class="version-badges-row" style="margin-top: 18px; justify-content: center;">
                <div class="badge-item">
                    <span class="badge-label" data-i18n="ui.version_label">App Version</span>
                    <span class="badge-value app-version-val">v{{APP_VERSION}}</span>
                </div>
                <div class="badge-item">
                    <span class="badge-label" data-i18n="ui.commit_label">Git Commit</span>
                    <a href="{{COMMIT_URL}}" target="_blank" rel="noopener noreferrer"
                        class="badge-value commit-hash-link" title="View commit on GitHub">
                        <code>{{GIT_COMMIT}}</code>
                        <span class="external-icon">↗</span>
                    </a>
                </div>
                <div class="badge-item">
                    <span class="badge-label">Build Date</span>
                    <span class="badge-value build-date-val">{{BUILD_DATE}}</span>
                </div>
            </div>
        </header>

        <!-- Changelog Timeline Section -->
        <section class="features-section" id="changelog-section" aria-labelledby="changelog-heading">
            <div class="section-badge-bar">
                <span class="section-badge">RELEASE CHRONICLE</span>
                <span class="wcag-pill">Automated Git Log</span>
            </div>
            <h2 id="changelog-heading" class="section-title">Continuous Deployment History</h2>
            <p class="section-intro">
                Every release milestone documents game engine evolutions, accessible interface improvements, astrophysics updates, and security hardening.
            </p>

            <div class="roadmap-timeline">
                ${timelineHtml}
            </div>
        </section>
    </main>
</body>

</html>
`;

fs.writeFileSync(path.join(rootDir, 'src/changelog.html'), changelogHtml, 'utf8');
console.log('Generated: src/changelog.html');
