import { Mapper0 } from './Mapper0';

export class Mapper2 extends Mapper0 {

  public constructor(nes) {
    super(nes);
  }

  public write(address: number, value: number) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    super.write(address, value);
    return;
  }

  else {
    // This is a ROM bank select command.
    // Swap in the given ROM bank at 0x8000:
    this.loadRomBank(value, 0x8000);
  }
};

  public loadROM(rom) {
    if (!this.nes.rom.valid) {
      window.alert("UNROM: Invalid ROM! Unable to load.");
      return;
    }

    // Load PRG-ROM:
    this.loadRomBank(0, 0x8000);
    this.loadRomBank(this.nes.rom.romCount - 1, 0xC000);

    // Load CHR-ROM:
    this.loadCHRROM();

    // Do Reset-Interrupt:
    this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
  };
}





