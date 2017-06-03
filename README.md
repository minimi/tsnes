TSNES
=====

TypeScript realization of bfirsh's JSNES.
JavaScript Nintendo Emulator.

Build
-----

To build a distribution, you have to install some node modules:

  In project directory do
    $ npm install

Then run:

    $ npm run build

This will create ``jsnes.js`` and ``jsnes-min.js`` in ``build/``.

Benchmark
---------

(minimi - i'm not tested it yet :)
The benchmark in ``test/benchmark.js`` is intended for testing JavaScript 
engines. It does not depend on a DOM or Canvas element etc.

