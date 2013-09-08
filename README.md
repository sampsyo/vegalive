Vegalive
========

Live preview of [Vega][] visualizations.

[Vega]: http://trifacta.github.io/vega/


What? Why?
----------

[Vega][] is a declarative language for making data visualizations. It's bona fide awesome. Check it out.

This is a tiny tool for quickly viewing Vega visualizations, complete with live updates. You can live-code your visualization in your favorite editor. Or you can automatically see updates as new points are added to a data file---so you can watch an experiment progress in real time.


How?
----

Vegalive is written for [Node.js][], so it's installed with [npm][]. Just type:

    $ npm install -g vegalive

[npm]: https://npmjs.org/
[Node.js]: http://nodejs.org/

Then, go to a directory that has one of your Vega specs (i.e., .json files) and type:

    $ vegalive

As the output suggests, you'll then want to point your browser at [http://localhost:4915](http://localhost:4915). There you'll see a list of JSON documents in the current directory. Click on your plot's filename to see it rendered in glorious HTML5.

Then the magic happens:

* Edit the spec in your favorite editor. Whenever you save, the plot refreshes in your browser.

* Edit the data files that your visualization uses (or have another tool update them). The plot refreshes automatically.

There's also a [screencast][].

[screencast]: http://youtu.be/QuCHRU5q4tU


Who?
----

Vegalive is by [Adrian Sampson][]. It is made available under [the BSD three-clause license][bsd], the same license as [Vega][] itself. Vega is by [Trifacta][], which is unaffiliated.

[Trifacta]: http://trifacta.com
[Adrian Sampson]: http://homes.cs.washington.edu/~asampson/
[bsd]: http://opensource.org/licenses/BSD-3-Clause
