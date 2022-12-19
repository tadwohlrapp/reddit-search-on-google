const queryRegex = /[&?]q=[^&]+/;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/;
const redditRegex = /\+site(?:%3A|\:)reddit\.com/;
const redditUrl = '+site%3Areddit.com';
let redditIcon = '<svg class="DCxYpf" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.7 16.2a.7.7 0 0 0-.2-.5.8.8 0 0 0-1 0 3.9 3.9 0 0 1-2.5.7 3.9 3.9 0 0 1-2.3-.6.7.7 0 0 0-.7-.3.7.7 0 0 0-.5.2.7.7 0 0 0-.2.4.6.6 0 0 0 .1.5 2.9 2.9 0 0 0 1 .6 6 6 0 0 0 2.5.6 6.2 6.2 0 0 0 2.6-.5 3.5 3.5 0 0 0 1-.6.6.6 0 0 0 .2-.5Z"/><ellipse cx="15" cy="12.8" rx="1.4" ry="1.3"/><ellipse cx="9.2" cy="12.8" rx="1.4" ry="1.3"/><path d="M22.3 11.6a2.8 2.8 0 0 0-2.8-2.9 2.7 2.7 0 0 0-1.4.5H18a11.2 11.2 0 0 0-4.7-1.5h-.2l1-2.8 2.9.7a1.9 1.9 0 1 0 1.8-2.3 1.8 1.8 0 0 0-1.4.7L13 2.8l-1.6 4.8A11.8 11.8 0 0 0 6 9.1a2.7 2.7 0 0 0-1.5-.3 2.8 2.8 0 0 0-2.7 2.8 2.9 2.9 0 0 0 1 2.2v.5c0 3.6 4.1 6.6 9.2 6.6s9.3-3 9.3-6.6v-.5a2.9 2.9 0 0 0 1-2.2ZM12 19.2c-4.2 0-7.6-2.2-7.6-5S7.8 9.4 12 9.4s7.6 2.2 7.6 5-3.5 4.9-7.6 4.9Z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);
const isActive = redditRegex.test(location.search.match(queryRegex)[0]);

if (typeof trustedTypes !== 'undefined') {
  const policy = trustedTypes.createPolicy('html', { createHTML: input => input });
  redditIcon = policy.createHTML(redditIcon);
}

