
import {Marked} from '/js/lib/markdown.js';
const markdown = new Marked();

// load from a url on pageload
function onPageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const content = urlParams.get("content");

  const $content = document.querySelector("#content");
  if (content) {
    $content.value = atob(content) ?? "";
  }
}

function onDialogCloseClick() {
  const $about = document.getElementById("about-page-button");
  const $dialog = document.getElementById("about-dialog");

  $about.classList.toggle("active");
  $dialog.classList.toggle("hidden");
  $dialog.close();
}

function onAboutClick() {
  const $about = document.getElementById("about-page-button");
  const $dialog = document.getElementById("about-dialog");

  $about.classList.toggle("active");
  $dialog.classList.toggle("hidden");

  $dialog.showModal();
}

// update the url on change
function onContentChange() {
  const $content = document.querySelector("#content");

  const text = btoa($content.value);
  if (text) {
    const pageUrl = `?content=${text}`;
    window.history.replaceState("", "", pageUrl);
  } else {
    window.history.replaceState("", "", "");
  }
}

class CopyContent {
  static share(target, shareData) {
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else if (navigator.clipboard) {
      debugger
      navigator.clipboard.writeText(shareData.url);
      target.textContent = "[copied!]";

      setTimeout(() => {
        target.textContent = `[${target.getAttribute('data-default-text')}]`;
      }, 1_000);
    } else {
      alert("Unable to copy or share URL");
    }
  }

  static getContent() {
    return document.querySelector("#content");
  }

  static dataUrl(event) {
    const $content = CopyContent.getContent();
    const url = `data:text/plain;base64,${btoa($content.value)}`;

    CopyContent.share(event.target, {
      title: "localpost",
      text: "save and share data using urls",
      url,
    });
  }

  static pageUrl(event) {
    CopyContent.share(event.target, {
      title: "localpost",
      text: "save and share data using urls",
      url: window.location.href,
    });
  }

  static markdownUrl(event) {
    const $content = CopyContent.getContent();
    const html = markdown.parse($content.value, {
      gfm: true
    });
    const url = `data:text/html;base64,${btoa(html)}`

    CopyContent.share(event.target, {
      title: "localpost",
      text: "save and share data using urls",
      url,
    });
  }

  static bookmarklet(event) {
    const $content = CopyContent.getContent();
    const url = `javascript:${$content.value}`;

    CopyContent.share(event.target, {
      title: "localpost",
      text: "save and share data using urls",
      url,
    });
  }
}

const $aboutPageButton = document.getElementById("about-page-button");
$aboutPageButton.addEventListener("click", onAboutClick);

const $copyPageButton = document.getElementById("copy-page-button");
$copyPageButton.addEventListener("click", CopyContent.pageUrl);

const $copyDataUrlButton = document.getElementById("copy-data-url-button");
$copyDataUrlButton.addEventListener("click", CopyContent.dataUrl);

const $copyMarkdownUrlButton = document.getElementById("copy-markdown-url-button");
$copyMarkdownUrlButton.addEventListener("click", CopyContent.markdownUrl);

const $bookmarkletButton = document.getElementById("copy-bookmarklet-button");
$bookmarkletButton.addEventListener("click", CopyContent.bookmarklet);

const $dialogCloseButton = document.getElementById("dialog-close-button");
$dialogCloseButton.addEventListener("click", onDialogCloseClick);

const $content = document.querySelector("#content");
$content.addEventListener("keyup", onContentChange);

document.body.onload = onPageLoad();
