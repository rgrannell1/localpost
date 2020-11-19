
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
