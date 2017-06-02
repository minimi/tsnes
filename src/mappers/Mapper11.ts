import {Mapper0} from './Mapper0';

/**
 * Mapper 011 (Color Dreams)
 *
 * @description http://wiki.nesdev.com/w/index.php/Color_Dreams
 * @example Crystal Mines, Metal Fighter
 */
export class Mapper11 extends Mapper0 {
  /**
   * @constructor
   * @param nes
   */
  constructor(nes) {
    super(nes);
  }

  write(address: number, value: number) {
    if (address < 0x8000) {
      super.write(address, value);
      return;
    } else {
      // Swap in the given PRG-ROM bank:
      const prgbank1 = ((value & 0xF) * 2) % this.nes.rom.romCount;
      const prgbank2 = ((value & 0xF) * 2 + 1) % this.nes.rom.romCount;

      this.loadRomBank(prgbank1, 0x8000);
      this.loadRomBank(prgbank2, 0xC000);


      if (this.nes.rom.vromCount > 0) {
        // Swap in the given VROM bank at 0x0000:
        const bank = ((value >> 4) * 2) % (this.nes.rom.vromCount);
        this.loadVromBank(bank, 0x0000);
        this.loadVromBank(bank + 1, 0x1000);
      }
    }
  }
}


