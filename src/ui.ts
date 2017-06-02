/*
 JSNES, based on Jamie Sanders' vNES
 Copyright (C) 2010 Ben Firshman

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Utils from './utils';
import WebAudio from './webaudio';

export class UI {

  private nes;
  private roms: any;
  private el: HTMLElement;

  private zoomed;
  private root: HTMLElement;
  private screen: HTMLCanvasElement;
  private romContainer: HTMLElement;
  private romSelect: HTMLSelectElement;
  private romUpload;
  private controls: Element;
  private buttons;
  private status: HTMLElement;
  private canvasContext;
  private canvasImageData;
  private webAudio: WebAudio;

  public uiSettings;

  public constructor(el, roms, nes) {
    this.nes = nes;

    this.el = el;

    this.roms = roms;

    this.zoomed = false;

    if (window.localStorage) {
      this.zoomed = Utils.strToBool(window.localStorage.getItem('zoom'));
      //TODO: Here was this.nes
      //this.nes.opts.emulateSound = Utils.strToBool(window.localStorage.getItem('sound'));
      this.uiSettings.emulateSound = Utils.strToBool(window.localStorage.getItem('sound'));
    }

    /*
     * Create UI
     */
    this.screen = this.el.querySelector('nes-screen') as HTMLCanvasElement;

    if (!this.screen.getContext) {
      this.el.innerHTML = ('Your browser doesn\'t support the <code>&lt;canvas&gt;</code> tag. Try Google Chrome, Safari, Opera or Firefox!');
      return;
    }

    this.romContainer = document.getElementById('nes-roms');
    this.romSelect = this.el.querySelector('rom-select') as HTMLSelectElement;

    this.romUpload = this.el.querySelector('rom-file');

    this.controls = this.el.querySelector('nes-controls');

    this.buttons = {
      pause: this.el.querySelector('btn-pause'),
      restart: this.el.querySelector('btn-restart'),
      sound: this.el.querySelector('btn-sound'),
      zoom: this.el.querySelector('btn-zoom')
    };
    this.status = this.el.querySelector('nes-status') as HTMLElement;


    if (this.zoomed) {
      this.screen.setAttribute('class', 'zoomed');
      this.buttons.zoom.childNodes[0].setAttribute('class', 'icon-zoom-out');
      this.buttons.zoom.childNodes[1].data = 'Zoom out';
    } else {
      this.screen.setAttribute('class', 'not-zoomed');
      this.buttons.zoom.childNodes[0].setAttribute('class', 'icon-zoom-in');
      this.buttons.zoom.childNodes[1].data = 'Zoom in';
    }

    if (this.uiSettings.emulateSound) {
      this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-mute');
      this.buttons.sound.childNodes[1].data = 'Disable Sound';
    } else {
      this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-3');
      this.buttons.sound.childNodes[1].data = 'Enable Sound';
    }

    /*
     * ROM loading
     */
    this.romSelect.addEventListener('change', function () {
      this.loadROM();
    });


    // These should be changed to use bind when jquery adds dataTransfer to its Event object.
    this.root.addEventListener('dragenter', Utils.cancelEvent, false);

    this.root.addEventListener('dragover', Utils.cancelEvent, false);

    this.root.addEventListener('drop', (e) => {
      Utils.cancelEvent(e);
      if (!e.dataTransfer) {
        this.updateStatus('Your browser doesn\'t support reading local files (FileAPI).');
        //alert("Your browser doesn't support reading local files (FileAPI).");
        return;
      }
      let files = e.dataTransfer.files;
      startRomFromFileBlob(files[0]);
    }, false);

    this.romUpload.addEventListener('change', function () {
      let files = this.romUpload.files;
      if (!files) {
        this.updateStatus("Your browser doesn't support reading local files (FileAPI).");
        //alert("Your browser doesn't support reading local files (FileAPI).");
        return;
      }
      startRomFromFileBlob.call(this, files[0]);
    });

    function startRomFromFileBlob(file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (evt:any) => {
        // FIXME: to fix evt.target.result
        this.nes.loadRom(evt.target.result);
        this.nes.start();
        this.enable();
      };
    }

    /*
     * Buttons
     */
    this.buttons.pause.addEventListener('click', function () {
      if (this.nes.isRunning) {
        this.nes.stop();
        this.updateStatus('Paused');
        this.buttons.pause.childNodes[0].setAttribute('class', 'icon-play');
        this.buttons.pause.childNodes[1].data = 'Resume';
      } else {
        this.nes.start();
        this.buttons.pause.childNodes[0].setAttribute('class', 'icon-pause');
        this.buttons.pause.childNodes[1].data = 'Pause';
      }
    });

    this.buttons.restart.addEventListener('click', function () {
      this.nes.reloadRom();
      this.nes.start();
    });

    this.buttons.sound.addEventListener('click', function () {
      if (this.nes.opts.emulateSound) {
        this.nes.opts.emulateSound = false;
        if (localStorage) localStorage.setItem('sound', 'false');
        this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-3');
        this.buttons.sound.childNodes[1].data = 'Enable Sound';
      } else {
        this.nes.opts.emulateSound = true;
        if (localStorage) localStorage.setItem('sound', 'true');
        this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-mute');
        this.buttons.sound.childNodes[1].data = 'Disable Sound';
      }
    });

    this.buttons.zoom.addEventListener('click', function () {
      if (this.zoomed) {
        this.zoomed = false;
        if (localStorage) localStorage.setItem('zoom', 'false');
        this.screen.setAttribute('class', 'not-zoomed');
        this.buttons.zoom.childNodes[0].setAttribute('class', 'icon-zoom-in');
        this.buttons.zoom.childNodes[1].data = 'Zoom in';
      } else {
        this.zoomed = true;
        if (localStorage) localStorage.setItem('zoom', 'true');
        this.screen.setAttribute('class', 'zoomed');
        this.buttons.zoom.childNodes[0].setAttribute('class', 'icon-zoom-out');
        this.buttons.zoom.childNodes[1].data = 'Zoom out';
      }
    });

    /*
     * Lightgun experiments with mouse
     * (Requires jquery.dimensions.js)
     */
    //if ($.offset) {
    this.screen.addEventListener('mousedown', (e) => {
      if (this.nes.mmap) {
        this.nes.mmap.mousePressed = true;
        // FIXME: does not take into account zoom
//                    this.nes.mmap.mouseX = e.pageX - this.screen.offset().left;
//                    this.nes.mmap.mouseY = e.pageY - this.screen.offset().top;
        this.nes.mmap.mouseX = e.pageX - this.screen.offsetLeft;
        this.nes.mmap.mouseY = e.pageY - this.screen.offsetTop;
        console.log(this.nes.mmap.mouseX);
        console.log(this.nes.mmap.mouseY);
      }
    });

    this.screen.addEventListener('mouseup', () => {
      setTimeout(function () {
        if (this.nes.mmap) {
          this.nes.mmap.mousePressed = false;
          this.nes.mmap.mouseX = 0;
          this.nes.mmap.mouseY = 0;
        }
      }, 500);
    });
    //}

    if (typeof roms !== 'undefined') {
      this.setRoms(roms);
    }

    /*
     * Canvas
     */
    this.canvasContext = this.screen.getContext('2d');

    if (!this.canvasContext.getImageData) {
      this.el.innerHTML = ('Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest versions of Google Chrome, Safari, Opera or Firefox!');
      return;
    }

    this.canvasImageData = this.canvasContext.getImageData(0, 0, 256, 240);
    this.resetCanvas();

    /*
     * Keyboard
     */
    document.addEventListener('keydown', (evt) => {
      this.nes.keyboard.keyDown(evt);
    });
    document.addEventListener('keyup', (evt) => {
      this.nes.keyboard.keyUp(evt);
    });
    document.addEventListener('keypress', (evt) => {
      this.nes.keyboard.keyPress(evt);
    });

    /*
     * Sound
     */
    this.webAudio = new WebAudio();

    if (!this.webAudio || !this.webAudio.audioContext) {
      //TODO: Add dynamic audio support
      //this.dynamicaudio = new DynamicAudio({
      //  swf: nes.opts.swfPath + 'dynamicaudio.swf'
      //});
    }
  }


  public loadROM(): boolean {
    this.updateStatus('Downloading...');

    let xhr = new XMLHttpRequest();

    if (!xhr) {
      this.updateStatus('ERROR: Cannot create an XMLHTTP instance');
      return false;
    }

    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }

    xhr.open('GET', this.romSelect.value, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let data = xhr.responseText;
        this.nes.loadRom(data);
        this.nes.start();
        this.enable();
      } else {
        this.updateStatus('Rom not loaded. Some errors.');
      }
    };

    try {
      xhr.send('');
    } catch (e) {
      if (e.code == 101 && e.name == 'NETWORK_ERR') {
        this.updateStatus('ERROR! Try to use JSNES from local PC? Cross origin requests are only supported for HTTP. Run JSNES from you server!');
      } else {
        this.updateStatus(e);
      }
    }
  }


  public resetCanvas() {
    this.canvasContext.fillStyle = 'black';
    // set alpha to opaque
    this.canvasContext.fillRect(0, 0, 256, 240);

    // Set alpha
    for (let i = 3; i < this.canvasImageData.data.length - 3; i += 4) {
      this.canvasImageData.data[i] = 0xFF;
    }
  }


  /*
   * Enable and reset UI elements
   */
  public enable() {
    this.buttons.pause.removeAttribute("disabled");
    this.buttons.restart.removeAttribute("disabled");
    this.buttons.sound.removeAttribute("disabled");

    if (this.nes.isRunning) {
      this.buttons.pause.childNodes[0].setAttribute('class', 'icon-pause');
      this.buttons.pause.childNodes[1].data = 'Pause';
    } else {
      this.buttons.pause.childNodes[0].setAttribute('class', 'icon-play');
      this.buttons.pause.childNodes[1].data = 'Resume';
    }

    if (this.nes.opts.emulateSound) {
      this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-mute');
      this.buttons.sound.childNodes[1].data = 'Disable Sound';
    } else {
      this.buttons.sound.childNodes[0].setAttribute('class', 'icon-volume-3');
      this.buttons.sound.childNodes[1].data = 'Enable Sound';
    }
  }


  public updateStatus(s) {
    this.status.innerText = s;
  }


  public setRoms(roms) {
    for (let groupName in roms) {
      if (roms.hasOwnProperty(groupName)) {
        const optgroup = document.createElement('optgroup');
        optgroup.setAttribute('label', groupName);
        for (let i = 0; i < roms[groupName].length; i++) {
          const option = document.createElement('option');
          option.innerText = roms[groupName][i][0];
          option.setAttribute('value', roms[groupName][i][1]);
          optgroup.appendChild(option);
        }
        this.romSelect.appendChild(optgroup);
      }
    }
  }


  public writeAudio(samples) {
    return this.webAudio.writeInt(samples);

    //TODO: DynamicAudio output
    //return this.dynamicaudio.writeInt(samples);
  }

  public writeFrame(buffer, prevBuffer) {
    let imageData = this.canvasImageData.data;
    let pixel, i, j;

    for (i = 0; i < 256 * 240; i++) {
      pixel = buffer[i];

      if (pixel != prevBuffer[i]) {
        j = i * 4;
        imageData[j] = pixel & 0xFF;
        imageData[j + 1] = (pixel >> 8) & 0xFF;
        imageData[j + 2] = (pixel >> 16) & 0xFF;
        prevBuffer[i] = pixel;
      }
    }

    this.canvasContext.putImageData(this.canvasImageData, 0, 0);
  }

}

