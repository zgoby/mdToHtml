const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

class MainGenerator {
  firstLevelDir=[];
  dirs = {};
  mdContent = '';
  constructor(floder) {
    this.floder=floder
  }

  directoryParse() {
    try{
      const temFirst = fs.readdirSync(this.floder);
      // firstLevelTitle = temFirst.sort((a, b)=>{
      //   if(parseInt(a)>=parseInt(b)) return 1;
      //   else return -1;
      // });
      this.firstLevelDir=this.pathFormat(temFirst);
      temFirst.forEach((item, index)=>{
        const secondaryDir = fs.readdirSync(path.join(this.floder,item))
        this.dirs[this.firstLevelDir[index]] = this.pathFormat(secondaryDir, true);
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

  toNavs(firstLevelDir, dirs) {
    console.log(this.dirs)
  }

  _generateHtmlWithMd(dirs) {
    
  }

  _generateTemplate(template) {
    this.templateHtml = fs.readFileSync(path.join("template", template, 'index.html')).toString();
  }

  toContents(template) {
    this._generateTemplate(template);
    const html = ejs.render(this.templateHtml, {
      title: 'aaaaa',
      dirs: this.dirs,
      firstLevelDir: this.firstLevelDir,
      active: this.firstLevelDir[0],
      mdContent: this.mdContent,
    });
    console.log(html);
  }

  toHome(params) {
  
  }
}

module.exports = MainGenerator;