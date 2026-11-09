# Chạy trên GitHub Actions: tải ảnh từ sihylens.vn / kinhaptrong.com.vn về thư mục images/
# rồi đổi đường dẫn trong các trang sang ảnh nội bộ của sihy.vn. Ảnh nào tải lỗi thì giữ link cũ.
import os, re, sys, urllib.request, urllib.parse, concurrent.futures as cf
ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
SITE = 'https://sihy.vn/'
PAT = re.compile(r'(?:https?:)?//(?:www\.)?(sihylens\.vn|kinhaptrong\.com\.vn)/([^"\'\s<>)]+?\.(?:jpe?g|png|gif|webp|svg))(\?[^"\'\s<>)]*)?', re.I)
files = []
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d not in ('.git', 'images', '.github', 'tools')]
    files += [os.path.join(dp, f) for f in fn if f.endswith(('.html', '.js', '.json', '.css', '.xml'))]
urls = {}
for f in files:
    for m in PAT.finditer(open(f, encoding='utf-8').read()):
        host = 'sihylens' if m.group(1).startswith('sihy') else 'kinhaptrong'
        urls[m.group(0)] = (f'https://{"www." if host=="kinhaptrong" else ""}{m.group(1)}/{m.group(2)}', f'images/{host}/{urllib.parse.unquote(m.group(2))}', f'images/{host}/{m.group(2)}')
def get(item):
    src, local, web = item
    path = os.path.join(ROOT, local)
    if os.path.exists(path) and os.path.getsize(path) > 0: return True
    try:
        req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0 (sihy.vn image sync)', 'Referer': 'https://sihylens.vn/'})
        data = urllib.request.urlopen(req, timeout=40).read()
        if len(data) < 100: return False
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, 'wb').write(data); return True
    except Exception as e:
        print('Lỗi tải', src, e); return False
with cf.ThreadPoolExecutor(8) as ex:
    ok = dict(zip(urls, ex.map(get, urls.values())))
good = {u: SITE + v[2] for u, v in urls.items() if ok[u]}
for f in files:
    s = open(f, encoding='utf-8').read(); o = s
    for u in sorted(good, key=len, reverse=True): s = s.replace(u, good[u])
    if s != o: open(f, 'w', encoding='utf-8').write(s)
print(f'Ảnh: {sum(ok.values())}/{len(urls)} tải thành công')
