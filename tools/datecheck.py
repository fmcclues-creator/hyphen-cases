#!/usr/bin/env python3
"""Every date in the three cases, checked against the calendar and each other.

Sara's birthday was wrong because two dates that had to agree were written in
two different places and only one of them got changed. This looks for that
shape of mistake: a weekday that isn't that day's weekday, a caption whose year
disagrees with the date the photo sorts by, a photo taken after the case
started, and the handful of family dates that have to fall in a certain order.
"""
import pathlib, re, datetime as dt

AR = str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789')
w = lambda s: s.translate(AR)
WD = {0: 'الاثنين', 1: 'الثلاثاء', 2: 'الأربعاء', 3: 'الخميس',
      4: 'الجمعة', 5: 'السبت', 6: 'الأحد'}
MON = {'يناير': 1, 'فبراير': 2, 'مارس': 3, 'أبريل': 4, 'ابريل': 4, 'مايو': 5,
       'يونيو': 6, 'يوليو': 7, 'أغسطس': 8, 'اغسطس': 8, 'سبتمبر': 9,
       'أكتوبر': 10, 'اكتوبر': 10, 'نوفمبر': 11, 'ديسمبر': 12}

ROOT = pathlib.Path('/home/claude/hyphen-cases/public')
problems = []


def note(game, what):
    problems.append(f'{game}: {what}')


# ---------------------------------------------------------------- خالد
CASE = dt.datetime(2025, 10, 1, 21, 0)      # the hour the file is opened
s = (ROOT / 'game/index.html').read_text(encoding='utf8')

items = list(re.finditer(
    r"\{id:'(p\d+)'[^}]*?d:'(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d))?'[^}]*?info:'([^']*)'", s))
print(f'خالد — {len(items)} dated photos')
for m in items:
    pid = m.group(1)
    when = dt.datetime(int(m[2]), int(m[3]), int(m[4]), int(m[5] or 0), int(m[6] or 0))
    info = m.group(7)

    # the weekday written on the photo must be that date's weekday
    for i, name in WD.items():
        if info.startswith(name):
            if when.weekday() != i:
                note('خالد', f'{pid} {when.date()} is labelled {name}, really {WD[when.weekday()]}')
            break

    # the year written on the photo must be the year it sorts by
    yrs = {w(t) for t in re.findall(r'[٠-٩]{4}', info) if w(t).startswith(('19', '20'))}
    if yrs and w(m[2]) not in yrs:
        note('خالد', f'{pid} sorts under {m[2]} but its caption says {"/".join(sorted(yrs))} — «{info}»')

    # a written-out date on the photo must be the date it sorts by
    d2 = re.search(r'([٠-٩]{1,2})\s*(' + '|'.join(MON) + r')\s*([٠-٩]{4})', info)
    if d2:
        said = dt.date(int(w(d2[3])), MON[d2[2]], int(w(d2[1])))
        if said != when.date():
            note('خالد', f'{pid} sorts under {when.date()} but reads «{d2.group(0)}»')

    if when > CASE:
        note('خالد', f'{pid} {when} is after the case opens — «{info}»')

# the family's own dates, which have to fall in order
papers = dict(re.findall(r'<div class="k">([^<]+)</div><div class="v">([^<]+)</div>', s))
got = {}
for k, v in papers.items():
    d = re.match(r'\s*([٠-٩]{2})\s*/\s*([٠-٩]{2})\s*/\s*([٠-٩]{4})', v)
    if d:
        got[k.strip()] = dt.date(int(w(d[3])), int(w(d[2])), int(w(d[1])))
for k, v in got.items():
    print(f'   {k}: {v}')
birth  = next((v for k, v in got.items() if 'البطاقة' in k), None)
wed    = next((v for k, v in got.items() if 'عرس' in k), None)
sara   = next((v for k, v in got.items() if 'ميلاد' in k), None)
if wed and sara:
    months = (sara.year - wed.year) * 12 + sara.month - wed.month
    if months < 9:
        note('خالد', f'سارة is born {months} months after the عرس — she would have been conceived before it')
if birth and wed and wed < birth:
    note('خالد', 'the عرس is before خالد was born')
if birth:
    age = CASE.year - birth.year - ((CASE.month, CASE.day) < (birth.month, birth.day))
    said = re.search(r'خالد،?\s*([٠-٩]{2})\s*سنة', s)
    if said and int(w(said[1])) != age:
        note('خالد', f'the file says خالد is {w(said[1])}, his civil ID makes him {age}')
    else:
        print(f'   خالد is {age} on the night of the case ✓')
# الملچة has to come before the wedding
mil = re.search(r"d:'(\d{4})-(\d\d)-(\d\d)[^']*'[^}]*?n:'الملچة'", s)
if mil and wed:
    md = dt.date(int(mil[1]), int(mil[2]), int(mil[3]))
    print(f'   الملچة: {md}' + ('  ✓' if md < wed else '  ✗ after the عرس'))
    if md >= wed:
        note('خالد', f'الملچة {md} falls after the عرس {wed}')

# ---------------------------------------------------------------- the other two
for folder, label, days in [('shaleh', 'الشاليه', None), ('villa', 'الفيلا', None)]:
    t = (ROOT / f'{folder}/index.html').read_text(encoding='utf8')
    print(f'\n{label} — day-and-time references')
    seen = {}
    for m in re.finditer(r'(' + '|'.join(WD.values()) + r')\s*([٠-٩]{1,2}:[٠-٩]{2})?\s*(ص|م)?', t):
        day = m[1]
        seen.setdefault(day, 0)
        seen[day] += 1
    for k, v in sorted(seen.items(), key=lambda x: -x[1]):
        print(f'   {k}: {v}')

print()
if problems:
    print(f'{len(problems)} PROBLEM(S)')
    for p in problems:
        print('  ✗', p)
else:
    print('no date problems found')
