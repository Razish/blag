"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const front_matter_1 = __importDefault(require("front-matter"));
const moment_1 = __importDefault(require("moment"));
const marked_1 = __importDefault(require("marked"));
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
        return this.sourceDir + '/' + contentType;
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
        let contentTypes = await util_1.promisify(fs.readdir)(config.sourceDir);
        for (const contentType of contentTypes) {
            await this.precompileContentType(contentType);
        }
    }
    async precompileContentType(contentType) {
        let contents = await this.loadContents(contentType);
        for (const p of contents) {
            await this.writeContent(p);
        }
        await this.writeManifest(contentType, contents);
    }
    async loadContents(contentType) {
        let files = await util_1.promisify(fs.readdir)(config.sourceContentDir(contentType));
        let out = [];
        for (let file of files) {
            out.push(await this.parseContent(config.sourceContentDir(contentType) + '/' + file));
        }
        return out;
    }
    async writeContent(post) {
        const fullPath = `${config.targetDir}/${post.file}`;
        const directory = path_1.default.dirname(fullPath);
        const transformedContent = this.generateContent(post);
        await util_1.promisify(fs.mkdir)(directory, { recursive: true });
        await util_1.promisify(fs.writeFile)(fullPath, transformedContent);
        console.log(' ', fullPath);
    }
    /**
     * Generates the final content for this post.
     * - if markdown, transforms into HTML.
     * - otherwise, assumes HTML.
     */
    generateContent(post) {
        const suffix = post.file.split('.').pop();
        if ((suffix || '').toLowerCase() == 'md') {
            return marked_1.default(post.content);
        }
        else {
            return post.content;
        }
    }
    async writeManifest(contentType, posts) {
        let index = posts
            .sort((a, b) => b.date.valueOf() - a.date.valueOf()) //descending order by date
            .map(p => p.toSummary());
        let outPath = `${config.targetDir}/${config.sourceDir}/${contentType}.json`;
        await util_1.promisify(fs.writeFile)(outPath, JSON.stringify(index));
        console.log('  Manifest: ', outPath);
    }
    async parseContent(path) {
        let content = await util_1.promisify(fs.readFile)(path);
        let parsed = front_matter_1.default(content.toString());
        let time = moment_1.default(parsed.attributes.date);
        let tags = (parsed.attributes.tags || '').split(',').map((s) => s.replace(/ /g, ''));
        return new Post(path, parsed.attributes.title, time, tags, parsed.body);
    }
}
console.log('Precompiling');
let config = new Config('content', 'public');
new Precompiler(config).run().catch(reason => {
    console.log(reason);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUF5QjtBQUN6QixnREFBd0I7QUFDeEIsK0JBQWlDO0FBQ2pDLGdFQUE4QjtBQUM5QixvREFBd0M7QUFDeEMsb0RBQTRCO0FBRTVCLE1BQU0sTUFBTTtJQUNWO0lBQ0U7Ozs7O09BS0c7SUFDSSxTQUFpQjtJQUV4Qjs7T0FFRztJQUNJLFNBQWlCO1FBTGpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFLakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUN2QixDQUFDO0lBRUosZ0JBQWdCLENBQUMsV0FBbUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUM7SUFDNUMsQ0FBQztDQUNGO0FBRUQsTUFBTSxJQUFJO0lBQ1IsWUFDUyxJQUFZLEVBQ1osS0FBYSxFQUNiLElBQVksRUFDWixJQUFjLEVBQ2QsT0FBZTtRQUpmLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQVU7UUFDZCxZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQ3JCLENBQUM7SUFFSixTQUFTO1FBQ1AsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFDM0YsQ0FBQztDQUNGO0FBRUQsTUFBTSxXQUFXO0lBQ2YsWUFBbUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDO0lBRXJDLEtBQUssQ0FBQyxHQUFHO1FBQ1AsSUFBSSxZQUFZLEdBQUcsTUFBTSxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsS0FBSyxNQUFNLFdBQVcsSUFBSSxZQUFZLEVBQUU7WUFDdEMsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQW1CO1FBQzdDLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLFFBQVEsRUFBRTtZQUN4QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7UUFDRCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQW1CO1FBQ3BDLElBQUksS0FBSyxHQUFHLE1BQU0sZ0JBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUN0RjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBVTtRQUMzQixNQUFNLFFBQVEsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BELE1BQU0sU0FBUyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRELE1BQU0sZ0JBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUQsTUFBTSxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUU1RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGVBQWUsQ0FBQyxJQUFVO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ3hDLE9BQU8sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQW1CLEVBQUUsS0FBa0I7UUFDekQsSUFBSSxLQUFLLEdBQUcsS0FBSzthQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLDBCQUEwQjthQUM5RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzQixJQUFJLE9BQU8sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxXQUFXLE9BQU8sQ0FBQztRQUU1RSxNQUFNLGdCQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBWTtRQUM3QixJQUFJLE9BQU8sR0FBRyxNQUFNLGdCQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksTUFBTSxHQUFHLHNCQUFFLENBQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBQ0Y7QUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTVCLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUU3QyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIn0=