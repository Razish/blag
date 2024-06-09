<h2>Starting with a blank slate</h2>
<p>D is cute. I&#39;ve seen some D snippets every now and then, but never looked into it. It seems powerful and stays out of your way.<br>I like compiled languages (long live C 😍). It&#39;s been a long time since I last looked at it, and it seems to be a mature language by now.<br>It seems to fit a similar niche to Go. Is Go simply <em>better</em>? Maybe it has a better concurrency model? Stronger corporate backing?<br>That doesn&#39;t mean D is useless. Let&#39;s see how it <em>feels</em>!<br>There&#39;s a (very handy, I assume) <a href="https://tour.dlang.org/">DLang Tour</a> available. I don&#39;t want to use that until I absolutely must - a key priority I want to evaluate is &quot;how easy is this to just pick up and hit the ground running?&quot;. If I had to write a tool in D tomorrow, could I? I can think of one way to find out...!</p>
<h2>Managing Expectations</h2>
<p>I am dipping my toes into the waters of D and writing down the first thing that comes to mind. This is not an in-depth, exhaustive or professional review of the D language. It&#39;s an anecdotal journal of clumsily smashing things together over a weekend. I ended up writing most of this post before and after writing the code. I&#39;m not sure how much fun it would be watching me rewrite the same bit of code multiple times and debug a tokeniser with my pea-sized brain 🙃 maybe next time.<br>I am obviously not an expert on D. I might say some things that are factually incorrect. Do your own research and learning :)</p>
<h2>Pre-flight check</h2>
<p>I imagine we need a compiler, build system, debugger, what else?<br><code>dub</code> seems to be the build system. a la Cargo, npm.</p>
<pre><code class="language-console">$ brew install dub
# ... some stuff happened ...

$ dub

No package manifest (dub.json or dub.sdl) was found in
/Users/Razish/projects/dplayground
Please run DUB from the root directory of an existing package, or run
&quot;dub init --help&quot; to get information on creating a new package.

Error No valid root package found - aborting.
</code></pre>
<p>Cool, that was painless. And it gave us some helpful info. I&#39;m gonna <code>dub init</code> my project and be on my way 🙃</p>
<pre><code class="language-console">$ dub init
# ... selecting some things in the nice wizard ...
     Success created empty project in /Users/Razish/projects/dplayground
             Package successfully created in .
$ tree -a
.
├── .gitignore
├── dub.json
└── source
    └── app.d

$ cat source/app.d
import std.stdio;

void main()
{
        writeln(&quot;Edit source/app.d to start your project.&quot;);
}
</code></pre>
<p>Beautiful. I have a source file, project configuration and it&#39;s even configured git for me. Let&#39;s build it!</p>
<pre><code class="language-console">$ dub build
Error Executable file not found: dmd

$ brew install dmd
dmd: The x86_64 architecture is required for this software.
Error: dmd: An unsatisfied requirement failed this build.
</code></pre>
<p><code>dmd</code> (Digital Mars D Compiler) is the flagship compiler. Oops, there&#39;s no official binary for aarch64 🤦<br>A little birdy told me there&#39;s another blessed option that <em>does</em> work, <code>ldc</code>. It&#39;s built on LLVM. Let&#39;s go!</p>
<pre><code class="language-console">$ brew install ldc
# ... some stuff happened ...

$ dub build
    Starting Performing &quot;debug&quot; build using ldc2 for aarch64, arm_hardfloat.
    Building dplayground ~master: building configuration [application]
     Linking dplayground

$ ./dplayground
Edit source/app.d to start your project.
</code></pre>
<p>Not only did <code>ldc</code> work, but <code>dub</code> picked it up automatically and <em>just used it</em>. This feels nice and not astonishing.<br>Note, I&#39;m going to run <code>dub</code> with the <code>-q</code> flag from here on, which just silences the build output.</p>
<p>One last thing. Linting. DScanner is the tool of choice, and it is <em>fast</em> 🤩</p>
<pre><code class="language-console">$ brew install dscanner
# ... some stuff happened ...

$ dscanner lint
./source/parse/entities.d(6:8): Warning: Public declaration &#39;Entity&#39; is undocumented. (undocumented_declaration_check)
struct Entity
       ^^^^^^
