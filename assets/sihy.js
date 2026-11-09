/* SIHY Luxury Lens – menu, slider, xem nhanh sản phẩm, giỏ hàng, đặt hàng qua Zalo/Messenger */
(function(){
var P=window.SIHY_P||{},ZALO='0862626488',MESS='https://m.me/sihylens.vn',KEY='sihy_cart';
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function vnd(n){return n.toLocaleString('vi-VN')+'đ'}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
function save(c){try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}}
var cart=load();
function toast(t){var d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove()},2600)}
var DO=['0.00'];for(var x=50;x<=600;x+=25)DO.push('-'+(x/100).toFixed(2));for(x=650;x<=1000;x+=50)DO.push('-'+(x/100).toFixed(2));

/* logo: dòng dưới dài đúng bằng chữ SIHY */
function fitLogo(){$$('.logo-svg').forEach(function(sv){var a=$('.l1',sv),b=$('.l2',sv);try{var w=Math.ceil(a.getComputedTextLength()-1);if(w>0){b.setAttribute('textLength',w);sv.setAttribute('viewBox','0 0 '+w+' 46');sv.setAttribute('width',w)}}catch(e){}})}
fitLogo();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitLogo);
/* video trang chủ: đọc danh sách từ data/videos.json (sửa ở trang quản lý video) */
var vb=$('#vids');
if(vb&&window.fetch){fetch(vb.dataset.src+'?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(list){if(!list||!list.length)return;
 vb.innerHTML=list.filter(function(v){return /^https?:\/\//.test(v.url||'')}).map(function(v){var m=/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/.exec(v.url||''),y=m&&m[1],t=esc(v.title||'Video SIHY');
  return '<a class="vid'+(y?'':' novid')+'" href="'+esc(v.url)+'" target="_blank" rel="noopener" aria-label="Xem video '+t+'">'+(y?'<img src="https://i.ytimg.com/vi/'+y+'/hqdefault.jpg" alt="'+t+'" loading="lazy">':'')+'<i></i><span>'+t+'</span></a>'}).join('')}).catch(function(){})}
/* menu điện thoại */
var dr=$('#drawer');
$$('[data-open-menu]').forEach(function(b){b.onclick=function(){dr.hidden=false}});
if(dr){dr.onclick=function(e){if(e.target===dr||e.target.closest('[data-close]'))dr.hidden=true}}

/* slider */
var sl=$('.slider');
if(sl){var a=$$('a',sl),dots=$('.dots',sl),i=0,t;
 a.forEach(function(_,k){var b=document.createElement('button');b.setAttribute('aria-label','Ảnh '+(k+1));b.onclick=function(){go(k);run()};dots.appendChild(b)});
 function go(k){a[i].classList.remove('on');dots.children[i].classList.remove('on');i=k;a[i].classList.add('on');dots.children[i].classList.add('on')}
 function run(){clearInterval(t);t=setInterval(function(){go((i+1)%a.length)},4500)}
 go(0);run()}

/* lọc theo danh mục + xem thêm từng 4 sản phẩm */
function paged(g,c){var step=+g.dataset.page||0,btn=$('#more-btn');
 if(c!==undefined)g._c=c;c=g._c||'all';
 var list=$$('.card',g).filter(function(cd){return c==='all'||cd.dataset.c===c});
 $$('.card',g).forEach(function(cd){cd.hidden=true});list.forEach(function(cd,k){cd.hidden=step?k>=g._n:false});
 if(btn){var left=list.length-g._n;btn.parentNode.hidden=left<=0;btn.textContent='Xem thêm '+Math.min(step,left)+' sản phẩm'}}
$$('.tabs[data-filter]').forEach(function(tb){var g=$(tb.getAttribute('data-filter')),step=+g.dataset.page||0;g._n=step;
 $$('button',tb).forEach(function(b){b.onclick=function(){$$('button',tb).forEach(function(x){x.classList.toggle('on',x===b)});var c=b.dataset.c;
  if(step){g._n=step;paged(g,c)}else $$('.card',g).forEach(function(cd){cd.hidden=!(c==='all'||cd.dataset.c===c)})}});
 if(step){paged(g,'all');var mb=$('#more-btn');if(mb)mb.onclick=function(){g._n+=step;paged(g)}}});

/* giỏ hàng */
function count(){return cart.reduce(function(s,x){return s+x.q},0)}
function total(){return cart.reduce(function(s,x){return s+(P[x.id]?P[x.id].p:0)*x.q},0)}
function badge(){$$('.cart-n').forEach(function(e){var n=count();e.textContent=n;e.hidden=!n})}
function add(id,q,opt){var k=id+'|'+(opt||'');var f=cart.filter(function(x){return x.k===k})[0];
 if(f)f.q+=q;else cart.push({k:k,id:id,q:q,o:opt||''});save(cart);badge()}
