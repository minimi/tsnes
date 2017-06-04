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

Why TS?
-------
I just practicing TS and i like JSNES :)
 
My idea is to get simple set of files - ex. only two files index.html and jsnes.min.js
or even better - to get only one all-in-one file file: jsnes.html.
Remove all external deps such as jquery. Only vanilla ES6. Remove IE support - yes, IE is RIP.

About the code:
Entry point is app.ts

Benchmark
---------

(minimi - i'm not tested it yet :)
The benchmark in ``test/benchmark.js`` is intended for testing JavaScript 
engines. It does not depend on a DOM or Canvas element etc.

