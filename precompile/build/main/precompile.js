"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const front_matter_1 = __importDefault(require("front-matter"));
const marked_1 = require("marked");
const moment_1 = __importDefault(require("moment"));
class Config {
    constructor(
    /**
     * The parent directory in which the content lives.
     * This directory should be of the form:
     * <sourceDir>/<contentType>/<contentFile>
     * For example, <sourceDir>/posts/MyPost.html
     */
    sourceDir, 
    /**
     * The output directory where precompiled content will be placed.
     */
    targetDir) {
        this.sourceDir = sourceDir;
        this.targetDir = targetDir;
    }
    sourceContentDir(contentType) {
        return `${this.sourceDir}/${contentType}`;
    }
}
class Post {
    constructor(file, title, date, tags, content) {
        this.file = file;
        this.title = title;
        this.date = date;
        this.tags = tags;
        this.content = content;
    }
    toSummary() {
        return { path: this.file, title: this.title, tags: this.tags, date: this.date.format() };
    }
}
class Precompiler {
    constructor(config) {
        this.config = config;
    }
    async run() {
        const contentTypes = await fs.readdir(config.sourceDir);
        for (const contentType of contentTypes) {
            await this.precompileContentType(contentType);
        }
    }
    async precompileContentType(contentType) {
        const contents = await this.loadContents(contentType);
        for (const p of contents) {
            await this.writeContent(p);
        }
        await this.writeManifest(contentType, contents);
    }
    async loadContents(contentType) {
        const files = await fs.readdir(config.sourceContentDir(contentType));
        const out = [];
        for (const file of files) {
            out.push(await this.parseContent(`${config.sourceContentDir(contentType)}/${file}`));
        }
        return out;
    }
    async writeContent(post) {
        const fullPath = `${config.targetDir}/${post.file}`;
        const directory = node_path_1.default.dirname(fullPath);
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
    generateContent(post) {
        const suffix = post.file.split('.').pop();
        if ((suffix || '').toLowerCase() === 'md') {
            return marked_1.marked.parse(post.content);
        }
        return post.content;
    }
    async writeManifest(contentType, posts) {
        const index = posts
            .sort((a, b) => b.date.valueOf() - a.date.valueOf()) //descending order by date
            .map(p => p.toSummary());
        const outPath = `${config.targetDir}/${config.sourceDir}/${contentType}.json`;
        await fs.writeFile(outPath, JSON.stringify(index));
        console.log('  Manifest: ', outPath);
    }
    async parseContent(path) {
        const content = await fs.readFile(path);
        const parsed = (0, front_matter_1.default)(content.toString());
        const time = (0, moment_1.default)(parsed.attributes.date);
        const tags = (parsed.attributes.tags || '').split(',').map((s) => s.replace(/ /g, ''));
        return new Post(path, parsed.attributes.title, time, tags, parsed.body);
    }
}
console.log('Precompiling');
const config = new Config('content', 'public');
new Precompiler(config).run().catch(reason => {
    console.log(reason);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBdUM7QUFDdkMsMERBQTZCO0FBQzdCLGdFQUE4QjtBQUM5QixtQ0FBZ0M7QUFDaEMsb0RBQTZDO0FBRTdDLE1BQU0sTUFBTTtJQUNWO0lBQ0U7Ozs7O09BS0c7SUFDSSxTQUFpQjtJQUV4Qjs7T0FFRztJQUNJLFNBQWlCO1FBTGpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFLakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUN2QixDQUFDO0lBRUosZ0JBQWdCLENBQUMsV0FBbUI7UUFDbEMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksV0FBVyxFQUFFLENBQUM7SUFDNUMsQ0FBQztDQUNGO0FBUUQsTUFBTSxJQUFJO0lBQ1IsWUFDUyxJQUFZLEVBQ1osS0FBYSxFQUNiLElBQVksRUFDWixJQUFjLEVBQ2QsT0FBZTtRQUpmLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQVU7UUFDZCxZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQ3JCLENBQUM7SUFFSixTQUFTO1FBQ1AsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFDM0YsQ0FBQztDQUNGO0FBRUQsTUFBTSxXQUFXO0lBQ2YsWUFBbUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDO0lBRXJDLEtBQUssQ0FBQyxHQUFH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