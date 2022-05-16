	OBJECTS
================================

# o = addFigObject{} | dt.b | <figure id="bXXX" name="books"> == describe one book
- `o.id` = 'b' + primary key from DB | temporary key (<0) on added new book - set into addBook()
- `o.DB` = {} object "books" into DB

- `o.ZIP` = JSZip object for this book
   > `o.ZIP.files` == `{ file_name: {}, }` = list files into zip
   > `o.ZIP.files[file_name]._data.compressedSize` = size of one file

- `o.AU` = `{ file_name: [ url(blob) | String ], ...}` already unziped & make files on session
- `o.auth` = creators of the book [name, name, ...]
- `o.tag` = [name, name, ...] book genre
- `o.prs` = [] bumps for <footer=progress> on multi-files book
- `o.mark` = undefined | false | true | "marks" objectStore — go to this mark at setPage()+setTarg()
- `o.upId` = true => for set real id instead temporary key at upDate() - set into addBook()
- `o.setIdObj` = array[] adding objectStore with update "books"
- `o.setIdName` = array[] fields for convert `name`->`id` and on the contrary
- `o.notSetA` = not run setA() on complete transaction at upDate() book
- `o.notChange` = not run remChange() on complete transaction at upDate() book
- `o.d` = directory with index.html into zip-file
- `o.m` = timestamp unzip-message

# object "books" into DB
- `id` = primaryKey ## autoincrement
- `src` = string name of local file | global url
- `raw` = ArrayBuffer of the book = epub|zip|string
   > `raw.byteLength` = compressed size of full zip

- `type` = 'html' | 'epub' | 'text' | 'web' (two first as zip, other as string local|global)
- `title` = ["title","subtitle",...] names of the book ## index 'nams'
- `auth` = creators of the book [id, id, ...] primaryKey's "pipls" object ## index 'auths'
- `tag` = [id, id, ...] primaryKey's "tags" object ## index 'tags'
- `cover` = Blob of small cover-image
- `color` = [R,G,B] dominant color from `cover`
- `spine` = [] list file_names into book in reading order
- `nav` = string '<ol><li>content_page</li>...</ol>'
- `dat` = Date.now() last reading date ## index 'dats'
- `last` = the same {} object "marks" without `id`, `book`, `file`, `name`, `targ` and `idx`

# object "marks" into DB
- `id` = date of marks = Date.now() ## primaryKey
- `book` = key from object "books" ## index 'books'
- `name` = named mark | selected string | null with `targ` ## index 'nams'
- `targ` = query to <el> | undefined if just named without selected :>example:> "#id"
- `idx` = anchorOffset from begin `targ` to selected|range | =0 to start `targ` | =-1 to end `targ` == set at getSel()
- `w` = width iframe
- `h` = height iframe
- `x` = left margin <html> into iframe
- `c` = count into spine[] = pointer to current <html>-file
- `z` = name html-file NOT from `dt.b.DB.spine` but on `dt.b.ZIP.files`
- `a` = number of pages in current <html>-file into iframe
- `p` = percents readed book throw all files ## index 'pers'

# object "pipls" into DB
- `id` = primaryKey ## autoincrement
- `name` = string name ## index 'nams' unique

# object "tags" into DB
- `id` = primaryKey ## autoincrement
- `pa` = parent item key ## index 'pars'
- `name` = string tag name ## index 'nams' ## index 'pana' compaund `pa`+`name` unique

# object "styls" into DB
- "id" = string key ## primaryKey
- "val" = string value to key

# dt{}
- `dt.r` = style of cssRule `:root{}`
- `dt.v` = {} localize vocabulary for ebook.html <== ebook.{lang}.json
- `dt.w` = {} localize vocabulary for ebook.set.html <== ebook.set.{lang}.json
- `dt.b` = <figure> of current open book in <iframe> ==> `dt.b.DB` = object "books" from db
- `dt.c` = int number current open file from `dt.b.DB.spine`
- `dt.z` = string name current open file NOT from `dt.b.DB.spine` but on `dt.b.ZIP.files` <— return to undefined value at moveOver()
- `dt.zmark` = {x:1,targ:<a>} set at goHref() &go zipFile() ==> for moveOver() & ... setPage(setTarg()) — return to spine from non-spine zip-file

# wh{} <= all is integer
		// init at reSume()
		// wh.x & wh.s & wh.a correct at onSrc() on load iframe
		// wh.x correct at setPage() & setTarg() on goto mark
- `wh.x` = marginLeft = x-coordinate of <html> into iframe `fr.s`
- `wh.s` = full width of <body> into <iframe>
- `wh.a` = amount pages into <iframe> on current file into book
- `wh.w` = width of current book view port == <iframe> width without border
- `wh.h` = height of current book view port
- `wh.l` = left field of window for click to move on previous page
- `wh.r` = right field of window for click to move on next page
- `wh.t` = top field for click
- `wh.b` = bottom field for click

