const queryRegex = /[&?]q=[^&]+/
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/
const redditRegex = /\+site(?:%3A|\:)reddit\.com/
const redditUrl = '+site%3Areddit.com'
let redditIcon = '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fbbc05" d="M0 12.7v.6l.1.5v.1l.1.4v.2l.1.4.1.2.1.3.1.3.1.2.2.5v.1l.4.9 7-5.3-7-5.4a2 2 0 0 0-.4.8v.1l-.2.5-.1.2-.1.3-.1.3-.1.2-.1.4v.2l-.1.4v.1l-.1.5v2c0-.1 0-.1 0 0z"/><path fill="#34a853" d="m8.3 12.1-7 5.3A12 12 0 0 0 19.9 21L8.3 12.1z"/><path fill="#4285f4" d="M24 12c0-3.9-1.8-7.3-4.7-9.5l.7.6-11.7 9 11.6 9c2.5-2.3 4.1-5.5 4.1-9.1z"/><path fill="#ea4335" d="m8.3 12.1-7-5.4A11.8 11.8 0 0 1 20 3.1"/><path fill="#fff" d="M20 12c0-1-.8-1.7-1.7-1.7-.5 0-.9.2-1.2.5a8.5 8.5 0 0 0-4.7-1.5l.8-3.8 2.6.6c0 .7.6 1.2 1.2 1.2.7 0 1.2-.6 1.2-1.2s-.5-1.3-1.2-1.3c-.5 0-.9.3-1.1.7L13 4.8h-.2l-.1.2-.9 4.2c-1.9.1-3.6.7-4.8 1.6-.3-.3-.7-.5-1.2-.5-1 0-1.7.8-1.7 1.7 0 .7.4 1.3 1 1.6v.5c0 2.7 3.1 4.9 7 4.9s7-2.2 7-4.9v-.5c.5-.3.9-.9.9-1.6zM8 13.2c0-.6.6-1.2 1.3-1.2.7 0 1.2.6 1.2 1.2 0 .7-.6 1.2-1.2 1.2-.7.1-1.3-.5-1.3-1.2zm7 3.4c-.9.9-2.5.9-3 .9s-2.1-.1-3-.9v-.5h.5c.5.5 1.7.7 2.5.7s2-.2 2.5-.7h.5v.5zm-.3-2.1c-.7 0-1.2-.6-1.2-1.2s.6-1.2 1.2-1.2 1.2.6 1.2 1.2c.1.6-.5 1.2-1.2 1.2z"/></svg>'
const isImageSearch = /[?&]tbm=isch/.test(location.search)
const isActive = redditRegex.test(location.search.match(queryRegex)[0])

// Google tends to change its CSS class names fairly often,
// on top of various A/B tests, which requires regular updates to rsog.
// For now let's check the current DateElement classes manually, but:
// TODO: evaluate a smarter approach to get the class names of all relevant elements (API?).
const possibleDateElementClassNames = ["lhLbod", "gEBHYd", "MUxGbd", "wuQ4Ob", "WZ8Tjf"]
const dateElementClasses = { "array": [], "string": "" }
for (className of possibleDateElementClassNames) {
  const validDateElement = document.querySelector(`.${className}`)
  if (validDateElement) {
    const valuesIterator = validDateElement.classList.values();
    for (const value of valuesIterator) {
      dateElementClasses.array.push(value)
      dateElementClasses.string += `.${value}`
    }
    break
  }
}

if (typeof trustedTypes !== 'undefined') {
  const policy = trustedTypes.createPolicy('html', { createHTML: input => input })
  redditIcon = policy.createHTML(redditIcon)
}

