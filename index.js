
// load from a url on pageload
function onPageLoad() {
  const urlParams = new URLSearchParams(window.location.search)
  const content = urlParams.get('content')

  const $content = document.querySelector('#content')
  const $dataUrl = document.querySelector('#data-url')

  if (content) {
    $content.value = decodeURIComponent(content) || '';
    $dataUrl.value = `data:text/plain;charset=utf-8,${btoa(decodeURIComponent(content))}`;
  }
}

// update the url on change
function onContentChange() {
  const $content = document.querySelector('#content')
  const $dataUrl = document.querySelector('#data-url')

  const text = encodeURIComponent($content.value)

  $dataUrl.value = `data:text/plain;charset=utf-8,${btoa(decodeURIComponent($content.value))}`;

  if (text) {
    const pageUrl = `?content=${text}`
    window.history.replaceState('', '', pageUrl)
  } else {
    window.history.replaceState('', '', '')
  }
}
