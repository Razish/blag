import * as fs from 'node:fs/promises';
import path from 'node:path';
import fm from 'front-matter';
import { marked } from 'marked';
import moment, { type Moment } from 'moment';

class Config {
  constructor(
    /**
     * The parent directory in which the content lives.
     * This directory should be of the form:
     * <sourceDir>/<contentType>/<contentFile>
     * For example, <sourceDir>/posts/MyPost.html
     */
    public sourceDir: string,

    /**
     * The output directory where precompiled content will be placed.
     */
    public targetDir: string
  ) {}

  sourceContentDir(contentType: string) {
    return `${this.sourceDir}/${contentType}`;
  }
}

type RawAttributes = {
  title: string;
  date: string;
  tags: string;
};

class Post {
  constructor(
    public file: string,
    public title: string,
    public date: Moment,
    public tags: string[],
    public content: string
  ) {}

  toSummary() {
    return { path: this.file, title: this.title, tags: this.tags, date: this.date.format() };
  }
}

class Precompiler {
  constructor(public config: Config) {}

  async run() {
    const contentTypes = await fs.readdir(config.sourceDir);
    for (const contentType of contentTypes) {
      await this.precompileContentType(contentType);
    }
  }

  async precompileContentType(contentType: string) {
    const contents = await this.loadContents(contentType);
    for (const p of contents) {
      await this.writeContent(p);
    }
    await this.writeManifest(contentType, contents);
  }

  async loadContents(contentType: string): Promise<Array<Post>> {
    const files = await fs.readdir(config.sourceContentDir(contentType));
    const out: Post[] = [];
    for (const file of files) {
      out.push(await this.parseContent(`${config.sourceContentDir(contentType)}/${file}`));
    }
    return out;
  }

  async writeContent(post: Post): Promise<void> {
    const fullPath = `${config.targetDir}/${post.file}`;
    const directory = path.dirname(fullPath);
    const transformedContent = await this.generateContent(post);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, transformedContent);

    console.log(' ', fullPath);
  }

  /**
   * Generates the final content for this post.
   * - if markdown, transforms into HTML.
   * - otherwise, assumes HTML.
   */
  generateContent(post: Post): string | Promise<string> {
    const suffix = post.file.split('.').pop();
    if ((suffix || '').toLowerCase() === 'md') {
      return marked.parse(post.content);
    }
    return post.content;
  }

  async writeManifest(contentType: string, posts: Array<Post>) {
    const index = posts
      .sort((a, b) => b.date.valueOf() - a.date.valueOf()) //descending order by date
      .map(p => p.toSummary());

    const outPath = `${config.targetDir}/${config.sourceDir}/${contentType}.json`;

    await fs.writeFile(outPath, JSON.stringify(index));

    console.log('  Manifest: ', outPath);
  }

  async parseContent(path: string): Promise<Post> {
    const content = await fs.readFile(path);
    const parsed = fm<RawAttributes>(content.toString());
    const time = moment(parsed.attributes.date);
    const tags = (parsed.attributes.tags || '').split(',').map((s: string) => s.replace(/ /g, ''));
    return new Post(path, parsed.attributes.title, time, tags, parsed.body);
  }
}

console.log('Precompiling');

const config = new Config('content', 'public');

new Precompiler(config).run().catch(reason => {
  console.log(reason);
  process.exit(1);
});