var cd=$('#cart');
function render(){if(!cd)return;var it=$('.items',cd);
 if(!cart.length){it.innerHTML='<p class="empty">Giỏ hàng đang trống.<br>Chọn mẫu lens bạn thích để thêm vào giỏ.</p>';$('.sum',cd).hidden=true;return}
 $('.sum',cd).hidden=false;
 it.innerHTML=cart.map(function(x,n){var p=P[x.id]||{n:x.id,p:0,i:''};return '<div class="ci"><img src="'+p.i+'" alt=""><div><b>'+esc(p.n)+'</b>'+(x.o?'<small>'+esc(x.o)+'</small><br>':'')+'<small>'+vnd(p.p)+'</small><div class="q"><button data-n="'+n+'" data-cq="-1" aria-label="Giảm">−</button><span>'+x.q+'</span><button data-n="'+n+'" data-cq="1" aria-label="Tăng">+</button></div></div><button class="rm" data-rm="'+n+'">Xóa</button></div>'}).join('');
 var tt=total();$('#c-sub').textContent=vnd(tt);$('#c-ship').textContent=tt>=300000?'Miễn phí':'Báo khi xác nhận đơn';$('#c-total').textContent=vnd(tt)}
if(cd){cd.addEventListener('click',function(e){if(e.target===cd||e.target.closest('[data-close]')){cd.hidden=true;return}
 var b=e.target.closest('[data-cq]');if(b){var x=cart[+b.dataset.n];x.q+=+b.dataset.cq;if(x.q<1)cart.splice(+b.dataset.n,1);save(cart);badge();render()}
 var r=e.target.closest('[data-rm]');if(r){cart.splice(+r.dataset.rm,1);save(cart);badge();render()}})}
function openCart(){if(cd){qv&&(qv.hidden=true);render();cd.hidden=false;var d=$('#c-done');if(d)d.hidden=true}}
$$('[data-open-cart]').forEach(function(b){b.onclick=function(e){e.preventDefault();openCart()}});

/* lựa chọn của khối sản phẩm */
function pick(wrap){var q=+(($('.qin',wrap)||{}).value)||1,l=$('.dol',wrap),r=$('.dor',wrap);
 return {q:Math.max(1,q),o:(l&&r)?'Độ: trái '+l.value+' / phải '+r.value:''}}

/* gửi đơn: sao chép + mở chat */
function send(text,to,box){if(box){$('pre',box).textContent=text;box.hidden=false}
 var ok=function(){toast('Đã sao chép đơn hàng. Dán vào khung chat để gửi.')};
 try{if(navigator.clipboard)navigator.clipboard.writeText(text).then(ok,function(){toast('Hãy chép nội dung đơn hàng bên dưới và gửi cho SIHY.')})}catch(e){}
 window.open(to==='zalo'?'https://zalo.me/'+ZALO:MESS,'_blank','noopener')}
function cust(f){var l=['Khách: '+f.ten.value,'SĐT: '+f.sdt.value,'Địa chỉ: '+f.dc.value];if(f.gc&&f.gc.value)l.push('Ghi chú: '+f.gc.value);return l}
function quickOrder(f,to){if(!f.reportValidity())return;var id=f.dataset.id,p=P[id],o=pick(f.closest('[data-pd]')||document),tt=p.p*o.q;
 var l=['ĐƠN HÀNG SIHY LENS','- '+p.n+' x'+o.q+(o.o?' ('+o.o+')':'')+' = '+vnd(tt),'Tạm tính: '+vnd(tt)+(tt>=300000?' (miễn phí ship)':'')].concat(cust(f));
 send(l.join('\n'),to,$('.done',f))}
var fm=$('#c-form');
function cartOrder(to){if(!fm.reportValidity())return;var l=['ĐƠN HÀNG SIHY LENS'];
 cart.forEach(function(x){var p=P[x.id]||{n:x.id,p:0};l.push('- '+p.n+' x'+x.q+(x.o?' ('+x.o+')':'')+' = '+vnd(p.p*x.q))});
 var tt=total();l.push('Tạm tính: '+vnd(tt)+(tt>=300000?' (miễn phí ship)':''));send(l.concat(cust(fm.elements)).join('\n'),to,$('#c-done'))}
if(fm){fm.onsubmit=function(e){e.preventDefault();cartOrder('zalo')};$('#c-mess').onclick=function(){cartOrder('mess')}}

