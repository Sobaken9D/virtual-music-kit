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




