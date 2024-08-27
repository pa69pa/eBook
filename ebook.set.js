/** Additional script for elements from ebook.set.html
load at ebook.html/fetchSet() */
function dig3(){
 dig.opt=document.createElement('option');dig.opt.value=0;dig.opt.idTag=0;dig.opt.textContent=dt.w.ot;
 dig.sel.onchange=(e)=>{car(e.target,e.target.selectedOptions[0].idTag==0,'diasel')}
}
//** ******************** Interface Values ************************ */
let av={};//array for setValues() theme elements stored into DB
av.l=document.getElementById('l');
av.w=document.getElementById('w');
av.c=document.getElementById('c');
av.b=document.getElementById('b');
av.l.name=av.w.name=av.c.name=av.b.name="styls";

av.w.addEventListener('mousedown',avwShow);
av.w.addEventListener('touchstart',avwShow);
av.w.addEventListener('input',function(e){//console.log(e.target.value,'%');
 setStyle({id:'w',val:e.target.value+'%'},null,false)
});
function avwShow(e){//console.log('touchstart|mousedown');
 document.body.classList.add('rangew')
}
function avwSet(t){//console.log('avwSet t.value=',t.value);
 setChange([t]);
 document.body.classList.remove('rangew')
}

let dai=document.getElementById('da');
let nai=document.getElementById('ni');
let cpi=document.getElementById('cpi');
let bpi=document.getElementById('bpi');
cpi.DB=['c',av.c,'color'];
bpi.DB=['b',av.b,'background-color'];

cpi.addEventListener('input',avcIn);
bpi.addEventListener('input',avcIn);
function avcIn(e){
 dt.r.setProperty('--'+e.target.DB[0],e.target.value);
 e.target.DB[1].style[e.target.DB[2]]=e.target.value;
}
cpi.addEventListener('change',avcCh);
bpi.addEventListener('change',avcCh);
function avcCh(e){//console.log('avcCh()',e.target);
 e.target.DB[1].value=e.target.value;
 setChange([e.target.DB[1]]);
}
function avcToday(k,t){//console.log('avcToday('+k+')');
 av.c.value=dt.r.getPropertyValue('--c-'+k);
 av.b.value=dt.r.getPropertyValue('--b-'+k);
 setChange([av.b,av.c])
}

function avcIs(c,b){//console.log('avcIS INPUT c,b',c,b);
 if(!c)c=av.c.value;
 if(!b)b=av.b.value;//console.log('avcIS ISISI c,b',c,b);

 if(c && b){
  if(c==dt.r.getPropertyValue('--c-day')
	&& b==dt.r.getPropertyValue('--b-day')){
		avcSet(dai,nai,av.b);
  }else{
   if(c==dt.r.getPropertyValue('--c-night')
	&& b==dt.r.getPropertyValue('--b-night')){
		avcSet(nai,dai,av.b);
   }else{
		avcSet(av.b,nai,dai,c,b);
   }
  }
 }
}
function avcSet(e,ee,eee,c='#ff0000',b='#00ff00'){// el,el,el,color,background
 e.classList.remove('unshad');
 e.classList.add('seshad');
 ee.classList.remove('seshad');
 ee.classList.add('unshad');
 eee.classList.remove('seshad');
 eee.classList.add('unshad');
 cpi.value=c;
 bpi.value=b;
 av.c.style.color=c;
 av.b.style.backgroundColor=b;
}