(function () {
  'use strict'

  // Detect Google's new infinite scroll SERP
  const isInfinite = !document.querySelector('div[role="navigation"] > table')

  // Element
  const el = document.createElement('div')
  el.classList.add('rs-el')
  if (isImageSearch) el.classList.add('QOxLX', 'NGBa0b')
  if (!isImageSearch) el.classList.add('XDyW0e', 'nDcEnd')
  const link = document.createElement('a')

  // Span
  const span = document.createElement('span')
  span.classList.add('rs-icon', 'ExCKkf', 'z1asCe', 'rzyADb')
  if (isActive) span.classList.add('active')

  span.innerHTML = redditIcon
  if (isImageSearch) {
    const div = document.createElement('div')
    div.classList.add('gLJLzd', 'XZ5MVe')
    el.appendChild(div)
    div.appendChild(link)
  } else {
    el.appendChild(link)
  }
  link.appendChild(span)


  // Link to add or remove 'site:reddit.com' to/from the query
  if (isActive) {
    link.href = window.location.href.replace(redditRegex, '')
  } else {
    link.href = window.location.href.replace(queryRegex, (match) => {
      // Replace existing 'site' value if it exists
      return match.search(siteRegex) >= 0 ? match.replace(siteRegex, redditUrl) : match + redditUrl
    })
  }

  // Insert into search bar
  const searchBarElementWrapper = document.querySelector(isImageSearch ? '.OJmNWb' : '.dRYYxd')
  const placeIndex = isImageSearch ? 0 : 1
  searchBarElementWrapper.insertBefore(el, searchBarElementWrapper.children[placeIndex])

  function enhanceResults() {
    const results = document.querySelectorAll('#rcnt > #center_col div:not(.hlcw0c)>div.MjjYud:not([data-rsog]), #rcnt > #center_col div.hlcw0c div.g>div:first-child:not([data-rsog]), #rcnt > #center_col .MjjYud ul.FxLDp li.MYVUIe:not([data-rsog])')

    let postIdArr = []
    results.forEach((result) => {
      try {
        const link = result.querySelectorAll('a[href*="reddit.com/r/"][data-ved], a[href*="reddit.com/t/"][data-ved], a[href*="reddit.com/user/"][data-ved]')
        if (link.length < 1) return result.dataset.rsog = false

        const linkHrefText = link[0].getAttribute('href')
        const linkElementsArray = linkHrefText.match(/.*\.reddit\.com\/(r|t|user)\/([^\/]+)(?:\/(\w+)(?:\/(\w+)|$|\/)|$|\/)/)
        if (linkElementsArray.length < 1) return

        const caret = ' › '
        const subredditText = linkElementsArray[1].charAt(0) + '/' + linkElementsArray[2]
        let pathPrimary = linkElementsArray[3] ?? ''
        let pathSecondary = linkElementsArray[4]
        let pathDisplay = pathPrimary

        switch (pathPrimary) {
          case 'wiki':
            pathDisplay = caret + pathPrimary + caret + pathSecondary
            break
          case 'comments':
            postIdArr.push('t3_' + pathSecondary)
            result.dataset.postId = pathSecondary
            pathDisplay = caret + pathPrimary
            break
        }

        const breadcrumbs = result.querySelectorAll('span[role="text"]')
        if (breadcrumbs.length > 1) {
          breadcrumbs.forEach((breadcrumb) => {
            const subredditSpan = document.createElement('span')
            subredditSpan.style.fontWeight = 'bold'
            subredditSpan.style.letterSpacing = '0.3px'
            subredditSpan.classList.add('lyLwlc')
            subredditSpan.textContent = subredditText
            breadcrumb.textContent = caret
            breadcrumb.appendChild(subredditSpan)
            breadcrumb.appendChild(document.createTextNode(pathDisplay))
          })
        }

        result.dataset.rsog = true

      } catch (error) {
        console.error(error)
      }
    })

    if (postIdArr.length < 1) return
    fetch(`https://api.reddit.com/api/info/?id=${postIdArr}`)
      .then((response) => response.json())
      .then((data) => {
        for (const child of data.data.children) {
          addApiData(child.data)
        }
      })
  }

  function addApiData(data) {
    const result = document.querySelector(`div[data-post-id="${data.id}"]`)
    if (!result) return

    const title = result.querySelector('h3')
    title.title = decodeHtmlEntity(data.title)

    const previewDivArr = result.querySelectorAll('div[data-sncf="1"], div[data-content-feature="1"], div[data-sncf="2"], div[data-content-feature="2"]')
    if (previewDivArr.length < 1) return

    let longestTextContent = 0
    let preview = previewDivArr[0]

    previewDivArr.forEach((previewDiv) => {
      const text = previewDiv.textContent
      if (text.length > longestTextContent) {
        longestTextContent = text.length;
        preview = previewDiv;
      }
    })

    const description = preview.querySelectorAll('div.VwiC3b, div.IsZvec')[0]

    const existingDatesArr = result.querySelectorAll(dateElementClasses.string)
    if (existingDatesArr.length > 0) {
      existingDatesArr.forEach((existingDate) => {
        existingDate.remove()
      })
    }

    // Cleanup existing vote and comment count from description text
    const repRegx = /^\d+(?:\.\dK |K | )vote[s]?, \d+(?:\.\dK |K | )comment[s]?. /
    if (description.firstChild.innerHTML) {
      description.firstChild.innerHTML = description.firstChild.innerHTML.replace(repRegx, '')
    } else {
      description.firstChild.textContent = description.firstChild.textContent.replace(repRegx, '')
    }

    const fluff = result.querySelector('[data-content-feature="2"]:not(.VGXe8)')
    if (fluff) fluff.remove()

    const locale = document.documentElement.lang
    const timestamp = new Date(data.created * 1000)
    const prettyDate = timestamp.getDate() + ' ' + timestamp.toLocaleString(locale, { month: "short" }) + ' ' + timestamp.getFullYear()

    const additionalInfo = document.createElement('div')
    for (const dateElementClass of dateElementClasses.array) {
      additionalInfo.classList.add(dateElementClass)
    }
    const boldPoints = document.createElement('em')
    boldPoints.textContent = data.score.toLocaleString(locale)
    additionalInfo.append(`${prettyDate} — `)
    additionalInfo.append(boldPoints)
    additionalInfo.append(` point${data.score === 1 ? '' : 's'} (${Math.round(data.upvote_ratio * 100)}% upvoted) · ${data.num_comments.toLocaleString(locale)} comment${data.num_comments === 1 ? '' : 's'}`)

    preview.prepend(additionalInfo)
  }

  function decodeHtmlEntity(text) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = text
    return textArea.value
  }

  // Run script once on document ready
  enhanceResults()

  if (isInfinite) {
    // Add MutationObserver to detect loading of further search results on scrolling
    const mutationObserver = new MutationObserver(enhanceResults);
    const targetNode = document.querySelector('#rcnt > #center_col');
    mutationObserver.observe(targetNode, { childList: true, subtree: true });
  }

})()
