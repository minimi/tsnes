import {Mapper0} from './Mapper0';

/**
 * Mapper007 (AxROM)
 * @example Battletoads, Time Lord, Marble Madness
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_007
 */
export class Mapper7 extends Mapper0 {
  /**
   * @constructor
   * @param nes
   */
  constructor(nes) {
    super(nes);
  }


  write(address: number, value: number) {
    // Writes to addresses other than MMC registers are handled by NoMapper.
    if (address < 0x8000) {
      super.write(address, value);
    } else {
      this.load32kRomBank(value & 0x7, 0x8000);
      if (value & 0x10) {
        this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING2);
      } else {
        this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING);
      }
    }
  }

  loadROM(rom) {
    if (!this.nes.rom.valid) {
      window.alert("AOROM: Invalid ROM! Unable to load.");
      return;
    }

    // Load PRG-ROM:
    this.loadPRGROM();

    // Load CHR-ROM:
    this.loadCHRROM();

    // Do Reset-Interrupt:
    this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
  };

}