./source/parse/entities.d(11:27): Warning: Parameter entities is never used. (unused_parameter_check)
string serialise(Entity[] entities)
                          ^^^^^^^^
./source/parse/entities.d(20:10): Warning: Variable bytes is never used. (unused_variable_check)
  byte[] bytes = new byte[lump.length];
         ^^^^^
</code></pre>
<p>Slightly underwhelming, but I also haven&#39;t written much code. I&#39;m sure it will come in handy.<br>Note I don&#39;t ever lint manually, my IDE automatically updates with the latest lints inline. This immediate feedback is why a fast linter is important. No one wants to wait 3+ seconds to start reading what they did wrong.<br>I don&#39;t pay much mind to those unused vars/params, especially while I&#39;m fleshing things out. I also don&#39;t like how it&#39;s nagging at me to document <em>everything</em>. It doesn&#39;t consider an inline comment on a struct member as documentation, it wants a full-fledged javadoc style block comment, for each member. Not happening. I&#39;m going to tweak some of these rules by providing a config file (generated by <code>dscanner --defaultConfig</code> and copied into the source tree).  </p>
<p>Let&#39;s get into some actual programming.</p>
<h2>VSCode extension</h2>
<p>I&#39;m using VSCode, and I&#39;m going to need syntax highlighting, an LSP, maybe a formatter? Looks like <code>webfreak.code-d</code> (<a href="https://github.com/Pure-D/code-d">https://github.com/Pure-D/code-d</a>) is the extension for me 🤞<br>Upon installing that extension, it complains that <code>serve-d</code> (from setting <code>d.servedPath</code>) is not installed and prompts me to compile it. Okay, I&#39;ll let it do that</p>
<pre><code class="language-text">&gt; /opt/homebrew/bin/dub build --compiler=ldc2
     Warning Invalid source/import path: /Users/Razish/.dub/packages/dfmt/0.14.1/dfmt/bin
     Warning Invalid source/import path: /Users/Razish/.dub/packages/dscanner/0.11.1/dscanner/bin
     Warning Invalid source/import path: /Users/Razish/.dub/packages/dcd/0.13.6/dcd/bin
     Pre-gen Running commands for dfmt
/bin/sh: rdmd: command not found
Error Command failed with exit code 127: rdmd &quot;/Users/Razish/.dub/packages/dfmt/0.14.1/dfmt/dubhash.d&quot;
Failed to install serve-d (Error code 2)
</code></pre>
<p>Ugh. That&#39;s not nice. This is a few years old too: <a href="https://github.com/Pure-D/code-d/issues/395">https://github.com/Pure-D/code-d/issues/395</a><br>So we&#39;re missing <code>dcd</code> and <code>serve-d</code>. We can <code>brew install dcd</code> and let&#39;s try compile <code>serve-d</code> from source.</p>
<pre><code class="language-sh">cd ~/projects
git clone git@github.com:Pure-D/serve-d.git
cd serve-d
dub build
</code></pre>
<p>...Oh, that was painless. Now we configure VSCode (via <code>settings.json</code>) to point to this binary: <code>&quot;d.servedPath&quot;: &quot;/Users/Razish/projects/serve-d/serve-d&quot;</code></p>
<h2>What to write?</h2>
<p>I recently <a href="https://github.com/Razish/bsputil-go">wrote an RBSP parser</a> in Go for some practice. That felt a bit clunky. I wonder how D fares for this task?<br>RBSP (<code>.bsp</code>) a simple binary format used to store level data for games built by Ravensoft on the Quake III engine. The &quot;BSP&quot; comes from Binary Space Partitioning, which describes the tree structure used to quickly traverse (and cull) the level geometry.<br>It parses very well in C. It has a header that describes the layout (offset + size) of 18 (depending on the version) &quot;lumps&quot;. Think of it as an extremely primitive (uncompressed) zip file for binary data.<br>Once the relevant lumps are parsed, I can output a JSONL representation of them to compose pipelines for processing that data: <code>bsputil foo.bsp entities | jq -r &#39;.classname + &quot; @ &quot; + (.origin // &quot;N/A&quot;)&#39;</code><br>I&#39;m only going to focus on reading some trivial lumps (which are incidentally some of the most practical for the (21 year old 🤘) modding community).</p>
<h2>Reaching for primitive tools</h2>
<p>Let&#39;s get started by defining that header. I&#39;m sure D has structs, enums etc. Let&#39;s see:</p>
<pre><code class="language-d">enum LumpId
{
  Entities,
  Shaders,
  // ... blah blah blah ...
  NumLumps,
}

