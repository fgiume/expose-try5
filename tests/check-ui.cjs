/* Lightweight DOM smoke test for the complete EXPOSE research Database. */
const fs=require('fs');
const assert=require('assert');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('database.html','utf8');
const dom=new JSDOM(html,{url:'https://example.org/database.html?view=matrix',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;
w.HTMLElement.prototype.scrollIntoView=function(){};
const files=['data/coded-cases.js','data/matrix-codes.js','js/bm25.js','data/episode-search.js','js/main.js','js/database-next.js'];
for(const name of files){
  console.log('Evaluating',name);
  w.eval(fs.readFileSync(name,'utf8'));
}
assert.strictEqual(w.EXPOSE_CODED.episodes.length,69);
assert.strictEqual(w.EXPOSE_SEARCH_INDEX.documents.length,69);
assert.strictEqual(Object.keys(w.EXPOSE_CODE_STATUS.episodeCodes).length,69);
assert(w.document.querySelectorAll('#mx-table tbody tr').length>0,'Matrix should render rows');
assert(w.document.querySelectorAll('#mx-table td').length>0,'Matrix should render cells');
assert(w.document.querySelector('#ev-count').textContent.includes('excerpts'),'Search view should render excerpts');
const yes=w.document.querySelector('#mx-table button.db-yes-button');
assert(yes,'Matrix should include at least one YES from real coded examples');
yes.click();
assert.strictEqual(w.document.getElementById('mx-details').hidden,false);
assert(w.document.querySelectorAll('#mx-examples article').length<=15);
w.document.getElementById('mx-all').click();
assert.strictEqual(w.document.getElementById('evidence-view').hidden,false);
assert.strictEqual(w.document.getElementById('matrix-view').hidden,true);
console.log('UI smoke test passed: '+w.document.querySelectorAll('#mx-table td').length+' matrix cells and real evidence drill-down.');
w.close();
