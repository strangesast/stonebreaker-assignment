import './index.scss';

const form = document.querySelector('form');

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

function saveValue(value) {
  localStorage.setItem('save', JSON.stringify(value));
}

function loadValueFromJSON(value) {
  for (const el of form.elements) {
    const name = el.getAttribute('name');
    if (name in value) {
      el.value = value[name];
    }
    if (el.tagName == 'TEXTAREA') {
      textAreaAdjust.call(el);
    }
  }
}

function reset() {
  for (const el of form.elements) {
    el.value = '';
    if (el.tagName == 'TEXTAREA') {
      textAreaAdjust.call(el);
    }
  }
}


let value;
document.addEventListener('DOMContentLoaded', () => {
  try {
    value = JSON.parse(localStorage.getItem('save'));
    loadValueFromJSON(value);
  } catch (e) {
    value = {};
  }
  form.oninput = e => {
    const el = e.srcElement;
    value[el.getAttribute('name')] = el.value;
    saveValue(value);
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

const fileInputElement = document.getElementById('file-input');
document.getElementById('load-json').onclick = () => fileInputElement.click();

fileInputElement.onchange = function () {
  if (fileInputElement.files.length) {
    const file = fileInputElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (e) {
      try {
        const value = JSON.parse(reader.result);
        loadValueFromJSON(value);
        saveValue(value);
      } catch (e) {
        alert('failed to read file');
      }
    }
    reader.onerror = function () {
      alert('failed to read file');
    }
  }
}

document.getElementById('clear').onclick = () => {
  if (window.confirm('Are you sure?')) {
    reset();
    saveValue({});
  }
};