struct BspHeader
{
  uint ident;
  uint _version; // for some reason i can&#39;t have an identifier called `version`?
  Lump lump[NumLumps];
}
</code></pre>
<p>That&#39;s how the formatter decided to print my code. The opening brace is on a new line (&quot;Allman&quot; style).<br>This language is an absolute trash pile, I&#39;m done 🚮<br>Thanks for reading.</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p>Just kidding. It actually gave me a very good suggestion! ...rather, it was an informative <em>error</em>.</p>
<blockquote>
<p>Lump lump[NumLumps];<br>source/app.d(39,7): Error: instead of C-style syntax, use D-style <code>Lump[NumLumps] lump</code></p>
</blockquote>
<p>I don&#39;t hate this so-called &quot;D-style&quot;. It&#39;s not as egregious as Go-style to me. I believe the &quot;Array of T&quot; detail is very much a part of the type, not the identifier.</p>
<ul>
<li>C: <code>Lump lumps[NumLumps];</code> &quot;This variable is of <code>Lump</code> type, I will refer to it as <code>lumps</code> - but actually I have <code>NumLumps</code> of them&quot;</li>
<li>D: <code>Lump[NumLumps] lump;</code> &quot;This variable is of <code>Lump[]</code> type, I have <code>NumLumps</code> of them, and I refer to them as <code>lumps</code>&quot;</li>
<li>Go: <code>Lumps [NumLumps]Lump</code> &quot;I will refer to this as <code>Lumps</code>, which is a list of <code>NumLumps</code> variables of type <code>Lump</code>&quot;</li>
</ul>
<p>After following that suggestion I&#39;m told <code>undefined identifier NumLumps</code>, which is actually awesome and exactly what I wanted to hear; enum identifiers must be qualified!<br>The correct declaration is <code>Lump[LumpId.NumLumps] lump;</code><br>I have always hated the global namespace pollution of enum identifiers in C and C++. At least C++ has &quot;enum classes&quot; as an option to enforce scoping. Tight scoping should just be default behaviour, and avoid prefix stutter where possible (<code>MyFlags.FlagFoo</code> -&gt; <code>MyFlag.Foo</code>).</p>
<p>How do I know what I&#39;ve typed is correct? Do enums behave in a sane manner? I hope they start from 0!<br>My first instinct for something like this is to make it tell me. I should just print it out. Wait, how do I print a formatted string in D?</p>
<pre><code class="language-d">  writefln(&quot;There are %i lumps&quot;, LumpId.NumLumps);
  // or:
  writeln(&quot;There are %i lumps&quot;.format(LumpId.NumLumps));
  // or:
  writeln(string.format(&quot;There are %i lumps&quot;, LumpId.NumLumps));
</code></pre>
<p>😮‍💨 Completely as expected. So far, there is nothing astonishing in how it feels to write D.</p>
<pre><code class="language-sh">$ dub -q
std.format.FormatException@std/format/internal/write.d(340): incompatible format character for integral argument: %i
# ... stack trace here ...
</code></pre>
<p>I&#39;m a little disappointed there was no static analysis / compiler warning on the format specifier being wrong. Perhaps I&#39;ve been spoiled. I also haven&#39;t RTFM after all!<br>I&#39;m going to assume <code>%d</code> is the correct format specifier.</p>
<pre><code class="language-console">$ dub -q
There are 18 lumps
</code></pre>
<p>Cool. Nobody has been messing with the universal constants.</p>
<h2>How to structure a project?</h2>
<p>What about modules, namespaces, etc?<br>Let&#39;s do something simple: move my header definition into <code>parse/header.d</code> and drive it from <code>main.d</code>:</p>
<pre><code class="language-d">// source/main.d
module main;

import parse.header;
import std.stdio;

void main()
{
  writefln(&quot;There are %d lumps&quot;, LumpId.NumLumps);
}
</code></pre>
<pre><code class="language-d">// source/parse/header.d
module parse.header;