/** set value for styled av[] <elements> */
function setValue(i,v){//console.log('setValue('+i+','+v+')');
 switch(i){
  case "c":
	avcIs(v,null);
	break;
  case "b":
	avcIs(null,v);
	break;
  case "w":
	let p = parseInt(v);
	if(v.slice(v.length-1)=='%') v=p;
	else if(p>window.innerWidth) v=100;
		else v = p * 100 / window.innerWidth;
	break;
 }
 av[i].value=v; // all & for "l" just is it
}
/** first load ebook.set.html == set all values to input elements av[] */
function setValues(){//console.log('setValueSSSSS');
 let v;
 for(let i in av){
  switch(i){
	case "l":
	 v=(document.documentElement.lang || '_');
	 break;
	default: // "w, c, b"
	 v=dt.r.getPropertyValue('--'+i);
	 break;
  };
  setValue(i,v)
 }
}
/** clear interface set to default = delete all from "styls" object */
function inDef(){//cl('inDef()',db)
 if(db){
    let t = db.transaction(["styls"], "readwrite");
    let o = t.objectStore("styls");
    let r = o.clear();
    r.onsuccess = setDef
 }else setDef()
}
//** ******************** Edit `book` objectStore ************************ */
ebk.savBut=ebk.querySelector('footer div.btn');
ebk.savTit=ebk.querySelector('input[required]');
ebk.imgOwn=ebk.querySelector('#book_cover img.own');
ebk.imgNew=ebk.querySelector('#book_cover img.new');
ebk.filRea=ebk.querySelector('#book_cover input');
ebk.cleCov=ebk.querySelector('#book_cover span');
ebk.cloSet=()=>{
    bau.textContent='';
    bta.textContent='';
    ebk.savBut.setAttribute('disabled','disabled');
    seaCl()
}
function filEbk(){
 ebk.savIs=false;
 ebk.cover=null;
 ebk.imgNew.src='';
 ebk.filRea.value='';
 ebk.cleCov.classList.add('dn');

 bau.append(pip);
 filPT(pip,ebk.book);
 bta.append(tga);
 filPT(tga,ebk.book);

 ebk.querySelectorAll('input[type="text"]').forEach((t,i) => {
    if(ebk.book.DB.title[i])t.value=ebk.book.DB.title[i]; else t.value='';
 });

 if(ebk.book.DB.cover){ebk.cover=ebk.book.DB.cover; ebk.imgOwn.src=URL.createObjectURL(ebk.cover)}
 else ebk.imgOwn.src=dimg();
}
function savIs(){
 ebk.savIs=true;
 ebk.savBut.removeAttribute('disabled');
}
/** save objectStore `book`
param e = Event on button
param c=true for close edit window after save */
function savEbk(e,c){cl("savEbk() Event=",e)
 let t=ebk.savTit.value.trim();
 if(!t){dialog('<b>'+dt.w.text["#ebk > b"]+'</b> — '+dt.w.req);return}
 if(ebk.savIs)dialog(dt.w.sav+' <b>'+t+'</b>',0).then(v=>{
    let f=e.target.parentNode.book || e.target.parentNode.parentNode.book;//<figure>
    f.DB.title=[];
    ebk.querySelectorAll('input[type="text"]').forEach(i=>{
        if(i.value)f.DB.title.push(i.value)
    });

    f.reName=true;
    f.notSetA=false;
    upDate([f])
    if(!c)fetchSet(ebk)
 },nul);
 else if(!c)fetchSet(ebk)
}
/**add tag|pipl to book: seL(getPT(this),'list','add','ownl',true)
 remove it from book: seL(getPT(this),'ownl','delete','list',false) */
function seL(pt,lt,st,at,x){
 let s=[...pt[lt].selectedOptions];//cl('selL('+x?'ADD':'REM'+') selected=',s,ebk.book);
 for(let i of s){
    if(x && i.ownl_opt)continue;
    let l=i;
    if(!i.books)l=i.list_opt;
    l.books[st](ebk.book.DB.id);
    if(pt.parId)seP(x,i,pt);
    else pt[at].append(i);
    seB(x,l.DB.id,pt)
 };
 clOp(pt);
 savIs()
}
function seB(x,k,pt){cl('seB k='+k+' BEFORE=',ebk.book.DB[pt.bookIdArr]);
 let c=-2;
 let a=ebk.book.DB[pt.bookIdArr];
 if(a)c=a.indexOf(k);
 if(x){
    if(c==-2)a=ebk.book.DB[pt.bookIdArr]=[];
    if(c<0)a.push(k);
 }else{
    if(c>-1)a.splice(c,1);
 }cl('seB AFTER=',ebk.book.DB[pt.bookIdArr]);
}
function seP(x,i,pt){
 if(x){
    addOwnList(pt,i,i.treeParent);
    treeBooks(i)
 }else{
    i.list_opt.classList.remove('ownl');
    i.list_opt.ownl_opt=undefined;
    treeBooks(i.list_opt);
    i.remove()
 }
}
function preCov(){
 let f = ebk.filRea.files[0];
 let r = new FileReader();
 r.onloadend=()=>{ cover(ebk.book,null,(o)=>{ ebk.imgNew.src = URL.createObjectURL(o.DB.cover); savIs() },r.result) }

 if(car(ebk.cleCov,!f))cleCov();
 else r.readAsDataURL(f)
}
function cleCov(){
 ebk.imgNew.src = "";
 ebk.book.DB.cover=ebk.cover;
}
//** **************** Edit `pipls`&`tags` objectStore ******************* */
const bau=document.querySelector('#book_auths'),
    bta=document.querySelector('#book_tags');
