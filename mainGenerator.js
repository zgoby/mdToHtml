const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const showdown = require('showdown'),converter = new showdown.Converter();

class MainGenerator {
  firstLevelDir=[];
  dirs = {};
  mdContent = '';
  template;
  bookName;
  output;
  constructor({folder, bookName, template, output}) {
    this.folder=folder;
    this.bookName=bookName;
    this.template=template;
    this.output=output;
  }

  directoryParse() {
    try{
      const temFirst = fs.readdirSync(this.folder);
      // firstLevelTitle = temFirst.sort((a, b)=>{
      //   if(parseInt(a)>=parseInt(b)) return 1;
      //   else return -1;
      // });
      this.firstLevelDir=this.pathFormat(temFirst);
      temFirst.forEach((item, index)=>{
        const secondaryDir = fs.readdirSync(path.join(this.folder,item))
        this.dirs[this.firstLevelDir[index]] = {
          title: this.pathFormat(secondaryDir, true),
          originalDir: item,
          mdPath: secondaryDir.map(it => path.join(this.folder, item, it)),
        };
      });
    }catch(err) {
      throw err;
    }
  }

  // 使用1.分割
  pathFormat(arr, flag) {
    return arr.map(item=>{
      const index = flag ? path.basename(item,path.extname(item)).indexOf('.') : item.indexOf('.');
      if (index<=0) {
        throw new Error('File and folder name should be started <Num.>')
      }
      return flag ? path.basename(item.slice(index+1), path.extname(item)) : item.slice(index+1);
    });
  }

  get() {
    return { dirs: this.dirs, firstLevelDirs: this.firstLevelDir };
  }

  generateHtmlWithMd(md) {
    return converter.makeHtml(md);
  }

  generateTemplate() {
    this.templateHtml = fs.readFileSync(path.join(__dirname, "template", this.template, 'index.html')).toString();
  }

  build() {
    this.generateTemplate();
    this.firstLevelDir.forEach((item)=>{
      const dirsItem = this.dirs[item];
      dirsItem.mdPath.forEach((it, index)=>{
        const mdBuf = fs.readFileSync(it);
        const html = ejs.render(this.templateHtml, {
          title: 'aaaaa',
          dirs: this.dirs,
          firstLevelDir: this.firstLevelDir,
          active: item,
          mdContent: this.generateHtmlWithMd(mdBuf.toString()),
        });
        // m目录待确定
        // console.log(path.join('./builds/', item, dirsItem.title[index]+'.md'));
        
        const writeS = fs.createWriteStream(path.join(__dirname, this.output, item, dirsItem.title[index]+'.html'), 'utf8');
        writeS.write(html)
      })
    });
  }
}

module.exports = MainGenerator;