enum LumpId
{
  Entities,
  Shaders,
  // ... blah blah blah ...
  NumLumps,
}

// ... blah blah blah ...
</code></pre>
<p>Something feels off here, but maybe it&#39;s just my javascript speaking.<br>Importing a module brings in <em>everything</em> to your top-level namespace, I can simply type <code>LumpId.Entities</code> from my <code>main.d</code>. How could I scope this further?<br>...Future me has come back to answer this; we can use <em>selective imports</em>:</p>
<pre><code class="language-d">import std.stdio : File, writeln;

writeln(&quot;this still works&quot;);
</code></pre>
<p>Alternatively, we can use <em>static imports</em>, and even rename them to something else:</p>
<pre><code class="language-d">static import io = std.stdio;

io.writeln(&quot;this is even easier than std.stdio.writeln!&quot;);
</code></pre>
<p>I think I&#39;m going to prefer static imports, some renamed imports and a sprinkling of selective imports. I usually like qualifying what I mean. The default behaviour of global pollution feels like the anti-pattern of <code>using namespace std</code> in C++ 🤮</p>
<p>By now I&#39;ve gathered my primitive tools and made sure they&#39;re sharp. Let&#39;s start getting serious.</p>
<h2>I put on my robe and wizard hat</h2>
<p>Let&#39;s lay down some goals:</p>
<ul>
<li>Parse commandline arguments so we know which file to read<ul>
<li>This might be trivial, the stdlib has <code>getopt</code> after all 🤔 or I can just start off with positional args</li>
</ul>
</li>
<li>Read the file from disk</li>
<li>Parse the header</li>
<li>Parse the desired lump<ul>
<li>What does memory allocation look like? Should I...not care until I have to?</li>
</ul>
</li>
<li>Serialise the data as JSONL<ul>
<li>We need to pick a JSON library - unless it&#39;s built in? (spoiler alert: it is 🤩)</li>
</ul>
</li>
</ul>
<p>That seems simple. Our control flow is as follows:</p>
<pre><code class="language-d">void main(string[] args)
{
  // parse commandline arguments so we know which file to read
  if (args.length &lt; 2)
  {
    throw new Error(&quot;usage: %s &lt;filename&gt; &lt;lump name&gt;&quot;.format(args[0]));
  }
  const string inputFilename = args[1];
  const string desiredLump = args[2];

  // read the file from disk
  auto f = File(inputFilename, &quot;rb&quot;);

  // parse the header
  BspHeader header = parse.header.read(f);

  // parse the lump(s) and serialise as JSONL
  switch (desiredLump)
  {
  case &quot;entities&quot;, &quot;ents&quot;:
    auto entities = parse.entities.read(f, &amp;header);
    entities.serialise;
    break;
  case &quot;shaders&quot;:
    auto shaders = parse.shaders.read(f, &amp;header);
    shaders.serialise;
    break;
  default:
    throw new UnsupportedLumpException(&quot;unsupported lump &#39;%s&#39;&quot;.format(desiredLump));
    break;
  }

  f.close;
}
</code></pre>
<p>This is probably gonna change a bit over time, I&#39;ll link the end result at the bottom.</p>
<p>Rather than describing my code as I&#39;m writing it line by line, I&#39;m just going to start writing it off-screen and summarise the best/worst parts of the language as I come across them.</p>
<h2>Some nice language features</h2>
<h3>Type aliases</h3>
<p>Type aliasing (think <code>typedef</code>, <code>using</code>) is so intuitive I didn&#39;t have to look it up:</p>
<pre><code class="language-d">alias FooStr = string;
</code></pre>
<h3>Uniform Function Call Syntax and extending types</h3>
<p>What if we wanted to define a function that&#39;s directly applicable to an array of <code>FooStr</code>, effectively extending two built-in types (<code>string</code>, <code>[]</code>)?<br>UFCS (uniform function call syntax) to the rescue! UFCS essentially means <code>foo.bar(baz)</code> is the same as <code>bar(foo, baz)</code>. It&#39;s syntactic sugar to pass the receiver as the first argument.<br>So we can define the following:</p>
<pre><code class="language-d">void magic(FooStr[] foos)
{
  foos.map!(retro) // retro from std.range, map+each from std.algorithm
    .each!(stdio.writeln);
}

void main(string[] args)
{
  FooStr[] foos = [&quot;hello&quot;, &quot;there&quot;, &quot;world&quot;]; // this has an implicit cast from string -&gt; FooStr
  foos.magic();
  /* outputs:
    olleh
    ereht
    dlrow
  */

  // we can also call it directly, since `string` can be safely cast to `FooStr`
  [&quot;foo&quot;, &quot;bar&quot;].magic();

  // it&#39;s also the reason we can call `format` directly on a string literal
  writefln(&quot;i have %d apples&quot;, 42); // i have 42 apples
}
</code></pre>
<p>It&#39;s a bit like the colon operator for table functions in Lua:</p>
<pre><code class="language-lua">-- the implicit first argument is the `self`
function Account:withdraw(v)
  self.balance = self.balance - v
end
local acc = Account
acc.withdraw(acc, 100.00) -- this is OK
acc:withdraw(100.00) -- this is the same thing, `:` will pass the receiver as the first argument (i.e. self)
</code></pre>
<p>This also works for primitive types (bonus example of chaining):</p>
<pre><code class="language-d">int squared(int v)
{
  return v * v;
}

void main(string[] args)
{
  writeln(16.squared().squared()); // 65536
}
</code></pre>
<h3>Arrow functions</h3>
<p>Another feature where I just wrote some code and <em>it worked</em>. The spec calls this a ShortenedFunctionBody.</p>
<pre><code class="language-d">int squared(int v) =&gt; v * v;
</code></pre>
<p>Seems you can also define these in the middle of a function, but you have to call it explicitly. I can&#39;t get the UFCS shortcut to work.</p>
<p>Here&#39;s a pretty FP-style usage from the spec:</p>
<pre><code class="language-d">stdin.byLine(KeepTerminator.yes)
  .map!(a =&gt; a.idup)
  .array
  .copy(stdout.lockingTextWriter());
</code></pre>
<h3>Optional parenthesis</h3>
<p>I think this only works when there are no parameters?</p>
<pre><code class="language-d">auto f = File(&quot;foo.bin&quot;, &quot;rb&quot;);
f.readRaw(myFoo);
f.close; // &lt;-- this is allowed
</code></pre>
<p>Combine optional parens, arrow functions and UFCS to get the following:</p>
<pre><code class="language-d">int squared(int v) =&gt; v * v;
writefln(&quot;IT&#39;S OVER %d&quot;, 16.squared.squared);
</code></pre>
<h3>CTFE - Compile Time Function Execution</h3>
<p>Did I mention that all of the above <code>squared</code> examples might be executed at <em>compile</em> time?<br>This is like C++ <code>constexpr</code> on steroids, automatically! Who doesn&#39;t love compiler optimisations for free?<br>Rule of thumb: if it&#39;s a pure function with a static lvalue, it&#39;s probably CTFE&#39;d. If it&#39;s not pure, executions that don&#39;t follow the impure path are still CTFE-able.<br><a href="https://dlang.org/spec/function.html#interpretation">See more</a></p>
<h3>Pass by value, *pointer or &amp;reference? who-&gt;cares</h3>
<p>There&#39;s a bit of churn in C and C++ when dealing with structs passed by value, pointer or reference. Is it <code>foo.bar</code> or <code>foo-&gt;bar</code>?<br>It doesn&#39;t matter in D. It&#39;s always <code>foo.bar</code>. It <em>just knows</em> what you want. If you decide to pass by pointer instead of value later on, you don&#39;t have to tweak all your references.<br>These differences are fairly insignificant in the grand scheme, but the less friction over time, the more stamina and happiness you&#39;ll have when writing code. Don&#39;t fight a thousand small battles over fine details that should never have mattered. Just. Write. Code. This is the real blessing of D, and I hope to continue experiencing these refreshing breaths.</p>
<h3>foreach loops</h3>
<p>These are just nice. Slightly novel syntax, types are inferred for range-based foreach loops. Less clunky than the C++ counterparts.</p>
<pre><code class="language-d">  for (uint index = 0; index &lt; length; index++) {} // ol&#39; trusty
  foreach (index; 0 .. length) {} // range: numeric
  foreach (element; myArray) {} // range: array iterator
</code></pre>
<h3>Type inference</h3>
<p>Not having to specify the types for your range iterators is nice, but that&#39;s not the only place types can be inferred!</p>
<pre><code class="language-d">const MAX_QPATH = 64u; // no type specified, but it is inferred to be a uint

// _whatever_ File gives us is fine
auto f = File(inputFilename, &quot;rb&quot;);

// even function return types!
auto serialise(Item[] items) =&gt; items
  .map!(e =&gt; e.toJson.toString)
  .join(&quot;\n&quot;);
</code></pre>
<h3>Standard Library</h3>
<p>This used to be a hot topic in D a few years back. The SparkNotes version is that in the days of D1, there was the standard library called Phobos (aptly named after the largest moon of Mars - oh yeah, D is championed by <a href="https://www.digitalmars.com/">Digital Mars</a>). The community wanted MOAR so they kinda just added it in the form of complimentary libraries. One of these (Tango) got pretty popular and was affectionately referred to as the second standard library. It&#39;s a bit like Boost for C++.<br>As of D2, Phobos is a pretty mature library, and the language isn&#39;t going through as many breaking changes.<br>That typical thing you&#39;re trying to do? It&#39;s probably in the (Phobos) stdlib.<br>That piece of C&#39;s stdlib you&#39;re so familiar? Oh yeah, you can just reach into that too (<code>import core.stdc.string : strtok;</code>)</p>
<h3>Unit Testing</h3>
<p>Extremely first-class unit testing!<br>It&#39;s not uncommon to see unit tests immediately following the implementation:</p>
<pre><code class="language-d">int foo(string bar)
{
  /* ... */
}

unittest
{
  assert(foo(&quot;hello&quot;) == 42, &quot;fooing a hello was not a big happy&quot;);
}
</code></pre>
<p>And you can run it like <code>dub test</code>, which is roughly equivalent to <code>dub build -b unittest &amp;&amp; ./my_program</code>.<br>Who doesn&#39;t love some plain old asserts? No convoluted DSL or 5 new libraries to learn just to write some adequate tests. Now you have an awesome place to put those asserts, and you can <em>really</em> do some TDD right next to the implementation if that&#39;s your jam.<br>There&#39;s also built-in code coverage via <code>dub -b cov</code> and <code>dub -b unittest-cov</code>, which integrated nicely into VSCode (bonus points for <code>profile</code> and <code>profile-gc</code> build types too 👌)</p>
<p>Here&#39;s a dead simple example of table-based testing I ended up using for entity serialisation:</p>
<pre><code class="language-d">string serialise(Entity[] entities) =&gt; entities
  .map!(e =&gt; json.JSONValue(e).toString(json.JSONOptions.doNotEscapeSlashes))
  .join(&quot;\n&quot;);

unittest
{
  struct TestCase
  {
    Entity[] entities;
    string result;
  }

  TestCase[] testCases = [
    {entities: [], result: &quot;&quot;},
    {entities: [[&quot;key&quot;: &quot;value&quot;]], result: &quot;{\&quot;key\&quot;:\&quot;value\&quot;}&quot;},
    {entities: [[&quot;key&quot;: &quot;value&quot;], [&quot;key&quot;: &quot;value&quot;]], result: &quot;{\&quot;key\&quot;:\&quot;value\&quot;}\n{\&quot;key\&quot;:\&quot;value\&quot;}&quot;},
  ];
  foreach (testCase; testCases)
  {
    auto serialised = serialise(testCase.entities);
    assert(serialised == testCase.expected,
      &quot;`%s` should serialise correctly, got: `%s`, expected `%s`&quot;.format(
        testCase.entities, serialised, testCase.expected));
  }
}

// after intentionally breaking one of the cases:
// core.exception.AssertError@source/parse/entities.d(137): `[[&quot;keay&quot;:&quot;value&quot;]]` should serialise correctly, got: `{&quot;keay&quot;:&quot;value&quot;}`, expected `{&quot;key&quot;:&quot;value&quot;}`
</code></pre>
<h3>Breaking out of multiple loops</h3>
<p>Pretty simple, but nice to have when you need it.</p>
<pre><code class="language-d">outer: for (size_t i = 0; i &lt; input.length; i++)
{
  // ... doing some stuff ...

  while (looksGood(i))
  {
    if (input[i] == theBadThing)
    {
      break outer;
    }
  }
}
</code></pre>
<h3>Voldemort Types</h3>
<p>This gets an honourable mention just for the name 😆</p>
<pre><code class="language-d">auto createDarkLord() {
  struct Voldemort {
    string whoAmI() const {
      return &quot;He who must not be named&quot;;
    }
  }

  return Voldemort();
}

const auto youKnowWho = createDarkLord();
// youKnowWho is He who must not be named of type const(main.createDarkLord().Voldemort)
stdio.writefln(&quot;youKnowWho is %s of type %s&quot;, youKnowWho.whoAmI(), typeid(youKnowWho));
</code></pre>
<p>There&#39;s actually no way to refer to the <code>Voldemort</code> type, we can only use type inference from the factory function.</p>
<h2>Some un-nice language features</h2>
<h3><code>string</code> is quite literally a string of bytes</h3>
<p>Strings are a bit cooked. It seems this is the case in a lot of modern languages that hide the nastiness of C (or pascal) strings behind a facade and try to present this nicely abstracted concept of &quot;a range of text&quot;, but still try to reap the benefits of being &quot;low level&quot;. Go is no exception here.<br>The file format I&#39;m parsing has an array of structs stored <em>in binary</em>. A string of 64 chars followed by 2 integers per element. Strong emphasis on &quot;<em>in binary</em>&quot;.<br>This means the string <code>&quot;foo&quot;</code> is 3 characters (<code>[ &#39;f&#39;, &#39;o&#39;, &#39;o&#39; ]</code>) followed by 61 null bytes. If I parse that out into a struct with <code>File.readRaw</code>, then assign it to my nicely abstracted <code>string</code> variable like <code>myStr = myBytes.idup</code>, I end up with: <code>foo\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000</code>.<br>...but of course, you have to call <code>.fromStringz</code> to parse a null-terminated string from an array of bytes. <em>Obviously!</em> Also, the <code>.idup</code> is there to make an immutable copy of the bytes. You&#39;ll see a lot of <code>idup</code> thrown around the place.</p>
<p>It&#39;s no better in Go. We don&#39;t have a built-in <code>.fromStringz</code> there, we have to do something ridiculous like this ourselves:</p>
<pre><code class="language-go">func CToGoString(b []byte) string {
  i := bytes.IndexByte(b, 0) // find the first null byte
  if i &lt; 0 {
    i = len(b)
  }
  return string(b[:i])
}

myBytes := []byte(&quot;foo\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00&quot;)
fmt.Println(&quot;c-string len: &quot;, len(CToGoString(myBytes[:]))) // 3
fmt.Println(&quot;gostring len: &quot;, len(string(myBytes[:]))) // 15
</code></pre>
<h3>Dynamic array appending is strange</h3>
<p>Thought you could write <code>myArray.append(42);</code> or <code>myArray += 42</code>? Nah. Actually you want to do <code>myArray ~= 42;</code>. Wat?<br>The docs weren&#39;t 100% clear on this either, I didn&#39;t trust it until I tried it.</p>
<h3>You can&#39;t name a function the same as the top-level module it&#39;s in</h3>
<p>...if you&#39;re importing another module from the same top-level module.</p>
<pre><code class="language-d">// parse/header.d
module parse.header;

// ...
</code></pre>
<pre><code class="language-d">// parse/entities.d
module parse.entities;

import parse.header; // &lt;-- this is the catalyst for the following error

alias Entity = string[string];
alias EntityString = byte[];

static Entity[] parse(EntityString bytes) // function `parse.entities.parse` conflicts with import `parse.entities.parse` at source/parse/entities.d(8,8)
{
  // ...
}

static Entity[] parseEntities(EntityString bytes) // this works fine, but introduces stutter
{
  // ...
}
</code></pre>
<h3>std.json default options</h3>
<p>Pop quiz. How would you serialise a(n object containing a) string as JSON?<br>Perhaps you&#39;d write the following:</p>
<pre><code class="language-d">auto foo = &quot;/path/to/foo&quot;;
stdio.writeln(foo.JSONValue.toString); // surely this prints `&quot;/path/to/foo&quot;`?
</code></pre>
<p>But you&#39;d be wrong. I mean it would work, and even be spec compliant. But you&#39;d get <code>&quot;\/path\/to\/foo&quot;</code> instead.<br>What you <em>actually</em> intended was:</p>
<pre><code class="language-d">stdio.writeln(foo.JSONValue.toString(JSONOptions.doNotEscapeSlashes));
</code></pre>
<p>Some absolute madman decided the <em>default</em> for serialising a string as JSON should <em>escape the quotes</em>. Whyyyyyyyy 😩<br>Okay it&#39;s not the end of the world...but...whyyyyyy! We&#39;re <em>probably not</em> injecting this straight into an XML body in the majority of cases. Even the de facto reference implementation in JS doesn&#39;t <em>default</em> to escaping quotes.</p>
<h2>End Result</h2>
<p>You can find the result of my little hackathon on my Github: <a href="https://github.com/Razish/bsputil-d">Razish/bsputil-d</a>.<br>I highly recommend having a read through the code to see how I&#39;ve managed to do things.<br>If you want to play around with it, you can source a community-made BSP file from <a href="https://jkhub.org/files/category/13-free-for-all/">this section</a> - unzip the downloaded PK3 file.</p>
<h2>Final thoughts</h2>
<p>Wow. That was an interesting experience. I mostly really enjoyed writing D. Sure there are some slightly painful things, but nothing that was truly inherent to D or that couldn&#39;t be overcome with the slightest bit of perseverance. Writing and debugging a somewhat flexible tokeniser/scanner was something I hadn&#39;t done in a while, and I managed to pull it off somewhat neatly using slices of an immutable buffer in a new (to me) language. I wouldn&#39;t have minded having something like Go&#39;s test.Scanner handy though.<br>It was fairly easy to intuit how I should be structuring things, naming things, etc and the tools are very helpful to guide you along the path if you stray too much. I didn&#39;t feel like I was <em>fighting against</em> the tooling.</p>
<p>There&#39;s a lot to the D landscape that I haven&#39;t explored yet. I&#39;m keen to go through the DLang tour next and learn more about this language.<br>Overall, I honestly felt more comfortable writing D than writing Go, and it felt equally (if not more) powerful, expressive, handy and featureful. I think there&#39;s a lot of room for D to shine in areas like tools programming. I haven&#39;t personally assessed the performance, but it seems completely adequate for anything but HPC. You can also run in a <a href="https://dlang.org/blog/2017/06/16/life-in-the-fast-lane/">non-GC mode</a> if you&#39;re concerned about that.<br>I&#39;m very keen to explore the C(++) interop more, since I still work a lot with C(++) code and it&#39;s not that big a leap.</p>
<p>I said I wanted to evaluate &quot;how easy is this to just pick up and hit the ground running&quot; - I think it was very easy. I was able to guess most of the syntax, features, structure. The tooling (compiler:ldc, linter:dscanner, build tool:dub) told me a lot with very good errors/warnings (much less convoluted than C++, much more detailed than JS). Everything else was immediately discoverable by searching <code>dlang the thing</code> and <a href="https://dlang.org/phobos/index.html">R-ing The FM</a>.<br>It might not be good as someone&#39;s <em>first</em> language to learn, but anyone looking to pick up a second or third language (perhaps one that is low(er) level) and is even slightly put off by C++ should absolutely give D a shot.</p>
<h2>Future Work</h2>
<p>Now that I&#39;ve given it an honest go as a complete novice, I want to spent some more time going through the DLang tour and learn the more magical parts of the language. I&#39;m sure I&#39;ve skipped over some incredibly useful features - which is <em>amazing</em>, because I was still able to be productive and write correct code with minimal friction. It&#39;s exciting to think how much better it could be after spending the time to really learn the language. I think I might give templates a real chance - as someone who mostly avoids C++ template hell, too much STL or ever using Boost.</p>
<p>I might pick up another modern-ish language and run it through a similar gauntlet. Probably a different task, I&#39;m already sick of this one 😆<br>I&#39;m thinking something like Nim, Crystal, Rust, Zig or Racket (lol). Guess I&#39;ll just roll a dice!</p>
<p>Stay tuned for more insane rants where I do bad things incorrectly maybe? 😇</p>
