export interface IMapper {

  write(address: number, value: number): void;

  loadROM(rom?: any): void;

}
