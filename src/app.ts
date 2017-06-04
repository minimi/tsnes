import {UI} from './ui';
import {JSNES} from './nes';

const emulator = document.getElementById('nes-emulator');

const gameList = {
  'Working': [
    ['Addams Family, The', 'roms/Addams Family, The (U).nes'],
    ['Battletoads', 'roms/Battletoads (U).nes'],
    ['Bubble Bobble', 'roms/Bubble Bobble.nes'],
//                ['Castlevania 3 - Dracula\'s Curse', 'roms/Castlevania 3 - Dracula\'s Curse (U).nes'],
    ['Capitan America', 'roms/cap_am.nes'],
    ['Chip \'n Dale Rescue Rangers (RUS)', 'roms/Chip_\'n_Dale_Rescue_Rangers_(R).nes'],
    //['Chip \'n Dale Rescue Rangers 2', 'roms/Chip_\'n_Dale_Rescue_Rangers_2_(R).nes'],
    ['Circus Charlie', 'roms/Circus Charlie.nes'],
    ['Contra', 'roms/Contra.nes'],
    ['Crystal Mines', 'roms/Crystal Mines.nes'],
    ['Darkseed', 'roms/Darkseed (Unl).nes'],
    ['Darkwing Duck', 'roms/Darkwing Duck (U).nes'],
    ['Dragon Power', 'roms/Dragon Power (U).nes'],
    ['Dragon Quest', 'roms/Dragon Quest (J).nes'],
    ['Dragon Warrior', 'roms/Dragon Warrior.nes'],
    ['Duck Tales', 'roms/Duck Tales (E).nes'],
    ['Excitebike', 'roms/Excitebike.nes'],
    ['Felix the Cat', 'roms/Felix the Cat (U).nes'],
    ['Golf', 'roms/Golf (E) [!].nes'],
    //['Impossible Mission II', 'roms/Impossible Mission II.nes'],
    ['Legend of Zelda', 'roms/Legend of Zelda.nes'],
    ['Marble Madness', 'roms/Marble Madness (U).nes'],
    ['Mashou', 'roms/Mashou.nes'],
    ['Metal Fighter', 'roms/Metal Fighter.nes'],
    ['RC Pro-Am', 'roms/RC Pro-Am.nes'],
    ['RC Pro-Am 2', 'roms/RC Pro-Am 2.nes'],
    ['Solomon\'s Key', 'roms/Solomon\'s Key (U) [!].nes'],
    ['Super Contra', 'roms/Super Contra.nes'],
    ['Super Mario Bros', 'roms/Super Mario Bros..nes'],
    ['Super Mario Bros. 2', 'roms/Super Mario Bros. 2.nes'],
    ['Super Mario Bros. 3', 'roms/Super Mario Bros. 3.nes'],
    ['Time Lord', 'roms/Time Lord.nes'],
    ['Zelda II - Adventure of Link', 'roms/Zelda II - Adventure of Link.nes'],
    ['Zen Intergalactic Ninja', 'roms/Zen Intergalactic Ninja.nes']
  ]
};

const jsnes = new JSNES();

const ui = new UI(emulator, gameList, jsnes);

document.addEventListener('updateStatus', (evt: CustomEvent) => {
  ui.updateStatus(evt.detail);
});

