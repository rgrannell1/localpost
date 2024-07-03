
// load from a url on pageload
function onPageLoad() {
  const urlParams = new URLSearchParams(window.location.search)
  const content = urlParams.get('content')

  const $content = document.querySelector('#content')
console.log(content)
  if (content) {
    $content.value = decodeURIComponent(content) ?? '';
  }
}

// update the url on change
function onContentChange() {
  const $content = document.querySelector('#content')

  const text = encodeURIComponent($content.value)
  if (text) {
    const pageUrl = `?content=${text}`
    window.history.replaceState('', '', pageUrl)
  } else {
    window.history.replaceState('', '', '')
  }
}

class CopyContent {
  static pageUrl() {
    const $button = document.getElementById("copy-page-button")

    const shareData = {
      title: 'localpost',
      text: 'save and share data using urls',
      url: window.location.href
    }

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      $button.textContent = '[copied!]'

      setTimeout(() => {
        $button.textContent = '[page url]'
      }, 1000);
    } else {
      alert('Unable to copy or share URL')
    }
  }

  static dataUrl() {
    const $button = document.getElementById("copy-data-url-button")

    const $content = document.querySelector('#content')
    const dataUrl = `data:text/plain;base64,${btoa($content.value)}`;

    const shareData = {
      title: 'localpost',
      text: 'save and share data using urls',
      url: dataUrl
    }

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(dataUrl)
      $button.textContent = '[copied!]'

      setTimeout(() => {
        $button.textContent = '[data url]'
      }, 1000);

    } else {
      alert('Unable to copy or share URL')
    }
  }
}
