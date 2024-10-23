
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
  static pageUrl() {
    const $button = document.getElementById("copy-page-button");

    const shareData = {
      title: "localpost",
      text: "save and share data using urls",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      $button.textContent = "[copied!]";

      setTimeout(() => {
        $button.textContent = "[page url]";
      }, 1000);
    } else {
      alert("Unable to copy or share URL");
    }
  }

  static dataUrl() {
    const $button = document.getElementById("copy-data-url-button");
    const isMarkdown = document.querySelector('#markdown').value === 'on';

    const $content = document.querySelector("#content");

    var url;
    if (isMarkdown) {
      const html = markdown.parse($content.value, {
        gfm: true
      });
      url = `data:text/html;base64,${btoa(html)}`
    } else {
      url = `data:text/plain;base64,${btoa($content.value)}`;
    }

    const shareData = {
      title: "localpost",
      text: "save and share data using urls",
      url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      $button.textContent = "[copied!]";

      setTimeout(() => {
        $button.textContent = "[data url]";
      }, 1000);
    } else {
      alert("Unable to copy or share URL");
    }
  }
}

const $aboutPageButton = document.getElementById("about-page-button");
$aboutPageButton.addEventListener("click", onAboutClick);

const $copyPageButton = document.getElementById("copy-page-button");
$copyPageButton.addEventListener("click", CopyContent.pageUrl);

const $copyDataUrlButton = document.getElementById("copy-data-url-button");
$copyDataUrlButton.addEventListener("click", CopyContent.dataUrl);

const $dialogCloseButton = document.getElementById("dialog-close-button");
$dialogCloseButton.addEventListener("click", onDialogCloseClick);

const $content = document.querySelector("#content");
$content.addEventListener("keyup", onContentChange);

document.body.onload = onPageLoad();