/* xem nhanh sản phẩm */
var qv=$('#qv');
function openQV(id){var p=P[id];if(!p||!qv)return;var d=p.o&&p.o>p.p?Math.round((p.o-p.p)*100/p.o):0;
 var opts=DO.map(function(v){return '<option>'+v+'</option>'}).join('');
 var thumbs=p.g.length>1?p.g.map(function(u,k){return '<button type="button" data-src="'+u+'"'+(k?'':' class="on"')+' aria-label="Ảnh '+(k+1)+'"><img src="'+u+'" alt=""></button>'}).join(''):'';
 $('.qv-body',qv).innerHTML='<div class="pd" data-pd><div class="gal"><div class="main"><img src="'+p.g[0]+'" alt="'+esc(p.n)+'"></div><div class="thumbs">'+thumbs+'</div></div>'+
 '<div class="pi"><span class="eyebrow">'+esc(p.c)+'</span><h2 class="qv-h">'+esc(p.n)+'</h2><div class="price"><b>'+vnd(p.p)+'</b>'+(d?'<s>'+vnd(p.o)+'</s><em>-'+d+'%</em>':'')+'</div>'+
 '<table class="specs">'+p.s.map(function(r){return '<tr><th>'+r[0]+'</th><td>'+esc(r[1])+'</td></tr>'}).join('')+'</table>'+
 (p.l?'<div class="opt"><label for="qv-dol">Độ mắt trái<select id="qv-dol" class="dol">'+opts+'</select></label><label for="qv-dor">Độ mắt phải<select id="qv-dor" class="dor">'+opts+'</select></label></div>':'')+
 '<div class="buy"><div class="qty"><button type="button" data-d="-1" aria-label="Giảm">−</button><input class="qin" id="qv-qty" value="1" inputmode="numeric" aria-label="Số lượng"><button type="button" data-d="1" aria-label="Tăng">+</button></div><button class="btn o" type="button" data-add="'+id+'">Thêm vào giỏ</button></div>'+
 '<form class="oform" data-id="'+id+'"><h3>Đặt hàng nhanh</h3><div class="two"><input id="qv-ten" name="ten" placeholder="Họ tên" required autocomplete="name"><input id="qv-sdt" name="sdt" placeholder="Số điện thoại" required inputmode="tel" pattern="[0-9 +]{9,13}" autocomplete="tel"></div><input id="qv-dc" name="dc" placeholder="Địa chỉ nhận hàng" required autocomplete="street-address"><input id="qv-gc" name="gc" placeholder="Ghi chú (không bắt buộc)"><div class="two"><button class="btn" type="submit">Đặt qua Zalo</button><button class="btn o" type="button" data-mess>Đặt qua Messenger</button></div><p class="note">Đơn hàng được sao chép sẵn, bạn chỉ cần dán vào khung chat để gửi. SIHY gọi xác nhận trước khi giao, thanh toán khi nhận hàng.</p><div class="done" hidden><b>Nội dung đơn hàng</b><pre></pre></div></form>'+
 '</div></div><section class="qv-desc"><h3>Mô tả chi tiết</h3><div class="prose">'+p.d+'</div><p><a class="btn o sm" href="'+id+'.html">Mở trang sản phẩm</a></p></section>';
 qv.hidden=false;qv.querySelector('.pn').scrollTop=0;document.body.style.overflow='hidden'}
function closeQV(){qv.hidden=true;document.body.style.overflow=''}
if(qv){qv.addEventListener('click',function(e){if(e.target===qv||e.target.closest('[data-close]'))closeQV()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!qv.hidden)closeQV()})}
$$('.card').forEach(function(c){var id=($('[data-add]',c)||{}).dataset;id=id&&id.add;if(!id)return;
 $$('.im, h3 a',c).forEach(function(a){a.addEventListener('click',function(e){if(e.ctrlKey||e.metaKey||e.shiftKey||!qv)return;e.preventDefault();openQV(id)})})});

/* sự kiện chung: ảnh, số lượng, thêm giỏ, đặt nhanh */
document.addEventListener('click',function(e){
 var t=e.target.closest('.thumbs button');if(t){var g=t.closest('.gal');$('.main img',g).src=t.dataset.src;$$('.thumbs button',g).forEach(function(x){x.classList.toggle('on',x===t)});return}
 var q=e.target.closest('.qty [data-d]');if(q){var inp=$('input',q.parentNode);inp.value=Math.max(1,(+inp.value||1)+(+q.dataset.d));return}
 var a=e.target.closest('[data-add]');if(a){var id=a.dataset.add,w=a.closest('[data-pd]'),o=w?pick(w):{q:1,o:''};add(id,o.q,o.o);toast('Đã thêm '+(P[id]?P[id].n:'')+' vào giỏ');return}
 var m=e.target.closest('.oform [data-mess]');if(m){quickOrder(m.closest('form'),'mess')}});
document.addEventListener('submit',function(e){var f=e.target;if(f.classList.contains('oform')){e.preventDefault();quickOrder(f,'zalo')}});
badge();
})();
