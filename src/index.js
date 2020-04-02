import './index.scss';

function textAreaAdjust() {
  this.style.height = '1px';
  this.style.height = `${25+this.scrollHeight}px`;
}

for (const el of document.body.querySelectorAll('textarea')) {
  el.setAttribute('placeholder', 'Enter your answer here...');
  el.onkeyup = textAreaAdjust;
}

function inlineInputAdjust() {
  this.setAttribute('size', Math.max(3, this.value.length));
}

for (const el of document.body.querySelectorAll('input.inline')) {
  el.setAttribute('placeholder', 'Answer');
  el.onkeyup = inlineInputAdjust;
}

let value;
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  try {
    value = JSON.parse(localStorage.getItem('save'));
    for (const el of form.elements) {
      const name = el.getAttribute('name');
      if (name in value) {
        el.value = value[name];
      }
      if (el.tagName == 'TEXTAREA') {
        textAreaAdjust.call(el);
      }
    }
  } catch (e) {
    value = {};
  }
  form.oninput = e => {
    const el = e.srcElement;
    value[el.getAttribute('name')] = el.value;
    localStorage.setItem('save', JSON.stringify(value));
  }
});

document.getElementById('toggle-dark').onclick = function (e) {
  document.body.classList.toggle('dark');
}

document.getElementById('save-json').onclick = function (e) {
  const a = document.createElement('a');
  a.setAttribute('download', 'save.json');
  a.style.display = 'none';
  const data = new Blob([JSON.stringify(value)], {type: 'text/plain'});
  const href = window.URL.createObjectURL(data);
  a.setAttribute('href', href);
  document.body.appendChild(a).click();
  setTimeout(() => {
    window.URL.revokeObjectURL(href);
    document.body.removeChild(a);
  }, 100);
}
