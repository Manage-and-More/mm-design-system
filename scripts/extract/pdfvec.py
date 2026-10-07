"""Turn PyMuPDF vector drawings from a PDF page region into a standalone SVG."""
import pymupdf, sys, json

def hexc(c):
    if c is None: return None
    return '#%02X%02X%02X' % tuple(round(v*255) for v in c[:3])

def path_d(items, ox, oy):
    out=[]; cur=None
    f=lambda p:f'{p.x-ox:.2f} {p.y-oy:.2f}'
    for it in items:
        k=it[0]
        if k=='l':
            a,b=it[1],it[2]
            if cur is None or abs(cur.x-a.x)>1e-3 or abs(cur.y-a.y)>1e-3: out.append('M'+f(a))
            out.append('L'+f(b)); cur=b
        elif k=='c':
            a,c1,c2,b=it[1:5]
            if cur is None or abs(cur.x-a.x)>1e-3 or abs(cur.y-a.y)>1e-3: out.append('M'+f(a))
            out.append('C'+f(c1)+' '+f(c2)+' '+f(b)); cur=b
        elif k=='re':
            # keep the PDF's winding direction so nested rectangles (outlines) stay holes
            r=it[1]; ccw=len(it)>2 and it[2]==1
            if ccw: out.append(f'M{r.x0-ox:.2f} {r.y0-oy:.2f}V{r.y1-oy:.2f}H{r.x1-ox:.2f}V{r.y0-oy:.2f}Z')
            else: out.append(f'M{r.x0-ox:.2f} {r.y0-oy:.2f}H{r.x1-ox:.2f}V{r.y1-oy:.2f}H{r.x0-ox:.2f}Z')
            cur=None
        elif k=='qu':
            q=it[1]; out.append('M'+f(q.ul)+'L'+f(q.ur)+'L'+f(q.lr)+'L'+f(q.ll)+'Z'); cur=None
    return ''.join(out)

def drawings_in(page, clip, skip_bg=True):
    clip=pymupdf.Rect(clip); res=[]
    for d in page.get_drawings():
        r=d['rect']
        if not clip.contains(r) and not (r.is_empty and clip.contains(r.tl)): continue
        if skip_bg and r.width>=clip.width*0.95 and r.height>=clip.height*0.95: continue
        res.append(d)
    return res

def to_svg(drs, colormap=None, pad=0, title=None, fill_override=None):
    colormap=colormap or {}
    x0=min(d['rect'].x0 for d in drs)-pad; y0=min(d['rect'].y0 for d in drs)-pad
    x1=max(d['rect'].x1 for d in drs)+pad; y1=max(d['rect'].y1 for d in drs)+pad
    W,H=x1-x0,y1-y0
    parts=[]
    for d in drs:
        dd=path_d(d['items'],x0,y0)
        fill=hexc(d.get('fill')); stroke=hexc(d.get('color'))
        fill=colormap.get(fill,fill); stroke=colormap.get(stroke,stroke)
        if fill_override and d.get(fill_override):
            fill=d[fill_override] if fill else None
            stroke=d[fill_override] if stroke else None
        a=[f'd="{dd}"']
        a.append(f'fill="{fill}"' if fill and 'f' in d['type'] else 'fill="none"')
        if fill and d.get('even_odd'): a.append('fill-rule="evenodd"')
        if 's' in d['type'] and stroke:
            a.append(f'stroke="{stroke}" stroke-width="{d.get("width") or 1:.2f}"')
            if d.get('lineCap'): a.append(f'stroke-linecap="{["butt","round","square"][max(d["lineCap"]) if isinstance(d["lineCap"],(list,tuple)) else d["lineCap"]]}"')
            if d.get('lineJoin') is not None: a.append(f'stroke-linejoin="{["miter","round","bevel"][int(d["lineJoin"])]}"')
            if d.get('dashes') and d['dashes'] not in ('[] 0','[] 0.0'):
                import re
                nums=re.findall(r'[\d.]+',d['dashes'].split(']')[0])
                if nums: a.append(f'stroke-dasharray="{" ".join(nums)}"')
        op=d.get('fill_opacity')
        if op is not None and op<1: a.append(f'fill-opacity="{op:.3f}"')
        parts.append('<path '+' '.join(a)+'/>')
    t=f'<title>{title}</title>' if title else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" width="{W:.0f}" height="{H:.0f}" role="img">{t}\n'
            + '\n'.join(parts) + '\n</svg>\n'), (x0,y0,x1,y1)