pip.name="pipls";
pip.idx="nams";
pip.bookIdArr="auth";
pip.bookIdx="auths";
tga.name="tags";
tga.idx="pana";
tga.bookIdArr="tag";
tga.bookIdx="tags";
tga.parId=true;
[pip,tga].forEach(i=>{
 i.list=i.querySelector('select[name="list"]');
 i.list.onchange=aro.bind('addO');
 i.ownl=i.querySelector('select[name="ownl"]');
 i.ownl.onchange=aro.bind('remO');
 i.addO=i.querySelector('footer div.tro.add');
 i.remO=i.querySelector('footer div.tro.rem');
 i.amo=i.querySelector('footer > div');
 i.amo.books=new Set();
 i.amo.booksChild=new Set();
 i.tit='option';
});
function aro(e){
 let pt=e.target.parentNode;
 let o=e.target.selectedOptions;
 let l=o.length;//cl('aro() o,l=',o,l);
 if(pt.parId)[...o].forEach(i=>{if(i.ownl_opt)l--});
 pt[this][ l>0 ? 'removeAttribute' : 'setAttribute']("disabled","disabled")
}
pip.func=tga.func=(r,o)=>{//params = result getAll("books") & <option> == call throw addSea(getA(func()))
 o.books=new Set(r);
 if(r.length>0)treeBooks(o);
 o.clearFunc=setAmo;
 o.onclick=(e)=>{//cl('onClick LIST',e.target,e)
    if(e.isTrusted)e.target.parentNode.querySelectorAll('option.ownl').forEach(i=>{ i.ownl_opt.selected=i.selected });
    e.target.clickTime=e.timeStamp;
    let pt=getPT(e.target);
    let a=pt.amo;
    a.booksName='';
    a.books.clear();
    a.booksChildName='';
    a.booksChild.clear();
    a.target=e.target;
    let p=getOp(pt)[0];
    if(p.length>0){
        for(let i of p){
            if(i.books){
             i.books.forEach(a.books.add.bind(a.books));
             a.booksName = (a.booksName=='' ? i.textContent : a.booksName+' | '+i.textContent)
            }
            if(i.booksChild){
             i.booksChild.forEach(a.booksChild.add.bind(a.booksChild));
             a.booksChildName = (a.booksChildName=='' ? i.textContent : a.booksChildName+' | '+i.textContent)
            }
        }
        setAmo(a,a.books.size,a.booksChild.size)
    }else setAmo(a)
 }
}
function getPT(b){// return pip|tga from menu button | select option
 return b.parentNode.parentNode
}
function setPT(d,pt){//for edit at settings-window — param d = <details> into <section.sets>
 if(d.getAttribute('open')==null){
     d.append(pt);
     filPT(pt,-1)
 }
}
/** fill <select> in `pt` = pip|tag // for edit at book-edit-window
param b = one objectStore `books` from filEbk() | = -1 for all list from setPT() */
function filPT(pt,b){cl('filPT() pt=',pt,' book=',b)
 pt.list.textContent='';
 pt.ownl.textContent='';
 pt.addO.setAttribute('disabled','disabled');
 pt.remO.setAttribute('disabled','disabled');
 setAmo(pt.amo);
 pt.book=b;
 pt.under=undefined;
 setC(pt);
}
/** get selected <option>'s from pip|tga at <select> "list"&"ownl"
param pt = pip|tag
param a = true if need one along first <option>
param f = function
return option|null if a==true OR call `f()`
 OR return [[option,option...],[L,O]] where L=count from "list" and O=count from "ownl" */