# fr{} — all about document from iframe <== set at onSrc()
- `fr.d` = <document>
- `fr.h` = <html>
- `fr.s` = <html>.style
- `fr.b` = <html>.<body>.style
- `fr.r` = sheet with [:root{} & @keyframes move_page{}] — <html>.appendChild("style")
- `fr.v` = true then <iframe> on hide transition


#treeChild()
================================
function treeChilds(pt,e,f=-1,ix,ox,ex,k) \\\ pt.list.childNodes.forEach(item=>{...})
- pt = `tga` object
- e = root <option> about tree
- f = 0 (only from titObj{}) | = function callback() from dialog() | = -1 for never call f()
- ix = 1 | Set{} if need return array of childs item's — ix.add(item)
- ox = true if include in `ix` self item
- ex = Set{} excludes key's from merPT() == not call f() at this key's
- param k = true to `ex` collect key's instead items ix.add(item.DB.id)
>>> return: [] all childs starting with `e` if f!=0 <<OR>> [string_name_all_sample_tree,[array_child]] if f==0
- if present function `f` — call f(item) at NOT self `e` and NOT alls childs `e` — on every rest items
- if present f() and ex{} — NOT call f(item) if !ex.has(item.DB.id)

=====>>>
	function reP(o,e,pt)
		===> treeChilds(pt,e,-1,1,true|false)// replace item with childs | only childs &>> return array all|childs items return

	function delObj(titObj())
		===> treeChilds(tga,e,0,1,1)// return [txt,[]] names for delete items with it's childs (self selected+all childs)

	function dialog(s,o,a={},ex,tp)
							<<< ex = Set{} excludes key's from conPT()
							<<< tp = key for treeParent from elect
		===> treeChilds(tga,o,(i)=>{...},0,0,ex);

	function newPT(pt)
		===> dialog('New?',{DB:{name:''}}) // full doubling list items

	function ediObj(e)
		===> dialog('Rename? Replace?',e,{re:true})

	function merPT(pt)
		===> treeChilds(pt,i,-1,eix,false,null,true)//KEYS alls childs of alls selected items to eix{}
		===> dialog('Merge?',f,{re:true,un:true},eix,t.length>0?t[0].treeParent:undefined)

=== example ===
|ownl| list|<<<<)`item select sign`|
|{id:1, pa:5}|{id:3, pa:0}||
||{id:5, pa:3}|<<<<<)delete|
|{id:1, pa:5}||<<<<<)elect|
||{id:10, pa:1}|
|{id:2, pa:5}|
||{id:7, pa:2}|
|{id:4, pa:0}||<<<<<)delete|
||{id:6, pa:4}|
|{id:8, pa:0}|
||{id:9, pa:8}|

in dialog present as possible parent choise (for replace) items with id: 3, 8, 9 and item with id=3 will be selected
return new_parent
- has: array for delete pt.delMer=[5,4]
- run:
1. array first childs under delete items (without elect) pt.arrMer=[2,6]
2. all tags in all books change [5,4] to 1 ==> upDate(books)
3. if(reName || rePlace) upDate(elect) & replace it with childs id=[1,10] under new_parent AND reM()
4. 				else reM()
5. reM() — upDate(pt.arrMer) — replace reP() all it's childs under elect and delete pt.delMer


	HELP
================================

# indexDB
* ALL
https://learn.javascript.ru/indexeddb
* createIndex{multiEntry:true}
https://www.raymondcamden.com/2012/08/10/Searching-for-array-elements-in-IndexedDB
* IDBCursor > update direction
https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor/update
https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor/direction
* Searching
https://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB
https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17

# JSZip
https://stuk.github.io/jszip/documentation/howto/read_zip.html

# Canvas
https://developer.mozilla.org/ru/docs/Web/API/HTMLCanvasElement
https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D

# Blob
https://flaviocopes.com/blob/

# Промисы > Микрозадачи
https://learn.javascript.ru/async
https://learn.javascript.ru/microtask-queue

# epub
https://gist.github.com/stormwild/86673836eb6153e6ab2e65b4353a289e

📚📓️📔️📘️👤️🎟️📑🖱️💻🌐📖📄📃🧾🗒💳📒🔖🔍📝🔗🖇️🧷🪢🗑️📎💬📍📌️🚩📂📁🗃🎯🎲🧩🪄✨
🤲☝👆👇👈👉🖕👍👎⭐🌟💡⬅️➡️⬆️⬇️❇️✴️✳️
➡⬅➕➗➖✖️⁉️‼️❓❗❌⭕❎✅☑️📛🆔🆓🔠🔢🔣🆗🆒🆕🅾️🅰️🅱️🆎🆘
✏️✒️🖋️🖍️🖊️✂️📞📱📲🔋🎞️📩✉️📧⚙️🛠️🚰🚾⚠️⛔🚫🚱📵📴️💯️
🔴⚫⚪🔵🟡🟠🟢🟣🟤🟪🟩🟨⬜🟥🟫🟧🟦⬛💠🔶🔷🔹🔸▪◼▫◻🔻🔺◽◾🔳🔲🔘
⇫↥↧↤↦⭱⭳⭰⭲⊕
🗺🧭🔑🪨🪵💎🪆🖼️📸️
