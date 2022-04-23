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

})();
