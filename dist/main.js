/******/ (() => { // webpackBootstrap
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
const body = document.body;

class XylophoneKeyboard {
  constructor() {
    this.noteButtons = ['q', 'w', "e", "r", "t", "y", "u"];
    this.noteColors = [
      '#FF6B6B',
      '#FF9E6B',
      '#FFD166',
      '#06D6A0',
      '#118AB2',
      '#4165d7',
      '#7209B7'
    ];
    this.srcSounds = [
      '../assets/sounds/sound_1.mp3',
      '../assets/sounds/sound_2.mp3',
      '../assets/sounds/sound_3.mp3',
      '../assets/sounds/sound_4.mp3',
      '../assets/sounds/sound_5.mp3',
      '../assets/sounds/sound_6.mp3',
      '../assets/sounds/sound_7.mp3',
    ];
    this.audioElements = [];
    this.keyMapping = {};
    this.customMapping = {};
    this.currentPlayingAudio = null;
    this.init();
  }

  init() {
    this.loadAudioFiles();
    this.buildKeyMapping();
    this.setKeyboardListener();
    // this.setupUI();
  }

  loadAudioFiles() {
    this.audioElements = this.srcSounds.map(file => {
      const audio = new Audio(file);
      audio.preload = 'auto';
      return audio;
    })
  }

  buildKeyMapping() {
    this.keyMapping = {};

    this.noteButtons.forEach((key, index) => {
      this.keyMapping[key.toLowerCase()] = index;
      this.keyMapping[key.toUpperCase()] = index;

      const russianKey = this.getRussianEquivalent(key);
      this.keyMapping[russianKey.toLowerCase()] = index;
      this.keyMapping[russianKey.toUpperCase()] = index;
    })
  }

  getRussianEquivalent(engKey) {
    const mapping = {
      'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к',
      't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш',
      'o': 'щ', 'p': 'з', 'a': 'ф', 's': 'ы',
      'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р',
      'j': 'о', 'k': 'л', 'l': 'д', 'z': 'я',
      'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
      'n': 'т', 'm': 'ь'
    };

    return mapping[engKey.toLowerCase()];
  }

  addKeyMapping(newKey, noteIndex) {
    const keysToAdd = [
      newKey.toLowerCase(),
      newKey.toUpperCase()
    ];

    const russianKey = this.getRussianEquivalent(newKey);
    if (russianKey) {
      keysToAdd.push(russianKey.toLowerCase());
      keysToAdd.push(russianKey.toUpperCase());
    }

    keysToAdd.forEach(k => {
      this.keyMapping[k] = noteIndex;
    })

    this.buildKeyMapping();
    this.updateKeyHints();
  }

  removeKeyMapping(newKey, index) {
    let key = this.findKeyByIndex(index);

    const keysToRemove = [
      key.toLowerCase(),
      key.toUpperCase()
    ];

    const russianKey = this.getRussianEquivalent(key);
    if (russianKey) {
      keysToRemove.push(russianKey.toLowerCase());
      keysToRemove.push(russianKey.toUpperCase());
    }

    // console.log(keysToRemove);
    keysToRemove.forEach(k => {
      delete this.keyMapping[k];
    })
    this.noteButtons[index] = newKey;

    this.buildKeyMapping();
    this.updateKeyHints();
  }

  findKeyByIndex(index) {
    for (const key in this.keyMapping) {
      if (this.keyMapping[key] === index) {
        return key;
      }
    }
    return null;
  }

  playNote(indexNote) {
    if (this.currentPlayingAudio && !this.currentPlayingAudio.paused) {
      this.currentPlayingAudio.pause();
      this.currentPlayingAudio.currentTime = 0;
    }

    if (this.audioElements[indexNote]) {
      this.currentPlayingAudio = this.audioElements[indexNote];
      this.currentPlayingAudio.currentTime = 0;
      this.currentPlayingAudio.play().catch(e => console.log('Ошибка воспроизведения:', e));
      this.highlightNote(indexNote);
    }
  }

  highlightNote(index) {
    document.querySelectorAll('.xylophone-note').forEach(note => {
      note.classList.remove('active');
    });

    const activeNote = document.getElementById(`xylophoneNoteElement-${index}`);
    if (activeNote) {
      activeNote.classList.add('active');
      setTimeout(() => activeNote.classList.remove('active'), 300);
    }
  }

  setKeyboardListener() {
    document.addEventListener('keydown', (event) => {
      if (event.repeat) return;

      const key = event.key;

      if (this.keyMapping.hasOwnProperty(key)) {
        const noteIndex = this.keyMapping[key];
        this.playNote(noteIndex);
      }
    })
  }

  updateKeyHints() {
    this.noteButtons.forEach((_, index) => {
      const noteElement = document.getElementById(`xylophoneNoteElement-${index}`);
      noteElement.innerText = this.getKeyHintText(index);
    });
  }

  getKeyHintText(noteIndex) {
    const keys = [];

    Object.entries(this.keyMapping).forEach(([key, index]) => {
      if (index === noteIndex && !keys.includes(key.toLowerCase())) {
        keys.push(key.toUpperCase());
      }
    });

    return keys.slice(0, 1);
  }

}

let xylophone = new XylophoneKeyboard();

function createElement(options = {}) {
  const {
    nameElement = 'div',
    textElement = '',
    idElement = '',
    classesElement = [],
    childrenElement = []
  } = options;

  const element = document.createElement(nameElement);
  if (idElement) element.id = idElement;
  if (textElement) element.innerText = textElement;
  if (classesElement.length) element.classList.add(...classesElement);
  if (childrenElement.length) element.append(...childrenElement);
  return element;
}

function createNoteElement(indexNote) {
  const xylophoneNoteElement = createElement({
    nameElement: 'div',
    textElement: xylophone.noteButtons[indexNote].toUpperCase(),
    classesElement: ['xylophone-note'],
    idElement: `xylophoneNoteElement-${indexNote}`
  })

  xylophoneNoteElement.style.backgroundColor = xylophone.noteColors[indexNote];
  xylophoneNoteElement.style.width = `${90 + indexNote * 3}px`;
  xylophoneNoteElement.style.height = `${350 - indexNote * 15}px`;


  xylophoneNoteElement.addEventListener('click', () => {
    xylophone.playNote(indexNote);
  });

  return xylophoneNoteElement;
}

function createNoteInputElement(indexNote) {
  const xylophoneNoteEditInputElement = createElement({
    nameElement: 'input',
    classesElement: ['xylophone-note-input'],
    idElement: `xylophoneNoteEditInputElement-${indexNote}`
  });

  xylophoneNoteEditInputElement.maxLength = 1;
  xylophoneNoteEditInputElement.placeholder = xylophone.noteButtons[indexNote].toUpperCase();

  xylophoneNoteEditInputElement.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    e.target.value = e.target.value.replace(/[^A-Z]/g, '');
  })

  xylophoneNoteEditInputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newKey = e.target.value.trim().toLowerCase();
      xylophone.addKeyMapping(newKey, indexNote);
      xylophone.removeKeyMapping(newKey, indexNote);
      xylophoneNoteEditInputElement.style.display = 'none';
    }
  })

  xylophoneNoteEditInputElement.addEventListener('blur', (e) => {
    xylophoneNoteEditInputElement.style.display = 'none';
    e.target.value = '';
  })

  return xylophoneNoteEditInputElement;
}