(function () {
  'use strict';

  // Element
  let el = document.createElement('div');
  el.className = 'hdtb-mitem';
  const link = document.createElement('a');

  // SVG icon
  const span = document.createElement('span');
  span.className = isImageSearch ? 'm3kSL' : 'bmaJhd iJddsb';
  span.style.cssText = 'height:16px;width:16px';
  span.innerHTML = redditIcon;
  link.appendChild(span);

  // Hyperlink to add or remove 'site:reddit.com' to/from the query
  link.appendChild(document.createTextNode('Reddit'));
  if (isActive) {
    link.href = window.location.href.replace(redditRegex, '');
  } else {
    link.href = window.location.href.replace(queryRegex, (match) => {
      // Replace existing 'site' value if it exists
      return match.search(siteRegex) >= 0 ? match.replace(siteRegex, redditUrl) : match + redditUrl;
    });
  }

  // Special treatment for image search page
  if (isImageSearch) {
    link.classList.add('NZmxZe');
    el = link;
    if (isActive) link.classList.add('rQEFy');
  } else {
    el.appendChild(link);
    if (isActive) {
      link.style.color = document.body.dataset.dt ? '#8ab4f8' : '#1a73e8';
      const underline = document.createElement('div');
      underline.className = 'YTDezd';
      link.appendChild(underline);
    }
  }

  // Inserting the element into Google search
  const menuBar = document.querySelector(isImageSearch ? '.T47uwc' : '.MUFPAc');
  if (isImageSearch) {
    menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
  } else {
    menuBar.appendChild(el);
  }

  function cleanupResults() {
    const results = document.querySelectorAll('#search .MjjYud:not([data-rsog])');
    let postIdArr = [];
    results.forEach((result) => {
      try {
        const link = result.querySelectorAll('a[href*="reddit.com/r/"][data-ved], a[href*="reddit.com/user/"][data-ved]');
        if (link.length < 1) return;

        const linkHrefText = link[0].getAttribute('href');
        const linkElementsArray = linkHrefText.match(/.*\.reddit\.com\/(r|user)\/(.*?)\/((.*?)\/.*|$)/);
        if (linkElementsArray.length < 1) return;

        // Post Id
        if (linkElementsArray[4] === 'comments') {
          const postId = linkHrefText.match(/comments\/(.*?)\/(?:.*)\//)[1];
          postIdArr.push('t3_' + postId);
          result.dataset.postId = postId;
        }

        const arrowText = ' › ';
        const subredditText = linkElementsArray[1].charAt(0) + '/' + linkElementsArray[2];
        let pathText = linkElementsArray[4];

        if (pathText) {
          if (pathText === 'wiki') {
            pathText = arrowText + linkElementsArray[3].replace(/\//, arrowText).replace(/\//, '');
          } else {
            pathText = arrowText + pathText;
          }
        } else {
          pathText = ''
        }

        const breadcrumbs = result.querySelectorAll('span[role="text"]');
        if (breadcrumbs.length > 1) {
          breadcrumbs.forEach((breadcrumb) => {
            const subredditSpan = document.createElement('span');
            subredditSpan.style.fontWeight = 'bold';
            subredditSpan.textContent = subredditText;
            breadcrumb.textContent = arrowText;
            breadcrumb.appendChild(subredditSpan);
            breadcrumb.appendChild(document.createTextNode(pathText));
          })
        }

        // Add CSS class to the thumbnail
        result.dataset.rsog = true;

      } catch (error) {
        console.error(error);
      }
    });

    if (postIdArr.length < 1) return;
    fetch(`https://api.reddit.com/api/info/?id=${postIdArr}`)
      .then((response) => response.json())
      .then((data) => {
        for (const child of data.data.children) {
          addApiData(child.data);
        }
      });
  }

  function addApiData(data) {
    const result = document.querySelector(`div[data-post-id="${data.id}"]`);
    if (!result) return;

    const title = result.querySelector('h3');
    title.title = decodeHtmlEntity(data.title);

    const preview = result.querySelectorAll(['div[data-content-feature="1"], div[data-content-feature="2"].VGXe8'])[0];

    const existingDatesArr = result.querySelectorAll('.MUxGbd.wuQ4Ob.WZ8Tjf');
    if (existingDatesArr.length > 0) {
      existingDatesArr.forEach((el) => {
        el.remove();
      })
    }

    const fluff = result.querySelector('[data-content-feature="2"]:not(.VGXe8)');
    if (fluff) fluff.remove();

    const locale = document.documentElement.lang;
    const timestamp = new Date(data.created * 1000);
    const formattedDate = timestamp.getDate() + ' ' + timestamp.toLocaleString(locale, { month: "short" }) + ' ' + timestamp.getFullYear()

    const additionalInfo = document.createElement('div');
    additionalInfo.classList.add('MUxGbd', 'wuQ4Ob', 'WZ8Tjf');
    additionalInfo.append(`${formattedDate} · ${data.score.toLocaleString(locale)} point${data.score === 1 ? '' : 's'} (${Math.round(data.upvote_ratio * 100)}% upvoted) · ${data.num_comments.toLocaleString(locale)} comment${data.num_comments === 1 ? '' : 's'}`);

    preview.prepend(additionalInfo)
  }

  function decodeHtmlEntity(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  // Run script once on document ready
  cleanupResults();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(cleanupResults);

  // Let MutationObserver target the grid containing all thumbnails
  const targetNode = document.querySelector('div#search');

  // Run MutationObserver
  mutationObserver.observe(targetNode, { childList: true, subtree: true });
})();
