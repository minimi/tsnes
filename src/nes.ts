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

import {CPU} from './cpu';
import {PPU} from './ppu';
import {PAPU} from './papu';
import {ROM} from './rom';
import {Keyboard} from './keyboard';


type JSNESOpts = {
  preferredFrameRate?: number,
  fpsInterval?: number,
  showDisplay?: boolean,
  emulateSound?: boolean,
  sampleRate?: number,
  CPU_FREQ_NTSC?: number,
  CPU_FREQ_PAL?: number
};

export class JSNES {
  public static VERSION = '<%= version %>';

  public opts: JSNESOpts;

  private frameTime: number;
  private cpu;
  private ppu;
  private papu;
  private mmap;
  private rom;
  private keyboard;

  private isRunning = false;
  private fpsFrameCount = 0;
  private romData = null;
  private frameInterval: number;
  private fpsInterval: number;
  private lastFrameTime;
  private lastFpsTime;

  public constructor(opts?) {
    this.opts = {
      preferredFrameRate: 60,
      fpsInterval: 500, // Time between updating FPS in ms
      showDisplay: true,

      emulateSound: false,
      sampleRate: 44100, // Sound sample rate in hz

      CPU_FREQ_NTSC: 1789772.5, //1789772.72727272d;
      CPU_FREQ_PAL: 1773447.4
    };

    if (typeof opts !== 'undefined') {
      for (let key in this.opts) {
        if (typeof opts[key] !== 'undefined') {
          this.opts[key] = opts[key];
        }
      }
    }

    this.frameTime = 1000 / this.opts.preferredFrameRate;

    this.cpu = new CPU.CPU(this);
    this.ppu = new PPU.PPU(this);
    this.papu = new PAPU.PAPU(this);
    this.mmap = null; // set in loadRom()
    this.keyboard = new Keyboard();

    //this.ui.updateStatus("Ready to load a ROM.");
    this.emitEvent('updateStatus', 'Ready to load a ROM.');
  }

  private emitEvent(eventName, data) {
    let customEvent = new CustomEvent(eventName, {'detail': data});
    document.dispatchEvent(customEvent);
  }

  // Resets the system
  reset() {
    if (this.mmap !== null) {
      this.mmap.reset();
    }

    this.cpu.reset();
    this.ppu.reset();
    this.papu.reset();
  }

  start() {
    if (this.rom !== null && this.rom.valid) {
      if (!this.isRunning) {
        this.isRunning = true;

        this.frameInterval = setInterval(() => {
          this.frame();
        }, this.frameTime);

        this.resetFps();
        this.printFps();

        this.fpsInterval = setInterval(() => {
          this.printFps();
        }, this.opts.fpsInterval);
      }
    }
    else {
      //this.ui.updateStatus("There is no ROM loaded, or it is invalid.");
      this.emitEvent('updateStatus', 'There is no ROM loaded, or it is invalid.');
    }
  }


  frame() {
    this.ppu.startFrame();
    var cycles = 0;
    var emulateSound = this.opts.emulateSound;
    var cpu = this.cpu;
    var ppu = this.ppu;
    var papu = this.papu;
    FRAMELOOP: for (; ;) {
      if (cpu.cyclesToHalt === 0) {
        // Execute a CPU instruction
        cycles = cpu.emulate();
        if (emulateSound) {
          papu.clockFrameCounter(cycles);
        }
        cycles *= 3;
      }
      else {
        if (cpu.cyclesToHalt > 8) {
          cycles = 24;
          if (emulateSound) {
            papu.clockFrameCounter(8);
          }
          cpu.cyclesToHalt -= 8;
        }
        else {
          cycles = cpu.cyclesToHalt * 3;
          if (emulateSound) {
            papu.clockFrameCounter(cpu.cyclesToHalt);
          }
          cpu.cyclesToHalt = 0;
        }
      }

      for (; cycles > 0; cycles--) {
        if (ppu.curX === ppu.spr0HitX &&
          ppu.f_spVisibility === 1 &&
          ppu.scanline - 21 === ppu.spr0HitY) {
          // Set sprite 0 hit flag:
          ppu.setStatusFlag(ppu.STATUS_SPRITE0HIT, true);
        }

        if (ppu.requestEndFrame) {
          ppu.nmiCounter--;
          if (ppu.nmiCounter === 0) {
            ppu.requestEndFrame = false;
            ppu.startVBlank();
            break FRAMELOOP;
          }
        }

        ppu.curX++;
        if (ppu.curX === 341) {
          ppu.curX = 0;
          ppu.endScanline();
        }
      }
    }
    this.fpsFrameCount++;
    this.lastFrameTime = +new Date();
  }


  printFps() {
    var now = +new Date();
    var s = 'Running';
    if (this.lastFpsTime) {
      s += ': ' + (
          this.fpsFrameCount / ((now - this.lastFpsTime) / 1000)
        ).toFixed(2) + ' FPS';
    }
    //this.ui.updateStatus(s);
    this.emitEvent('updateStatus', s);
    this.fpsFrameCount = 0;
    this.lastFpsTime = now;
  }


  stop() {
    clearInterval(this.frameInterval);
    clearInterval(this.fpsInterval);
    this.isRunning = false;
  }


  reloadRom() {
    if (this.romData !== null) {
      this.loadRom(this.romData);
    }
  }


  // Loads a ROM file into the CPU and PPU.
  // The ROM file is validated first.
  loadRom(data) {
    if (this.isRunning) {
      this.stop();
    }

    //this.ui.updateStatus("Loading ROM...");
    this.emitEvent('updateStatus', 'Loading ROM...');

    // Load ROM file:
    this.rom = new ROM(this);
    this.rom.load(data);

    if (this.rom.valid) {
      this.reset();
      this.mmap = this.rom.createMapper();
      if (!this.mmap) {
        return;
      }
      this.mmap.loadROM();
      this.ppu.setMirroring(this.rom.getMirroringType());
      this.romData = data;

      //this.ui.updateStatus("Successfully loaded. Ready to be started.");
      this.emitEvent('updateStatus', 'Successfully loaded. Ready to be started.');
    }
    else {
      //this.ui.updateStatus("Invalid ROM!");
      this.emitEvent('updateStatus', 'Invalid ROM!');
    }
    return this.rom.valid;
  }


  resetFps() {
    this.lastFpsTime = null;
    this.fpsFrameCount = 0;
  }

  setFramerate(rate) {
    this.opts.preferredFrameRate = rate;
    this.frameTime = 1000 / rate;
    this.papu.setSampleRate(this.opts.sampleRate, false);
  }

  toJSON() {
    return {
      'romData': this.romData,
      'cpu': this.cpu.toJSON(),
      'mmap': this.mmap.toJSON(),
      'ppu': this.ppu.toJSON()
    };
  }

  fromJSON(s) {
    this.loadRom(s.romData);
    this.cpu.fromJSON(s.cpu);
    this.mmap.fromJSON(s.mmap);
    this.ppu.fromJSON(s.ppu);
  }
}