function createInputPlayElement() {
  const inputPlayElement = createElement({
    nameElement: 'input',
    classesElement: ['input-play'],
    idElement: 'inputPlayElement'
  });

  inputPlayElement.maxLength = 15;
  inputPlayElement.placeholder = 'Enter notes...';

  inputPlayElement.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    e.target.value = e.target.value.replace(/[^A-Z]/g, '');
  })

  return inputPlayElement;
}

function createButtonPlayElement() {
  const buttonPlayElement = createElement({
    nameElement: 'button',
    classesElement: ['button-play'],
    textElement: 'Play',
    idElement: 'buttonPlayElement'
  });

  buttonPlayElement.addEventListener('click', (e) => {
    const input = document.getElementById('inputPlayElement');
    const inputValue = input.value;
    const indexNotesArray = [];

    inputValue.split('').forEach((value) => {
      let indexNote = xylophone.noteButtons.indexOf(value.toLowerCase());
      if (indexNote !== -1) {
        indexNotesArray.push(indexNote);
      }
    });

    indexNotesArray.forEach((noteIndex, i) => {
      setTimeout(() => {
        xylophone.playNote(noteIndex);
      }, i * 500);
    });
  })

  return buttonPlayElement;
}

function createNoteLabelElement(indexNote) {
  const xylophoneNoteEditLabelElement = createElement({
    nameElement: 'label',
    textElement: 'Edit',
    classesElement: ['xylophone-note-label'],
    idElement: `xylophoneNoteEditLabelElement-${indexNote}`
  });
  xylophoneNoteEditLabelElement.htmlFor = `xylophoneNoteEditInputElement-${indexNote}`;

  return xylophoneNoteEditLabelElement;
}

const wrapperElement = createElement({
  nameElement: 'div',
  classesElement: ['wrapper']
});

const titleElement = createElement({
  nameElement: 'h1',
  textElement: 'XyloPhone',
  classesElement: ['title'],
  idElement: 'titleElement'
});

