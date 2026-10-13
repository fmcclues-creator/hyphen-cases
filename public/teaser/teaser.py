from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageEnhance
import os
F='/home/claude/fonts/';OUT='/home/claude/teaser/';os.makedirs(OUT,exist_ok=True)
kw=dict(direction='rtl',language='ar')
def font(n,s): return ImageFont.truetype(F+n,s)
# white logo
lg=Image.open('/home/claude/logo-crop.png').convert('RGBA');lg.thumbnail((1400,800))
px=lg.load()
for y in range(lg.height):
    for x in range(lg.width):
        r,g,b,a=px[x,y]
        if r>200 and g>200 and b>200: px[x,y]=(0,0,0,0)
        elif r>150 and g<110 and b<110: px[x,y]=(230,30,30,255)
        else:
            k=255-int((r+g+b)/3);px[x,y]=(255,255,255,min(255,k+40))
lg=lg.crop(lg.getbbox())
def logo(w):
    l=lg.copy();l.thumbnail((w,w));return l
def bg(src,W,H,dark=0.35,blur=0):
    im=Image.open(src).convert('RGB');im=ImageOps.fit(im,(W,H),centering=(0.5,0.5))
    if blur: im=im.filter(ImageFilter.GaussianBlur(blur))
    im=ImageEnhance.Brightness(im).enhance(dark)
    # vignette
    v=Image.new('L',(W,H),0);ImageDraw.Draw(v).ellipse((-W*0.3,-H*0.2,W*1.3,H*1.2),fill=255);v=v.filter(ImageFilter.GaussianBlur(W//4))
    return Image.composite(im,Image.new('RGB',(W,H),(6,8,12)),v.point(lambda p:int(p*0.85+38)))
def tape(d,W,y,txt,ang=-6,fs=46):
    t=Image.new('RGBA',(700,110),(0,0,0,0));td=ImageDraw.Draw(t);td.rectangle((0,0,699,109),fill=(196,56,45,235))
    td.text((350,18),txt,font=font('Tajawal-Bold.ttf',fs),fill=(255,245,235),anchor='ma',**kw)
    t=t.rotate(ang,expand=True,resample=Image.BICUBIC);return t
def frame(W,H,src,big,sub,lines,tapetxt,darkv=0.35,blur=0,ypos=0.42,pin=False):
    im=bg(src,W,H,darkv,blur);d=ImageDraw.Draw(im)
    l=logo(int(W*0.42));im.paste(l,((W-l.width)//2,int(H*0.07)),l)
    d.text((W/2,int(H*0.07)+l.height+18),'C A S E S',font=font('Tajawal-Bold.ttf',int(W*0.034)),fill=(200,205,215),anchor='ma')
    fs=int(W*0.2)
    while d.textlength(big,font=font('Tajawal-Black.ttf',fs),**kw)>W*0.86: fs-=6
    d.text((W/2,H*ypos),big,font=font('Tajawal-Black.ttf',fs),fill=(255,255,255),anchor='mm',**kw)
    d.text((W/2,H*ypos+int(W*0.14)),sub,font=font('Tajawal-Medium.ttf',int(W*0.05)),fill=(230,232,238),anchor='ma',**kw)
    y=H*ypos+int(W*0.25)
    for ln in lines:
        d.text((W/2,y),ln,font=font('Tajawal-Regular.ttf',int(W*0.04)),fill=(190,196,208),anchor='ma',**kw);y+=int(W*0.06)
    if tapetxt:
        t=tape(d,W,0,tapetxt);im.paste(t,(int(W*0.5-t.width/2),int(H*0.78)),t)
    d.text((W/2,H*0.93),'cases.hyphen-eventskw.com',font=font('Tajawal-Medium.ttf',int(W*0.034)),fill=(140,148,165),anchor='ma')
    d.line((W*0.46,H*0.905,W*0.54,H*0.905),fill=(230,30,30),width=4)
    return im
S='/home/claude/shaleh/img/';K='/home/claude/hyphen-cases/public/game/'
W,H=1080,1920
frame(W,H,S+'courtyard_moon.jpg','قريباً',"ألعاب جديدة… تحقيق وتوتّر وضحك",['موبايل مقفل. ملف قضية. ساعة وحدة.','والكل متّهم.'],'سرّي للغاية',0.4).save(OUT+'story_1.jpg',quality=92)
frame(W,H,S+'smudge.jpg','من الجاني؟','افتحوا موبايله… وشوفوا بنفسكم',['واتساب، مكالمات، صور، صوتيات.','كل شي ينقال… وكل شي ينكشف.'],'ملف رقم ٢',0.45,0,0.40).save(OUT+'story_2.jpg',quality=92)
frame(W,H,S+'cam_hall_0235.jpg','ترقّبوا','العبوها بفريق أو لوحدكم — على التلفزيون',['بلهجتنا. بوجوهنا. بأسرارنا.','HYPHEN CASES'],'قريباً',0.35,0,0.42).save(OUT+'story_3.jpg',quality=92)
# post 4:5
W,H=1080,1350
frame(W,H,S+'courtyard_moon.jpg','قريباً',"ألعاب جديدة… تحقيق وتوتّر وضحك",['موبايل مقفل. ملف قضية. ساعة وحدة.','والكل متّهم.'],'سرّي للغاية',0.4,0,0.45).save(OUT+'post_4x5.jpg',quality=92)
W,H=1080,1080
frame(W,H,S+'smudge.jpg','قريباً',"ألعاب جديدة… تحقيق وتوتّر وضحك",['موبايل مقفل. ملف قضية. ساعة وحدة.'],'سرّي للغاية',0.4,0,0.47).save(OUT+'post_1x1.jpg',quality=92)
print('ok')
