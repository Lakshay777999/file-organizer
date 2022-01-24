

const fs=require('fs');
const path = require('path');


let input = process.argv.slice(2)

let inputArr = input

let command = inputArr[0];

let types = {
    media: ["mp4", "mkv", "mp3"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: [
      "docx",
      "doc",
      "pdf",
      "xlsx",
      "xls",
      "odt",
      "ods",
      "odp",
      "odg",
      "odf",
      "txt",
      "ps",
      "tex",
    ],
    app: ["exe", "dmg", "pkg", "deb"],
  };
  

switch(command){
       case 'tree':
              treefn(inputArr[1])
              break
       case 'organize':
        organizeFn(inputArr[1])
              break
       case 'help':
              console.log('Help Implemented')
              break
       default :
        console.log('Please enter a Valid command')
        break;
}
function organizeFn(dirpath)
{
    let destf;
    
    if(dirpath==undefined)
    {
        console.log("Please enter a valid dir path");
        return;
    }
    let doesex=fs.existsSync(dirpath);
    if(doesex==true)
    {
        destf=path.join(dirpath,'organized path');
        if(fs.existsSync(destf)==false)
        {
            fs.mkdirSync(destf);
        }
        else
        {
            console.log("already exist");
        }
        organizerhelper(dirpath,destf);

    }
    function organizerhelper(src , dest){
        let childNames = fs.readdirSync(src)
        //console.log(childNames)
   
      for(let i=0 ; i<childNames.length;i++){
            let childAddress = path.join(src , childNames[i])
            let isFile = fs.lstatSync(childAddress).isFile()
   
            if(isFile==true){
              let category=getcategory(childNames[i]);
              sendFiles(childAddress , dest , category)
            }
      }
    }
    function getcategory(childAddress)
    {
        let ext=path.extname(childAddress).slice(1);
        for (let key in types) {
          let cTypeArr = types[key];
          // we took out all the Category type Arrays here
          //console.log(cTypeArr)
      
          for (let i = 0; i < cTypeArr.length; i++) {
            if (ext == cTypeArr[i]) {
              return key;
            }
          }
        }
      
        return "others";
    }

   

    
}
function sendFiles(srcFilePath , dest , fileCategory){
  // we will create path for each category type encountered to create folders of their names
     let catPath = path.join(dest , fileCategory)

      //D:\FJP4\test folder\organized_files\media
      //D:\FJP4 \test folder\organized_files\documents


     if(fs.existsSync(catPath)==false){
       fs.mkdirSync(catPath)
     }


     let fileName = path.basename(srcFilePath)

     // we took out the basename of all the files

     let destFilePath = path.join(catPath , fileName)


     fs.copyFileSync(srcFilePath , destFilePath)

     fs.unlinkSync(srcFilePath)


     console.log('Files Organized')



 
}

function treefn(dirpath)
{
  if(dirpath==undefined)
  {
    console.log("Please enter file path");
    return;
  }
  else
  {
    let doesexis=fs.existsSync(dirpath);
    if(doesexis==true)
    {
      treehelper(dirpath,"")
    }
  }


}
function treehelper(targetpath,intend)
{
  let isFile=fs.lstatSync(targetpath).isFile();

  if(isFile==true)
  {
    let fileName=path.basename(targetpath);
    console.log(intend+" ├──"+fileName);
  }
  else
  {
    let foldername=path.basename(targetpath);
    console.log(intend+"└──"+foldername);
    let children=fs.readdirSync(targetpath);
    for(let i=0;i<children.length;i++)
    {
      let nestedpath=path.join(targetpath,children[i])
      treehelper(nestedpath,intend+"\t");
    }
   
  }
}