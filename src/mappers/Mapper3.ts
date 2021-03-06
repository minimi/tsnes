import { Mapper0 } from './Mapper0';

/**
 * Mapper 003 (CNROM)
 *
 * @constructor
 * @example Solomon's Key, Arkanoid, Arkista's Ring, Bump 'n' Jump, Cybernoid
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_003
 */
export class Mapper3 extends Mapper0 {

  constructor(nes) {
    super(nes);
  }

  public write(address: number, value: number) {
    // Writes to addresses other than MMC registers are handled by NoMapper.
    if (address < 0x8000) {
      super.write(address, value);
      return;
    } else {
      // This is a ROM bank select command.
      // Swap in the given ROM bank at 0x8000:
      // This is a VROM bank select command.
      // Swap in the given VROM bank at 0x0000:
      let bank = (value % (this.nes.rom.vromCount / 2)) * 2;
      this.loadVromBank(bank, 0x0000);
      this.loadVromBank(bank + 1, 0x1000);
      this.load8kVromBank(value * 2, 0x0000);
    }
  }
}

