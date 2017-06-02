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

import { Mapper0 } from './mappers/Mapper0';
import { Mapper1 } from './mappers/Mapper1';
import { Mapper2 } from './mappers/Mapper2';
import { Mapper4 } from './mappers/Mapper4';
import { Mapper5 } from './mappers/Mapper5';
import { Mapper7 } from './mappers/Mapper7';
import { Mapper11 } from './mappers/Mapper11';
import { Mapper34 } from './mappers/Mapper34';
import { Mapper66 } from './mappers/Mapper66';

export let Mappers = [];

Mappers[0] = Mapper0;
Mappers[1] = Mapper1;
Mappers[2] = Mapper2;
Mappers[4] = Mapper4;
Mappers[5] = Mapper5;
Mappers[7] = Mapper7;
Mappers[11] = Mapper11;
Mappers[34] = Mapper34;
Mappers[66] = Mapper66;


