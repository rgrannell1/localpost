
const onPageLoad = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const content = urlParams.get('content')

  const $content = document.querySelector('#content')

  if (content) {
    $content.value = decodeURIComponent(content) || ''
  }
}

const onContentChange = () => {
  const $content = document.querySelector('#content')
  const text = encodeURIComponent($content.value)

  if (text) {
    const pageUrl = `?content=${text}`
    window.history.replaceState('', '', pageUrl)
  } else {
    window.history.replaceState('', '', '')
  }
}