const wrapperPlayBlockElement = createElement({
  nameElement: 'div',
  classesElement: ['wrapper-play-block'],
  idElement: 'wrapperPlayBlockElement'
});

const inputPlayElement = createInputPlayElement();

const buttonPlayElement = createButtonPlayElement();

const xylophoneElement = createElement({
  nameElement: 'div',
  classesElement: ['xylophone'],
  idElement: 'xylophoneElement'
});

const xylophoneNotesElemetsArray = Array.from({length: 7}).map((el, index) => {
  const xylophoneNoteEditInputElement = createNoteInputElement(index);

  const xylophoneNoteEditLabelElement = createNoteLabelElement(index);
  xylophoneNoteEditLabelElement.addEventListener('click', () => {
    xylophoneNoteEditInputElement.style.display = "inline-block";
  })

  const xylophoneNoteElement = createNoteElement(index);

  const xylophoneNoteWrapperElement = createElement({
    nameElement: 'div',
    classesElement: ['xylophone-note-wrapper'],
    idElement: `xylophoneNoteWrapperElement-${index}`,
    childrenElement: [xylophoneNoteElement, xylophoneNoteEditLabelElement, xylophoneNoteEditInputElement]
  });

  return xylophoneNoteWrapperElement;
});


wrapperPlayBlockElement.append(inputPlayElement, buttonPlayElement);

wrapperElement.append(titleElement, wrapperPlayBlockElement, xylophoneElement);

xylophoneElement.append(...xylophoneNotesElemetsArray);

body.append(wrapperElement);





})();

// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/sass/style.scss ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFVBQVU7QUFDMUQsR0FBRztBQUNILDJFQUEyRSxVQUFVO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLE1BQU07QUFDcEQ7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2WEEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aXJ0dWFsLW11c2ljLWtpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92aXJ0dWFsLW11c2ljLWtpdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZpcnR1YWwtbXVzaWMta2l0Ly4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vdmlydHVhbC1tdXNpYy1raXQvLi9zcmMvc2Fzcy9zdHlsZS5zY3NzPzNhYzQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG5cclxuY2xhc3MgWHlsb3Bob25lS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5ub3RlQnV0dG9ucyA9IFsncScsICd3JywgXCJlXCIsIFwiclwiLCBcInRcIiwgXCJ5XCIsIFwidVwiXTtcclxuICAgIHRoaXMubm90ZUNvbG9ycyA9IFtcclxuICAgICAgJyNGRjZCNkInLFxyXG4gICAgICAnI0ZGOUU2QicsXHJcbiAgICAgICcjRkZEMTY2JyxcclxuICAgICAgJyMwNkQ2QTAnLFxyXG4gICAgICAnIzExOEFCMicsXHJcbiAgICAgICcjNDE2NWQ3JyxcclxuICAgICAgJyM3MjA5QjcnXHJcbiAgICBdO1xyXG4gICAgdGhpcy5zcmNTb3VuZHMgPSBbXHJcbiAgICAgICcuLi9hc3NldHMvc291bmRzL3NvdW5kXzEubXAzJyxcclxuICAgICAgJy4uL2Fzc2V0cy9zb3VuZHMvc291bmRfMi5tcDMnLFxyXG4gICAgICAnLi4vYXNzZXRzL3NvdW5kcy9zb3VuZF8zLm1wMycsXHJcbiAgICAgICcuLi9hc3NldHMvc291bmRzL3NvdW5kXzQubXAzJyxcclxuICAgICAgJy4uL2Fzc2V0cy9zb3VuZHMvc291bmRfNS5tcDMnLFxyXG4gICAgICAnLi4vYXNzZXRzL3NvdW5kcy9zb3VuZF82Lm1wMycsXHJcbiAgICAgICcuLi9hc3NldHMvc291bmRzL3NvdW5kXzcubXAzJyxcclxuICAgIF07XHJcbiAgICB0aGlzLmF1ZGlvRWxlbWVudHMgPSBbXTtcclxuICAgIHRoaXMua2V5TWFwcGluZyA9IHt9O1xyXG4gICAgdGhpcy5jdXN0b21NYXBwaW5nID0ge307XHJcbiAgICB0aGlzLmN1cnJlbnRQbGF5aW5nQXVkaW8gPSBudWxsO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5sb2FkQXVkaW9GaWxlcygpO1xyXG4gICAgdGhpcy5idWlsZEtleU1hcHBpbmcoKTtcclxuICAgIHRoaXMuc2V0S2V5Ym9hcmRMaXN0ZW5lcigpO1xyXG4gICAgLy8gdGhpcy5zZXR1cFVJKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkQXVkaW9GaWxlcygpIHtcclxuICAgIHRoaXMuYXVkaW9FbGVtZW50cyA9IHRoaXMuc3JjU291bmRzLm1hcChmaWxlID0+IHtcclxuICAgICAgY29uc3QgYXVkaW8gPSBuZXcgQXVkaW8oZmlsZSk7XHJcbiAgICAgIGF1ZGlvLnByZWxvYWQgPSAnYXV0byc7XHJcbiAgICAgIHJldHVybiBhdWRpbztcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBidWlsZEtleU1hcHBpbmcoKSB7XHJcbiAgICB0aGlzLmtleU1hcHBpbmcgPSB7fTtcclxuXHJcbiAgICB0aGlzLm5vdGVCdXR0b25zLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcclxuICAgICAgdGhpcy5rZXlNYXBwaW5nW2tleS50b0xvd2VyQ2FzZSgpXSA9IGluZGV4O1xyXG4gICAgICB0aGlzLmtleU1hcHBpbmdba2V5LnRvVXBwZXJDYXNlKCldID0gaW5kZXg7XHJcblxyXG4gICAgICBjb25zdCBydXNzaWFuS2V5ID0gdGhpcy5nZXRSdXNzaWFuRXF1aXZhbGVudChrZXkpO1xyXG4gICAgICB0aGlzLmtleU1hcHBpbmdbcnVzc2lhbktleS50b0xvd2VyQ2FzZSgpXSA9IGluZGV4O1xyXG4gICAgICB0aGlzLmtleU1hcHBpbmdbcnVzc2lhbktleS50b1VwcGVyQ2FzZSgpXSA9IGluZGV4O1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGdldFJ1c3NpYW5FcXVpdmFsZW50KGVuZ0tleSkge1xyXG4gICAgY29uc3QgbWFwcGluZyA9IHtcclxuICAgICAgJ3EnOiAn0LknLCAndyc6ICfRhicsICdlJzogJ9GDJywgJ3InOiAn0LonLFxyXG4gICAgICAndCc6ICfQtScsICd5JzogJ9C9JywgJ3UnOiAn0LMnLCAnaSc6ICfRiCcsXHJcbiAgICAgICdvJzogJ9GJJywgJ3AnOiAn0LcnLCAnYSc6ICfRhCcsICdzJzogJ9GLJyxcclxuICAgICAgJ2QnOiAn0LInLCAnZic6ICfQsCcsICdnJzogJ9C/JywgJ2gnOiAn0YAnLFxyXG4gICAgICAnaic6ICfQvicsICdrJzogJ9C7JywgJ2wnOiAn0LQnLCAneic6ICfRjycsXHJcbiAgICAgICd4JzogJ9GHJywgJ2MnOiAn0YEnLCAndic6ICfQvCcsICdiJzogJ9C4JyxcclxuICAgICAgJ24nOiAn0YInLCAnbSc6ICfRjCdcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG1hcHBpbmdbZW5nS2V5LnRvTG93ZXJDYXNlKCldO1xyXG4gIH1cclxuXHJcbiAgYWRkS2V5TWFwcGluZyhuZXdLZXksIG5vdGVJbmRleCkge1xyXG4gICAgY29uc3Qga2V5c1RvQWRkID0gW1xyXG4gICAgICBuZXdLZXkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgbmV3S2V5LnRvVXBwZXJDYXNlKClcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgcnVzc2lhbktleSA9IHRoaXMuZ2V0UnVzc2lhbkVxdWl2YWxlbnQobmV3S2V5KTtcclxuICAgIGlmIChydXNzaWFuS2V5KSB7XHJcbiAgICAgIGtleXNUb0FkZC5wdXNoKHJ1c3NpYW5LZXkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgIGtleXNUb0FkZC5wdXNoKHJ1c3NpYW5LZXkudG9VcHBlckNhc2UoKSk7XHJcbiAgICB9XHJcblxyXG4gICAga2V5c1RvQWRkLmZvckVhY2goayA9PiB7XHJcbiAgICAgIHRoaXMua2V5TWFwcGluZ1trXSA9IG5vdGVJbmRleDtcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5idWlsZEtleU1hcHBpbmcoKTtcclxuICAgIHRoaXMudXBkYXRlS2V5SGludHMoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUtleU1hcHBpbmcobmV3S2V5LCBpbmRleCkge1xyXG4gICAgbGV0IGtleSA9IHRoaXMuZmluZEtleUJ5SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgIGNvbnN0IGtleXNUb1JlbW92ZSA9IFtcclxuICAgICAga2V5LnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIGtleS50b1VwcGVyQ2FzZSgpXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IHJ1c3NpYW5LZXkgPSB0aGlzLmdldFJ1c3NpYW5FcXVpdmFsZW50KGtleSk7XHJcbiAgICBpZiAocnVzc2lhbktleSkge1xyXG4gICAgICBrZXlzVG9SZW1vdmUucHVzaChydXNzaWFuS2V5LnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICBrZXlzVG9SZW1vdmUucHVzaChydXNzaWFuS2V5LnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKGtleXNUb1JlbW92ZSk7XHJcbiAgICBrZXlzVG9SZW1vdmUuZm9yRWFjaChrID0+IHtcclxuICAgICAgZGVsZXRlIHRoaXMua2V5TWFwcGluZ1trXTtcclxuICAgIH0pXHJcbiAgICB0aGlzLm5vdGVCdXR0b25zW2luZGV4XSA9IG5ld0tleTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkS2V5TWFwcGluZygpO1xyXG4gICAgdGhpcy51cGRhdGVLZXlIaW50cygpO1xyXG4gIH1cclxuXHJcbiAgZmluZEtleUJ5SW5kZXgoaW5kZXgpIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMua2V5TWFwcGluZykge1xyXG4gICAgICBpZiAodGhpcy5rZXlNYXBwaW5nW2tleV0gPT09IGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwbGF5Tm90ZShpbmRleE5vdGUpIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5aW5nQXVkaW8gJiYgIXRoaXMuY3VycmVudFBsYXlpbmdBdWRpby5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5jdXJyZW50UGxheWluZ0F1ZGlvLnBhdXNlKCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFBsYXlpbmdBdWRpby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXVkaW9FbGVtZW50c1tpbmRleE5vdGVdKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFBsYXlpbmdBdWRpbyA9IHRoaXMuYXVkaW9FbGVtZW50c1tpbmRleE5vdGVdO1xyXG4gICAgICB0aGlzLmN1cnJlbnRQbGF5aW5nQXVkaW8uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICB0aGlzLmN1cnJlbnRQbGF5aW5nQXVkaW8ucGxheSgpLmNhdGNoKGUgPT4gY29uc29sZS5sb2coJ9Ce0YjQuNCx0LrQsCDQstC+0YHQv9GA0L7QuNC30LLQtdC00LXQvdC40Y86JywgZSkpO1xyXG4gICAgICB0aGlzLmhpZ2hsaWdodE5vdGUoaW5kZXhOb3RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZ2hsaWdodE5vdGUoaW5kZXgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy54eWxvcGhvbmUtbm90ZScpLmZvckVhY2gobm90ZSA9PiB7XHJcbiAgICAgIG5vdGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBhY3RpdmVOb3RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHh5bG9waG9uZU5vdGVFbGVtZW50LSR7aW5kZXh9YCk7XHJcbiAgICBpZiAoYWN0aXZlTm90ZSkge1xyXG4gICAgICBhY3RpdmVOb3RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGFjdGl2ZU5vdGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyksIDMwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRLZXlib2FyZExpc3RlbmVyKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xyXG4gICAgICBpZiAoZXZlbnQucmVwZWF0KSByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBrZXkgPSBldmVudC5rZXk7XHJcblxyXG4gICAgICBpZiAodGhpcy5rZXlNYXBwaW5nLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBjb25zdCBub3RlSW5kZXggPSB0aGlzLmtleU1hcHBpbmdba2V5XTtcclxuICAgICAgICB0aGlzLnBsYXlOb3RlKG5vdGVJbmRleCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB1cGRhdGVLZXlIaW50cygpIHtcclxuICAgIHRoaXMubm90ZUJ1dHRvbnMuZm9yRWFjaCgoXywgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3Qgbm90ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgeHlsb3Bob25lTm90ZUVsZW1lbnQtJHtpbmRleH1gKTtcclxuICAgICAgbm90ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5nZXRLZXlIaW50VGV4dChpbmRleCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEtleUhpbnRUZXh0KG5vdGVJbmRleCkge1xyXG4gICAgY29uc3Qga2V5cyA9IFtdO1xyXG5cclxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMua2V5TWFwcGluZykuZm9yRWFjaCgoW2tleSwgaW5kZXhdKSA9PiB7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gbm90ZUluZGV4ICYmICFrZXlzLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgIGtleXMucHVzaChrZXkudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBrZXlzLnNsaWNlKDAsIDEpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmxldCB4eWxvcGhvbmUgPSBuZXcgWHlsb3Bob25lS2V5Ym9hcmQoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQob3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3Qge1xyXG4gICAgbmFtZUVsZW1lbnQgPSAnZGl2JyxcclxuICAgIHRleHRFbGVtZW50ID0gJycsXHJcbiAgICBpZEVsZW1lbnQgPSAnJyxcclxuICAgIGNsYXNzZXNFbGVtZW50ID0gW10sXHJcbiAgICBjaGlsZHJlbkVsZW1lbnQgPSBbXVxyXG4gIH0gPSBvcHRpb25zO1xyXG5cclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lRWxlbWVudCk7XHJcbiAgaWYgKGlkRWxlbWVudCkgZWxlbWVudC5pZCA9IGlkRWxlbWVudDtcclxuICBpZiAodGV4dEVsZW1lbnQpIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGV4dEVsZW1lbnQ7XHJcbiAgaWYgKGNsYXNzZXNFbGVtZW50Lmxlbmd0aCkgZWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXNFbGVtZW50KTtcclxuICBpZiAoY2hpbGRyZW5FbGVtZW50Lmxlbmd0aCkgZWxlbWVudC5hcHBlbmQoLi4uY2hpbGRyZW5FbGVtZW50KTtcclxuICByZXR1cm4gZWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm90ZUVsZW1lbnQoaW5kZXhOb3RlKSB7XHJcbiAgY29uc3QgeHlsb3Bob25lTm90ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICAgIG5hbWVFbGVtZW50OiAnZGl2JyxcclxuICAgIHRleHRFbGVtZW50OiB4eWxvcGhvbmUubm90ZUJ1dHRvbnNbaW5kZXhOb3RlXS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgY2xhc3Nlc0VsZW1lbnQ6IFsneHlsb3Bob25lLW5vdGUnXSxcclxuICAgIGlkRWxlbWVudDogYHh5bG9waG9uZU5vdGVFbGVtZW50LSR7aW5kZXhOb3RlfWBcclxuICB9KVxyXG5cclxuICB4eWxvcGhvbmVOb3RlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB4eWxvcGhvbmUubm90ZUNvbG9yc1tpbmRleE5vdGVdO1xyXG4gIHh5bG9waG9uZU5vdGVFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7OTAgKyBpbmRleE5vdGUgKiAzfXB4YDtcclxuICB4eWxvcGhvbmVOb3RlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHszNTAgLSBpbmRleE5vdGUgKiAxNX1weGA7XHJcblxyXG5cclxuICB4eWxvcGhvbmVOb3RlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIHh5bG9waG9uZS5wbGF5Tm90ZShpbmRleE5vdGUpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4geHlsb3Bob25lTm90ZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5vdGVJbnB1dEVsZW1lbnQoaW5kZXhOb3RlKSB7XHJcbiAgY29uc3QgeHlsb3Bob25lTm90ZUVkaXRJbnB1dEVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICAgIG5hbWVFbGVtZW50OiAnaW5wdXQnLFxyXG4gICAgY2xhc3Nlc0VsZW1lbnQ6IFsneHlsb3Bob25lLW5vdGUtaW5wdXQnXSxcclxuICAgIGlkRWxlbWVudDogYHh5bG9waG9uZU5vdGVFZGl0SW5wdXRFbGVtZW50LSR7aW5kZXhOb3RlfWBcclxuICB9KTtcclxuXHJcbiAgeHlsb3Bob25lTm90ZUVkaXRJbnB1dEVsZW1lbnQubWF4TGVuZ3RoID0gMTtcclxuICB4eWxvcGhvbmVOb3RlRWRpdElucHV0RWxlbWVudC5wbGFjZWhvbGRlciA9IHh5bG9waG9uZS5ub3RlQnV0dG9uc1tpbmRleE5vdGVdLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gIHh5bG9waG9uZU5vdGVFZGl0SW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuICAgIGUudGFyZ2V0LnZhbHVlID0gZS50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKTtcclxuICAgIGUudGFyZ2V0LnZhbHVlID0gZS50YXJnZXQudmFsdWUucmVwbGFjZSgvW15BLVpdL2csICcnKTtcclxuICB9KVxyXG5cclxuICB4eWxvcGhvbmVOb3RlRWRpdElucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiBlLnRhcmdldC52YWx1ZS50cmltKCkgIT09ICcnKSB7XHJcbiAgICAgIGNvbnN0IG5ld0tleSA9IGUudGFyZ2V0LnZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB4eWxvcGhvbmUuYWRkS2V5TWFwcGluZyhuZXdLZXksIGluZGV4Tm90ZSk7XHJcbiAgICAgIHh5bG9waG9uZS5yZW1vdmVLZXlNYXBwaW5nKG5ld0tleSwgaW5kZXhOb3RlKTtcclxuICAgICAgeHlsb3Bob25lTm90ZUVkaXRJbnB1dEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB4eWxvcGhvbmVOb3RlRWRpdElucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGUpID0+IHtcclxuICAgIHh5bG9waG9uZU5vdGVFZGl0SW5wdXRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gIH0pXHJcblxyXG4gIHJldHVybiB4eWxvcGhvbmVOb3RlRWRpdElucHV0RWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSW5wdXRQbGF5RWxlbWVudCgpIHtcclxuICBjb25zdCBpbnB1dFBsYXlFbGVtZW50ID0gY3JlYXRlRWxlbWVudCh7XHJcbiAgICBuYW1lRWxlbWVudDogJ2lucHV0JyxcclxuICAgIGNsYXNzZXNFbGVtZW50OiBbJ2lucHV0LXBsYXknXSxcclxuICAgIGlkRWxlbWVudDogJ2lucHV0UGxheUVsZW1lbnQnXHJcbiAgfSk7XHJcblxyXG4gIGlucHV0UGxheUVsZW1lbnQubWF4TGVuZ3RoID0gMTU7XHJcbiAgaW5wdXRQbGF5RWxlbWVudC5wbGFjZWhvbGRlciA9ICdFbnRlciBub3Rlcy4uLic7XHJcblxyXG4gIGlucHV0UGxheUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZS5yZXBsYWNlKC9bXkEtWl0vZywgJycpO1xyXG4gIH0pXHJcblxyXG4gIHJldHVybiBpbnB1dFBsYXlFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25QbGF5RWxlbWVudCgpIHtcclxuICBjb25zdCBidXR0b25QbGF5RWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgbmFtZUVsZW1lbnQ6ICdidXR0b24nLFxyXG4gICAgY2xhc3Nlc0VsZW1lbnQ6IFsnYnV0dG9uLXBsYXknXSxcclxuICAgIHRleHRFbGVtZW50OiAnUGxheScsXHJcbiAgICBpZEVsZW1lbnQ6ICdidXR0b25QbGF5RWxlbWVudCdcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uUGxheUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXRQbGF5RWxlbWVudCcpO1xyXG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IGlucHV0LnZhbHVlO1xyXG4gICAgY29uc3QgaW5kZXhOb3Rlc0FycmF5ID0gW107XHJcblxyXG4gICAgaW5wdXRWYWx1ZS5zcGxpdCgnJykuZm9yRWFjaCgodmFsdWUpID0+IHtcclxuICAgICAgbGV0IGluZGV4Tm90ZSA9IHh5bG9waG9uZS5ub3RlQnV0dG9ucy5pbmRleE9mKHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICBpZiAoaW5kZXhOb3RlICE9PSAtMSkge1xyXG4gICAgICAgIGluZGV4Tm90ZXNBcnJheS5wdXNoKGluZGV4Tm90ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGluZGV4Tm90ZXNBcnJheS5mb3JFYWNoKChub3RlSW5kZXgsIGkpID0+IHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgeHlsb3Bob25lLnBsYXlOb3RlKG5vdGVJbmRleCk7XHJcbiAgICAgIH0sIGkgKiA1MDApO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIGJ1dHRvblBsYXlFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb3RlTGFiZWxFbGVtZW50KGluZGV4Tm90ZSkge1xyXG4gIGNvbnN0IHh5bG9waG9uZU5vdGVFZGl0TGFiZWxFbGVtZW50ID0gY3JlYXRlRWxlbWVudCh7XHJcbiAgICBuYW1lRWxlbWVudDogJ2xhYmVsJyxcclxuICAgIHRleHRFbGVtZW50OiAnRWRpdCcsXHJcbiAgICBjbGFzc2VzRWxlbWVudDogWyd4eWxvcGhvbmUtbm90ZS1sYWJlbCddLFxyXG4gICAgaWRFbGVtZW50OiBgeHlsb3Bob25lTm90ZUVkaXRMYWJlbEVsZW1lbnQtJHtpbmRleE5vdGV9YFxyXG4gIH0pO1xyXG4gIHh5bG9waG9uZU5vdGVFZGl0TGFiZWxFbGVtZW50Lmh0bWxGb3IgPSBgeHlsb3Bob25lTm90ZUVkaXRJbnB1dEVsZW1lbnQtJHtpbmRleE5vdGV9YDtcclxuXHJcbiAgcmV0dXJuIHh5bG9waG9uZU5vdGVFZGl0TGFiZWxFbGVtZW50O1xyXG59XHJcblxyXG5jb25zdCB3cmFwcGVyRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoe1xyXG4gIG5hbWVFbGVtZW50OiAnZGl2JyxcclxuICBjbGFzc2VzRWxlbWVudDogWyd3cmFwcGVyJ11cclxufSk7XHJcblxyXG5jb25zdCB0aXRsZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICBuYW1lRWxlbWVudDogJ2gxJyxcclxuICB0ZXh0RWxlbWVudDogJ1h5bG9QaG9uZScsXHJcbiAgY2xhc3Nlc0VsZW1lbnQ6IFsndGl0bGUnXSxcclxuICBpZEVsZW1lbnQ6ICd0aXRsZUVsZW1lbnQnXHJcbn0pO1xyXG5cclxuY29uc3Qgd3JhcHBlclBsYXlCbG9ja0VsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICBuYW1lRWxlbWVudDogJ2RpdicsXHJcbiAgY2xhc3Nlc0VsZW1lbnQ6IFsnd3JhcHBlci1wbGF5LWJsb2NrJ10sXHJcbiAgaWRFbGVtZW50OiAnd3JhcHBlclBsYXlCbG9ja0VsZW1lbnQnXHJcbn0pO1xyXG5cclxuY29uc3QgaW5wdXRQbGF5RWxlbWVudCA9IGNyZWF0ZUlucHV0UGxheUVsZW1lbnQoKTtcclxuXHJcbmNvbnN0IGJ1dHRvblBsYXlFbGVtZW50ID0gY3JlYXRlQnV0dG9uUGxheUVsZW1lbnQoKTtcclxuXHJcbmNvbnN0IHh5bG9waG9uZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICBuYW1lRWxlbWVudDogJ2RpdicsXHJcbiAgY2xhc3Nlc0VsZW1lbnQ6IFsneHlsb3Bob25lJ10sXHJcbiAgaWRFbGVtZW50OiAneHlsb3Bob25lRWxlbWVudCdcclxufSk7XHJcblxyXG5jb25zdCB4eWxvcGhvbmVOb3Rlc0VsZW1ldHNBcnJheSA9IEFycmF5LmZyb20oe2xlbmd0aDogN30pLm1hcCgoZWwsIGluZGV4KSA9PiB7XHJcbiAgY29uc3QgeHlsb3Bob25lTm90ZUVkaXRJbnB1dEVsZW1lbnQgPSBjcmVhdGVOb3RlSW5wdXRFbGVtZW50KGluZGV4KTtcclxuXHJcbiAgY29uc3QgeHlsb3Bob25lTm90ZUVkaXRMYWJlbEVsZW1lbnQgPSBjcmVhdGVOb3RlTGFiZWxFbGVtZW50KGluZGV4KTtcclxuICB4eWxvcGhvbmVOb3RlRWRpdExhYmVsRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIHh5bG9waG9uZU5vdGVFZGl0SW5wdXRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xyXG4gIH0pXHJcblxyXG4gIGNvbnN0IHh5bG9waG9uZU5vdGVFbGVtZW50ID0gY3JlYXRlTm90ZUVsZW1lbnQoaW5kZXgpO1xyXG5cclxuICBjb25zdCB4eWxvcGhvbmVOb3RlV3JhcHBlckVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtcclxuICAgIG5hbWVFbGVtZW50OiAnZGl2JyxcclxuICAgIGNsYXNzZXNFbGVtZW50OiBbJ3h5bG9waG9uZS1ub3RlLXdyYXBwZXInXSxcclxuICAgIGlkRWxlbWVudDogYHh5bG9waG9uZU5vdGVXcmFwcGVyRWxlbWVudC0ke2luZGV4fWAsXHJcbiAgICBjaGlsZHJlbkVsZW1lbnQ6IFt4eWxvcGhvbmVOb3RlRWxlbWVudCwgeHlsb3Bob25lTm90ZUVkaXRMYWJlbEVsZW1lbnQsIHh5bG9waG9uZU5vdGVFZGl0SW5wdXRFbGVtZW50XVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4geHlsb3Bob25lTm90ZVdyYXBwZXJFbGVtZW50O1xyXG59KTtcclxuXHJcblxyXG53cmFwcGVyUGxheUJsb2NrRWxlbWVudC5hcHBlbmQoaW5wdXRQbGF5RWxlbWVudCwgYnV0dG9uUGxheUVsZW1lbnQpO1xyXG5cclxud3JhcHBlckVsZW1lbnQuYXBwZW5kKHRpdGxlRWxlbWVudCwgd3JhcHBlclBsYXlCbG9ja0VsZW1lbnQsIHh5bG9waG9uZUVsZW1lbnQpO1xyXG5cclxueHlsb3Bob25lRWxlbWVudC5hcHBlbmQoLi4ueHlsb3Bob25lTm90ZXNFbGVtZXRzQXJyYXkpO1xyXG5cclxuYm9keS5hcHBlbmQod3JhcHBlckVsZW1lbnQpO1xyXG5cclxuXHJcblxyXG5cclxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==