function getOp(pt,a,f){
 let r=[[],[0,0]];
 let s = pt.list.selectedOptions;
 if(s.length>0){
    if(a){
        unOp(pt.list,s[0].index,pt);
        if(f){f(s[0]);return}
        else return s[0]
    }else{ r[0]=[...s]; r[1][0]=s.length }
 }
 let o = pt.ownl.selectedOptions;
 if(o.length>0){
    if(a){
        unOp(pt.ownl,o[0].index);
        if(f){f(o[0]);return}
        else return o[0]
    }else{ r[0]=[...r[0],...o]; r[1][1]=o.length }
 }
 if(f)dialog(dt.v.sl);
 if(a)return null;
 else return r;
}
/** set count books for pip|tag with icon 📚|🗑️
param a = pip.amo|tga.amo OR param this = <option>
param b = count of books with selected <option>
param c = count of books in child tree of the same <option> */
function setAmo(a,b='',c=''){
 if(!a)a=getPT(this).amo;
 let s=b+(c ? '<br><i>+'+c+'</i>' : '');
 a.style[s?'removeProperty':'setProperty']('pointer-events','none');
 a.children[0].innerHTML=s;
 let l1=a.children[1].classList;
 let l2=a.children[2].classList;
 a.alls=b+c;// '' | 0 | N
 if(a.alls>0)l1.remove('dn'); else l1.add('dn');
 if(a.alls===0)l2.remove('dn'); else l2.add('dn')
}
function clOp(pt){// clear amo & unselected all <option>
 unOp(pt.list,-1,pt);
 setAmo(pt.amo);
 pt.addO.setAttribute('disabled','disabled');
 pt.remO.setAttribute('disabled','disabled');
}
function unOp(s,c,pt){// selected along <option>
 if(pt)pt.ownl.selectedIndex=-1;
 s.selectedIndex=c;
}
function newPT(pt){cl('newPT() pt.name=',pt.name);// create objectStore "pipls"|"tags"
 let o;
 if(pt.parId)o=getOp(pt,true);
 dialog(dt.w[pt.name]+( o ? ' '+dt.w.un+' <b>'+o.textContent+'</b>' : '' )+':',{DB:{name:''}}).then(v=>{cl('newPT() '+pt.name,v);
    let n;
    if(n=pt.list.querySelector('option.nof'))n.remove();

    pt.DB=v.DB;
    pt.book=-1;
    if(pt.parId){
     if(o){
       pt.DB.pa=o.DB.id;
       pt.under=o
     }else{
       pt.DB.pa=0;
       pt.under=undefined
     }
    }else pt.under=undefined;
    pt.upId=true;
    upDate([pt])
 },nul)
}
function merPT(pt){// merge options of pt = pip|tag
 let r=getOp(pt);cl('merPT() selected options=',r);

 if((pt.parId ? r[1][0] : r[1][0]+r[1][1])<2){dialog(dt.w.cm);return};
 if(r[1][1]>1){dialog(dt.w.cn+' <b>'+dt.w.text["#"+pt.bookIdArr+"_ownl"]+'</b>');return};

 let x,y,
 n,//big name for all selected items
 c,//count pointer for elect item into r[0]
 f,//elect to leave, delete the rest
 nn=(i)=>{n = n==undefined ? '<b>'+i.textContent+'</b>' : n+' + <b>'+i.textContent+'</b>'};
 if(r[1][1]==1){//there is one choise into pt.ownl
    c=r[0].length-1;
    if(r[0][c].list_opt){f=r[0].pop().list_opt;c=c-1}
    else f=r[0][c];
    r[0].forEach(nn)
 }else{//all choises into pt.list
    f=r[0][0];c=0;y=f.clickTime;nn(f);
    for(let i=1; i<r[0].length; i++){ nn(r[0][i]); x=r[0][i].clickTime; if(y>x){y=x;f=r[0][i];c=i} }
 };
 let eix//set{}array to dialog on exclude key for replace elect item
 ,d=r[0].map(o=>o.DB.id)//array[] all objectStore keys mapped r[0] = all selected <option>
 ,t=[];//array[] tree parents objects about elect `f` included in `d` where t[0] is topmost
 if(pt.parId){
    let p=f.treeParent;
    while(p){
        if(d.includes(p.DB.id))t.unshift(p);else break;
        p=p.treeParent
    }cl('merPT() TREE ',t);

    eix = new Set(d);
    r[0].forEach(i=>{
        treeChilds(pt,i,-1,eix,false,null,true)//keys on alls childs of alls selected items to eix{}
    })
 };

 dialog(n+'<br>'+dt.w.cc+':',f,{re:true,un:true},eix,t.length>0?t[0].treeParent:f.treeParent).then(o=>{
    pt.eleMer=pt.arrMer=pt.delMer=undefined;
    d.splice(c,1);//items keys for delete
    r[0].splice(c,1);//<option>'s for delete
//console.log('merPT() o=',o,' o.DB=',o.DB,'o.reName=',o.reName,'o.rePlace=',o.rePlace,'o.under=',o.under,'c=',c,'d=',d,'r[0]=',r[0].map(o=>o.DB.name));

    if(pt.parId){//only tags
        pt.eleMer=o;//elect

        let u=[];//array first childs for delete items
        pt.list.childNodes.forEach(i=>{
            if(i.DB.pa!=o.DB.id//`i` is not child of elect
                && d.includes(i.DB.pa)//parent of `i` is delete item
                && !d.includes(i.DB.id)){//`i` is not delete item
                    i.DB.pa=o.DB.id;
                    i.rePlace=true;
                    i.under=o;
                    u.push(i)
            }
        });
        if(u.length>0)pt.arrMer=u//upDate & replace this <options> under elect at reP(...if(pt.eleMer)...)
    };

    let bo=new Set();//set{} for all books keys at delete pipls|tags
    r[0].forEach(i=>{
        i.books.forEach(b=>{bo.add(b);o.books.add(b)})
    });
    let os,fb=[],fs=[];
    bo.forEach(j=>{
        let fig=document.querySelector('#b'+j);
        if(fig){
            fig.reName=true;
            fig.notSetA=false;
            fb.push(fig);
            merF(pt,fb,fs,bo,d,o.DB.id)
        }else{
            if(!os)os=db.transaction("books","readonly").objectStore("books");
            os.get(j).onsuccess = e=>{
                fs.push({name:"books",DB:e.target.result,notSetA:true,notChange:true});
                merF(pt,fb,fs,bo,d,o.DB.id)
            }
        }
    });

    if(r[1][1]==1)pt.addO.setAttribute("disabled","disabled");

    if(!pt.parId){ delDate({name:'pipls'},r[0]) }//only pipls (tags delete at reP() from pt.arrMer[])
    else pt.delMer=r[0];

    if(o.reName || o.rePlace){o.reMerge=true;upDate([o])}//goto addSea(...if(e.book==undefined)...) with reN+reP+reM() without reB() & reT()
    else reM(pt);//upDate(pt.arrMer) >> addSea(reP()) on every <option> & run reD(pt.delMer) with reB+reT() on success delete transaction
 },nul)
}
function merF(pt,fb,fs,bo,d,id){cl('merF() fb.length+fs.length==bo.size',fb.length,fs.length,bo.size)
 if(fb.length+fs.length==bo.size){
    fb.forEach(b=>{merB(b,d,id,pt.bookIdArr)});
    upDate(fb);
    fs.forEach(b=>{merB(b,d,id,pt.bookIdArr)});
    upDate(fs)
 }
}
function merB(b,d,id,ia){cl('merB() o.DB.id=',id,' pipls|tags ARRRRR 000000 =',b.DB.title[0],b.DB[ia]);
    b.DB[ia].forEach((t,i)=>{
        d.forEach(k=>{ if(t==k)b.DB[ia][i]=id })
    });cl('merB() pipls|tags ARRRRR 11111 =',b.DB.title[0],b.DB[ia]);
    b.DB[ia]=[...new Set(b.DB[ia])];cl('merB() pipls|tags ARRRRR FFFFFFF =',b.DB.title[0],b.DB[ia]);
}
